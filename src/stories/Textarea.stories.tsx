import { Textarea } from '@/components/ui/form-fields/textarea';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MessageSquare, Send } from 'lucide-react';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/FormFields/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable textarea component with Material-UI styling patterns, supporting auto-grow functionality and icon variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
      description: 'The visual style variant of the textarea',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'The size of the textarea',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the textarea has an error state',
    },
    success: {
      control: { type: 'boolean' },
      description: 'Whether the textarea has a success state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the textarea',
    },
    rows: {
      control: { type: 'number' },
      description: 'Number of visible rows',
    },
    autoGrow: {
      control: { type: 'boolean' },
      description: 'Whether the textarea should auto-grow with content',
    },
  },
  args: {
    placeholder: 'Enter your text here...',
    onChange: fn(),
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Variants
export const Default: Story = {
  args: {
    placeholder: 'Enter your message here...',
  },
};

export const WithValue: Story = {
  args: {
    value:
      'This is a sample text that demonstrates how the textarea looks with content.',
    placeholder: 'Enter your message here...',
  },
};

// Variants
export const Error: Story = {
  args: {
    error: true,
    placeholder: 'This textarea has an error',
  },
};

export const Success: Story = {
  args: {
    success: true,
    placeholder: 'This textarea is successful',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small textarea',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large textarea',
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled textarea',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'This is read-only content that cannot be edited.',
  },
};

// Auto-grow functionality
export const AutoGrow: Story = {
  args: {
    autoGrow: true,
    placeholder: 'Type to see the textarea grow...',
  },
};

export const AutoGrowWithContent: Story = {
  args: {
    autoGrow: true,
    value:
      'This textarea will automatically grow as you type more content. The height will adjust based on the content length.',
    placeholder: 'Type to see the textarea grow...',
  },
};

// Rows
export const ThreeRows: Story = {
  args: {
    rows: 3,
    placeholder: 'Three rows textarea',
  },
};

export const FiveRows: Story = {
  args: {
    rows: 5,
    placeholder: 'Five rows textarea',
  },
};

// Icon Examples
export const WithStartIcon: Story = {
  args: {
    startIcon: <MessageSquare className='h-4 w-4' />,
    placeholder: 'Start typing your message...',
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: <Send className='h-4 w-4' />,
    placeholder: 'Type your message and click send',
  },
};

export const WithBothIcons: Story = {
  args: {
    startIcon: <MessageSquare className='h-4 w-4' />,
    endIcon: <Send className='h-4 w-4' />,
    placeholder: 'Message with both icons',
  },
};

// Interactive Examples
export const Interactive: Story = {
  args: {
    placeholder: 'Type to see changes...',
    onChange: fn(),
  },
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full max-w-4xl'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Default</label>
        <Textarea placeholder='Default textarea' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Error</label>
        <Textarea error placeholder='Error textarea' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Success</label>
        <Textarea success placeholder='Success textarea' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Disabled</label>
        <Textarea disabled placeholder='Disabled textarea' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Small</label>
        <Textarea size='sm' placeholder='Small textarea' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Large</label>
        <Textarea size='lg' placeholder='Large textarea' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Auto-grow</label>
        <Textarea autoGrow placeholder='Auto-grow textarea' />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>With Icon</label>
        <Textarea
          startIcon={<MessageSquare className='h-4 w-4' />}
          placeholder='Textarea with icon'
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Form Example
export const ContactForm: Story = {
  render: () => (
    <div className='space-y-4 p-4 w-full max-w-2xl'>
      <h3 className='text-lg font-semibold'>Contact Form</h3>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Name</label>
        <input
          className='w-full px-3 py-2 border border-[rgba(0,0,0,0.23)] rounded'
          placeholder='Enter your name'
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Email</label>
        <input
          className='w-full px-3 py-2 border border-[rgba(0,0,0,0.23)] rounded'
          type='email'
          placeholder='Enter your email'
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Message</label>
        <Textarea
          autoGrow
          startIcon={<MessageSquare className='h-4 w-4' />}
          endIcon={<Send className='h-4 w-4' />}
          placeholder='Enter your message here...'
          rows={4}
        />
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
          <h4 className='text-sm font-medium mb-2'>Basic Textarea</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Textarea } from '@/components/ui/form-fields/textarea';

<Textarea placeholder="Enter your message" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Auto-grow Textarea</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Textarea } from '@/components/ui/form-fields/textarea';

<Textarea 
  autoGrow 
  placeholder="This textarea will grow as you type"
/>`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Textarea with Icons</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Textarea } from '@/components/ui/form-fields/textarea';
import { MessageSquare, Send } from 'lucide-react';

<Textarea 
  startIcon={<MessageSquare className="h-4 w-4" />}
  endIcon={<Send className="h-4 w-4" />}
  placeholder="Message with icons"
  onEndIconClick={() => console.log('Send clicked')}
/>`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Textarea Variants</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Textarea } from '@/components/ui/form-fields/textarea';

<Textarea variant="default" placeholder="Default" />
<Textarea error placeholder="Error state" />
<Textarea success placeholder="Success state" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Textarea Sizes</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Textarea } from '@/components/ui/form-fields/textarea';

<Textarea size="sm" placeholder="Small" />
<Textarea size="default" placeholder="Default" />
<Textarea size="lg" placeholder="Large" />`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
