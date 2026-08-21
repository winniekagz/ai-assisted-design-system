import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import type { InputValidationResult } from '@/lib/input-security';

import { Input } from './input';

afterEach(() => cleanup());

describe('Input', () => {
  it('keeps the current label, helper text and aria behavior by default', () => {
    const html = renderToStaticMarkup(
      <Input
        id='project-name'
        label='Project name'
        helperText='Required.'
        required
        error
        defaultValue='Checkout'
      />
    );

    expect(html).toContain('for="project-name"');
    expect(html).toContain('Project name');
    expect(html).toContain('Required.');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="project-name-helper"');
    expect(html).toContain('value="Checkout"');
  });

  it('does not validate mid-IME-composition, and does validate once composition ends', () => {
    const results: InputValidationResult[] = [];
    render(
      <Input
        label='Name'
        inputSecurityPolicy={{ kind: 'plainText', trim: true }}
        onInputValidationResult={result => results.push(result)}
        onNormalizedValueChange={() => {}}
      />
    );

    const input = screen.getByLabelText('Name');

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: ' compos' } });
    expect(results).toHaveLength(0);

    fireEvent.compositionEnd(input);
    fireEvent.change(input, { target: { value: ' composing ' } });
    expect(results).toHaveLength(1);
  });

  it('corrects the DOM value on blur when normalization changes it', () => {
    const normalizedValues: string[] = [];
    render(
      <Input
        label='Name'
        defaultValue=' hello '
        inputSecurityPolicy={{ kind: 'plainText', trim: true }}
        onNormalizedValueChange={value => normalizedValues.push(value)}
      />
    );

    const input = screen.getByLabelText('Name') as HTMLInputElement;
    fireEvent.blur(input);

    expect(input.value).toBe('hello');
    expect(normalizedValues).toEqual(['hello']);
  });

  it('leaves the forbidden character in the DOM value under default reject handling', () => {
    const results: InputValidationResult[] = [];
    render(
      <Input
        label='Name'
        inputSecurityPolicy={{ kind: 'plainText' }}
        onInputValidationResult={result => results.push(result)}
        onNormalizedValueChange={() => {}}
      />
    );

    const input = screen.getByLabelText('Name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'safe‮txt' } });
    fireEvent.blur(input);

    expect(input.value).toBe('safe‮txt');
    expect(results.at(-1)?.ok).toBe(false);
  });
});

// Compile-time guarantee (checked by `tsc --noEmit`, not at test runtime): passing
// `inputSecurityPolicy` without `onNormalizedValueChange` must fail to compile.
function _typeOnlyEnforcementCheck() {
  // @ts-expect-error inputSecurityPolicy requires onNormalizedValueChange to be wired.
  return <Input inputSecurityPolicy={{ kind: 'plainText' }} />;
}
void _typeOnlyEnforcementCheck;
