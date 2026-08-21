import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import type { InputValidationResult } from '@/lib/input-security';

import { Textarea } from './textarea';

afterEach(() => cleanup());

describe('Textarea', () => {
  it('renders with a label and is addressable by it', () => {
    const html = renderToStaticMarkup(
      <Textarea aria-label='Notes' defaultValue='Hello' />
    );

    expect(html).toContain('Hello');
  });

  it('does not validate mid-IME-composition, and does validate once composition ends', () => {
    const results: InputValidationResult[] = [];
    render(
      <Textarea
        aria-label='Notes'
        inputSecurityPolicy={{ kind: 'multilineText', trim: true }}
        onInputValidationResult={result => results.push(result)}
        onNormalizedValueChange={() => {}}
      />
    );

    const textarea = screen.getByLabelText('Notes');

    fireEvent.compositionStart(textarea);
    fireEvent.change(textarea, { target: { value: ' compos' } });
    expect(results).toHaveLength(0);

    fireEvent.compositionEnd(textarea);
    fireEvent.change(textarea, { target: { value: ' composing ' } });
    expect(results).toHaveLength(1);
  });

  it('corrects the DOM value on blur when normalization changes it', () => {
    const normalizedValues: string[] = [];
    render(
      <Textarea
        aria-label='Notes'
        defaultValue={' hello\r\nworld '}
        inputSecurityPolicy={{ kind: 'multilineText', trim: true }}
        onNormalizedValueChange={value => normalizedValues.push(value)}
      />
    );

    const textarea = screen.getByLabelText('Notes') as HTMLTextAreaElement;
    fireEvent.blur(textarea);

    expect(textarea.value).toBe('hello\nworld');
    expect(normalizedValues).toEqual(['hello\nworld']);
  });

  it('leaves the forbidden character in the DOM value under default reject handling', () => {
    const results: InputValidationResult[] = [];
    render(
      <Textarea
        aria-label='Notes'
        inputSecurityPolicy={{ kind: 'multilineText' }}
        onInputValidationResult={result => results.push(result)}
        onNormalizedValueChange={() => {}}
      />
    );

    const textarea = screen.getByLabelText('Notes') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'safe‮txt' } });
    fireEvent.blur(textarea);

    expect(textarea.value).toBe('safe‮txt');
    expect(results.at(-1)?.ok).toBe(false);
  });
});

// Compile-time guarantee (checked by `tsc --noEmit`, not at test runtime): passing
// `inputSecurityPolicy` without `onNormalizedValueChange` must fail to compile.
function _typeOnlyEnforcementCheck() {
  // @ts-expect-error inputSecurityPolicy requires onNormalizedValueChange to be wired.
  return <Textarea inputSecurityPolicy={{ kind: 'multilineText' }} />;
}
void _typeOnlyEnforcementCheck;
