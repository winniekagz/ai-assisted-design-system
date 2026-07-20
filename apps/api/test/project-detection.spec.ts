import { describe, expect, it } from 'vitest';

import { detectProjectSetup } from '../src/project-detection/detector-orchestrator';
import { buildManifestFromUpload } from '../src/project-detection/source-manifest';

function manifest(files: Record<string, string>) {
  return buildManifestFromUpload(
    Object.entries(files).map(([originalname, content]) => ({
      originalname,
      buffer: Buffer.from(content),
      size: Buffer.byteLength(content),
    }))
  );
}

describe('project detection', () => {
  it('detects Next.js TypeScript with Tailwind evidence', () => {
    const setup = detectProjectSetup(
      manifest({
        'package.json': JSON.stringify({
          dependencies: { next: '15.0.0', react: '19.0.0', tailwindcss: '4.0.0' },
          devDependencies: { typescript: '5.0.0' },
          packageManager: 'pnpm@9.0.0',
        }),
        'next.config.ts': 'export default {}',
        'tsconfig.json': '{}',
        'pnpm-lock.yaml': '',
        'src/components/Button.tsx': 'export function Button() { return null }',
        'src/components/Card.tsx': 'export function Card() { return null }',
        'src/styles/tokens.css': ':root { --color-brand: red; }',
      }),
      'snapshot_1'
    );

    expect(setup.framework.value).toBe('NEXTJS');
    expect(setup.language.value).toBe('TYPESCRIPT');
    expect(setup.packageManager.value).toBe('PNPM');
    expect(setup.stylingSystem.value).toContain('TAILWIND');
    expect(setup.componentPaths.value).toContain('src/components');
    expect(setup.tokenPaths.value).toContain('src/styles/tokens.css');
    expect(setup.projectRoot.value).toBe('.');
  });

  it('detects React with Vite only when React and Vite evidence combine', () => {
    const setup = detectProjectSetup(
      manifest({
        'package.json': JSON.stringify({
          dependencies: { react: '19.0.0', vite: '7.0.0' },
        }),
        'vite.config.ts': 'export default {}',
        'src/App.jsx': 'export default function App() { return null }',
      }),
      null
    );

    expect(setup.framework.value).toBe('REACT_VITE');
  });

  it('detects plain React when no stronger framework exists', () => {
    const setup = detectProjectSetup(
      manifest({
        'package.json': JSON.stringify({ dependencies: { react: '19.0.0' } }),
        'src/App.jsx': 'export default function App() { return null }',
      }),
      null
    );

    expect(setup.framework.value).toBe('REACT');
  });

  it('detects mobile web from Expo and React Native Web evidence', () => {
    const setup = detectProjectSetup(
      manifest({
        'package.json': JSON.stringify({
          dependencies: {
            expo: '53.0.0',
            'expo-router': '5.0.0',
            react: '19.0.0',
            'react-native': '0.79.0',
            'react-native-web': '0.20.0',
          },
        }),
        'app.json': JSON.stringify({ expo: { name: 'Hoppla' } }),
        'app/index.tsx': 'export default function Screen() { return null }',
      }),
      null
    );

    expect(setup.framework.value).toBe('MOBILE_WEB');
    expect(setup.framework.confidence).toBe('HIGH');
    expect(setup.framework.evidence.map(item => item.detail)).toContain('react-native-web dependency found.');
  });

  it('keeps backend-only projects reviewable with an unknown framework warning', () => {
    const setup = detectProjectSetup(
      manifest({
        'package.json': JSON.stringify({
          dependencies: {
            '@nestjs/core': '10.0.0',
            '@prisma/client': '5.0.0',
          },
        }),
        'src/main.ts': 'bootstrap();',
      }),
      null
    );

    expect(setup.framework.value).toBe('UNKNOWN');
    expect(setup.framework.warnings.join(' ')).toContain('backend-only');
    expect(setup.globalWarnings.join(' ')).toContain('backend-only');
  });

  it('warns on malformed package manifests instead of crashing', () => {
    const setup = detectProjectSetup(
      manifest({
        'package.json': '{',
        'src/App.js': 'console.log("hello")',
      }),
      null
    );

    expect(setup.framework.value).toBe('UNKNOWN');
    expect(setup.globalWarnings.some(warning => warning.includes('package manifest'))).toBe(true);
  });

  it('detects monorepo signals without trusting an apps directory alone', () => {
    const monorepo = detectProjectSetup(
      manifest({
        'package.json': JSON.stringify({ workspaces: ['apps/*'] }),
        'apps/web/package.json': JSON.stringify({ dependencies: { next: '15.0.0' } }),
        'turbo.json': '{}',
      }),
      null
    );
    const appsOnly = detectProjectSetup(
      manifest({
        'apps/web/package.json': JSON.stringify({ dependencies: { next: '15.0.0' } }),
      }),
      null
    );

    expect(monorepo.monorepo.value?.detected).toBe(true);
    expect(appsOnly.monorepo.value?.detected).toBe(false);
  });

  it('ignores environment files and traversal paths', () => {
    const source = manifest({
      '.env': 'SECRET=value',
      '../escape/package.json': '{}',
      'package.json': JSON.stringify({ dependencies: { astro: '5.0.0' } }),
    });
    const paths = source.entries.map(entry => entry.relativePath);

    expect(paths).toEqual(['package.json']);
    expect(detectProjectSetup(source, null).framework.value).toBe('ASTRO');
  });
});
