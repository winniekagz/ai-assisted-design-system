import { ApiError } from '@/lib/api/client';

export function errorMessageFromAuditFailure(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'forbidden') {
      return 'You do not have permission to run audits in this organization.';
    }

    return error.message;
  }

  return 'ComponentIQ could not run this audit. Try again.';
}
