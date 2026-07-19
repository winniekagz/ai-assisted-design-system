# Component IQ Backend Implementation Rules

You are implementing backend features in the Component IQ monorepo:

`/home/winnie/Desktop/projects/ai-assisted-design-system`

The backend uses NestJS, Prisma, PostgreSQL, Clerk authentication,
Clerk Organizations, and shared contracts from the monorepo.

Follow these rules for all backend implementation work.

## 1. Start with repository inspection

Before modifying code, inspect:

- the relevant NestJS module;
- existing controllers, services, guards, DTOs and Prisma models;
- shared types and validation schemas;
- organization resolution;
- current project and configuration state machines;
- existing error-handling conventions;
- test conventions;
- background-job conventions;
- source-upload and temporary-file behavior.

Do not introduce a parallel architecture when an established pattern exists.

Ask a blocking question only when repository inspection cannot resolve a
decision that would materially change persistence, security, storage or job
execution.

Do not ask questions about naming, file placement or patterns that can be
inferred from the repository.

## 2. Think in domain transitions, not endpoints

Every write operation must represent a valid domain transition.

For project configuration, reason using:

```text
SETUP_REQUIRED
→ SOURCE_SELECTED
→ UPLOADING
→ ANALYZING
→ REVIEW_REQUIRED
→ READY