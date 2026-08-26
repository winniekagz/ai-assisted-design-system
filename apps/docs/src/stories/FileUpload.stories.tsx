import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  FileDisplayCard,
  FileTypeIcon,
  FileUpload,
  FileUploadProgress,
  type FileUploadDisplayFile,
  type FileUploadRejection,
  type FileUploadStatus,
} from '@/components/ui/form-fields/file-upload';

function makeSyntheticFile(
  name: string,
  sizeBytes: number,
  type = 'text/plain'
) {
  return new File([new Uint8Array(sizeBytes)], name, { type });
}

const sampleFiles: FileUploadDisplayFile[] = [
  {
    name: 'customers_Q5_2023.xlsx',
    size: 3 * 1024 * 1024,
    status: 'loading',
    progress: 40,
  },
  { name: 'release-notes.txt', size: 14 * 1024, status: 'success' },
  { name: 'contract.pdf', size: 2.4 * 1024 * 1024, status: 'idle' },
  { name: 'brand-preview.png', size: 860 * 1024, status: 'success' },
  {
    name: 'subscribers.csv',
    size: 750 * 1024,
    status: 'loading',
    progress: 72,
  },
  { name: 'proposal.docx', size: 1.8 * 1024 * 1024, status: 'idle' },
  {
    name: 'roadmap.ppt',
    size: 6.2 * 1024 * 1024,
    status: 'error',
    message: 'Upload failed. Try again.',
  },
];

function VariantShowcase({
  title,
  variants,
}: {
  title: string;
  variants: Array<{ label: string; code: string; node: React.ReactNode }>;
}) {
  const [sel, setSel] = React.useState(0);

  return (
    <div className='w-full space-y-[var(--spacing-md)]'>
      <h2 className='text-[length:var(--font-size-heading-6)] font-[var(--font-weight-bold)] text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
        {title}
      </h2>
      <div className='grid grid-cols-1 gap-[var(--spacing-sm)] lg:grid-cols-2'>
        {variants.map((v, i) => (
          <div
            key={v.label}
            role='button'
            tabIndex={0}
            aria-pressed={sel === i}
            onClick={() => setSel(i)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSel(i);
              }
            }}
            className={`flex flex-col items-start gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border p-[var(--spacing-md)] text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] ${
              sel === i
                ? 'border-[color:var(--color-primary)] bg-[color:var(--bg-hover)]'
                : 'border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] hover:bg-[color:var(--bg-hover)]'
            }`}
          >
            <span className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] [font-family:var(--font-rubik)]'>
              {v.label}
            </span>
            <div className='w-full' onClick={event => event.stopPropagation()}>
              {v.node}
            </div>
          </div>
        ))}
      </div>
      <div className='rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--bg-secondary)] p-[var(--spacing-md)]'>
        <p className='mb-[var(--spacing-sm)] text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] [font-family:var(--font-rubik)]'>
          {variants[sel].label}
        </p>
        <pre className='overflow-x-auto whitespace-pre-wrap font-mono text-[length:var(--font-size-xs)] text-[color:var(--text-paragraph)]'>
          <code>{variants[sel].code}</code>
        </pre>
      </div>
    </div>
  );
}

function LoadingUploadDemo() {
  const [progress, setProgress] = React.useState(40);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress(current => (current >= 92 ? 26 : current + 13));
    }, 1400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <FileUpload
      label='Upload file'
      accept={{ extensions: ['.xls', '.xlsx'] }}
      limits={{ maxTotalBytes: 25 * 1024 * 1024 }}
      displayFiles={[
        {
          name: 'Table Name.xls',
          size: 3 * 1024 * 1024,
          status: 'loading',
          progress,
        },
      ]}
      uploadStatus='loading'
      showFooter
    />
  );
}

function RemovableDisplayFilesDemo() {
  const [files, setFiles] = React.useState<FileUploadDisplayFile[]>(
    sampleFiles.slice(0, 4)
  );

  return (
    <FileUpload
      label='Upload file'
      multiple
      displayFiles={files}
      onDisplayFileRemove={(_, index) =>
        setFiles(current =>
          current.filter((__, fileIndex) => fileIndex !== index)
        )
      }
      showFooter
    />
  );
}

const meta = {
  title: 'Components/FormFields/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'padded',
    docs: {
      story: {
        inline: false,
        iframeHeight: 520,
      },
      source: {
        type: 'dynamic',
        language: 'tsx',
      },
      canvas: {
        sourceState: 'shown',
      },
      description: {
        component: `
Reusable upload organism with atomic file primitives. The full \`FileUpload\` composes a hidden native file input, accessible drag-and-drop dropzone, metadata-only selection handling, reusable file display cards, loading progress, success/error states, and removable files.

### Atomic design
- **Atoms:** \`FileTypeIcon\`, \`FileUploadProgress\`
- **Molecule:** \`FileDisplayCard\`
- **Organism:** \`FileUpload\`

### Usage
\`\`\`tsx
import { FileUpload } from 'componentiq';

<FileUpload
  label="Upload file"
  accept={{ extensions: ['.xls', '.xlsx', '.csv'] }}
  limits={{ maxTotalBytes: 25 * 1024 * 1024 }}
  multiple
  uploadStatus="loading"
  progress={40}
  showFooter
  onSelectionChange={selection => console.log(selection)}
/>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`label\` | string | "Upload file" | Heading and input label |
| \`helperText\` | string | — | Helper or validation text |
| \`error\` / \`success\` | boolean | false | Dropzone and helper state |
| \`accept\` | \`{ mimeTypes?, extensions? }\` | — | Browser picker hint plus client-side rejection |
| \`limits\` | \`{ maxFiles?, maxTotalBytes? }\` | — | Client-side UX limit |
| \`uploadStatus\` | \`"idle" \\| "loading" \\| "success" \\| "error"\` | "idle" | Fallback status for file cards |
| \`progress\` | number | — | Fallback upload progress |
| \`fileStatuses\` / \`fileProgress\` | Record<string, ...> | — | Per-file display state keyed by sanitized file name |
| \`displayFiles\` | FileUploadDisplayFile[] | — | Show controlled display cards without selecting real files |
| \`onDisplayFileRemove\` | function | — | Remove callback for controlled \`displayFiles\` cards |
| \`showFooter\` | boolean | false | Shows Help Center, Cancel, and Next controls |

### Accessibility
- The native \`<input type="file">\` remains labelled and available to assistive technology.
- A visible keyboard-operable dropzone opens the picker with Enter or Space.
- The hidden input is removed from sequential tab order so users do not land on an invisible control.
- Remove buttons are labelled with the sanitized file name.
- Loading progress uses \`role="progressbar"\` with numeric ARIA values when progress is known.

### Security boundary
This component only reads client-side file metadata: name, size, and MIME hint. It does not scan contents, sanitize uploads, or enforce a trusted MIME boundary. Server-side validation remains required.
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
    uploadStatus: {
      control: { type: 'select' },
      options: ['idle', 'loading', 'success', 'error'],
    },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    displayFiles: { table: { disable: true } },
    fileStatuses: { table: { disable: true } },
    fileProgress: { table: { disable: true } },
  },
  args: {
    label: 'Upload file',
    accept: { extensions: ['.xls', '.xlsx'] },
    limits: { maxTotalBytes: 25 * 1024 * 1024 },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <VariantShowcase
      title='File Upload'
      variants={[
        {
          label: 'Empty organism',
          code: `<FileUpload
  label="Upload file"
  accept={{ extensions: ['.xls', '.xlsx'] }}
  limits={{ maxTotalBytes: 25 * 1024 * 1024 }}
  showFooter
/>`,
          node: (
            <FileUpload
              label='Upload file'
              accept={{ extensions: ['.xls', '.xlsx'] }}
              limits={{ maxTotalBytes: 25 * 1024 * 1024 }}
              showFooter
            />
          ),
        },
        {
          label: 'Loading upload',
          code: `<FileUpload
  label="Upload file"
  displayFiles={[{ name: 'Table Name.xls', size: 3145728, status: 'loading', progress: 40 }]}
  uploadStatus="loading"
  showFooter
/>`,
          node: <LoadingUploadDemo />,
        },
        {
          label: 'Success state',
          code: `<FileUpload
  label="Upload file"
  success
  helperText="File uploaded successfully."
  displayFiles={[{ name: 'customers_Q5_2023.xlsx', size: 3145728, status: 'success' }]}
/>`,
          node: (
            <FileUpload
              label='Upload file'
              success
              helperText='File uploaded successfully.'
              displayFiles={[
                {
                  name: 'customers_Q5_2023.xlsx',
                  size: 3 * 1024 * 1024,
                  status: 'success',
                },
              ]}
            />
          ),
        },
        {
          label: 'Error state',
          code: `<FileUpload
  label="Upload file"
  error
  helperText="Upload failed. Try again."
  displayFiles={[{ name: 'roadmap.ppt', size: 6501171, status: 'error', message: 'Network timeout.' }]}
/>`,
          node: (
            <FileUpload
              label='Upload file'
              error
              helperText='Upload failed. Try again.'
              displayFiles={[
                {
                  name: 'roadmap.ppt',
                  size: 6.2 * 1024 * 1024,
                  status: 'error',
                  message: 'Network timeout.',
                },
              ]}
            />
          ),
        },
        {
          label: 'File display card',
          code: `<FileDisplayCard
  file={{ name: 'contract.pdf', size: 2516582, status: 'loading', progress: 26 }}
  status="loading"
  progress={26}
  onRemove={() => removeFile()}
/>`,
          node: (
            <FileDisplayCard
              file={{
                name: 'contract.pdf',
                size: 2.4 * 1024 * 1024,
                status: 'loading',
                progress: 26,
              }}
              status='loading'
              progress={26}
              onRemove={() => undefined}
            />
          ),
        },
        {
          label: 'Supported file types',
          code: `['xlsx', 'txt', 'pdf', 'png', 'csv', 'docx', 'ppt'].map(type => (
  <FileTypeIcon key={type} fileName={\`example.\${type}\`} />
))`,
          node: (
            <div className='flex flex-wrap gap-[var(--spacing-sm)]'>
              {['xlsx', 'txt', 'pdf', 'png', 'csv', 'docx', 'ppt'].map(type => (
                <FileTypeIcon key={type} fileName={`example.${type}`} />
              ))}
            </div>
          ),
        },
        {
          label: 'Removable display files',
          code: `const [files, setFiles] = React.useState(displayFiles);

<FileUpload
  label="Upload file"
  displayFiles={files}
  onDisplayFileRemove={(_, index) =>
    setFiles(current => current.filter((__, fileIndex) => fileIndex !== index))
  }
/>`,
          node: <RemovableDisplayFilesDemo />,
        },
      ]}
    />
  ),
  decorators: [
    Story => (
      <div className='w-full max-w-5xl'>
        <Story />
      </div>
    ),
  ],
};

const fieldDecorator = [
  (Story: React.ComponentType) => (
    <div className='w-[min(480px,calc(100vw-32px))]'>
      <Story />
    </div>
  ),
];

export const Default: Story = {
  decorators: fieldDecorator,
  args: { helperText: 'Choose a file to upload.' },
};

export const Loading: Story = {
  decorators: fieldDecorator,
  render: () => <LoadingUploadDemo />,
};

export const Success: Story = {
  decorators: fieldDecorator,
  args: {
    success: true,
    helperText: 'File uploaded successfully.',
    displayFiles: [
      {
        name: 'customers_Q5_2023.xlsx',
        size: 3 * 1024 * 1024,
        status: 'success' satisfies FileUploadStatus,
      },
    ],
  },
};

export const Error: Story = {
  decorators: fieldDecorator,
  args: {
    error: true,
    helperText: 'Upload failed. Try again.',
    displayFiles: [
      {
        name: 'roadmap.ppt',
        size: 6.2 * 1024 * 1024,
        status: 'error' satisfies FileUploadStatus,
        message: 'Network timeout.',
      },
    ],
  },
};

export const FileDisplayCards: Story = {
  decorators: [
    Story => (
      <div className='w-full max-w-2xl'>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className='grid gap-[var(--spacing-sm)]'>
      {sampleFiles.map(file => (
        <FileDisplayCard
          key={file.name}
          file={file}
          status={file.status}
          progress={file.progress}
          onRemove={() => undefined}
        />
      ))}
    </div>
  ),
};

export const RemovableDisplayFiles: Story = {
  decorators: fieldDecorator,
  render: () => <RemovableDisplayFilesDemo />,
};

export const ProgressStates: Story = {
  decorators: fieldDecorator,
  render: () => (
    <div className='grid gap-[var(--spacing-md)]'>
      <FileUploadProgress status='loading' progress={26} />
      <FileUploadProgress status='loading' progress={78} />
      <FileUploadProgress status='success' />
      <FileUploadProgress status='error' />
    </div>
  ),
};

export const WithSelection: Story = {
  decorators: fieldDecorator,
  args: {
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
  args: {
    disabled: true,
    helperText: 'Unavailable right now.',
    displayFiles: [
      {
        name: 'customers_Q5_2023.xlsx',
        size: 3 * 1024 * 1024,
        status: 'idle',
      },
    ],
  },
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
            ? `${rejections.length} file(s) rejected. See below.`
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
              {r.file.name}: {r.reason}
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
      files={[
        makeSyntheticFile('one.tsx', 100),
        makeSyntheticFile('two.tsx', 100),
      ]}
    />
  ),
};

export const RejectedTooLarge: Story = {
  decorators: fieldDecorator,
  render: () => (
    <RejectionDemo
      limits={{ maxTotalBytes: 100 }}
      files={[
        makeSyntheticFile('small.tsx', 60),
        makeSyntheticFile('big.tsx', 60),
      ]}
    />
  ),
};

export const MaliciousFilenameDisplay: Story = {
  decorators: fieldDecorator,
  args: {
    helperText:
      'Filenames are sanitized before display. This does not affect the underlying file.',
    defaultValue: {
      status: 'selected',
      files: [makeSyntheticFile('safe‮txt.exe', 2048)],
      totalBytes: 2048,
    },
  },
};
