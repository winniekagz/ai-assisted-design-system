import { Autocomplete } from '@/components/ui/form-fields/autocomplete';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/FormFields/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable autocomplete component with Material-UI styling patterns, supporting single and multiple selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
      description: 'The visual style variant of the autocomplete',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'The size of the autocomplete',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the autocomplete has an error state',
    },
    success: {
      control: { type: 'boolean' },
      description: 'Whether the autocomplete has a success state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the autocomplete is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the autocomplete',
    },
    multiple: {
      control: { type: 'boolean' },
      description: 'Whether multiple values can be selected',
    },
  },
  args: {
    placeholder: 'Search...',
    options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'nextjs', label: 'Next.js' },
      { value: 'nuxt', label: 'Nuxt.js' },
    ],
    onChange: fn(),
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Variants
export const Default: Story = {
  args: {
    placeholder: 'Search frameworks...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'react',
    placeholder: 'Search frameworks...',
  },
};

// Variants
export const Error: Story = {
  args: {
    error: true,
    placeholder: 'This autocomplete has an error',
  },
};

export const Success: Story = {
  args: {
    success: true,
    placeholder: 'This autocomplete is successful',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small autocomplete',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large autocomplete',
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled autocomplete',
  },
};

// Multiple Selection
export const Multiple: Story = {
  args: {
    multiple: true,
    placeholder: 'Select multiple frameworks...',
    selectedValues: ['react', 'vue'],
  },
};

export const MultipleEmpty: Story = {
  args: {
    multiple: true,
    placeholder: 'Select multiple frameworks...',
  },
};

// Interactive Examples
export const Interactive: Story = {
  args: {
    placeholder: 'Type to search...',
    onChange: fn(),
  },
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full max-w-4xl'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Default</label>
        <Autocomplete
          placeholder='Default autocomplete'
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Error</label>
        <Autocomplete
          error
          placeholder='Error autocomplete'
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Success</label>
        <Autocomplete
          success
          placeholder='Success autocomplete'
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Disabled</label>
        <Autocomplete
          disabled
          placeholder='Disabled autocomplete'
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Small</label>
        <Autocomplete
          size='sm'
          placeholder='Small autocomplete'
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Large</label>
        <Autocomplete
          size='lg'
          placeholder='Large autocomplete'
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
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
      <h3 className='text-lg font-semibold'>User Profile</h3>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Skills</label>
        <Autocomplete
          multiple
          placeholder='Select your skills...'
          options={[
            { value: 'javascript', label: 'JavaScript' },
            { value: 'typescript', label: 'TypeScript' },
            { value: 'react', label: 'React' },
            { value: 'vue', label: 'Vue.js' },
            { value: 'angular', label: 'Angular' },
            { value: 'nodejs', label: 'Node.js' },
            { value: 'python', label: 'Python' },
            { value: 'java', label: 'Java' },
            { value: 'csharp', label: 'C#' },
            { value: 'php', label: 'PHP' },
          ]}
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Country</label>
        <Autocomplete
          placeholder='Select your country...'
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'au', label: 'Australia' },
            { value: 'de', label: 'Germany' },
            { value: 'fr', label: 'France' },
            { value: 'jp', label: 'Japan' },
            { value: 'cn', label: 'China' },
            { value: 'in', label: 'India' },
            { value: 'br', label: 'Brazil' },
          ]}
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
          <h4 className='text-sm font-medium mb-2'>Basic Autocomplete</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Autocomplete } from '@/components/ui/form-fields/autocomplete';

<Autocomplete 
  placeholder="Search..."
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]}
/>`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Controlled Autocomplete</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Autocomplete } from '@/components/ui/form-fields/autocomplete';
import { useState } from 'react';

const [value, setValue] = useState('');

<Autocomplete 
  value={value}
  onChange={setValue}
  placeholder="Search..."
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
/>`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Multiple Selection</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Autocomplete } from '@/components/ui/form-fields/autocomplete';
import { useState } from 'react';

const [selectedValues, setSelectedValues] = useState([]);

<Autocomplete 
  multiple
  selectedValues={selectedValues}
  onSelectedValuesChange={setSelectedValues}
  placeholder="Select multiple..."
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
/>`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Autocomplete Variants</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Autocomplete } from '@/components/ui/form-fields/autocomplete';

<Autocomplete variant="default" placeholder="Default" />
<Autocomplete error placeholder="Error state" />
<Autocomplete success placeholder="Success state" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Autocomplete Sizes</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Autocomplete } from '@/components/ui/form-fields/autocomplete';

<Autocomplete size="sm" placeholder="Small" />
<Autocomplete size="default" placeholder="Default" />
<Autocomplete size="lg" placeholder="Large" />`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
