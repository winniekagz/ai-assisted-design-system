export type InputNormalizationKind = 'plainText' | 'multilineText' | 'exactValue';


export type ForbiddenControlCharacterHandling = 'reject' | 'strip' | 'preserve';

export type InputValidationIssueCode =
  | 'input.required'
  | 'input.too_long'
  | 'input.forbidden_control_character';

export type InputValidationIssue = {
  code: InputValidationIssueCode;
  message: string;
  index?: number;
  maxLength?: number;
};

export type InputValidationSuccess = {
  ok: true;
  value: string;
  issues: [];
};

export type InputValidationFailure = {
  ok: false;
  value: string;
  issues: [InputValidationIssue, ...InputValidationIssue[]];
};

export type InputValidationResult =
  | InputValidationSuccess
  | InputValidationFailure;

export type BaseInputNormalizationPolicy = {
  maxLength?: number;
  required?: boolean;
};

export type PlainTextNormalizationPolicy = BaseInputNormalizationPolicy & {
  kind: 'plainText';
  trim?: boolean;
  forbiddenControlCharacters?: Exclude<
    ForbiddenControlCharacterHandling,
    'preserve'
  >;
};

export type MultilineTextNormalizationPolicy = BaseInputNormalizationPolicy & {
  kind: 'multilineText';
  trim?: boolean;
  forbiddenControlCharacters?: Exclude<
    ForbiddenControlCharacterHandling,
    'preserve'
  >;
};

export type ExactValueNormalizationPolicy = BaseInputNormalizationPolicy & {
  kind: 'exactValue';
  forbiddenControlCharacters?: 'preserve' | 'reject';
};

export type InputNormalizationPolicy =
  | PlainTextNormalizationPolicy
  | MultilineTextNormalizationPolicy
  | ExactValueNormalizationPolicy;

export type InputSecurityProcessorOptions = {
  policy: InputNormalizationPolicy;
  // eslint-disable-next-line no-unused-vars
  onValidationResult?: (result: InputValidationResult) => void;
  // eslint-disable-next-line no-unused-vars
  onNormalizedValue?: (value: string, result: InputValidationSuccess) => void;
};

export type InputSecurityChangeContext = {
  isComposing?: boolean;
};

export type InputSecurityBlurResult = {
  result: InputValidationResult;
  changed: boolean;
};

const forbiddenDisplayControlPattern =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200E\u200F\u202A-\u202E\u2066-\u2069]/u;

// Bounds how many forbidden-control-character issues a single validation pass records,
// so a large adversarial string (e.g. megabytes of bidi-override characters pasted into
// a textarea) can't grow the issues array unbounded before any maxLength check applies.
const MAX_COLLECTED_CONTROL_CHARACTER_ISSUES = 25;

/**
 * Strips display-unsafe control and bidi-override characters (e.g. U+202E) from a
 * string for rendering purposes — e.g. showing an untrusted filename in a UI summary.
 * This is a display-layer normalization only: it does not validate, and it must not be
 * used as a substitute for backend path/content validation.
 */
export function sanitizeDisplayText(value: string): string {
  return Array.from(value)
    .filter(character => !forbiddenDisplayControlPattern.test(character))
    .join('');
}

export function validateAndNormalizeInput(
  value: string,
  policy: InputNormalizationPolicy
): InputValidationResult {
  const issues: InputValidationIssue[] = [];
  const normalized = normalizeInputValue(value, policy, issues);

  if (policy.required && normalized.length === 0) {
    issues.push({
      code: 'input.required',
      message: 'This field is required.',
    });
  }

  if (
    typeof policy.maxLength === 'number' &&
    normalized.length > policy.maxLength
  ) {
    issues.push({
      code: 'input.too_long',
      message: `Enter ${policy.maxLength} characters or fewer.`,
      maxLength: policy.maxLength,
    });
  }

  const firstIssue = issues[0];
  if (firstIssue) {
    return {
      ok: false,
      value: normalized,
      issues: [firstIssue, ...issues.slice(1)],
    };
  }

  return {
    ok: true,
    value: normalized,
    issues: [],
  };
}

export function createInputSecurityProcessor({
  policy,
  onValidationResult,
  onNormalizedValue,
}: InputSecurityProcessorOptions) {
  return {
    handleChange(value: string, context: InputSecurityChangeContext = {}) {
      if (!context.isComposing) {
        onValidationResult?.(validateAndNormalizeInput(value, policy));
      }

      return value;
    },
    handleBlur(value: string): InputSecurityBlurResult {
      const result = validateAndNormalizeInput(value, policy);
      onValidationResult?.(result);

      if (result.ok && result.value !== value) {
        onNormalizedValue?.(result.value, result);
      }

      return {
        result,
        changed: result.ok && result.value !== value,
      };
    },
  };
}

function normalizeInputValue(
  value: string,
  policy: InputNormalizationPolicy,
  issues: InputValidationIssue[]
) {
  if (policy.kind === 'exactValue') {
    recordControlCharacterIssues(value, policy, issues);
    return value;
  }

  const lineNormalized =
    policy.kind === 'multilineText' ? value.replace(/\r\n?/g, '\n') : value;
  const controlNormalized = handleControlCharacters(
    lineNormalized,
    policy,
    issues
  );

  return policy.trim ? controlNormalized.trim() : controlNormalized;
}

function handleControlCharacters(
  value: string,
  policy: PlainTextNormalizationPolicy | MultilineTextNormalizationPolicy,
  issues: InputValidationIssue[]
) {
  const handling = policy.forbiddenControlCharacters ?? 'reject';
  let output = '';
  let collectedIssues = 0;

  for (const [index, character] of Array.from(value).entries()) {
    if (!isForbiddenControlCharacter(character, policy.kind)) {
      output += character;
      continue;
    }

    if (handling === 'reject') {
      if (collectedIssues < MAX_COLLECTED_CONTROL_CHARACTER_ISSUES) {
        issues.push({
          code: 'input.forbidden_control_character',
          message: 'Remove unsupported control characters.',
          index,
        });
        collectedIssues += 1;
      }
      output += character;
      continue;
    }
  }

  return output;
}

function recordControlCharacterIssues(
  value: string,
  policy: ExactValueNormalizationPolicy,
  issues: InputValidationIssue[]
) {
  if ((policy.forbiddenControlCharacters ?? 'preserve') === 'preserve') return;

  let collectedIssues = 0;
  for (const [index, character] of Array.from(value).entries()) {
    if (collectedIssues >= MAX_COLLECTED_CONTROL_CHARACTER_ISSUES) break;

    if (isForbiddenControlCharacter(character, 'exactValue')) {
      issues.push({
        code: 'input.forbidden_control_character',
        message: 'Remove unsupported control characters.',
        index,
      });
      collectedIssues += 1;
    }
  }
}

function isForbiddenControlCharacter(
  character: string,
  kind: InputNormalizationKind
) {
  if (kind === 'plainText' && /[\t\n\r]/u.test(character)) return true;
  if (kind === 'exactValue' && /[\t\n\r]/u.test(character)) return true;

  return forbiddenDisplayControlPattern.test(character);
}
