import path from 'node:path';

import type { PackageJsonInfo, SourceManifest } from './detection.types';
import { SOURCE_LIMITS } from './detection.types';

type PackageJsonShape = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  packageManager?: string;
  workspaces?: unknown;
};

export function parsePackageJsons(manifest: SourceManifest): {
  packages: PackageJsonInfo[];
  warnings: string[];
} {
  const warnings: string[] = [];
  const packages: PackageJsonInfo[] = [];
  const packageEntries = manifest.entries
    .filter(entry => entry.basename === 'package.json')
    .slice(0, SOURCE_LIMITS.maxPackageManifests);

  for (const entry of packageEntries) {
    if (!entry.content) {
      continue;
    }

    try {
      const parsed = JSON.parse(entry.content) as PackageJsonShape;
      packages.push({
        path: entry.relativePath,
        root: path.posix.dirname(entry.relativePath) === '.' ? '' : path.posix.dirname(entry.relativePath),
        dependencies: {
          ...safeRecord(parsed.dependencies),
          ...safeRecord(parsed.devDependencies),
          ...safeRecord(parsed.peerDependencies),
          ...safeRecord(parsed.optionalDependencies),
        },
        packageManager: typeof parsed.packageManager === 'string' ? parsed.packageManager : undefined,
      });
    } catch {
      warnings.push(`Could not parse package manifest at ${entry.relativePath}.`);
      packages.push({
        path: entry.relativePath,
        root: path.posix.dirname(entry.relativePath) === '.' ? '' : path.posix.dirname(entry.relativePath),
        dependencies: {},
        malformed: true,
      });
    }
  }

  return { packages, warnings };
}

export function hasDependency(pkg: PackageJsonInfo | null, name: string): boolean {
  return Boolean(pkg?.dependencies[name]);
}

function safeRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  );
}

