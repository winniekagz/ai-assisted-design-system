import { builtinModules } from 'node:module';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceExtensions = new Set([
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.mdx',
]);
const ignoredDirectories = new Set([
  '.git',
  '.next',
  '.turbo',
  '.next-build',
  'coverage',
  'dist',
  'node_modules',
  'storybook-static',
]);
const rootFiles = ['eslint.config.mjs'];
const ignoredSourceFiles = new Set([
  'apps/api/src/ai/providers/mock-ai.provider.ts',
  'apps/api/src/common/swagger/api-examples.ts',
]);
const importPatterns = [
  /(?:^|\n)\s*import\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g,
  /(?:^|\n)\s*export\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g,
  /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
];
const builtins = new Set([
  ...builtinModules,
  ...builtinModules.map(moduleName => `node:${moduleName}`),
]);

const rootPackage = await readPackageJson(root);
const workspacePackageDirs = await findWorkspacePackageDirs(rootPackage.workspaces ?? []);
const packages = [
  {
    dir: root,
    packageJson: rootPackage,
    files: rootFiles.map(file => path.join(root, file)),
  },
  ...workspacePackageDirs.map(dir => ({
    dir,
    packageJson: null,
    files: null,
  })),
];

for (const packageInfo of packages) {
  packageInfo.packageJson ??= await readPackageJson(packageInfo.dir);
  packageInfo.files ??= await collectSourceFiles(packageInfo.dir);
}

const problems = [];

for (const packageInfo of packages) {
  const declaredDependencies = dependencyNames(packageInfo.packageJson);
  const packageName = packageInfo.packageJson.name ?? path.relative(root, packageInfo.dir);

  for (const file of packageInfo.files) {
    if (ignoredSourceFiles.has(path.relative(root, file))) continue;

    const source = await readFile(file, 'utf8');
    const imports = extractImports(source);

    for (const specifier of imports) {
      if (isInternalSpecifier(specifier)) continue;

      const dependencyName = packageNameFromSpecifier(specifier);
      if (
        builtins.has(dependencyName) ||
        dependencyName === packageName ||
        declaredDependencies.has(dependencyName)
      ) {
        continue;
      }

      problems.push({
        packageName,
        file: path.relative(root, file),
        dependencyName,
      });
    }
  }
}

if (problems.length > 0) {
  console.error('Missing workspace dependency declarations:');
  for (const problem of problems) {
    console.error(
      `- ${problem.packageName}: ${problem.dependencyName} imported by ${problem.file}`
    );
  }
  process.exit(1);
}

console.log('Workspace dependency declarations are complete.');

async function readPackageJson(dir) {
  return JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
}

async function findWorkspacePackageDirs(workspaces) {
  const dirs = [];

  for (const workspace of workspaces) {
    if (!workspace.endsWith('/*')) continue;

    const parent = path.join(root, workspace.slice(0, -2));
    const entries = await readdir(parent, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const dir = path.join(parent, entry.name);
      try {
        await readFile(path.join(dir, 'package.json'), 'utf8');
        dirs.push(dir);
      } catch {
        // Workspace globs may include directories that are not packages yet.
      }
    }
  }

  return dirs.sort();
}

async function collectSourceFiles(dir) {
  const files = [];
  await walk(dir, files);
  return files;
}

async function walk(dir, files) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;

    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(entryPath, files);
      continue;
    }

    if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }
}

function dependencyNames(packageJson) {
  return new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
  ]);
}

function extractImports(source) {
  const imports = new Set();

  for (const pattern of importPatterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      imports.add(match[1]);
    }
  }

  return imports;
}

function isInternalSpecifier(specifier) {
  return (
    specifier.startsWith('.') ||
    specifier.startsWith('/') ||
    specifier.startsWith('@/') ||
    specifier.startsWith('#')
  );
}

function packageNameFromSpecifier(specifier) {
  if (!specifier.startsWith('@')) {
    return specifier.split('/')[0];
  }

  const [scope, name] = specifier.split('/');
  return `${scope}/${name}`;
}
