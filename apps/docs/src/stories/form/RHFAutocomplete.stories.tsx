import { RHFAutocomplete } from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const meta = {
  title: 'Form/RHF/RHFAutocomplete',
  component: RHFAutocomplete,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'RHFAutocomplete is a React Hook Form adapter for the Autocomplete component. It provides automatic form integration, validation error display, and type-safe form handling for searchable dropdown inputs.',
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
      description: 'Label text for the autocomplete field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple selections are allowed',
    },
    options: {
      control: false,
      description: 'Array of options with value and label properties',
    },
  },
} satisfies Meta<typeof RHFAutocomplete>;

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
  { value: 'in', label: 'India' },
  { value: 'cn', label: 'China' },
];

const technologies = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'gatsby', label: 'Gatsby' },
  { value: 'remix', label: 'Remix' },
];

const interests = [
  { value: 'technology', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'music', label: 'Music' },
  { value: 'travel', label: 'Travel' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'reading', label: 'Reading' },
  { value: 'photography', label: 'Photography' },
  { value: 'art', label: 'Art' },
];

// Schemas for stories
const singleSelectionSchema = z.object({
  country: z.string().min(1, 'Please select a country'),
});

const multipleSelectionSchema = z.object({
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
});

const technologySchema = z.object({
  technologies: z
    .array(z.string())
    .min(1, 'Please select at least one technology'),
});

const multiFieldSchema = z.object({
  country: z.string().min(1, 'Please select a country'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  technologies: z
    .array(z.string())
    .min(1, 'Please select at least one technology'),
});

export const Default: Story = {
  args: {
    name: 'country',
    label: 'Country',
    options: countries,
    placeholder: 'Search for a country...',
  },
  render: () => (
    <FormWrapper schema={singleSelectionSchema} defaultValues={{ country: '' }}>
      <RHFAutocomplete
        name='country'
        label='Country'
        options={countries}
        placeholder='Search for a country...'
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
    placeholder: 'Search for a country...',
  },
  render: () => (
    <FormWrapper
      schema={singleSelectionSchema}
      defaultValues={{ country: 'us' }}
    >
      <RHFAutocomplete
        name='country'
        label='Country'
        options={countries}
        placeholder='Search for a country...'
        required
      />
    </FormWrapper>
  ),
};

export const MultipleSelection: Story = {
  args: {
    name: 'interests',
    label: 'Interests',
    options: interests,
    placeholder: 'Select your interests...',
    multiple: true,
  },
  render: () => (
    <FormWrapper
      schema={multipleSelectionSchema}
      defaultValues={{ interests: [] }}
    >
      <RHFAutocomplete
        name='interests'
        label='Interests'
        options={interests}
        placeholder='Select your interests...'
        multiple
        required
      />
    </FormWrapper>
  ),
};

export const Technologies: Story = {
  args: {
    name: 'technologies',
    label: 'Technologies',
    options: technologies,
    placeholder: 'Select technologies you know...',
    multiple: true,
  },
  render: () => (
    <FormWrapper schema={technologySchema} defaultValues={{ technologies: [] }}>
      <RHFAutocomplete
        name='technologies'
        label='Technologies'
        options={technologies}
        placeholder='Select technologies you know...'
        multiple
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
    placeholder: 'Search for a country...',
    disabled: true,
  },
  render: () => (
    <FormWrapper
      schema={singleSelectionSchema}
      defaultValues={{ country: 'us' }}
    >
      <RHFAutocomplete
        name='country'
        label='Country'
        options={countries}
        placeholder='Search for a country...'
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
    placeholder: 'Search for a country...',
  },
  render: () => (
    <FormWrapper schema={singleSelectionSchema} defaultValues={{ country: '' }}>
      <RHFAutocomplete
        name='country'
        label='Country'
        options={countries}
        placeholder='Search for a country...'
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
    placeholder: 'Search for a country...',
  },
  render: () => (
    <FormWrapper
      schema={multiFieldSchema}
      defaultValues={{
        country: '',
        interests: [],
        technologies: [],
      }}
    >
      <RHFAutocomplete
        name='country'
        label='Country'
        options={countries}
        placeholder='Search for a country...'
        required
      />
      <RHFAutocomplete
        name='interests'
        label='Interests'
        options={interests}
        placeholder='Select your interests...'
        multiple
        required
      />
      <RHFAutocomplete
        name='technologies'
        label='Technologies'
        options={technologies}
        placeholder='Select technologies you know...'
        multiple
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
    placeholder: 'Search for a country...',
  },
  render: () => (
    <div className='space-y-6 w-full max-w-md'>
      <h2 className='text-xl font-semibold'>Autocomplete Variants</h2>

      <FormWrapper
        schema={singleSelectionSchema}
        defaultValues={{ country: '' }}
      >
        <RHFAutocomplete
          name='country'
          label='Single Selection'
          options={countries}
          placeholder='Default variant'
        />
      </FormWrapper>

      <FormWrapper
        schema={singleSelectionSchema}
        defaultValues={{ country: 'us' }}
      >
        <RHFAutocomplete
          name='country'
          label='With Default Value'
          options={countries}
          placeholder='With default value'
        />
      </FormWrapper>

      <FormWrapper
        schema={multipleSelectionSchema}
        defaultValues={{ interests: [] }}
      >
        <RHFAutocomplete
          name='interests'
          label='Multiple Selection'
          options={interests}
          placeholder='Multiple selection'
          multiple
        />
      </FormWrapper>

      <FormWrapper
        schema={singleSelectionSchema}
        defaultValues={{ country: 'us' }}
      >
        <RHFAutocomplete
          name='country'
          label='Disabled Autocomplete'
          options={countries}
          placeholder='Disabled state'
          disabled
        />
      </FormWrapper>

      <FormWrapper
        schema={singleSelectionSchema}
        defaultValues={{ country: '' }}
      >
        <RHFAutocomplete
          name='country'
          label='Required Autocomplete'
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
    placeholder: 'Search for a country...',
  },
  render: () => (
    <div className='space-y-4 w-full max-w-2xl'>
      <h2 className='text-xl font-semibold'>Code Examples</h2>

      <div className='space-y-4'>
        <div>
          <h3 className='text-lg font-medium mb-2'>Basic Usage</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`import { RHFAutocomplete } from '@/components/form';
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
      <RHFAutocomplete
        name="country"
        label="Country"
        options={options}
        placeholder="Search for a country..."
        required
      />
    </form>
  );
}`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>Multiple Selection</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`const schema = z.object({
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { interests: [] },
});

<RHFAutocomplete
  name="interests"
  label="Interests"
  options={interests}
  placeholder="Select your interests..."
  multiple
  required
/>`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>With Default Values</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { 
    country: 'us',
    interests: ['technology', 'sports'],
  },
});

<RHFAutocomplete
  name="country"
  label="Country"
  options={countries}
  placeholder="Search for a country..."
/>
<RHFAutocomplete
  name="interests"
  label="Interests"
  options={interests}
  placeholder="Select your interests..."
  multiple
/>`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>Complex Validation</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`const schema = z.object({
  country: z.string().min(1, 'Please select a country'),
  interests: z.array(z.string())
    .min(1, 'Please select at least one interest')
    .max(3, 'You can select up to 3 interests'),
  technologies: z.array(z.string())
    .min(1, 'Please select at least one technology'),
});

<RHFAutocomplete name="country" label="Country" options={countries} required />
<RHFAutocomplete name="interests" label="Interests" options={interests} multiple required />
<RHFAutocomplete name="technologies" label="Technologies" options={technologies} multiple required />`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
