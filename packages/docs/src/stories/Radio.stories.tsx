import { Radio } from '@/components/ui/form-fields/radio';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/FormFields/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable radio component with Material-UI styling patterns, supporting various states and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
      description: 'The visual style variant of the radio',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'The size of the radio',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the radio has an error state',
    },
    success: {
      control: { type: 'boolean' },
      description: 'Whether the radio has a success state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the radio is disabled',
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the radio is checked',
    },
    label: {
      control: 'text',
      description: 'Label text for the radio',
    },
  },
  args: {
    label: 'Radio label',
    onChange: fn(),
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive Radio Component
const InteractiveRadio = ({
  label,
  name,
  value,
  checked: initialChecked,
  ...props
}: any) => {
  const [selectedValue, setSelectedValue] = useState(
    initialChecked ? value : ''
  );
  return (
    <Radio
      label={label}
      name={name}
      value={value}
      checked={selectedValue === value}
      onChange={e => setSelectedValue(e.target.value)}
      {...props}
    />
  );
};

// Basic Variants
export const Default: Story = {
  render: () => (
    <InteractiveRadio label='Default radio' name='radio1' value='default' />
  ),
};

export const Checked: Story = {
  render: () => (
    <InteractiveRadio
      label='Checked radio'
      name='radio2'
      value='checked'
      checked
    />
  ),
};

// Variants
export const Error: Story = {
  render: () => (
    <InteractiveRadio label='Error radio' name='radio3' value='error' error />
  ),
};

export const Success: Story = {
  render: () => (
    <InteractiveRadio
      label='Success radio'
      name='radio4'
      value='success'
      success
    />
  ),
};

// Sizes
export const Small: Story = {
  render: () => (
    <InteractiveRadio
      label='Small radio'
      name='radio5'
      value='small'
      size='sm'
    />
  ),
};

export const Large: Story = {
  render: () => (
    <InteractiveRadio
      label='Large radio'
      name='radio6'
      value='large'
      size='lg'
    />
  ),
};

// States
export const Disabled: Story = {
  render: () => (
    <InteractiveRadio
      label='Disabled radio'
      name='radio7'
      value='disabled'
      disabled
    />
  ),
};

export const DisabledChecked: Story = {
  render: () => (
    <InteractiveRadio
      label='Disabled checked radio'
      name='radio8'
      value='disabled-checked'
      disabled
      checked
    />
  ),
};

// Without Label
export const WithoutLabel: Story = {
  render: () => <InteractiveRadio name='radio9' value='no-label' />,
};

// Interactive Examples
export const Interactive: Story = {
  render: () => (
    <InteractiveRadio
      label='Interactive radio'
      name='radio10'
      value='interactive'
    />
  ),
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className='space-y-4 p-4 w-full max-w-md'>
      <div className='space-y-2'>
        <InteractiveRadio
          label='Default radio'
          name='all-variants'
          value='default'
        />
      </div>
      <div className='space-y-2'>
        <InteractiveRadio
          label='Checked radio'
          name='all-variants'
          value='checked'
          checked
        />
      </div>
      <div className='space-y-2'>
        <InteractiveRadio
          label='Error radio'
          name='all-variants'
          value='error'
          error
        />
      </div>
      <div className='space-y-2'>
        <InteractiveRadio
          label='Success radio'
          name='all-variants'
          value='success'
          success
        />
      </div>
      <div className='space-y-2'>
        <InteractiveRadio
          label='Disabled radio'
          name='all-variants'
          value='disabled'
          disabled
        />
      </div>
      <div className='space-y-2'>
        <InteractiveRadio
          label='Disabled checked radio'
          name='all-variants'
          value='disabled-checked'
          disabled
          checked
        />
      </div>
      <div className='space-y-2'>
        <InteractiveRadio
          label='Small radio'
          name='all-variants'
          value='small'
          size='sm'
        />
      </div>
      <div className='space-y-2'>
        <InteractiveRadio
          label='Large radio'
          name='all-variants'
          value='large'
          size='lg'
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Radio Group Example
export const RadioGroup: Story = {
  render: () => {
    const [contactMethod, setContactMethod] = useState('');

    return (
      <div className='space-y-4 p-4 w-full max-w-md'>
        <h3 className='text-lg font-semibold'>
          Select your preferred contact method
        </h3>
        <div className='space-y-3'>
          <Radio
            name='contact'
            value='email'
            label='Email'
            checked={contactMethod === 'email'}
            onChange={e => setContactMethod(e.target.value)}
          />
          <Radio
            name='contact'
            value='phone'
            label='Phone'
            checked={contactMethod === 'phone'}
            onChange={e => setContactMethod(e.target.value)}
          />
          <Radio
            name='contact'
            value='mail'
            label='Postal Mail'
            checked={contactMethod === 'mail'}
            onChange={e => setContactMethod(e.target.value)}
          />
          <Radio
            name='contact'
            value='sms'
            label='SMS'
            checked={contactMethod === 'sms'}
            onChange={e => setContactMethod(e.target.value)}
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

// Form Example
export const FormExample: Story = {
  render: () => {
    const [gender, setGender] = useState('');
    const [ageGroup, setAgeGroup] = useState('');

    return (
      <div className='space-y-6 p-4 w-full max-w-md'>
        <div>
          <h3 className='text-lg font-semibold mb-3'>Gender</h3>
          <div className='space-y-2'>
            <Radio
              name='gender'
              value='male'
              label='Male'
              checked={gender === 'male'}
              onChange={e => setGender(e.target.value)}
            />
            <Radio
              name='gender'
              value='female'
              label='Female'
              checked={gender === 'female'}
              onChange={e => setGender(e.target.value)}
            />
            <Radio
              name='gender'
              value='other'
              label='Other'
              checked={gender === 'other'}
              onChange={e => setGender(e.target.value)}
            />
            <Radio
              name='gender'
              value='prefer-not'
              label='Prefer not to say'
              checked={gender === 'prefer-not'}
              onChange={e => setGender(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-3'>Age Group</h3>
          <div className='space-y-2'>
            <Radio
              name='age'
              value='18-24'
              label='18-24'
              checked={ageGroup === '18-24'}
              onChange={e => setAgeGroup(e.target.value)}
            />
            <Radio
              name='age'
              value='25-34'
              label='25-34'
              checked={ageGroup === '25-34'}
              onChange={e => setAgeGroup(e.target.value)}
            />
            <Radio
              name='age'
              value='35-44'
              label='35-44'
              checked={ageGroup === '35-44'}
              onChange={e => setAgeGroup(e.target.value)}
            />
            <Radio
              name='age'
              value='45-54'
              label='45-54'
              checked={ageGroup === '45-54'}
              onChange={e => setAgeGroup(e.target.value)}
            />
            <Radio
              name='age'
              value='55+'
              label='55+'
              checked={ageGroup === '55+'}
              onChange={e => setAgeGroup(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  },
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
          <h4 className='text-sm font-medium mb-2'>Basic Radio</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Radio } from '@/components/ui/form-fields/radio';

<Radio label="Option 1" name="options" value="option1" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Radio Group</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Radio } from '@/components/ui/form-fields/radio';
import { useState } from 'react';

const [selectedValue, setSelectedValue] = useState('');

<Radio 
  name="options" 
  value="option1" 
  label="Option 1"
  checked={selectedValue === 'option1'}
  onChange={(e) => setSelectedValue(e.target.value)}
/>
<Radio 
  name="options" 
  value="option2" 
  label="Option 2"
  checked={selectedValue === 'option2'}
  onChange={(e) => setSelectedValue(e.target.value)}
/>`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Radio Variants</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Radio } from '@/components/ui/form-fields/radio';

<Radio variant="default" label="Default" />
<Radio error label="Error state" />
<Radio success label="Success state" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Radio Sizes</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Radio } from '@/components/ui/form-fields/radio';

<Radio size="sm" label="Small" />
<Radio size="default" label="Default" />
<Radio size="lg" label="Large" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Radio States</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Radio } from '@/components/ui/form-fields/radio';

<Radio disabled label="Disabled" />
<Radio disabled checked label="Disabled checked" />
<Radio required label="Required field" />`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
