// FIXTURE: Create/import project flow copy and discovery output.
// Replace with real GitHub repo discovery, archive analysis, and import APIs when
// those backend jobs exist.

export type DiscoverySourceId =
  | 'github_repository'
  | 'github_organization'
  | 'local_project'
  | 'zip_archive'
  | 'design_system'
  | 'componentiq_config';

export type DiscoverySource = {
  id: DiscoverySourceId;
  title: string;
  description: string;
  discovers: string;
  permissions: string;
  wired: boolean;
};

export type DiscoveryStep = {
  id: string;
  label: string;
  detail: string;
};

export type DiscoveryResult = {
  projectName: string;
  repositories: string[];
  framework: string;
  designSystem: string;
  confidence: number;
  componentsFound: number;
  techTags: string[];
  suggestions: {
    id: string;
    label: string;
    detail: string;
    enabled: boolean;
  }[];
};

export const discoverySources: DiscoverySource[] = [
  {
    id: 'github_repository',
    title: 'GitHub Repository',
    description: 'Connect one repository and let ComponentIQ inspect its app surface.',
    discovers: 'Framework, package manager, styling system, tokens, and components.',
    permissions: 'Requires repository read access through GitHub.',
    wired: false,
  },
  {
    id: 'github_organization',
    title: 'GitHub Organisation',
    description: 'Browse repositories from a GitHub organisation before importing one.',
    discovers: 'Repository candidates, frameworks, design-system usage, and audit readiness.',
    permissions: 'Requires organisation repository read access through GitHub.',
    wired: false,
  },
  {
    id: 'local_project',
    title: 'Local Project',
    description: 'Point ComponentIQ at a local source tree for discovery.',
    discovers: 'Package metadata, component paths, and styling conventions.',
    permissions: 'Out of scope until local agent upload is available.',
    wired: false,
  },
  {
    id: 'zip_archive',
    title: 'ZIP Archive',
    description: 'Review a compressed project archive before saving anything.',
    discovers: 'Framework, package scripts, source folders, and likely design tokens.',
    permissions: 'Out of scope until archive analysis is available.',
    wired: false,
  },
  {
    id: 'design_system',
    title: 'Existing Design System',
    description: 'Start from a known design system and find matching project usage.',
    discovers: 'Token coverage, deprecated components, and migration hints.',
    permissions: 'Out of scope until design-system linking is available.',
    wired: false,
  },
  {
    id: 'componentiq_config',
    title: 'ComponentIQ Configuration',
    description: 'Import a ComponentIQ configuration file and review detected settings.',
    discovers: 'Configured rules, repository metadata, and audit defaults.',
    permissions: 'Out of scope until configuration import is available.',
    wired: false,
  },
];

export const discoverySteps: DiscoveryStep[] = [
  { id: 'clone', label: 'Reading project metadata', detail: 'Checking repository name and default branch.' },
  { id: 'package', label: 'Detecting package manager', detail: 'Looking for lockfiles and workspace settings.' },
  { id: 'framework', label: 'Identifying framework', detail: 'Scanning scripts, dependencies, and app folders.' },
  { id: 'styles', label: 'Finding styling system', detail: 'Checking Tailwind, CSS modules, and token usage.' },
  { id: 'components', label: 'Indexing components', detail: 'Mapping reusable UI files and usage sites.' },
  { id: 'tokens', label: 'Checking design tokens', detail: 'Comparing colours, spacing, and typography patterns.' },
  { id: 'rules', label: 'Matching guardrail rules', detail: 'Suggesting rules based on detected technology.' },
  { id: 'repos', label: 'Grouping repositories', detail: 'Finding related frontend and API surfaces.' },
  { id: 'audit', label: 'Preparing first audit', detail: 'Selecting a baseline audit configuration.' },
  { id: 'summary', label: 'Building review summary', detail: 'Preparing results for confirmation.' },
];

export const discoveryResultFixture: DiscoveryResult = {
  projectName: 'Checkout Web',
  repositories: ['acme/checkout-web', 'acme/checkout-api', 'acme/checkout-mobile'],
  framework: 'Next.js',
  designSystem: 'Acme Design System v3.4',
  confidence: 92,
  componentsFound: 184,
  techTags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'npm'],
  suggestions: [
    {
      id: 'rules',
      label: 'Enable checkout accessibility rules',
      detail: 'Adds dialog naming, form label, and keyboard navigation checks.',
      enabled: true,
    },
    {
      id: 'tokens',
      label: 'Track raw colour usage',
      detail: 'Flags hardcoded colours that bypass approved tokens.',
      enabled: true,
    },
    {
      id: 'deprecated',
      label: 'Watch deprecated components',
      detail: 'Creates findings for legacy ButtonPrimary and ModalBase usage.',
      enabled: true,
    },
  ],
};

export const recentUploadFixtures = [
  'checkout-web-main.zip',
  'billing-portal-source.zip',
  'componentiq-project.json',
];
