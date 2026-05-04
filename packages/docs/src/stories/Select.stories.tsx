import { Select } from '@/components/ui/form-fields/select';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/FormFields/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable select component with Material-UI styling patterns, supporting various states and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
      description: 'The visual style variant of the select',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'The size of the select',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the select has an error state',
    },
    success: {
      control: { type: 'boolean' },
      description: 'Whether the select has a success state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the select is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the select',
    },
  },
  args: {
    placeholder: 'Select an option...',
    onChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Variants
export const Default: Story = {
  args: {
    placeholder: 'Select an option...',
    children: (
      <>
        <option value='option1'>Option 1</option>
        <option value='option2'>Option 2</option>
        <option value='option3'>Option 3</option>
      </>
    ),
  },
};

export const WithValue: Story = {
  args: {
    value: 'option2',
    placeholder: 'Select an option...',
    children: (
      <>
        <option value='option1'>Option 1</option>
        <option value='option2'>Option 2</option>
        <option value='option3'>Option 3</option>
      </>
    ),
  },
};

// Variants
export const Error: Story = {
  args: {
    error: true,
    placeholder: 'This select has an error',
    children: (
      <>
        <option value='option1'>Option 1</option>
        <option value='option2'>Option 2</option>
        <option value='option3'>Option 3</option>
      </>
    ),
  },
};

export const Success: Story = {
  args: {
    success: true,
    placeholder: 'This select is successful',
    children: (
      <>
        <option value='option1'>Option 1</option>
        <option value='option2'>Option 2</option>
        <option value='option3'>Option 3</option>
      </>
    ),
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small select',
    children: (
      <>
        <option value='option1'>Option 1</option>
        <option value='option2'>Option 2</option>
        <option value='option3'>Option 3</option>
      </>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large select',
    children: (
      <>
        <option value='option1'>Option 1</option>
        <option value='option2'>Option 2</option>
        <option value='option3'>Option 3</option>
      </>
    ),
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled select',
    children: (
      <>
        <option value='option1'>Option 1</option>
        <option value='option2'>Option 2</option>
        <option value='option3'>Option 3</option>
      </>
    ),
  },
};

// Interactive Examples
export const Interactive: Story = {
  args: {
    placeholder: 'Select an option...',
    onChange: fn(),
    children: (
      <>
        <option value='option1'>Option 1</option>
        <option value='option2'>Option 2</option>
        <option value='option3'>Option 3</option>
      </>
    ),
  },
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full max-w-2xl'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Default</label>
        <Select placeholder='Default select'>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </Select>
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Error</label>
        <Select error placeholder='Error select'>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </Select>
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Success</label>
        <Select success placeholder='Success select'>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </Select>
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Disabled</label>
        <Select disabled placeholder='Disabled select'>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </Select>
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Small</label>
        <Select size='sm' placeholder='Small select'>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </Select>
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Large</label>
        <Select size='lg' placeholder='Large select'>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </Select>
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
      <h3 className='text-lg font-semibold'>User Registration</h3>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Country</label>
        <Select placeholder='Select your country'>
          <option value='us'>United States</option>
          <option value='ca'>Canada</option>
          <option value='uk'>United Kingdom</option>
          <option value='au'>Australia</option>
          <option value='de'>Germany</option>
          <option value='fr'>France</option>
        </Select>
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Language</label>
        <Select placeholder='Select your language'>
          <option value='en'>English</option>
          <option value='es'>Spanish</option>
          <option value='fr'>French</option>
          <option value='de'>German</option>
          <option value='it'>Italian</option>
        </Select>
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Timezone</label>
        <Select placeholder='Select your timezone'>
          <option value='utc-8'>Pacific Time (UTC-8)</option>
          <option value='utc-7'>Mountain Time (UTC-7)</option>
          <option value='utc-6'>Central Time (UTC-6)</option>
          <option value='utc-5'>Eastern Time (UTC-5)</option>
          <option value='utc+0'>UTC</option>
          <option value='utc+1'>Central European Time (UTC+1)</option>
        </Select>
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
          <h4 className='text-sm font-medium mb-2'>Basic Select</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Select } from '@/components/ui/form-fields/select';

<Select placeholder="Select an option">
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
  <option value="option3">Option 3</option>
</Select>`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Select with Value</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Select } from '@/components/ui/form-fields/select';

<Select value="option2" placeholder="Select an option">
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
  <option value="option3">Option 3</option>
</Select>`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Select Variants</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Select } from '@/components/ui/form-fields/select';

<Select variant="default" placeholder="Default" />
<Select error placeholder="Error state" />
<Select success placeholder="Success state" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Select Sizes</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Select } from '@/components/ui/form-fields/select';

<Select size="sm" placeholder="Small" />
<Select size="default" placeholder="Default" />
<Select size="lg" placeholder="Large" />`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
