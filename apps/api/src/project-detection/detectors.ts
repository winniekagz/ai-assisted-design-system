import path from 'node:path';

import type {
  DetectionContext,
  Evidence,
  Field,
  Framework,
  Language,
  Manager,
  MonoTool,
  PackageJsonInfo,
  RootDetectionResult,
  SourceManifest,
  SourceManifestEntry,
  Styling,
} from './detection.types';
import { SOURCE_LIMITS } from './detection.types';
import { hasDependency } from './package-json';

export function detectProjectRoot(
  manifest: SourceManifest,
  packageJsons: PackageJsonInfo[]
): RootDetectionResult {
  const candidates = packageJsons
    .filter(pkg => !pkg.malformed && !pkg.root.includes('node_modules'))
    .map(pkg => {
      const evidence: Evidence[] = [{ type: 'package_manifest', path: pkg.path, detail: 'Package manifest found.' }];
      let score = 10;

      for (const [dependency, points] of Object.entries({
        next: 9,
        react: 5,
        expo: 8,
        'react-native': 6,
        'react-native-web': 9,
        vue: 5,
        nuxt: 9,
        '@angular/core': 9,
        '@sveltejs/kit': 9,
        svelte: 5,
        '@remix-run/react': 9,
        astro: 9,
        typescript: 2,
      })) {
        if (pkg.dependencies[dependency]) {
          score += points;
          evidence.push({ type: 'dependency', path: pkg.path, detail: `${dependency} dependency found.` });
        }
      }

      const rootPrefix = pkg.root ? `${pkg.root}/` : '';
      if (hasEntry(manifest, `${rootPrefix}src`)) {
        score += 3;
        evidence.push({ type: 'directory', path: `${rootPrefix}src`, detail: 'Source directory found.' });
      }
      if (hasEntry(manifest, `${rootPrefix}tsconfig.json`)) {
        score += 2;
        evidence.push({ type: 'config', path: `${rootPrefix}tsconfig.json`, detail: 'TypeScript config found.' });
      }
      if (hasConfig(manifest, pkg.root, ['next.config', 'vite.config', 'nuxt.config', 'svelte.config', 'astro.config'])) {
        score += 4;
        evidence.push({ type: 'config', path: pkg.root || '.', detail: 'Framework configuration found.' });
      }

      return { path: pkg.root || '.', score, evidence };
    })
    .sort((first, second) => second.score - first.score)
    .slice(0, SOURCE_LIMITS.maxPathCandidates);

  if (candidates.length === 0) {
    return field('.', 'LOW', [], ['No package manifest was available; using repository root for review.'], candidates);
  }

  const [selected, alternative] = candidates;
  const warnings =
    alternative && alternative.score >= selected.score - 4
      ? ['Multiple credible project roots were detected. Review the selected root before confirming.']
      : [];

  return field(
    selected.path,
    warnings.length ? 'MEDIUM' : 'HIGH',
    selected.evidence,
    warnings,
    candidates
  );
}

export function detectFramework(context: DetectionContext): Field<Framework> {
  const pkg = context.primaryPackageJson;
  const evidence: Evidence[] = [];
  const warnings: string[] = [];

  if (!pkg) {
    return field('UNKNOWN', 'LOW', [], ['No package manifest was available for framework detection.']);
  }

  const deps = pkg.dependencies;
  const mobileWebEvidence = detectMobileWebEvidence(context, pkg);
  if (mobileWebEvidence.length > 0) {
    return field(
      'MOBILE_WEB',
      mobileWebEvidence.some(item => item.detail.includes('react-native-web'))
        ? 'HIGH'
        : 'MEDIUM',
      mobileWebEvidence,
      mobileWebEvidence.some(item => item.detail.includes('react-native-web'))
        ? []
        : ['Mobile web was inferred from Expo/React Native signals; confirm web support before running audits.']
    );
  }

  const rules: Array<{ framework: Framework; dependencies: string[]; configPrefixes?: string[] }> = [
    { framework: 'NEXTJS', dependencies: ['next'], configPrefixes: ['next.config'] },
    { framework: 'NUXT', dependencies: ['nuxt'], configPrefixes: ['nuxt.config'] },
    { framework: 'ANGULAR', dependencies: ['@angular/core'], configPrefixes: ['angular.json'] },
    { framework: 'SVELTEKIT', dependencies: ['@sveltejs/kit'], configPrefixes: ['svelte.config'] },
    { framework: 'REMIX', dependencies: ['@remix-run/react'], configPrefixes: ['remix.config'] },
    { framework: 'ASTRO', dependencies: ['astro'], configPrefixes: ['astro.config'] },
    { framework: 'VUE', dependencies: ['vue'], configPrefixes: ['vite.config', 'vue.config'] },
    { framework: 'SVELTE', dependencies: ['svelte'], configPrefixes: ['svelte.config'] },
  ];

  const matches = rules.filter(rule => rule.dependencies.some(dependency => deps[dependency]));
  for (const match of matches) {
    evidence.push({ type: 'dependency', path: pkg.path, detail: `${match.dependencies.join(' or ')} dependency found.` });
    for (const prefix of match.configPrefixes ?? []) {
      const config = findRootConfig(context.manifest, context.selectedRoot, prefix);
      if (config) {
        evidence.push({ type: 'config', path: config.relativePath, detail: `${prefix} supports framework detection.` });
      }
    }
  }

  if (hasDependency(pkg, 'react') && hasDependency(pkg, 'vite') && findRootConfig(context.manifest, context.selectedRoot, 'vite.config')) {
    matches.push({ framework: 'REACT_VITE', dependencies: ['react', 'vite'] });
    evidence.push({ type: 'dependency', path: pkg.path, detail: 'react and vite dependencies found.' });
    evidence.push({ type: 'config', path: findRootConfig(context.manifest, context.selectedRoot, 'vite.config')?.relativePath ?? pkg.path, detail: 'Vite config supports React/Vite detection.' });
  }

  if (matches.length > 1) {
    warnings.push('Multiple framework signals were detected; review the selected framework.');
  }

  const selected = matches[0]?.framework ?? (hasDependency(pkg, 'react') ? 'REACT' : 'UNKNOWN');
  if (selected === 'REACT') {
    evidence.push({ type: 'dependency', path: pkg.path, detail: 'react dependency found without a stronger supported framework.' });
  }
  if (selected === 'UNKNOWN' && hasBackendServiceSignals(pkg)) {
    evidence.push({ type: 'backend_dependency', path: pkg.path, detail: 'Backend service dependencies found without supported frontend framework evidence.' });
    warnings.push('This source looks backend-only. ComponentIQ can save the detection for review, but no supported frontend framework was detected.');
  }

  return field(selected, selected === 'UNKNOWN' ? 'LOW' : warnings.length ? 'MEDIUM' : 'HIGH', evidence, warnings);
}

export function detectLanguage(context: DetectionContext): Field<Language> {
  const entries = entriesUnderRoot(context.manifest, context.selectedRoot);
  const evidence: Evidence[] = [];
  const hasTsConfig = Boolean(findRootConfig(context.manifest, context.selectedRoot, 'tsconfig'));
  const tsFile = entries.find(entry => ['.ts', '.tsx'].includes(entry.extension));
  const jsFile = entries.find(entry => ['.js', '.jsx'].includes(entry.extension));

  if (hasTsConfig) {
    evidence.push({ type: 'config', path: rootPath(context.selectedRoot, 'tsconfig.json'), detail: 'TypeScript config found.' });
  }
  if (tsFile) evidence.push({ type: 'file_extension', path: tsFile.relativePath, detail: 'TypeScript source file found.' });
  if (jsFile) evidence.push({ type: 'file_extension', path: jsFile.relativePath, detail: 'JavaScript source file found.' });
  if (context.primaryPackageJson?.dependencies.typescript) {
    evidence.push({ type: 'dependency', path: context.primaryPackageJson.path, detail: 'typescript dependency found.' });
  }

  if (hasTsConfig || tsFile || context.primaryPackageJson?.dependencies.typescript) {
    return field('TYPESCRIPT', jsFile ? 'MEDIUM' : 'HIGH', evidence, jsFile ? ['JavaScript files were also found.'] : []);
  }

  if (jsFile || context.primaryPackageJson) {
    return field('JAVASCRIPT', 'MEDIUM', evidence, []);
  }

  return field('UNKNOWN', 'LOW', evidence, ['No TypeScript or JavaScript source evidence was found.']);
}

export function detectPackageManager(context: DetectionContext): Field<Manager> {
  const lockfiles: Array<[Manager, string]> = [
    ['PNPM', 'pnpm-lock.yaml'],
    ['YARN', 'yarn.lock'],
    ['NPM', 'package-lock.json'],
    ['NPM', 'npm-shrinkwrap.json'],
    ['BUN', 'bun.lock'],
    ['BUN', 'bun.lockb'],
  ];
  const evidence: Evidence[] = [];
  const found = lockfiles.filter(([, file]) => hasFile(context.manifest, context.selectedRoot, file));

  for (const [manager, file] of found) {
    evidence.push({ type: 'lockfile', path: rootPath(context.selectedRoot, file), detail: `${manager} lockfile found.` });
  }

  const packageManager = context.primaryPackageJson?.packageManager?.split('@')[0]?.toLowerCase();
  if (packageManager) {
    evidence.push({ type: 'package_manager_field', path: context.primaryPackageJson?.path ?? 'package.json', detail: `packageManager declares ${packageManager}.` });
  }

  const fieldManager = normalizePackageManager(packageManager);
  const selected = found[0]?.[0] ?? fieldManager ?? 'UNKNOWN';
  const uniqueManagers = new Set(found.map(([manager]) => manager));
  const warnings = uniqueManagers.size > 1 ? ['Multiple incompatible lockfiles were detected.'] : [];

  return field(selected, selected === 'UNKNOWN' ? 'LOW' : warnings.length ? 'MEDIUM' : 'HIGH', evidence, warnings);
}

export function detectStyling(context: DetectionContext): Field<Styling[]> {
  const entries = entriesUnderRoot(context.manifest, context.selectedRoot);
  const styles = new Set<Styling>();
  const evidence: Evidence[] = [];
  const pkg = context.primaryPackageJson;

  if (pkg?.dependencies.tailwindcss || findRootConfig(context.manifest, context.selectedRoot, 'tailwind.config')) {
    styles.add('TAILWIND');
    evidence.push({ type: 'dependency_or_config', path: pkg?.path ?? rootPath(context.selectedRoot, 'tailwind.config.*'), detail: 'Tailwind signal found.' });
  }
  if (entries.some(entry => /\.module\.(css|scss|sass)$/.test(entry.relativePath))) {
    styles.add('CSS_MODULES');
    evidence.push({ type: 'file_pattern', path: firstPath(entries, /\.module\.(css|scss|sass)$/), detail: 'CSS module files found.' });
  }
  if (pkg?.dependencies.sass || entries.some(entry => ['.scss', '.sass'].includes(entry.extension))) {
    styles.add('SASS');
    evidence.push({ type: 'dependency_or_file', path: pkg?.dependencies.sass ? pkg.path : firstPath(entries, /\.(scss|sass)$/), detail: 'Sass signal found.' });
  }
  if (pkg?.dependencies['styled-components']) {
    styles.add('STYLED_COMPONENTS');
    evidence.push({ type: 'dependency', path: pkg.path, detail: 'styled-components dependency found.' });
  }
  if (pkg?.dependencies['@emotion/react'] || pkg?.dependencies['@emotion/styled']) {
    styles.add('EMOTION');
    evidence.push({ type: 'dependency', path: pkg.path, detail: 'Emotion dependency found.' });
  }
  if (entries.some(entry => entry.extension === '.css')) {
    styles.add('PLAIN_CSS');
    evidence.push({ type: 'file_extension', path: firstPath(entries, /\.css$/), detail: 'CSS files found.' });
  }

  const value = styles.size ? Array.from(styles) : ['UNKNOWN' as const];
  return field(value, styles.size ? 'MEDIUM' : 'LOW', evidence, styles.size ? [] : ['No supported styling system was detected.']);
}

export function detectMonorepo(context: DetectionContext): Field<{ detected: boolean; tool: MonoTool | null; candidateWorkspaceRoots: string[] }> {
  const evidence: Evidence[] = [];
  let tool: MonoTool | null = null;

  const signals: Array<[MonoTool, string]> = [
    ['PNPM_WORKSPACE', 'pnpm-workspace.yaml'],
    ['TURBO', 'turbo.json'],
    ['NX', 'nx.json'],
    ['LERNA', 'lerna.json'],
  ];
  for (const [candidateTool, filename] of signals) {
    if (hasFile(context.manifest, '', filename)) {
      tool ??= candidateTool;
      evidence.push({ type: 'monorepo_config', path: filename, detail: `${candidateTool} configuration found.` });
    }
  }
  const rootPackage = context.packageJsons.find(pkg => pkg.root === '');
  if (rootPackage?.path) {
    const entry = context.manifest.entries.find(item => item.relativePath === rootPackage.path);
    if (entry?.content?.includes('"workspaces"')) {
      tool ??= 'PACKAGE_WORKSPACES';
      evidence.push({ type: 'package_workspaces', path: rootPackage.path, detail: 'package.json workspaces field found.' });
    }
  }

  return field({ detected: evidence.length > 0, tool, candidateWorkspaceRoots: context.packageJsons.map(pkg => pkg.root || '.').slice(0, SOURCE_LIMITS.maxPathCandidates) }, evidence.length ? 'HIGH' : 'LOW', evidence, []);
}

export function detectStorybook(context: DetectionContext): Field<boolean> {
  const evidence: Evidence[] = [];
  const pkg = context.primaryPackageJson;

  if (hasEntry(context.manifest, rootPath(context.selectedRoot, '.storybook'))) {
    evidence.push({ type: 'directory', path: rootPath(context.selectedRoot, '.storybook'), detail: 'Storybook directory found.' });
  }
  if (Object.keys(pkg?.dependencies ?? {}).some(dependency => dependency.includes('storybook'))) {
    evidence.push({ type: 'dependency', path: pkg?.path ?? 'package.json', detail: 'Storybook dependency found.' });
  }
  const storyFile = entriesUnderRoot(context.manifest, context.selectedRoot).find(entry => /\.stories\.[cm]?[jt]sx?$|\.stories\.(vue|svelte)$/.test(entry.relativePath));
  if (storyFile) {
    evidence.push({ type: 'story_file', path: storyFile.relativePath, detail: 'Story file found as supporting evidence.' });
  }

  const detected = evidence.some(item => item.type !== 'story_file');
  return field(detected, detected ? 'HIGH' : storyFile ? 'LOW' : 'MEDIUM', evidence, storyFile && !detected ? ['Story files were found, but no Storybook dependency or config was detected.'] : []);
}

export function detectComponentPaths(context: DetectionContext): Field<string[]> {
  const candidates = scoreDirectories(context, [
    'src/components',
    'components',
    'app/components',
    'packages/ui',
    'packages/design-system',
  ], /\.(tsx|jsx|vue|svelte)$/);

  return field(candidates.map(candidate => candidate.path), candidates.length ? 'MEDIUM' : 'LOW', candidates.flatMap(candidate => candidate.evidence), candidates.length ? [] : ['No likely component directories were detected.']);
}

export function detectTokenPaths(context: DetectionContext): Field<string[]> {
  const entries = entriesUnderRoot(context.manifest, context.selectedRoot);
  const tokenPattern = /(^|\/)(tokens|design-tokens|theme|themes|variables|foundations)(\/|\.|-)|tokens?\.(json|ts|js|css)$/i;
  const matches = entries
    .filter(entry => tokenPattern.test(entry.relativePath) || entry.content?.includes('--'))
    .filter(entry => ['.json', '.ts', '.js', '.css', '.scss'].includes(entry.extension))
    .slice(0, SOURCE_LIMITS.maxPathCandidates);

  const evidence = matches.map(entry => ({
    type: entry.content?.includes('--') ? 'css_custom_properties' : 'path_pattern',
    path: entry.relativePath,
    detail: 'Potential design-token source found.',
  }));

  return field(matches.map(entry => entry.relativePath), matches.length ? 'LOW' : 'LOW', evidence, matches.length ? ['Token paths are heuristic suggestions and require review.'] : ['No likely design-token paths were detected.']);
}

function scoreDirectories(context: DetectionContext, knownDirs: string[], filePattern: RegExp) {
  const entries = entriesUnderRoot(context.manifest, context.selectedRoot).slice(0, SOURCE_LIMITS.maxComponentFilesSampled);
  const scores = new Map<string, { path: string; score: number; evidence: Evidence[] }>();

  for (const known of knownDirs) {
    const fullPath = rootPath(context.selectedRoot, known);
    const count = entries.filter(entry => entry.relativePath.startsWith(`${fullPath}/`) && filePattern.test(entry.relativePath)).length;
    if (count >= 2 || hasEntry(context.manifest, fullPath)) {
      scores.set(fullPath, { path: fullPath, score: count + 3, evidence: [{ type: 'directory', path: fullPath, detail: `Likely component directory with ${count} component-like files.` }] });
    }
  }

  return Array.from(scores.values())
    .sort((first, second) => second.score - first.score)
    .slice(0, SOURCE_LIMITS.maxPathCandidates);
}

function field<T>(value: T | null, confidence: Field<T>['confidence'], evidence: Evidence[], warnings: string[], candidates?: RootDetectionResult['candidates']): RootDetectionResult & Field<T> {
  return { value, confidence, evidence, warnings, candidates: candidates ?? [] } as RootDetectionResult & Field<T>;
}

function entriesUnderRoot(manifest: SourceManifest, root: string): SourceManifestEntry[] {
  const prefix = root && root !== '.' ? `${root}/` : '';
  return manifest.entries.filter(entry => !prefix || entry.relativePath.startsWith(prefix));
}

function hasFile(manifest: SourceManifest, root: string, filename: string): boolean {
  return manifest.entries.some(entry => entry.relativePath === rootPath(root, filename));
}

function hasEntry(manifest: SourceManifest, relativePath: string): boolean {
  return manifest.entries.some(entry => entry.relativePath === relativePath || entry.relativePath.startsWith(`${relativePath}/`));
}

function hasConfig(manifest: SourceManifest, root: string, prefixes: string[]): boolean {
  return prefixes.some(prefix => Boolean(findRootConfig(manifest, root, prefix)));
}

function findRootConfig(manifest: SourceManifest, root: string, prefix: string): SourceManifestEntry | undefined {
  const rootPrefix = root && root !== '.' ? `${root}/` : '';
  return manifest.entries.find(entry => entry.relativePath.startsWith(rootPrefix) && path.posix.basename(entry.relativePath).startsWith(prefix));
}

function rootPath(root: string, child: string): string {
  return root && root !== '.' ? `${root}/${child}` : child;
}

function firstPath(entries: SourceManifestEntry[], pattern: RegExp): string {
  return entries.find(entry => pattern.test(entry.relativePath))?.relativePath ?? '.';
}

function normalizePackageManager(value: string | undefined): Manager | null {
  if (value === 'pnpm') return 'PNPM';
  if (value === 'npm') return 'NPM';
  if (value === 'yarn') return 'YARN';
  if (value === 'bun') return 'BUN';
  return null;
}

function detectMobileWebEvidence(
  context: DetectionContext,
  pkg: PackageJsonInfo
): Evidence[] {
  const evidence: Evidence[] = [];
  const hasExpo = hasDependency(pkg, 'expo');
  const hasReactNative = hasDependency(pkg, 'react-native');
  const hasReactNativeWeb = hasDependency(pkg, 'react-native-web');
  const hasExpoRouter = hasDependency(pkg, 'expo-router');
  const appConfig = findRootConfig(context.manifest, context.selectedRoot, 'app.config') ??
    findRootConfig(context.manifest, context.selectedRoot, 'app.json');

  if (!hasExpo && !hasReactNative && !hasReactNativeWeb) {
    return [];
  }

  if (hasReactNativeWeb) {
    evidence.push({ type: 'dependency', path: pkg.path, detail: 'react-native-web dependency found.' });
  }
  if (hasExpo) {
    evidence.push({ type: 'dependency', path: pkg.path, detail: 'expo dependency found.' });
  }
  if (hasReactNative) {
    evidence.push({ type: 'dependency', path: pkg.path, detail: 'react-native dependency found.' });
  }
  if (hasExpoRouter) {
    evidence.push({ type: 'dependency', path: pkg.path, detail: 'expo-router dependency found.' });
  }
  if (appConfig) {
    evidence.push({ type: 'config', path: appConfig.relativePath, detail: 'Expo app configuration found.' });
  }

  return hasReactNativeWeb || (hasExpo && (hasReactNative || hasExpoRouter || appConfig))
    ? evidence
    : [];
}

function hasBackendServiceSignals(pkg: PackageJsonInfo) {
  return [
    '@nestjs/core',
    'express',
    'fastify',
    'koa',
    'hono',
    '@prisma/client',
    'drizzle-orm',
  ].some(dependency => hasDependency(pkg, dependency));
}
