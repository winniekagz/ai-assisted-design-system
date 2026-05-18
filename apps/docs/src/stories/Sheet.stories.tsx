import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Box,
  Check,
  ChevronRight,
  Download,
  Plug,
  Plus,
  Search,
  X,
} from 'lucide-react';
import {
  Button,
  Drawer,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'componentiq';

const meta = {
  title: 'Components/Sheet',
  component: SheetContent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Reusable drawer/sheet primitive for focused workflows. It is built on Radix Dialog, accepts any React node as body content, and uses a fixed header + fixed footer with only \`SheetBody\` scrolling by default.

### When to use
- Side-panel workflows where the page context should remain visible behind an overlay.
- Long forms, asset details, event details, or review workflows that need stable actions.
- Bottom sheets on narrow screens or mobile-like flows.

### Usage
\`\`\`tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetClose,
  Button,
} from 'componentiq';

<Sheet>
  <SheetTrigger asChild>
    <Button>Open sheet</Button>
  </SheetTrigger>
  <SheetContent side="right" size="lg">
    <SheetHeader>
      <SheetTitle>Event Details</SheetTitle>
      <SheetDescription>Shipment, warehouse and crew related details</SheetDescription>
    </SheetHeader>
    <SheetBody>
      <YourScrollableContent />
    </SheetBody>
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outlined">Cancel</Button>
      </SheetClose>
      <Button>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
\`\`\`

### Convenience wrapper
\`\`\`tsx
<Drawer
  trigger={<Button>Open drawer</Button>}
  header={<SheetTitle>Assets</SheetTitle>}
  footer={<Button>Export</Button>}
>
  <LongAssetTable />
</Drawer>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`side\` | \`"top" \\| "right" \\| "bottom" \\| "left"\` | "right" | Where the sheet enters from |
| \`size\` | \`"sm" \\| "md" \\| "lg" \\| "xl" \\| "full"\` | "md" | Width or height depending on side |
| \`showClose\` | boolean | true | Renders the top-right close button |
| \`children\` | ReactNode | — | Any React node; put scrollable content inside \`SheetBody\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Edge the sheet enters from.',
      table: {
        type: { summary: "'top' | 'right' | 'bottom' | 'left'" },
        defaultValue: { summary: "'right'" },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Width for left/right sheets; height for top/bottom sheets.',
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
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const sideOptions = [
  {
    side: 'top',
    label: 'Top sheet',
    description: 'Slides down from the top and uses height-based sizing.',
  },
  {
    side: 'bottom',
    label: 'Bottom sheet',
    description: 'Slides up from the bottom and works well for mobile flows.',
  },
  {
    side: 'right',
    label: 'Right sheet',
    description: 'Default drawer direction for detail and edit workflows.',
  },
  {
    side: 'left',
    label: 'Left sheet',
    description: 'Useful for navigation, filters, or secondary context.',
  },
] as const;

const assets = Array.from({ length: 26 }, (_, index) => ({
  name: [
    'Alex-ProBook-450',
    'Jordan-Dell-XPS-13',
    'Sam-Linux-Ubuntu-22.04',
    'Taylor-MacBook-Pro-16',
    'Chris-Lenovo-ThinkPad-T14',
    'Jamie-MacMini-2020',
  ][index % 6],
  status: index < 12 ? 'Failing' : index < 20 ? 'Compliant' : 'Inactive',
}));

function AssetTable() {
  return (
    <div className='space-y-4'>
      <div className='rounded-[var(--radius-md)] border border-[color:var(--helper-error)] bg-[color:var(--helper-error-pastel)] p-4'>
        <p className='text-sm font-semibold text-[color:var(--helper-error)]'>
          11 failing assets
        </p>
        <p className='mt-1 text-sm text-[color:var(--text-paragraph)]'>
          Branch rulesets for several repositories should require approval for
          code changes.
        </p>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='flex h-9 min-w-[180px] flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] px-3 text-sm text-[color:var(--text-muted)]'>
          <Search className='size-4' aria-hidden='true' />
          Search assets...
        </div>
        <Button variant='outlined' size='sm'>
          Status
        </Button>
        <Button variant='outlined' size='sm'>
          Connection
        </Button>
      </div>
      <div className='overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--border-subtle)]'>
        <div className='grid grid-cols-[1fr_180px] border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-secondary)] px-4 py-3 text-xs font-semibold uppercase text-[color:var(--text-muted)]'>
          <span>Asset</span>
          <span>Connection</span>
        </div>
        {assets.map((asset, index) => (
          <div
            key={`${asset.name}-${index}`}
            className='grid grid-cols-[1fr_180px] items-center border-b border-[color:var(--border-subtle)] px-4 py-3 text-sm last:border-b-0'
          >
            <span className='flex min-w-0 items-center gap-2 font-medium text-[color:var(--text-title)]'>
              <span
                className={
                  asset.status === 'Compliant'
                    ? 'size-2 rounded-full bg-[color:var(--helper-success)]'
                    : asset.status === 'Inactive'
                      ? 'size-2 rounded-full bg-[color:var(--text-disabled)]'
                      : 'size-2 rotate-45 bg-[color:var(--helper-error)]'
                }
              />
              <span className='truncate'>{asset.name}</span>
            </span>
            <span className='truncate text-[color:var(--text-secondary)]'>
              Oneleet MDM Module
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConnectionForm() {
  return (
    <div className='mx-auto max-w-[680px] space-y-5'>
      <div className='rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-6'>
        <div className='mb-5 flex items-center gap-2 text-[color:var(--text-title)]'>
          <Plug className='size-5' aria-hidden='true' />
          <h3 className='text-lg font-semibold'>New API connection</h3>
        </div>
        <label className='grid gap-2 text-sm font-medium text-[color:var(--text-title)]'>
          Name
          <input
            className='h-10 rounded-[var(--radius-md)] border border-[color:var(--border-default)] px-3 text-sm font-normal outline-none focus:border-[color:var(--color-primary)]'
            defaultValue='Custom Community Data'
          />
        </label>
        <label className='mt-5 grid gap-2 text-sm font-medium text-[color:var(--text-title)]'>
          JSON example
          <textarea
            className='min-h-[160px] rounded-[var(--radius-md)] border border-[color:var(--border-default)] p-3 font-mono text-sm font-normal outline-none focus:border-[color:var(--color-primary)]'
            defaultValue={`{
  "firstName": "John",
  "lastName": "Appleseed",
  "isCustomer": false,
  "isLead": true
}`}
          />
        </label>
      </div>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className='rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] p-4 text-sm text-[color:var(--text-secondary)]'
        >
          Optional mapping section {index + 1}
        </div>
      ))}
    </div>
  );
}

function ShipmentDetails() {
  const rows = [
    'Package Center 6',
    'Package Center 7',
    'Fulfillment Center 5',
    'Main Distribution',
    'Collection center 1',
    'Collection center 2',
    'Collection center 3',
    'Collection center 4',
  ];

  return (
    <div className='space-y-5'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3 text-[color:var(--text-title)]'>
          <Box className='size-5' aria-hidden='true' />
          <div>
            <h3 className='font-semibold'>Shipment Details</h3>
            <p className='text-sm text-[color:var(--text-secondary)]'>
              Shipment, warehouse and crew related details
            </p>
          </div>
        </div>
        <span className='text-sm text-[color:var(--text-secondary)]'>
          Step 2 of 3
        </span>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-3 border-y border-[color:var(--border-subtle)] py-4'>
        <Button variant='text' startIcon={<Plus />}>
          Select a warehouse
        </Button>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Fulfilment Center 5</span>
          <span className='rounded-[var(--radius-md)] bg-[color:var(--helper-success-pastel)] px-3 py-1 text-sm text-[color:var(--helper-success)]'>
            Selected
          </span>
        </div>
      </div>
      <div className='min-w-[640px] overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--border-subtle)]'>
        <div className='grid grid-cols-[180px_repeat(8,1fr)] bg-[color:var(--bg-secondary)] text-xs text-[color:var(--text-muted)]'>
          <div className='border-r border-[color:var(--border-subtle)] p-3'>
            Ramp
          </div>
          {['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'].map(
            time => (
              <div
                key={time}
                className='border-r border-[color:var(--border-subtle)] p-3'
              >
                {time}
              </div>
            )
          )}
        </div>
        {rows.map((row, rowIndex) => (
          <div
            key={row}
            className='grid grid-cols-[180px_repeat(8,1fr)] border-t border-[color:var(--border-subtle)] text-sm'
          >
            <div className='border-r border-[color:var(--border-subtle)] p-3 font-medium'>
              {row}
            </div>
            {Array.from({ length: 8 }, (_, colIndex) => {
              const selected = rowIndex === 2 && colIndex === 4;
              const busy = (rowIndex + colIndex) % 5 === 0;
              return (
                <div
                  key={colIndex}
                  className='min-h-14 border-r border-[color:var(--border-subtle)] p-1'
                >
                  {selected ? (
                    <div className='grid h-full place-items-center rounded-[var(--radius-md)] border-2 border-[color:var(--color-primary)] bg-[color:var(--color-primary-50,var(--bg-hover))] text-xs font-semibold text-[color:var(--text-title)]'>
                      1 PM - 2 PM
                    </div>
                  ) : busy ? (
                    <div className='h-full rounded-[var(--radius-md)] bg-sky-200' />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className='rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] p-4'>
        <h3 className='font-semibold text-[color:var(--text-title)]'>
          Notes to the crew
        </h3>
        <p className='mt-2 text-sm text-[color:var(--text-secondary)]'>
          Leave shipment paperwork with the warehouse lead.
        </p>
      </div>
    </div>
  );
}

function ScrollBodyDemo() {
  return (
    <div className='grid gap-3'>
      {Array.from({ length: 16 }, (_, index) => (
        <div
          key={index}
          className='rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-4 text-sm text-[color:var(--text-secondary)]'
        >
          Scrollable body item {index + 1}
        </div>
      ))}
    </div>
  );
}

export const AllSides: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {sideOptions.map(option => (
        <Sheet key={option.side}>
          <SheetTrigger asChild>
            <Button variant='outlined'>{option.label}</Button>
          </SheetTrigger>
          <SheetContent
            side={option.side}
            size={
              option.side === 'top' || option.side === 'bottom' ? 'md' : 'sm'
            }
          >
            <SheetHeader>
              <SheetTitle className='text-xl font-semibold text-[color:var(--text-title)]'>
                {option.label}
              </SheetTitle>
              <SheetDescription className='text-sm text-[color:var(--text-secondary)]'>
                {option.description}
              </SheetDescription>
            </SheetHeader>
            <SheetBody>
              <ScrollBodyDemo />
            </SheetBody>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant='outlined'>Close</Button>
              </SheetClose>
              <Button>Continue</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};

export const AssetsDrawer: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open assets drawer</Button>
      </SheetTrigger>
      <SheetContent side='right' size='xl'>
        <SheetHeader>
          <div className='flex items-center gap-2 text-xs text-[color:var(--text-muted)]'>
            Monitors <ChevronRight className='size-3' /> Github
          </div>
          <SheetTitle className='mt-3 text-2xl font-semibold text-[color:var(--text-title)]'>
            Assets
          </SheetTitle>
        </SheetHeader>
        <SheetBody>
          <AssetTable />
        </SheetBody>
        <SheetFooter>
          <Button variant='outlined' startIcon={<Download />}>
            Export
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const CustomApiConnection: Story = {
  render: () => (
    <Drawer
      side='right'
      size='lg'
      trigger={<Button startIcon={<Plug />}>New API connection</Button>}
      header={
        <div>
          <SheetTitle className='text-2xl font-semibold text-[color:var(--text-title)]'>
            Custom API connection
          </SheetTitle>
          <SheetDescription className='mt-2 text-sm text-[color:var(--text-secondary)]'>
            Bring your own custom data into AhoyConnect.
          </SheetDescription>
        </div>
      }
      footer={
        <>
          <SheetClose asChild>
            <Button variant='outlined'>Cancel</Button>
          </SheetClose>
          <Button startIcon={<Plus />}>Add connection</Button>
        </>
      }
    >
      <ConnectionForm />
    </Drawer>
  ),
};

export const EventDetailsSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open event details</Button>
      </SheetTrigger>
      <SheetContent side='right' size='xl'>
        <SheetHeader>
          <SheetTitle className='text-base font-semibold text-[color:var(--text-title)]'>
            Event Details
          </SheetTitle>
        </SheetHeader>
        <SheetBody className='overflow-x-auto'>
          <ShipmentDetails />
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outlined' startIcon={<X />}>
              Cancel
            </Button>
          </SheetClose>
          <Button startIcon={<Check />}>Assign Shipment</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const BottomSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outlined'>Open bottom sheet</Button>
      </SheetTrigger>
      <SheetContent side='bottom' size='md'>
        <SheetHeader>
          <SheetTitle className='text-xl font-semibold text-[color:var(--text-title)]'>
            Review changes
          </SheetTitle>
          <SheetDescription className='text-sm text-[color:var(--text-secondary)]'>
            The footer stays visible while this body scrolls.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className='grid gap-3'>
            {Array.from({ length: 14 }, (_, index) => (
              <div
                key={index}
                className='rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] p-4 text-sm'
              >
                Change request {index + 1}
              </div>
            ))}
          </div>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outlined'>Dismiss</Button>
          </SheetClose>
          <Button>Approve</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
