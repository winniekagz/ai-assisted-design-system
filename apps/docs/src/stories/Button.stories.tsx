import { Button } from '@/components/ui/button';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  ArrowRight,
  Check,
  Download,
  Heart,
  Mail,
  Menu,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Token-driven button with seven variants, five sizes, icon slots, loading state, and full-width layout. Built on Radix \`Slot\` so it composes with \`<a>\`, \`<Link>\`, or any other element via \`asChild\`.

### When to use
- **contained** — primary CTA, one per surface.
- **outlined** — secondary action alongside a contained button.
- **text / ghost** — low-emphasis actions in toolbars or cards.
- **destructive** — irreversible actions (delete, remove). Confirm first when possible.
- **link** — inline navigation that must look like a link.
- **secondary** — alternate brand emphasis when primary is already in use.

### Usage
\`\`\`tsx
import { Button } from '@winniekagendo/componentiq';
import { Save, Trash2 } from 'lucide-react';

<Button startIcon={<Save />}>Save changes</Button>
<Button variant="outlined">Cancel</Button>
<Button variant="destructive" startIcon={<Trash2 />}>Delete</Button>

// Compose with Next.js Link
<Button asChild variant="text">
  <Link href="/dashboard">Dashboard</Link>
</Button>

// Loading state
<Button loading>Saving…</Button>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`variant\` | \`"contained" \\| "outlined" \\| "text" \\| "secondary" \\| "destructive" \\| "ghost" \\| "link"\` | "contained" | Visual emphasis and intent |
| \`size\` | \`"sm" \\| "default" \\| "lg" \\| "xl" \\| "icon"\` | "default" | Height and padding |
| \`loading\` | boolean | false | Shows a spinner and disables interaction |
| \`disabled\` | boolean | false | Prevents interaction |
| \`fullWidth\` | boolean | false | Stretches to fill the parent width |
| \`startIcon\` | ReactNode | — | Icon before the label |
| \`endIcon\` | ReactNode | — | Icon after the label |
| \`asChild\` | boolean | false | Merges props onto the first child element (Radix Slot) |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['contained','outlined','text','secondary','destructive','ghost','link'],
      description: 'Visual emphasis and intent.',
      table: { type: { summary: "'contained' | 'outlined' | 'text' | 'secondary' | 'destructive' | 'ghost' | 'link'" }, defaultValue: { summary: "'contained'" } },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg', 'xl', 'icon'],
      description: 'Height and padding. Use `icon` for square icon-only buttons.',
      table: { type: { summary: "'sm' | 'default' | 'lg' | 'xl' | 'icon'" }, defaultValue: { summary: "'default'" } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretch the button to fill its parent container.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: 'Show a spinner and disable interaction.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevent interaction and reduce opacity.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    startIcon: {
      control: false,
      description: 'ReactNode rendered before the label (use a 16–20 px Lucide icon).',
      table: { type: { summary: 'ReactNode' } },
    },
    endIcon: {
      control: false,
      description: 'ReactNode rendered after the label.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      control: 'text',
      description: 'Button label.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
  args: {
    onClick: fn(),
    children: 'Button',
    variant: 'contained',
    size: 'default',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Variants
export const Contained: Story = {
  args: {
    variant: 'contained',
    children: 'Contained Button',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Default: Story = {
  args: {
    size: 'default',
    children: 'Default Button (30px × 10px)',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large Button',
  },
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Settings />,
    'aria-label': 'Settings',
  },
};

// States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const LoadingDisabled: Story = {
  args: {
    loading: true,
    disabled: true,
    children: 'Processing...',
  },
};

// Icons
export const WithStartIcon: Story = {
  args: {
    startIcon: <Download />,
    children: 'Download',
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: <ArrowRight />,
    children: 'Continue',
  },
};

export const WithBothIcons: Story = {
  args: {
    startIcon: <Mail />,
    endIcon: <Star />,
    children: 'Send Email',
  },
};

export const IconButton: Story = {
  args: {
    size: 'icon',
    children: <Heart />,
    'aria-label': 'Like',
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

export const FullWidthWithIcon: Story = {
  args: {
    fullWidth: true,
    startIcon: <Download />,
    children: 'Download All Files',
  },
  parameters: {
    layout: 'padded',
  },
};

// Interactive Examples
export const Interactive: Story = {
  args: {
    startIcon: <Heart />,
    children: 'Like Post',
    onClick: fn(),
  },
};

export const FormSubmit: Story = {
  args: {
    variant: 'contained',
    fullWidth: true,
    endIcon: <Check />,
    children: 'Submit Form',
    onClick: fn(),
  },
  parameters: {
    layout: 'padded',
  },
};

// Accessibility Examples
export const Accessible: Story = {
  args: {
    variant: 'contained',
    startIcon: <Plus />,
    children: 'Add Item',
    'aria-label': 'Add new item to the list',
    'aria-describedby': 'add-item-desc',
  },
  render: args => (
    <div>
      <Button {...args} />
      <div id='add-item-desc' className='sr-only'>
        This button adds a new item to the current list
      </div>
    </div>
  ),
};

export const ToggleButton: Story = {
  args: {
    variant: 'outlined',
    startIcon: <Heart />,
    children: 'Like',
    'aria-pressed': 'false',
    'aria-label': 'Like this post',
  },
};

// Composition
export const AsLink: Story = {
  args: {
    variant: 'text',
    asChild: true,
  },
  render: args => (
    <Button {...args}>
      <a href='#dashboard'>Go to Dashboard</a>
    </Button>
  ),
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4'>
      <Button variant='contained'>Contained</Button>
      <Button variant='outlined'>Outlined</Button>
      <Button variant='text'>Text</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='destructive'>Destructive</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button variant='link'>Link</Button>
      <Button size='icon' aria-label='Menu'>
        <Menu />
      </Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4 p-4'>
      <Button size='sm'>Small</Button>
      <Button size='default'>Default</Button>
      <Button size='lg'>Large</Button>
      <Button size='xl'>Extra Large</Button>
      <Button size='icon' aria-label='Search'>
        <Search />
      </Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Icon Examples
export const IconExamples: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4 p-4'>
      <Button startIcon={<Download />}>Download</Button>
      <Button endIcon={<ArrowRight />}>Continue</Button>
      <Button startIcon={<Mail />} endIcon={<Star />}>
        Send Email
      </Button>
      <Button startIcon={<Plus />} endIcon={<Check />}>
        Add & Save
      </Button>
      <Button startIcon={<Trash2 />} variant='destructive'>
        Delete
      </Button>
      <Button startIcon={<X />} variant='outlined'>
        Cancel
      </Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// States Comparison
export const StatesComparison: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4 p-4'>
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
      <Button loading disabled>
        Processing
      </Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
