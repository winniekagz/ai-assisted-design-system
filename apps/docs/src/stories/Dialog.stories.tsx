import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  AlertTriangle,
  Check,
  FileText,
  Save,
  Settings,
  Trash2,
} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Modal,
} from 'componentiq';

const meta = {
  title: 'Components/Dialog',
  component: DialogContent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Reusable centered dialog/modal primitive for confirmations, short forms, and focused decisions. It is built on Radix Dialog and uses a fixed header + fixed footer with only \`DialogBody\` scrolling by default.

### When to use
- Confirming destructive or high-impact actions.
- Editing a small amount of information without leaving the current page.
- Showing important focused content where the user must respond before continuing.

### Usage
\`\`\`tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Button,
} from 'componentiq';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open dialog</Button>
  </DialogTrigger>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Delete project?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogBody>
      <p>All related settings and saved views will be removed.</p>
    </DialogBody>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outlined">Cancel</Button>
      </DialogClose>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
\`\`\`

### Convenience wrapper
\`\`\`tsx
<Modal
  trigger={<Button>Edit settings</Button>}
  header={<DialogTitle>Workspace settings</DialogTitle>}
  footer={<Button>Save changes</Button>}
>
  <SettingsForm />
</Modal>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`size\` | \`"sm" \\| "md" \\| "lg" \\| "xl" \\| "full"\` | "md" | Maximum modal width |
| \`showClose\` | boolean | true | Renders the top-right close button |
| \`children\` | ReactNode | — | Any React node; put scrollable content inside \`DialogBody\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Maximum modal width.',
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl' | 'full'" },
        defaultValue: { summary: "'md'" },
      },
    },
    showClose: {
      control: 'boolean',
      description: 'Show the built-in close button.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

function SettingsForm() {
  return (
    <div className='grid gap-4'>
      <label className='grid gap-2 text-sm font-medium text-[color:var(--text-title)]'>
        Workspace name
        <input
          className='h-10 rounded-[var(--radius-md)] border border-[color:var(--border-default)] px-3 text-sm font-normal outline-none focus:border-[color:var(--color-primary)]'
          defaultValue='ComponentIQ Product Team'
        />
      </label>
      <label className='grid gap-2 text-sm font-medium text-[color:var(--text-title)]'>
        Description
        <textarea
          className='min-h-[120px] rounded-[var(--radius-md)] border border-[color:var(--border-default)] p-3 text-sm font-normal outline-none focus:border-[color:var(--color-primary)]'
          defaultValue='Shared workspace for design-system governance, Storybook review, and AI-assisted component guidance.'
        />
      </label>
      <div className='grid gap-3 rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] p-4'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-medium text-[color:var(--text-title)]'>
              Require review before publish
            </p>
            <p className='text-sm text-[color:var(--text-secondary)]'>
              Protect release changes from accidental publishing.
            </p>
          </div>
          <input type='checkbox' defaultChecked className='size-4' />
        </div>
      </div>
    </div>
  );
}

function LongContent() {
  return (
    <div className='grid gap-3'>
      {Array.from({ length: 18 }, (_, index) => (
        <div
          key={index}
          className='rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-4 text-sm text-[color:var(--text-secondary)]'
        >
          Review item {index + 1}: component documentation and token usage
          should be checked before this workflow is approved.
        </div>
      ))}
    </div>
  );
}

export const BasicDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button startIcon={<FileText />}>Open dialog</Button>
      </DialogTrigger>
      <DialogContent size='md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-[color:var(--text-title)]'>
            Review component guidance
          </DialogTitle>
          <DialogDescription className='text-sm text-[color:var(--text-secondary)]'>
            Check the recommendation before sharing it with your team.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className='text-sm leading-6 text-[color:var(--text-paragraph)]'>
            ComponentIQ recommends using the existing Button, Alert, and Sheet
            primitives for this workflow. The recommendation references current
            design tokens and avoids custom one-off controls.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outlined'>Close</Button>
          </DialogClose>
          <Button startIcon={<Check />}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmationModal: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive' startIcon={<Trash2 />}>
          Delete project
        </Button>
      </DialogTrigger>
      <DialogContent size='sm'>
        <DialogHeader>
          <div className='mb-3 grid size-11 place-items-center rounded-full bg-[color:var(--helper-error-pastel)] text-[color:var(--helper-error)]'>
            <AlertTriangle className='size-5' aria-hidden='true' />
          </div>
          <DialogTitle className='text-xl font-semibold text-[color:var(--text-title)]'>
            Delete this project?
          </DialogTitle>
          <DialogDescription className='text-sm text-[color:var(--text-secondary)]'>
            This action cannot be undone. All saved views and recommendations
            will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outlined'>Cancel</Button>
          </DialogClose>
          <Button variant='destructive'>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FormModal: Story = {
  render: () => (
    <Modal
      size='lg'
      trigger={<Button startIcon={<Settings />}>Edit settings</Button>}
      header={
        <div>
          <DialogTitle className='text-xl font-semibold text-[color:var(--text-title)]'>
            Workspace settings
          </DialogTitle>
          <DialogDescription className='mt-2 text-sm text-[color:var(--text-secondary)]'>
            Update the shared workspace profile and publishing safeguards.
          </DialogDescription>
        </div>
      }
      footer={
        <>
          <DialogClose asChild>
            <Button variant='outlined'>Cancel</Button>
          </DialogClose>
          <Button startIcon={<Save />}>Save changes</Button>
        </>
      }
    >
      <SettingsForm />
    </Modal>
  ),
};

export const ScrollableBody: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outlined'>Open long modal</Button>
      </DialogTrigger>
      <DialogContent size='lg'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-[color:var(--text-title)]'>
            Review checklist
          </DialogTitle>
          <DialogDescription className='text-sm text-[color:var(--text-secondary)]'>
            Header and footer stay fixed while only the body scrolls.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <LongContent />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outlined'>Dismiss</Button>
          </DialogClose>
          <Button>Approve checklist</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
