import { RHFSelect } from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const meta = {
  title: 'Form/RHF/RHFSelect',
  component: RHFSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'RHFSelect is a React Hook Form adapter for the Select component. It provides automatic form integration, validation error display, and type-safe form handling for dropdown selections.',
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
      description: 'Label text for the select field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    options: {
      control: false,
      description: 'Array of options with value and label properties',
    },
  },
} satisfies Meta<typeof RHFSelect>;

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

// Sample options for stories
const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'br', label: 'Brazil' },
];

const states = [
  { value: 'ny', label: 'New York' },
  { value: 'ca', label: 'California' },
  { value: 'tx', label: 'Texas' },
  { value: 'fl', label: 'Florida' },
  { value: 'il', label: 'Illinois' },
];

const categories = [
  { value: 'technology', label: 'Technology' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
];

// Schemas for stories
const countrySchema = z.object({
  country: z.string().min(1, 'Please select a country'),
});

const stateSchema = z.object({
  state: z.string().min(1, 'Please select a state'),
});

const categorySchema = z.object({
  category: z.string().min(1, 'Please select a category'),
});

const multiFieldSchema = z.object({
  country: z.string().min(1, 'Please select a country'),
  state: z.string().min(1, 'Please select a state'),
  category: z.string().min(1, 'Please select a category'),
});

export const Default: Story = {
  args: {
    name: 'country',
    label: 'Country',
    options: countries,
    placeholder: 'Select your country',
    required: true,
  },
  render: () => (
    <FormWrapper schema={countrySchema} defaultValues={{ country: '' }}>
      <RHFSelect
        name='country'
        label='Country'
        options={countries}
        placeholder='Select your country'
        required
      />
    </FormWrapper>
  ),
};

export const WithDefaultValue: Story = {
  args: {
    name: 'country',
    label: 'Country',
    options: countries,
    placeholder: 'Select your country',
    required: true,
  },
  render: () => (
    <FormWrapper schema={countrySchema} defaultValues={{ country: 'us' }}>
      <RHFSelect
        name='country'
        label='Country'
        options={countries}
        placeholder='Select your country'
        required
      />
    </FormWrapper>
  ),
};

export const States: Story = {
  args: {
    name: 'state',
    label: 'State',
    options: states,
    placeholder: 'Select your state',
    required: true,
  },
  render: () => (
    <FormWrapper schema={stateSchema} defaultValues={{ state: '' }}>
      <RHFSelect
        name='state'
        label='State'
        options={states}
        placeholder='Select your state'
        required
      />
    </FormWrapper>
  ),
};

export const Categories: Story = {
  args: {
    name: 'category',
    label: 'Category',
    options: categories,
    placeholder: 'Select a category',
    required: true,
  },
  render: () => (
    <FormWrapper schema={categorySchema} defaultValues={{ category: '' }}>
      <RHFSelect
        name='category'
        label='Category'
        options={categories}
        placeholder='Select a category'
        required
      />
    </FormWrapper>
  ),
};

export const Disabled: Story = {
  args: {
    name: 'country',
    label: 'Country',
    options: countries,
    placeholder: 'Select your country',
    disabled: true,
  },
  render: () => (
    <FormWrapper schema={countrySchema} defaultValues={{ country: 'us' }}>
      <RHFSelect
        name='country'
        label='Country'
        options={countries}
        placeholder='Select your country'
        disabled
      />
    </FormWrapper>
  ),
};

export const WithError: Story = {
  args: {
    name: 'country',
    label: 'Country',
    options: countries,
    placeholder: 'Select your country',
    required: true,
  },
  render: () => (
    <FormWrapper schema={countrySchema} defaultValues={{ country: '' }}>
      <RHFSelect
        name='country'
        label='Country'
        options={countries}
        placeholder='Select your country'
        formError='This is a custom error message'
        required
      />
    </FormWrapper>
  ),
};

export const MultipleFields: Story = {
  args: {
    name: 'country',
    label: 'Country',
    options: countries,
    placeholder: 'Select your country',
    required: true,
  },
  render: () => (
    <FormWrapper
      schema={multiFieldSchema}
      defaultValues={{
        country: '',
        state: '',
        category: '',
      }}
    >
      <RHFSelect
        name='country'
        label='Country'
        options={countries}
        placeholder='Select your country'
        required
      />
      <RHFSelect
        name='state'
        label='State'
        options={states}
        placeholder='Select your state'
        required
      />
      <RHFSelect
        name='category'
        label='Category'
        options={categories}
        placeholder='Select a category'
        required
      />
    </FormWrapper>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const AllVariants: Story = {
  args: {
    name: 'country',
    label: 'Country',
    options: countries,
    placeholder: 'Select your country',
  },
  render: () => (
    <div className='space-y-6 w-full max-w-md'>
      <h2 className='text-xl font-semibold'>Select Variants</h2>

      <FormWrapper schema={countrySchema} defaultValues={{ country: '' }}>
        <RHFSelect
          name='country'
          label='Default Select'
          options={countries}
          placeholder='Default variant'
        />
      </FormWrapper>

      <FormWrapper schema={countrySchema} defaultValues={{ country: 'us' }}>
        <RHFSelect
          name='country'
          label='Select with Default Value'
          options={countries}
          placeholder='With default value'
        />
      </FormWrapper>

      <FormWrapper schema={countrySchema} defaultValues={{ country: 'us' }}>
        <RHFSelect
          name='country'
          label='Disabled Select'
          options={countries}
          placeholder='Disabled state'
          disabled
        />
      </FormWrapper>

      <FormWrapper schema={countrySchema} defaultValues={{ country: '' }}>
        <RHFSelect
          name='country'
          label='Required Select'
          options={countries}
          placeholder='Required field'
          required
        />
      </FormWrapper>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const CodeExample: Story = {
  args: {
    name: 'country',
    label: 'Country',
    options: countries,
    placeholder: 'Select your country',
  },
  render: () => (
    <div className='space-y-4 w-full max-w-2xl'>
      <h2 className='text-xl font-semibold'>Code Examples</h2>

      <div className='space-y-4'>
        <div>
          <h3 className='text-lg font-medium mb-2'>Basic Usage</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`import { RHFSelect } from '@/components/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  country: z.string().min(1, 'Please select a country'),
});

const options = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
];

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { country: '' },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <RHFSelect
        name="country"
        label="Country"
        options={options}
        placeholder="Select your country"
        required
      />
    </form>
  );
}`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>With Validation</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`const schema = z.object({
  country: z.string().min(1, 'Please select a country'),
  state: z.string().min(1, 'Please select a state'),
});

<RHFSelect
  name="country"
  label="Country"
  options={countries}
  required
/>
<RHFSelect
  name="state"
  label="State"
  options={states}
  required
/>`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>With Default Value</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { country: 'us' },
});

<RHFSelect
  name="country"
  label="Country"
  options={countries}
  placeholder="Select your country"
/>`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
