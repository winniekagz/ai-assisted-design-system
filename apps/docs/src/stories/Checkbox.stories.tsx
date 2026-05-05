import { Checkbox } from '@/components/ui/form-fields/checkbox';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/FormFields/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable checkbox component with Material-UI styling patterns, supporting various states and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
      description: 'The visual style variant of the checkbox',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'The size of the checkbox',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox has an error state',
    },
    success: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox has a success state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is disabled',
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is checked',
    },
    label: {
      control: 'text',
      description: 'Label text for the checkbox',
    },
  },
  args: {
    label: 'Checkbox label',
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive Checkbox Component
const InteractiveCheckbox = ({ label, ...props }: any) => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label={label}
      checked={checked}
      onChange={e => setChecked(e.target.checked)}
      {...props}
    />
  );
};

// Basic Variants
export const Default: Story = {
  render: () => <InteractiveCheckbox label='Default checkbox' />,
};

export const Checked: Story = {
  render: () => <InteractiveCheckbox label='Checked checkbox' checked />,
};

// Variants
export const Error: Story = {
  render: () => <InteractiveCheckbox label='Error checkbox' error />,
};

export const Success: Story = {
  render: () => <InteractiveCheckbox label='Success checkbox' success />,
};

// Sizes
export const Small: Story = {
  render: () => <InteractiveCheckbox label='Small checkbox' size='sm' />,
};

export const Large: Story = {
  render: () => <InteractiveCheckbox label='Large checkbox' size='lg' />,
};

// States
export const Disabled: Story = {
  render: () => <InteractiveCheckbox label='Disabled checkbox' disabled />,
};

export const DisabledChecked: Story = {
  render: () => (
    <InteractiveCheckbox label='Disabled checked checkbox' disabled checked />
  ),
};

// Without Label
export const WithoutLabel: Story = {
  render: () => <InteractiveCheckbox />,
};

// Interactive Examples
export const Interactive: Story = {
  render: () => <InteractiveCheckbox label='Interactive checkbox' />,
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className='space-y-4 p-4 w-full max-w-md'>
      <div className='space-y-2'>
        <InteractiveCheckbox label='Default checkbox' />
      </div>
      <div className='space-y-2'>
        <InteractiveCheckbox label='Checked checkbox' checked />
      </div>
      <div className='space-y-2'>
        <InteractiveCheckbox label='Error checkbox' error />
      </div>
      <div className='space-y-2'>
        <InteractiveCheckbox label='Success checkbox' success />
      </div>
      <div className='space-y-2'>
        <InteractiveCheckbox label='Disabled checkbox' disabled />
      </div>
      <div className='space-y-2'>
        <InteractiveCheckbox
          label='Disabled checked checkbox'
          disabled
          checked
        />
      </div>
      <div className='space-y-2'>
        <InteractiveCheckbox label='Small checkbox' size='sm' />
      </div>
      <div className='space-y-2'>
        <InteractiveCheckbox label='Large checkbox' size='lg' />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Form Example
export const FormExample: Story = {
  render: () => {
    const [preferences, setPreferences] = useState({
      email: false,
      sms: false,
      push: false,
      share: false,
      newsletter: false,
    });

    const handleChange = (key: string) => (e: any) => {
      setPreferences(prev => ({
        ...prev,
        [key]: e.target.checked,
      }));
    };

    return (
      <div className='space-y-4 p-4 w-full max-w-md'>
        <h3 className='text-lg font-semibold'>Preferences</h3>
        <div className='space-y-3'>
          <Checkbox
            label='Receive email notifications'
            checked={preferences.email}
            onChange={handleChange('email')}
          />
          <Checkbox
            label='Receive SMS notifications'
            checked={preferences.sms}
            onChange={handleChange('sms')}
          />
          <Checkbox
            label='Receive push notifications'
            checked={preferences.push}
            onChange={handleChange('push')}
          />
          <Checkbox
            label='Share data with third parties'
            checked={preferences.share}
            onChange={handleChange('share')}
          />
          <Checkbox
            label='Subscribe to newsletter'
            checked={preferences.newsletter}
            onChange={handleChange('newsletter')}
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

// Terms and Conditions Example
export const TermsAndConditions: Story = {
  render: () => {
    const [agreements, setAgreements] = useState({
      terms: false,
      privacy: false,
      marketing: false,
    });

    const handleChange = (key: string) => (e: any) => {
      setAgreements(prev => ({
        ...prev,
        [key]: e.target.checked,
      }));
    };

    return (
      <div className='space-y-4 p-4 w-full max-w-md'>
        <h3 className='text-lg font-semibold'>Terms and Conditions</h3>
        <div className='space-y-3'>
          <Checkbox
            label='I agree to the Terms of Service'
            checked={agreements.terms}
            onChange={handleChange('terms')}
            required
          />
          <Checkbox
            label='I agree to the Privacy Policy'
            checked={agreements.privacy}
            onChange={handleChange('privacy')}
            required
          />
          <Checkbox
            label='I want to receive marketing emails'
            checked={agreements.marketing}
            onChange={handleChange('marketing')}
          />
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
          <h4 className='text-sm font-medium mb-2'>Basic Checkbox</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Checkbox } from '@/components/ui/form-fields/checkbox';

<Checkbox label="Accept terms and conditions" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Controlled Checkbox</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Checkbox } from '@/components/ui/form-fields/checkbox';
import { useState } from 'react';

const [checked, setChecked] = useState(false);

<Checkbox 
  label="Controlled checkbox"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Checkbox Variants</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Checkbox } from '@/components/ui/form-fields/checkbox';

<Checkbox variant="default" label="Default" />
<Checkbox error label="Error state" />
<Checkbox success label="Success state" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Checkbox Sizes</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Checkbox } from '@/components/ui/form-fields/checkbox';

<Checkbox size="sm" label="Small" />
<Checkbox size="default" label="Default" />
<Checkbox size="lg" label="Large" />`}
          </pre>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Checkbox States</h4>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
            {`import { Checkbox } from '@/components/ui/form-fields/checkbox';

<Checkbox disabled label="Disabled" />
<Checkbox disabled checked label="Disabled checked" />
<Checkbox required label="Required field" />`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
