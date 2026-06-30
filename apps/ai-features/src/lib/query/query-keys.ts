export const queryKeys = {
  me: ['me'] as const,
  organizations: ['organizations'] as const,
  organization: (orgSlug: string) => ['organizations', orgSlug] as const,
  members: (orgSlug: string) => ['organizations', orgSlug, 'members'] as const,
  invites: (orgSlug: string) => ['organizations', orgSlug, 'invites'] as const,
  invitePreview: (token: string) => ['invites', 'validate', token] as const,
};
