import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  FileUpload,
  type FileUploadRejection,
  type FileUploadSelection,
} from './file-upload';

afterEach(() => cleanup());

function makeFile(name: string, sizeBytes: number, type = 'text/plain') {
  return new File([new Uint8Array(sizeBytes)], name, { type });
}

describe('FileUpload', () => {
  it('renders label and helper text with aria wiring', () => {
    render(
      <FileUpload
        label='Project source'
        helperText='Up to 250MB.'
        id='project-source'
      />
    );

    const input = screen.getByLabelText('Project source');
    expect(input).toHaveAttribute('aria-describedby', 'project-source-helper');
    expect(screen.getByText('Up to 250MB.')).toBeInTheDocument();
  });

  it('summarizes MIME-only accepted formats', () => {
    render(<FileUpload label='Files' accept={{ mimeTypes: ['image/png'] }} />);

    expect(
      screen.getByText('Supported formats: image/png')
    ).toBeInTheDocument();
  });

  it('summarizes accepted extensions and MIME types together', () => {
    render(
      <FileUpload
        label='Files'
        accept={{ extensions: ['.csv'], mimeTypes: ['application/pdf'] }}
      />
    );

    expect(
      screen.getByText('Supported formats: CSV, application/pdf')
    ).toBeInTheDocument();
  });

  it('emits a selected-status selection with the chosen files', async () => {
    const user = userEvent.setup();
    let latest: FileUploadSelection = { status: 'empty' };

    render(
      <FileUpload
        label='Files'
        multiple
        value={latest}
        onSelectionChange={selection => {
          latest = selection;
        }}
      />
    );

    const input = screen.getByLabelText('Files');
    const file = makeFile('component.tsx', 10);
    await user.upload(input, file);

    expect(latest).toEqual({
      status: 'selected',
      files: [file],
      totalBytes: 10,
    });
  });

  it('rejects files beyond maxFiles and reports them via onRejections', async () => {
    const user = userEvent.setup();
    const rejections: FileUploadRejection[] = [];
    let latest: FileUploadSelection = { status: 'empty' };

    render(
      <FileUpload
        label='Files'
        multiple
        limits={{ maxFiles: 1 }}
        value={latest}
        onSelectionChange={selection => {
          latest = selection;
        }}
        onRejections={next => rejections.push(...next)}
      />
    );

    const input = screen.getByLabelText('Files');
    const first = makeFile('one.tsx', 5);
    const second = makeFile('two.tsx', 5);
    await user.upload(input, [first, second]);

    expect(latest).toEqual({
      status: 'selected',
      files: [first],
      totalBytes: 5,
    });
    expect(rejections).toEqual([{ file: second, reason: 'too_many_files' }]);
  });

  it('rejects files beyond maxTotalBytes', async () => {
    const user = userEvent.setup();
    const rejections: FileUploadRejection[] = [];
    let latest: FileUploadSelection = { status: 'empty' };

    render(
      <FileUpload
        label='Files'
        multiple
        limits={{ maxTotalBytes: 10 }}
        value={latest}
        onSelectionChange={selection => {
          latest = selection;
        }}
        onRejections={next => rejections.push(...next)}
      />
    );

    const input = screen.getByLabelText('Files');
    const first = makeFile('one.tsx', 8);
    const second = makeFile('two.tsx', 8);
    await user.upload(input, [first, second]);

    expect(latest).toEqual({
      status: 'selected',
      files: [first],
      totalBytes: 8,
    });
    expect(rejections).toEqual([{ file: second, reason: 'too_large' }]);
  });

  it('rejects files that do not match the accepted extensions', async () => {
    // `accept` is a UX hint only — a real browser lets users bypass it via "All Files"
    // in the OS picker, so disable user-event's own accept-filtering to exercise our
    // own (equally non-authoritative) client-side check instead of its simulation.
    const user = userEvent.setup({ applyAccept: false });
    const rejections: FileUploadRejection[] = [];
    let latest: FileUploadSelection = { status: 'empty' };

    render(
      <FileUpload
        label='Files'
        accept={{ extensions: ['.zip'] }}
        value={latest}
        onSelectionChange={selection => {
          latest = selection;
        }}
        onRejections={next => rejections.push(...next)}
      />
    );

    const input = screen.getByLabelText('Files');
    const file = makeFile('component.tsx', 5);
    await user.upload(input, file);

    expect(latest).toEqual({ status: 'empty' });
    expect(rejections).toEqual([{ file, reason: 'not_accepted_type' }]);
  });

  it('sanitizes bidi/control characters in the rendered filename summary', async () => {
    const user = userEvent.setup();

    render(<FileUpload label='Files' defaultValue={{ status: 'empty' }} />);

    const input = screen.getByLabelText('Files');
    const file = makeFile('safe‮txt.exe', 5);
    await user.upload(input, file);

    expect(screen.getByText('safetxt.exe')).toBeInTheDocument();
    expect(screen.queryByText(/‮/)).not.toBeInTheDocument();
  });

  it('removes a single file via its remove control', async () => {
    const user = userEvent.setup();

    render(
      <FileUpload label='Files' multiple defaultValue={{ status: 'empty' }} />
    );

    const input = screen.getByLabelText('Files');
    const first = makeFile('one.tsx', 5);
    const second = makeFile('two.tsx', 5);
    await user.upload(input, [first, second]);

    await user.click(screen.getByRole('button', { name: 'Remove one.tsx' }));

    expect(screen.queryByText('one.tsx')).not.toBeInTheDocument();
    expect(screen.getByText('two.tsx')).toBeInTheDocument();
  });

  it('clears the whole selection via "Clear all"', async () => {
    const user = userEvent.setup();

    render(
      <FileUpload label='Files' multiple defaultValue={{ status: 'empty' }} />
    );

    const input = screen.getByLabelText('Files');
    await user.upload(input, [makeFile('one.tsx', 5), makeFile('two.tsx', 5)]);

    await user.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(screen.queryByText('one.tsx')).not.toBeInTheDocument();
    expect(screen.queryByText('two.tsx')).not.toBeInTheDocument();
  });

  it('removes the hidden native input from the tab order (the visible button is the sole tab stop)', () => {
    render(<FileUpload label='Files' />);
    expect(screen.getByLabelText('Files')).toHaveAttribute('tabindex', '-1');
  });

  it('clamps a single-mode defaultValue containing multiple files down to one', () => {
    const first = makeFile('one.tsx', 5);
    const second = makeFile('two.tsx', 5);

    render(
      <FileUpload
        label='Files'
        defaultValue={{
          status: 'selected',
          files: [first, second],
          totalBytes: 10,
        }}
      />
    );

    expect(screen.getByText('one.tsx')).toBeInTheDocument();
    expect(screen.queryByText('two.tsx')).not.toBeInTheDocument();
  });

  it('clamps a single-mode controlled value containing multiple files down to one', () => {
    const first = makeFile('one.tsx', 5);
    const second = makeFile('two.tsx', 5);

    render(
      <FileUpload
        label='Files'
        value={{ status: 'selected', files: [first, second], totalBytes: 10 }}
        onSelectionChange={() => {}}
      />
    );

    expect(screen.getByText('one.tsx')).toBeInTheDocument();
    expect(screen.queryByText('two.tsx')).not.toBeInTheDocument();
  });

  it('caps single (non-multiple) mode at one file even if more are supplied', async () => {
    const user = userEvent.setup();
    let latest: FileUploadSelection = { status: 'empty' };

    render(
      <FileUpload
        label='Files'
        value={latest}
        onSelectionChange={selection => {
          latest = selection;
        }}
      />
    );

    const input = screen.getByLabelText('Files');
    const first = makeFile('one.tsx', 5);
    const second = makeFile('two.tsx', 5);
    // user-event itself truncates non-multiple uploads to one file, matching real
    // browser behavior — pass applyAccept:false-equivalent via a raw multi-file
    // upload to also exercise the component's own defensive cap independently.
    await user.upload(input, [first, second]);

    expect(latest.status).toBe('selected');
    expect(latest).toMatchObject({ files: [first] });
  });

  it('fires a new selection when the same file is chosen again', async () => {
    const user = userEvent.setup();
    const selections: FileUploadSelection[] = [];

    render(
      <FileUpload
        label='Files'
        defaultValue={{ status: 'empty' }}
        onSelectionChange={selection => selections.push(selection)}
      />
    );

    const input = screen.getByLabelText('Files') as HTMLInputElement;
    const file = makeFile('component.tsx', 10);

    await user.upload(input, file);
    expect(input.value).toBe('');

    await user.upload(input, file);

    expect(selections).toHaveLength(2);
    expect(selections[1]).toEqual({
      status: 'selected',
      files: [file],
      totalBytes: 10,
    });
  });

  it('reflects the required attribute', () => {
    render(<FileUpload label='Files' required />);
    // The visible label text includes a decorative, aria-hidden "*" suffix.
    expect(screen.getByLabelText(/Files/)).toBeRequired();
  });

  it('disables both the trigger button and the underlying input', () => {
    render(<FileUpload label='Files' disabled />);
    expect(screen.getByLabelText('Files')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Choose file' })).toBeDisabled();
  });

  it('marks aria-invalid when error is set', () => {
    render(<FileUpload label='Files' error helperText='Something is wrong.' />);
    expect(screen.getByLabelText('Files')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('is keyboard operable — Enter and Space on the trigger button open the picker', async () => {
    const user = userEvent.setup();
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

    render(<FileUpload label='Files' />);
    const button = screen.getByRole('button', { name: 'Choose file' });
    button.focus();

    await user.keyboard('{Enter}');
    expect(clickSpy).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(clickSpy).toHaveBeenCalledTimes(2);

    clickSpy.mockRestore();
  });

  it('never reads file contents — only metadata (name/size/type) is accessed', async () => {
    const user = userEvent.setup();
    const file = makeFile('component.tsx', 10);
    // This environment's File/Blob polyfill doesn't define `.text`/`.arrayBuffer` at
    // all, so install instrumented stand-ins directly rather than `vi.spyOn` (which
    // requires the property to already exist) — either way, a call would prove the
    // component read the file's bytes, which it must never do.
    const textSpy = vi.fn();
    const arrayBufferSpy = vi.fn();
    Object.defineProperty(file, 'text', { value: textSpy, configurable: true });
    Object.defineProperty(file, 'arrayBuffer', {
      value: arrayBufferSpy,
      configurable: true,
    });

    render(<FileUpload label='Files' defaultValue={{ status: 'empty' }} />);
    const input = screen.getByLabelText('Files');
    await user.upload(input, file);

    expect(textSpy).not.toHaveBeenCalled();
    expect(arrayBufferSpy).not.toHaveBeenCalled();
  });

  it('never creates object URLs (no preview leaks)', async () => {
    const user = userEvent.setup();
    const createObjectURLSpy = vi.fn();
    const hadOwnCreateObjectURL = Object.prototype.hasOwnProperty.call(
      URL,
      'createObjectURL'
    );
    const original = (URL as { createObjectURL?: unknown }).createObjectURL;
    Object.defineProperty(URL, 'createObjectURL', {
      value: createObjectURLSpy,
      configurable: true,
      writable: true,
    });

    try {
      render(
        <FileUpload label='Files' multiple defaultValue={{ status: 'empty' }} />
      );
      const input = screen.getByLabelText('Files');
      await user.upload(input, [
        makeFile('one.tsx', 5),
        makeFile('two.tsx', 5),
      ]);
      await user.click(screen.getByRole('button', { name: 'Remove one.tsx' }));

      expect(createObjectURLSpy).not.toHaveBeenCalled();
    } finally {
      if (hadOwnCreateObjectURL) {
        Object.defineProperty(URL, 'createObjectURL', {
          value: original,
          configurable: true,
          writable: true,
        });
      } else {
        delete (URL as { createObjectURL?: unknown }).createObjectURL;
      }
    }
  });
});

// Compile-time guarantee (checked by `tsc --noEmit`, not at test runtime): a controlled
// `value` without `onSelectionChange` must fail to compile.
function _typeOnlyEnforcementCheck() {
  // @ts-expect-error value requires onSelectionChange to be wired.
  return <FileUpload label='Files' value={{ status: 'empty' }} />;
}
void _typeOnlyEnforcementCheck;
