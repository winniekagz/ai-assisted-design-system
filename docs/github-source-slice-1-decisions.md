# GitHub Source Slice 1 Decisions

Slice 1 implements repository listing and the real frontend repository picker only.

1. Canonical source enum value: `ProjectSourceType.GITHUB_REPOSITORY`.
   `ConfigurationSourceType.GIT_REPOSITORY` remains the job/source-family value, but the canonical `ProjectSource.type` value for GitHub repositories is `GITHUB_REPOSITORY`.

2. Permission for connecting a source: `PERMISSIONS.PROJECT_CREATE`.
   This matches the existing local source endpoint and the current GitHub App connect/disconnect routes. The repository-listing endpoint uses `PERMISSIONS.PROJECT_VIEW`.

3. Repository pagination: `GitHubRepositoryListResponse.pagination.nextCursor`.
   The cursor is opaque to frontend callers. For GitHub's current page-based API, the backend encodes the next page number as this cursor.

4. GitHub error mapping:
   `401` during repository listing maps to `source_github_unauthorized`.
   `403` maps to `source_github_forbidden`, except rate-limit responses map to `source_github_rate_limited` with HTTP `429`.
   `404` during repository listing maps to `source_repository_not_found`.
   `401`, `403`, or `404` during installation-token exchange map to `source_installation_revoked` because the installation can no longer mint a usable token.

5. Installation tokens remain ephemeral.
   The API mints an installation access token inside each GitHub client operation, uses it for the immediate GitHub request, and returns only normalized repository metadata. Tokens are not persisted, returned, or logged.
