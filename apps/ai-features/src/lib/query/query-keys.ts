export const queryKeys = {
  me: ['me'] as const,
  organizations: ['organizations'] as const,
  organization: (orgSlug: string) => ['organizations', orgSlug] as const,
  projects: (orgSlug: string) => ['organizations', orgSlug, 'projects'] as const,
  projectConfiguration: (orgSlug: string, projectId: string) =>
    ['organizations', orgSlug, 'projects', projectId, 'configuration'] as const,
  projectAudits: (orgSlug: string, projectId: string) =>
    ['organizations', orgSlug, 'projects', projectId, 'audits'] as const,
  githubConnections: (orgSlug: string) =>
    ['organizations', orgSlug, 'integrations', 'github'] as const,
  githubRepositories: (
    orgSlug: string,
    connectionId: string,
    cursor?: string | null
  ) =>
    [
      'organizations',
      orgSlug,
      'integrations',
      'github',
      connectionId,
      'repositories',
      cursor ?? 'first-page',
    ] as const,
  members: (orgSlug: string) => ['organizations', orgSlug, 'members'] as const,
  invites: (orgSlug: string) => ['organizations', orgSlug, 'invites'] as const,
  invitePreview: (token: string) => ['invites', 'validate', token] as const,
};
