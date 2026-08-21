import { describe, expect, it } from 'vitest';

import {
  createInputSecurityProcessor,
  sanitizeDisplayText,
  validateAndNormalizeInput,
  type InputValidationIssueCode,
  type InputValidationResult,
} from './input-security';

describe('input security primitives', () => {
  it('preserves ordinary text and punctuation', () => {
    const result = validateAndNormalizeInput('Hello, Component IQ!', {
      kind: 'plainText',
      maxLength: 100,
    });

    expect(result).toEqual({
      ok: true,
      value: 'Hello, Component IQ!',
      issues: [],
    });
  });

  it('preserves Unicode text', () => {
    const result = validateAndNormalizeInput('Héllo Nairobi — こんにちは', {
      kind: 'plainText',
      maxLength: 100,
    });

    expect(result.ok).toBe(true);
    expect(result.value).toBe('Héllo Nairobi — こんにちは');
  });

  it('normalizes multiline line endings without flattening content', () => {
    const result = validateAndNormalizeInput('first\r\nsecond\rthird', {
      kind: 'multilineText',
      maxLength: 100,
    });

    expect(result.ok).toBe(true);
    expect(result.value).toBe('first\nsecond\nthird');
  });

  it('reports forbidden control characters with stable issue codes', () => {
    const result = validateAndNormalizeInput('safe\u202Etxt', {
      kind: 'plainText',
      maxLength: 100,
    });

    expect(result.ok).toBe(false);
    expect(issueCodes(result)).toEqual(['input.forbidden_control_character']);
  });

  it('can strip forbidden control characters when the policy explicitly allows it', () => {
    const result = validateAndNormalizeInput('safe\u202Etxt', {
      kind: 'plainText',
      forbiddenControlCharacters: 'strip',
      maxLength: 100,
    });

    expect(result).toEqual({
      ok: true,
      value: 'safetxt',
      issues: [],
    });
  });

  it('allows empty strings unless the policy marks the field required', () => {
    expect(validateAndNormalizeInput('', { kind: 'plainText' }).ok).toBe(true);

    const result = validateAndNormalizeInput('', {
      kind: 'plainText',
      required: true,
    });

    expect(result.ok).toBe(false);
    expect(issueCodes(result)).toEqual(['input.required']);
  });

  it('reports maximum length failures without echoing sensitive values in issues', () => {
    const result = validateAndNormalizeInput('abcdef', {
      kind: 'plainText',
      maxLength: 5,
    });

    expect(result.ok).toBe(false);
    expect(result.issues[0]).toMatchObject({
      code: 'input.too_long',
      maxLength: 5,
    });
    expect(JSON.stringify(result.issues)).not.toContain('abcdef');
  });

  it('is idempotent', () => {
    const policy = multilinePolicy();
    const once = validateAndNormalizeInput(' hello\r\nworld ', policy);
    const twice = validateAndNormalizeInput(once.value, policy);

    expect(twice).toEqual(once);
  });

  it('leaves exact-value fields untouched', () => {
    const value = ' token://A B\tC\n\u202E ';
    const result = validateAndNormalizeInput(value, {
      kind: 'exactValue',
      maxLength: 100,
    });

    expect(result).toEqual({
      ok: true,
      value,
      issues: [],
    });
  });

  it('supports typed success and failure narrowing', () => {
    const success = validateAndNormalizeInput('ok', { kind: 'plainText' });
    const failure = validateAndNormalizeInput('too long', {
      kind: 'plainText',
      maxLength: 3,
    });

    expect(readTypedResult(success)).toBe('success:ok');
    expect(readTypedResult(failure)).toBe('failure:input.too_long');
  });

  it('does not validate or normalize during IME composition', () => {
    const results: InputValidationResult[] = [];
    const normalizedValues: string[] = [];
    const processor = createInputSecurityProcessor({
      policy: { kind: 'plainText', trim: true },
      onValidationResult: result => results.push(result),
      onNormalizedValue: value => normalizedValues.push(value),
    });

    processor.handleChange(' composing ', { isComposing: true });
    expect(results).toHaveLength(0);

    processor.handleChange(' composing ', { isComposing: false });
    expect(results).toHaveLength(1);

    const blur = processor.handleBlur(' composing ');
    expect(blur.changed).toBe(true);
    expect(normalizedValues).toEqual(['composing']);
  });

  it('leaves the forbidden character in value under default reject handling (reject flags, it does not strip)', () => {
    const result = validateAndNormalizeInput('safe‮txt', { kind: 'plainText' });

    expect(result.ok).toBe(false);
    expect(result.value).toBe('safe‮txt');
  });

  it('caps the number of forbidden-control-character issues collected on adversarial input', () => {
    const adversarial = 'a'.repeat(50) + '‮'.repeat(100_000);
    const result = validateAndNormalizeInput(adversarial, { kind: 'plainText' });

    expect(result.ok).toBe(false);
    const controlCharacterIssues = result.issues.filter(
      issue => issue.code === 'input.forbidden_control_character'
    );
    expect(controlCharacterIssues.length).toBeLessThanOrEqual(25);
    expect(result.value).toHaveLength(adversarial.length);
  });

  it('caps forbidden-control-character issues for exactValue policies too', () => {
    const adversarial = '‮'.repeat(10_000);
    const result = validateAndNormalizeInput(adversarial, {
      kind: 'exactValue',
      forbiddenControlCharacters: 'reject',
    });

    expect(result.ok).toBe(false);
    expect(result.issues.length).toBeLessThanOrEqual(25);
    expect(result.value).toBe(adversarial);
  });
});

describe('sanitizeDisplayText', () => {
  it('strips bidi-override and control characters', () => {
    expect(sanitizeDisplayText('safe‮txt.exe')).toBe('safetxt.exe');
  });

  it('preserves ordinary Unicode and emoji', () => {
    expect(sanitizeDisplayText('Héllo Nairobi — こんにちは 🎉')).toBe(
      'Héllo Nairobi — こんにちは 🎉'
    );
  });

  it('preserves legitimate tabs/newlines (display sanitization is not a plaintext normalizer)', () => {
    expect(sanitizeDisplayText('line1\nline2\ttabbed')).toBe('line1\nline2\ttabbed');
  });
});

function issueCodes(result: InputValidationResult): InputValidationIssueCode[] {
  if (result.ok) return [];

  return result.issues.map(issue => issue.code);
}

function readTypedResult(result: InputValidationResult) {
  if (result.ok) {
    const normalizedValue: string = result.value;

    return `success:${normalizedValue}`;
  }

  const firstIssueCode: InputValidationIssueCode = result.issues[0].code;

  return `failure:${firstIssueCode}`;
}

function multilinePolicy() {
  return {
    kind: 'multilineText',
    trim: true,
    maxLength: 100,
  } satisfies Parameters<typeof validateAndNormalizeInput>[1];
}
