import { Input } from '@/components/ui/form-fields/input';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Eye, Lock, Mail, Search } from 'lucide-react';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/FormFields/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable input component with Material-UI styling patterns, supporting various states, sizes, and icon variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'text', 'error', 'success'],
      description: 'The visual style variant of the input',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'The size of the input',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the input has an error state',
    },
    success: {
      control: { type: 'boolean' },
      description: 'Whether the input has a success state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'number'],
      description: 'The type of input',
    },
  },
  args: {
    placeholder: 'Enter text...',
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Variants
export const Default: Story = {
  args: {
    placeholder: 'Enter your text here',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Sample text',
    placeholder: 'Enter your text here',
  },
};

// Variants
export const Outline: Story = {
  args: {
    variant: 'outline',
    placeholder: 'Outline variant',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    placeholder: 'Text variant',
  },
};

export const Error: Story = {
  args: {
    error: true,
    placeholder: 'This input has an error',
  },
};

export const Success: Story = {
  args: {
    success: true,
    placeholder: 'This input is successful',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'Read-only text',
  },
};

// Input Types
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
  },
};

// Icon Examples
export const WithStartIcon: Story = {
  args: {
    startIcon: <Search className='h-4 w-4' />,
    placeholder: 'Search...',
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: <Mail className='h-4 w-4' />,
    placeholder: 'Email address',
  },
};

export const WithBothIcons: Story = {
  args: {
    startIcon: <Lock className='h-4 w-4' />,
    endIcon: <Eye className='h-4 w-4' />,
    type: 'password',
    placeholder: 'Password',
  },
};

// Interactive Examples
export const Interactive: Story = {
  args: {
    placeholder: 'Type to see changes',
    onChange: fn(),
  },
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full max-w-2xl'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Default</label>
        <Input placeholder='Default input' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Outline</label>
        <Input variant='outline' placeholder='Outline input' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Text</label>
        <Input variant='text' placeholder='Text input' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Error</label>
        <Input error placeholder='Error input' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Success</label>
        <Input success placeholder='Success input' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Disabled</label>
        <Input disabled placeholder='Disabled input' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Small</label>
        <Input size='sm' placeholder='Small input' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Large</label>
        <Input size='lg' placeholder='Large input' />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <div className='space-y-4 p-4 w-full max-w-md'>
      <h3 className='text-lg font-semibold'>Contact Form</h3>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Name</label>
        <Input placeholder='Enter your name' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Email</label>
        <Input
          startIcon={<Mail className='h-4 w-4' />}
          placeholder='Enter your email'
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Password</label>
        <Input
          type='password'
          startIcon={<Lock className='h-4 w-4' />}
          endIcon={<Eye className='h-4 w-4' />}
          placeholder='Enter your password'
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Message</label>
        <Input placeholder='Enter your message' />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Code Examples
export const CodeExample: Story = {
  render: () => (
    <div className='space-y-4 p-4 w-full max-w-2xl'>
      <h3 className='text-lg font-semibold'>Code Examples</h3>

      <div className='space-y-4'>
        <div>
          <h4 className='text-sm font-medium mb-2'>Basic Input</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Input } from '@/components/ui/form-fields/input';

<Input placeholder="Enter your text" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Input with Icons</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Input } from '@/components/ui/form-fields/input';
import { Search, Eye } from 'lucide-react';

<Input 
  startIcon={<Search className="h-4 w-4" />}
  endIcon={<Eye className="h-4 w-4" />}
  placeholder="Search with icon"
  onEndIconClick={() => console.log('Icon clicked')}
/>`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Input Variants</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Input } from '@/components/ui/form-fields/input';

<Input variant="default" placeholder="Default" />
<Input variant="outline" placeholder="Outline" />
<Input variant="text" placeholder="Text" />
<Input error placeholder="Error state" />
<Input success placeholder="Success state" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Input Sizes</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Input } from '@/components/ui/form-fields/input';

<Input size="sm" placeholder="Small" />
<Input size="default" placeholder="Default" />
<Input size="lg" placeholder="Large" />`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
