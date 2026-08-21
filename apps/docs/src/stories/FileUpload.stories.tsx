import * as React from 'react';
import { FileUpload } from '@/components/ui/form-fields/file-upload';
import type { FileUploadRejection } from '@/components/ui/form-fields/file-upload';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

function makeSyntheticFile(name: string, sizeBytes: number, type = 'text/plain') {
  return new File([new Uint8Array(sizeBytes)], name, { type });
}

const meta = {
  title: 'Components/FormFields/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Native-file-picker-based upload input. Follows the same label/helperText/error/aria
conventions as **Input** and **Textarea**.

### What this component does NOT provide
This is a client-side metadata/UX primitive only. It does **not** provide, and must
never be assumed to provide:
- malware or virus scanning
- trusted MIME-type verification (\`accept\` is a UX hint — real browsers let users
  bypass it via "All Files" in the OS picker, and a scripted request can ignore it
  entirely)
- file-content sanitization
- archive-extraction safety (zip/tar contents are not inspected)
- SVG sanitization
- secret detection

\`limits\` (max file count / total size) are enforced here purely for fast UI feedback.
The authoritative security boundary is server-side — see this repo's
\`FilesInterceptor\` limits in the projects API, which are enforced independently of
whatever this component allows through.

Drag-and-drop is intentionally not implemented in this phase (no existing dropzone
pattern in this repo, and it adds meaningfully more surface area than the native
picker for no stated requirement). Zip upload is also out of scope here — archive
handling needs its own safety work first.

### Usage
\`\`\`tsx
import { FileUpload } from 'componentiq';

<FileUpload
  label="Project source"
  helperText="Up to 250MB, 5,000 files."
  multiple
  limits={{ maxFiles: 5000, maxTotalBytes: 250 * 1024 * 1024 }}
  onSelectionChange={selection => console.log(selection)}
  onRejections={rejections => console.log(rejections)}
/>
\`\`\`
      `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'boolean' },
    success: { control: 'boolean' },
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

const fieldDecorator = [
  (Story: React.ComponentType) => (
    <div className='w-[min(480px,calc(100vw-32px))]'>
      <Story />
    </div>
  ),
];

export const Default: Story = {
  decorators: fieldDecorator,
  args: { label: 'Project source', helperText: 'Choose a file to upload.' },
};

export const WithSelection: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Project source',
    multiple: true,
    defaultValue: {
      status: 'selected',
      files: [
        makeSyntheticFile('component.tsx', 4200),
        makeSyntheticFile('tokens.css', 1800),
      ],
      totalBytes: 6000,
    },
  },
};

export const Disabled: Story = {
  decorators: fieldDecorator,
  args: { label: 'Project source', disabled: true, helperText: 'Unavailable right now.' },
};

function RejectionDemo({
  limits,
  files,
}: {
  limits: { maxFiles?: number; maxTotalBytes?: number };
  files: File[];
}) {
  const [rejections, setRejections] = React.useState<FileUploadRejection[]>([]);

  return (
    <div className='flex flex-col gap-[var(--spacing-sm)]'>
      <FileUpload
        label='Project source'
        multiple
        limits={limits}
        error={rejections.length > 0}
        helperText={
          rejections.length > 0
            ? `${rejections.length} file(s) rejected — see below.`
            : 'Client-side limits only; the server enforces the real boundary.'
        }
        onRejections={setRejections}
      />
      <p className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)]'>
        Try selecting: {files.map(f => f.name).join(', ')}
      </p>
      {rejections.length > 0 && (
        <ul className='text-[length:var(--font-size-xs)] text-[color:var(--helper-error)]'>
          {rejections.map((r, i) => (
            <li key={i}>
              {r.file.name} — {r.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const RejectedTooMany: Story = {
  decorators: fieldDecorator,
  render: () => (
    <RejectionDemo
      limits={{ maxFiles: 1 }}
      files={[makeSyntheticFile('one.tsx', 100), makeSyntheticFile('two.tsx', 100)]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Selecting more files than `limits.maxFiles` rejects the excess via `onRejections`.',
      },
    },
  },
};

export const RejectedTooLarge: Story = {
  decorators: fieldDecorator,
  render: () => (
    <RejectionDemo
      limits={{ maxTotalBytes: 100 }}
      files={[makeSyntheticFile('small.tsx', 60), makeSyntheticFile('big.tsx', 60)]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Selecting files whose combined size exceeds `limits.maxTotalBytes` rejects the overflow via `onRejections`.',
      },
    },
  },
};

export const MaliciousFilenameDisplay: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Project source',
    helperText: 'Filenames are sanitized before display — this does not affect the underlying file.',
    defaultValue: {
      status: 'selected',
      files: [makeSyntheticFile('safe‮txt.exe', 2048)],
      totalBytes: 2048,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This file is named with a bidi-override character (U+202E) so it *looks* like `safe...exe.txt` if rendered raw. The component strips display-unsafe control/bidi characters (via the same `sanitizeDisplayText` primitive used by `Input`/`Textarea`) before rendering the filename summary.',
      },
    },
  },
};
