import type { ProjectConfigurationStatus } from './types';

export const stageSteps = [
  { id: 'source', label: 'Source' },
  { id: 'setup', label: 'Setup' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'review', label: 'Review' },
];

export const repoRows = [
  {
    id: 'checkout-web',
    name: 'acme/checkout-web',
    visibility: 'Private',
    status: 'Available',
    branch: 'main',
  },
  {
    id: 'checkout-mobile',
    name: 'acme/checkout-mobile',
    visibility: 'Private',
    status: 'Already connected',
    branch: 'release/3.4',
  },
  {
    id: 'legacy-admin',
    name: 'acme/legacy-admin',
    visibility: 'Archived',
    status: 'Unavailable',
    branch: 'main',
  },
];

export const analysisSteps = [
  'Reading package manifests',
  'Detecting component directories',
  'Finding design token usage',
  'Preparing configuration review',
];

export const localExclusions = [
  'node_modules/',
  '.git/',
  '.cache/',
  '.turbo/',
  '.vercel/',
  'dist/',
  'build/',
  '.next/',
  'coverage/',
  '.env*',
  '*.pem',
  '*.key',
  '*.log',
  '*.map',
];

export const localUploadLimits = {
  maxFiles: 5000,
  maxBytes: 250 * 1024 * 1024,
};

export const statusLabels: Record<ProjectConfigurationStatus, string> = {
  NOT_CONFIGURED: 'Setup required',
  CONFIGURING: 'Configuring',
  REVIEW_REQUIRED: 'Review setup',
  READY: 'Ready',
  CONFIGURATION_FAILED: 'Setup failed',
  ARCHIVED: 'Archived',
};
