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
        component:
          'A highly customizable button component with multiple variants, sizes, icons, and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'contained',
        'outlined',
        'text',
        'secondary',
        'destructive',
        'ghost',
        'link',
      ],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg', 'xl', 'icon'],
      description: 'The size of the button',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether the button should take full width',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether to show loading state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    startIcon: {
      control: false,
      description: 'Icon to display at the start of the button',
    },
    endIcon: {
      control: false,
      description: 'Icon to display at the end of the button',
    },
    children: {
      control: 'text',
      description: 'Button content',
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
    children: 'Go to Dashboard',
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
