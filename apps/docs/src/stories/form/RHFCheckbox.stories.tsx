import { RHFCheckbox } from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const meta = {
  title: 'Form/RHF/RHFCheckbox',
  component: RHFCheckbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'RHFCheckbox is a React Hook Form adapter for the Checkbox component. It provides automatic form integration, validation error display, and type-safe form handling for boolean inputs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Form field name (must match Zod schema)',
    },
    label: {
      control: 'text',
      description: 'Label text for the checkbox',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
  },
} satisfies Meta<typeof RHFCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Form wrapper component for stories
const FormWrapper = ({ children, schema, defaultValues }: any) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full max-w-md space-y-4'
      >
        {children}
        <button
          type='submit'
          className='w-full bg-[color:var(--color-primary-500)] text-white py-2 px-4 rounded hover:bg-[color:var(--color-primary-600)]'
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

// Schemas for stories
const newsletterSchema = z.object({
  newsletter: z.boolean(),
});

const termsSchema = z.object({
  terms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
});

const preferencesSchema = z.object({
  newsletter: z.boolean(),
  marketing: z.boolean(),
  analytics: z.boolean(),
});

const multiCheckboxSchema = z.object({
  terms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
  newsletter: z.boolean(),
  marketing: z.boolean(),
  analytics: z.boolean(),
});

export const Default: Story = {
  args: {
    name: 'newsletter',
    label: 'Subscribe to our newsletter',
  },
  render: () => (
    <FormWrapper
      schema={newsletterSchema}
      defaultValues={{ newsletter: false }}
    >
      <RHFCheckbox name='newsletter' label='Subscribe to our newsletter' />
    </FormWrapper>
  ),
};

export const WithDefaultValue: Story = {
  args: {
    name: 'newsletter',
    label: 'Subscribe to our newsletter',
  },
  render: () => (
    <FormWrapper schema={newsletterSchema} defaultValues={{ newsletter: true }}>
      <RHFCheckbox name='newsletter' label='Subscribe to our newsletter' />
    </FormWrapper>
  ),
};

export const Required: Story = {
  args: {
    name: 'terms',
    label: 'I agree to the terms and conditions',
    required: true,
  },
  render: () => (
    <FormWrapper schema={termsSchema} defaultValues={{ terms: false }}>
      <RHFCheckbox
        name='terms'
        label='I agree to the terms and conditions'
        required
      />
    </FormWrapper>
  ),
};

export const Disabled: Story = {
  args: {
    name: 'newsletter',
    label: 'Subscribe to our newsletter',
    disabled: true,
  },
  render: () => (
    <FormWrapper schema={newsletterSchema} defaultValues={{ newsletter: true }}>
      <RHFCheckbox
        name='newsletter'
        label='Subscribe to our newsletter'
        disabled
      />
    </FormWrapper>
  ),
};

export const WithError: Story = {
  args: {
    name: 'terms',
    label: 'I agree to the terms and conditions',
    required: true,
  },
  render: () => (
    <FormWrapper schema={termsSchema} defaultValues={{ terms: false }}>
      <RHFCheckbox
        name='terms'
        label='I agree to the terms and conditions'
        formError='This is a custom error message'
        required
      />
    </FormWrapper>
  ),
};

export const MultipleCheckboxes: Story = {
  args: {
    name: 'newsletter',
    label: 'Subscribe to our newsletter',
  },
  render: () => (
    <FormWrapper
      schema={preferencesSchema}
      defaultValues={{
        newsletter: false,
        marketing: false,
        analytics: false,
      }}
    >
      <div className='space-y-3'>
        <RHFCheckbox name='newsletter' label='Subscribe to our newsletter' />
        <RHFCheckbox
          name='marketing'
          label='Receive marketing communications'
        />
        <RHFCheckbox name='analytics' label='Allow analytics tracking' />
      </div>
    </FormWrapper>
  ),
};

export const ComplexForm: Story = {
  args: {
    name: 'terms',
    label: 'I agree to the terms and conditions',
    required: true,
  },
  render: () => (
    <FormWrapper
      schema={multiCheckboxSchema}
      defaultValues={{
        terms: false,
        newsletter: false,
        marketing: false,
        analytics: false,
      }}
    >
      <div className='space-y-4'>
        <div className='border-b pb-4'>
          <h3 className='text-lg font-medium mb-3'>Account Preferences</h3>
          <div className='space-y-3'>
            <RHFCheckbox
              name='newsletter'
              label='Subscribe to our newsletter'
            />
            <RHFCheckbox
              name='marketing'
              label='Receive marketing communications'
            />
            <RHFCheckbox name='analytics' label='Allow analytics tracking' />
          </div>
        </div>

        <div>
          <RHFCheckbox
            name='terms'
            label='I agree to the terms and conditions'
            required
          />
        </div>
      </div>
    </FormWrapper>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const AllVariants: Story = {
  args: {
    name: 'newsletter',
    label: 'Subscribe to our newsletter',
  },
  render: () => (
    <div className='space-y-6 w-full max-w-md'>
      <h2 className='text-xl font-semibold'>Checkbox Variants</h2>

      <FormWrapper
        schema={newsletterSchema}
        defaultValues={{ newsletter: false }}
      >
        <RHFCheckbox name='newsletter' label='Default Checkbox' />
      </FormWrapper>

      <FormWrapper
        schema={newsletterSchema}
        defaultValues={{ newsletter: true }}
      >
        <RHFCheckbox name='newsletter' label='Checked by Default' />
      </FormWrapper>

      <FormWrapper
        schema={newsletterSchema}
        defaultValues={{ newsletter: true }}
      >
        <RHFCheckbox name='newsletter' label='Disabled Checkbox' disabled />
      </FormWrapper>

      <FormWrapper schema={termsSchema} defaultValues={{ terms: false }}>
        <RHFCheckbox name='terms' label='Required Checkbox' required />
      </FormWrapper>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const CodeExample: Story = {
  args: {
    name: 'newsletter',
    label: 'Subscribe to our newsletter',
  },
  render: () => (
    <div className='space-y-4 w-full max-w-2xl'>
      <h2 className='text-xl font-semibold'>Code Examples</h2>

      <div className='space-y-4'>
        <div>
          <h3 className='text-lg font-medium mb-2'>Basic Usage</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`import { RHFCheckbox } from '@/components/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  newsletter: z.boolean(),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { newsletter: false },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <RHFCheckbox
        name="newsletter"
        label="Subscribe to our newsletter"
      />
    </form>
  );
}`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>Required Checkbox</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`const schema = z.object({
  terms: z.boolean().refine(
    (val) => val === true,
    'You must accept the terms and conditions'
  ),
});

<RHFCheckbox
  name="terms"
  label="I agree to the terms and conditions"
  required
/>`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>Multiple Checkboxes</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`const schema = z.object({
  newsletter: z.boolean(),
  marketing: z.boolean(),
  analytics: z.boolean(),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    newsletter: false,
    marketing: false,
    analytics: false,
  },
});

<RHFCheckbox name="newsletter" label="Newsletter" />
<RHFCheckbox name="marketing" label="Marketing" />
<RHFCheckbox name="analytics" label="Analytics" />`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
