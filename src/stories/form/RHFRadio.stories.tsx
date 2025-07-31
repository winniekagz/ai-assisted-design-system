import { RHFRadio } from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const meta = {
  title: 'Form/RHF/RHFRadio',
  component: RHFRadio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'RHFRadio is a React Hook Form adapter for the Radio component. It provides automatic form integration, validation error display, and type-safe form handling for radio button groups.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Form field name (must match Zod schema)',
    },
    value: {
      control: 'text',
      description: 'Value for this radio option',
    },
    label: {
      control: 'text',
      description: 'Label text for the radio option',
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
} satisfies Meta<typeof RHFRadio>;

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
const genderSchema = z.object({
  gender: z.enum(['male', 'female', 'other', 'prefer-not']),
});

const sizeSchema = z.object({
  size: z.enum(['small', 'medium', 'large']),
});

const preferenceSchema = z.object({
  preference: z.enum(['email', 'phone', 'mail']),
});

const multiFieldSchema = z.object({
  gender: z.enum(['male', 'female', 'other', 'prefer-not']),
  size: z.enum(['small', 'medium', 'large']),
  preference: z.enum(['email', 'phone', 'mail']),
});

export const Default: Story = {
  args: {
    name: 'gender',
    value: 'male',
    label: 'Male',
  },
  render: () => (
    <FormWrapper schema={genderSchema} defaultValues={{ gender: 'prefer-not' }}>
      <div className='space-y-3'>
        <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
          Gender
        </label>
        <div className='space-y-2'>
          <RHFRadio name='gender' value='male' label='Male' />
          <RHFRadio name='gender' value='female' label='Female' />
          <RHFRadio name='gender' value='other' label='Other' />
          <RHFRadio
            name='gender'
            value='prefer-not'
            label='Prefer not to say'
          />
        </div>
      </div>
    </FormWrapper>
  ),
};

export const WithDefaultValue: Story = {
  args: {
    name: 'gender',
    value: 'female',
    label: 'Female',
  },
  render: () => (
    <FormWrapper schema={genderSchema} defaultValues={{ gender: 'female' }}>
      <div className='space-y-3'>
        <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
          Gender
        </label>
        <div className='space-y-2'>
          <RHFRadio name='gender' value='male' label='Male' />
          <RHFRadio name='gender' value='female' label='Female' />
          <RHFRadio name='gender' value='other' label='Other' />
          <RHFRadio
            name='gender'
            value='prefer-not'
            label='Prefer not to say'
          />
        </div>
      </div>
    </FormWrapper>
  ),
};

export const SizeSelection: Story = {
  args: {
    name: 'size',
    value: 'medium',
    label: 'Medium',
  },
  render: () => (
    <FormWrapper schema={sizeSchema} defaultValues={{ size: 'medium' }}>
      <div className='space-y-3'>
        <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
          Size
        </label>
        <div className='space-y-2'>
          <RHFRadio name='size' value='small' label='Small' />
          <RHFRadio name='size' value='medium' label='Medium' />
          <RHFRadio name='size' value='large' label='Large' />
        </div>
      </div>
    </FormWrapper>
  ),
};

export const ContactPreference: Story = {
  args: {
    name: 'preference',
    value: 'email',
    label: 'Email',
  },
  render: () => (
    <FormWrapper
      schema={preferenceSchema}
      defaultValues={{ preference: 'email' }}
    >
      <div className='space-y-3'>
        <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
          Preferred Contact Method
        </label>
        <div className='space-y-2'>
          <RHFRadio name='preference' value='email' label='Email' />
          <RHFRadio name='preference' value='phone' label='Phone' />
          <RHFRadio name='preference' value='mail' label='Mail' />
        </div>
      </div>
    </FormWrapper>
  ),
};

export const Disabled: Story = {
  args: {
    name: 'gender',
    value: 'male',
    label: 'Male',
    disabled: true,
  },
  render: () => (
    <FormWrapper schema={genderSchema} defaultValues={{ gender: 'male' }}>
      <div className='space-y-3'>
        <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
          Gender
        </label>
        <div className='space-y-2'>
          <RHFRadio name='gender' value='male' label='Male' disabled />
          <RHFRadio name='gender' value='female' label='Female' disabled />
          <RHFRadio name='gender' value='other' label='Other' disabled />
          <RHFRadio
            name='gender'
            value='prefer-not'
            label='Prefer not to say'
            disabled
          />
        </div>
      </div>
    </FormWrapper>
  ),
};

export const WithError: Story = {
  args: {
    name: 'gender',
    value: 'male',
    label: 'Male',
  },
  render: () => (
    <FormWrapper schema={genderSchema} defaultValues={{ gender: '' }}>
      <div className='space-y-3'>
        <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
          Gender
        </label>
        <div className='space-y-2'>
          <RHFRadio
            name='gender'
            value='male'
            label='Male'
            formError='Please select a gender'
          />
          <RHFRadio name='gender' value='female' label='Female' />
          <RHFRadio name='gender' value='other' label='Other' />
          <RHFRadio
            name='gender'
            value='prefer-not'
            label='Prefer not to say'
          />
        </div>
      </div>
    </FormWrapper>
  ),
};

export const MultipleGroups: Story = {
  args: {
    name: 'gender',
    value: 'male',
    label: 'Male',
  },
  render: () => (
    <FormWrapper
      schema={multiFieldSchema}
      defaultValues={{
        gender: 'prefer-not',
        size: 'medium',
        preference: 'email',
      }}
    >
      <div className='space-y-6'>
        <div className='space-y-3'>
          <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
            Gender
          </label>
          <div className='space-y-2'>
            <RHFRadio name='gender' value='male' label='Male' />
            <RHFRadio name='gender' value='female' label='Female' />
            <RHFRadio name='gender' value='other' label='Other' />
            <RHFRadio
              name='gender'
              value='prefer-not'
              label='Prefer not to say'
            />
          </div>
        </div>

        <div className='space-y-3'>
          <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
            Size
          </label>
          <div className='space-y-2'>
            <RHFRadio name='size' value='small' label='Small' />
            <RHFRadio name='size' value='medium' label='Medium' />
            <RHFRadio name='size' value='large' label='Large' />
          </div>
        </div>

        <div className='space-y-3'>
          <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
            Contact Preference
          </label>
          <div className='space-y-2'>
            <RHFRadio name='preference' value='email' label='Email' />
            <RHFRadio name='preference' value='phone' label='Phone' />
            <RHFRadio name='preference' value='mail' label='Mail' />
          </div>
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
    name: 'gender',
    value: 'male',
    label: 'Male',
  },
  render: () => (
    <div className='space-y-6 w-full max-w-md'>
      <h2 className='text-xl font-semibold'>Radio Variants</h2>

      <FormWrapper schema={genderSchema} defaultValues={{ gender: '' }}>
        <div className='space-y-3'>
          <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
            Default Radio Group
          </label>
          <div className='space-y-2'>
            <RHFRadio name='gender' value='male' label='Male' />
            <RHFRadio name='gender' value='female' label='Female' />
          </div>
        </div>
      </FormWrapper>

      <FormWrapper schema={genderSchema} defaultValues={{ gender: 'male' }}>
        <div className='space-y-3'>
          <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
            With Default Selection
          </label>
          <div className='space-y-2'>
            <RHFRadio name='gender' value='male' label='Male' />
            <RHFRadio name='gender' value='female' label='Female' />
          </div>
        </div>
      </FormWrapper>

      <FormWrapper schema={genderSchema} defaultValues={{ gender: 'male' }}>
        <div className='space-y-3'>
          <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
            Disabled Radio Group
          </label>
          <div className='space-y-2'>
            <RHFRadio name='gender' value='male' label='Male' disabled />
            <RHFRadio name='gender' value='female' label='Female' disabled />
          </div>
        </div>
      </FormWrapper>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const CodeExample: Story = {
  args: {
    name: 'gender',
    value: 'male',
    label: 'Male',
  },
  render: () => (
    <div className='space-y-4 w-full max-w-2xl'>
      <h2 className='text-xl font-semibold'>Code Examples</h2>

      <div className='space-y-4'>
        <div>
          <h3 className='text-lg font-medium mb-2'>Basic Usage</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`import { RHFRadio } from '@/components/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  gender: z.enum(['male', 'female', 'other']),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { gender: '' },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <RHFRadio name="gender" value="male" label="Male" />
        <RHFRadio name="gender" value="female" label="Female" />
        <RHFRadio name="gender" value="other" label="Other" />
      </div>
    </form>
  );
}`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>With Labels</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`<div className="space-y-3">
  <label className="text-sm font-medium">
    Gender
  </label>
  <div className="space-y-2">
    <RHFRadio name="gender" value="male" label="Male" />
    <RHFRadio name="gender" value="female" label="Female" />
    <RHFRadio name="gender" value="other" label="Other" />
  </div>
</div>`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>Multiple Radio Groups</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`const schema = z.object({
  gender: z.enum(['male', 'female']),
  size: z.enum(['small', 'medium', 'large']),
});

<div className="space-y-6">
  <div className="space-y-2">
    <RHFRadio name="gender" value="male" label="Male" />
    <RHFRadio name="gender" value="female" label="Female" />
  </div>
  
  <div className="space-y-2">
    <RHFRadio name="size" value="small" label="Small" />
    <RHFRadio name="size" value="medium" label="Medium" />
    <RHFRadio name="size" value="large" label="Large" />
  </div>
</div>`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
