import { ApiError } from '@/lib/api/client';

import type { FieldErrors } from './types';

export function fieldErrorsFromIssuePaths(
  issues: { path: PropertyKey[]; message: string }[]
): FieldErrors {
  return issues.reduce<FieldErrors>((errors, issue) => {
    const field = issue.path[0];

    if (field === 'name' && !errors.name) {
      errors.name = humanizeValidationMessage(issue.message, 'Project name');
    }

    if (field === 'description' && !errors.description) {
      errors.description = humanizeValidationMessage(issue.message, 'Description');
    }

    return errors;
  }, {});
}

export function errorMessageFromCreateFailure(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'conflict') {
      return 'A project with this name already exists in this organization.';
    }

    if (error.code === 'forbidden') {
      return 'You do not have permission to create projects in this organization.';
    }

    return error.message;
  }

  return 'We could not create this project. Try again.';
}

export function focusFirstInvalidField(errors: FieldErrors) {
  if (errors.name) {
    document.querySelector<HTMLInputElement>('input[name="project-name"]')?.focus();
    return;
  }

  if (errors.description) {
    document.getElementById('project-description')?.focus();
  }
}

function humanizeValidationMessage(message: string, label: string) {
  if (message.includes('Too small')) return `${label} must be at least 2 characters.`;
  if (message.includes('Too big')) return `${label} is too long.`;
  if (message.includes('Invalid input')) return `${label} is invalid.`;
  return message;
}
