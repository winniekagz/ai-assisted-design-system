import { RHFInput } from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Lock, Mail, Phone, User } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const meta = {
  title: 'Form/RHF/RHFInput',
  component: RHFInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'RHFInput is a React Hook Form adapter for the Input component. It provides automatic form integration, validation error display, and type-safe form handling.',
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
      description: 'Label text for the input field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'tel', 'url', 'number'],
      description: 'Input type',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    startIcon: {
      control: false,
      description: 'Icon to display at the start of the input',
    },
    endIcon: {
      control: false,
      description: 'Icon to display at the end of the input',
    },
  },
} satisfies Meta<typeof RHFInput>;

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

// Basic schema for stories
const basicSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Email schema for stories
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Password schema for stories
const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Phone schema for stories
const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

// Multiple fields schema
const multiFieldSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export const Default: Story = {
  args: {
    name: 'name',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
  },
  render: () => (
    <FormWrapper schema={basicSchema} defaultValues={{ name: '' }}>
      <RHFInput
        name='name'
        label='Full Name'
        placeholder='Enter your full name'
        required
      />
    </FormWrapper>
  ),
};

export const WithIcon: Story = {
  args: {
    name: 'name',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
  },
  render: () => (
    <FormWrapper schema={basicSchema} defaultValues={{ name: '' }}>
      <RHFInput
        name='name'
        label='Full Name'
        placeholder='Enter your full name'
        startIcon={<User className='h-4 w-4' />}
        required
      />
    </FormWrapper>
  ),
};

export const EmailInput: Story = {
  args: {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email address',
    required: true,
  },
  render: () => (
    <FormWrapper schema={emailSchema} defaultValues={{ email: '' }}>
      <RHFInput
        name='email'
        label='Email Address'
        type='email'
        placeholder='Enter your email address'
        startIcon={<Mail className='h-4 w-4' />}
        required
      />
    </FormWrapper>
  ),
};

export const PasswordInput: Story = {
  args: {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
  render: () => (
    <FormWrapper schema={passwordSchema} defaultValues={{ password: '' }}>
      <RHFInput
        name='password'
        label='Password'
        type='password'
        placeholder='Enter your password'
        startIcon={<Lock className='h-4 w-4' />}
        required
      />
    </FormWrapper>
  ),
};

export const PhoneInput: Story = {
  args: {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Enter your phone number',
    required: true,
  },
  render: () => (
    <FormWrapper schema={phoneSchema} defaultValues={{ phone: '' }}>
      <RHFInput
        name='phone'
        label='Phone Number'
        type='tel'
        placeholder='Enter your phone number'
        startIcon={<Phone className='h-4 w-4' />}
        required
      />
    </FormWrapper>
  ),
};

export const Disabled: Story = {
  args: {
    name: 'name',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    disabled: true,
  },
  render: () => (
    <FormWrapper schema={basicSchema} defaultValues={{ name: 'John Doe' }}>
      <RHFInput
        name='name'
        label='Full Name'
        placeholder='Enter your full name'
        disabled
      />
    </FormWrapper>
  ),
};

export const WithError: Story = {
  args: {
    name: 'name',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
  },
  render: () => (
    <FormWrapper schema={basicSchema} defaultValues={{ name: '' }}>
      <RHFInput
        name='name'
        label='Full Name'
        placeholder='Enter your full name'
        formError='This is a custom error message'
        required
      />
    </FormWrapper>
  ),
};

export const MultipleFields: Story = {
  args: {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter first name',
    required: true,
  },
  render: () => (
    <FormWrapper
      schema={multiFieldSchema}
      defaultValues={{
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      }}
    >
      <div className='grid grid-cols-2 gap-4'>
        <RHFInput
          name='firstName'
          label='First Name'
          placeholder='Enter first name'
          startIcon={<User className='h-4 w-4' />}
          required
        />
        <RHFInput
          name='lastName'
          label='Last Name'
          placeholder='Enter last name'
          startIcon={<User className='h-4 w-4' />}
          required
        />
      </div>
      <RHFInput
        name='email'
        label='Email Address'
        type='email'
        placeholder='Enter your email address'
        startIcon={<Mail className='h-4 w-4' />}
        required
      />
      <RHFInput
        name='phone'
        label='Phone Number'
        type='tel'
        placeholder='Enter your phone number'
        startIcon={<Phone className='h-4 w-4' />}
        required
      />
    </FormWrapper>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const WithEndIcon: Story = {
  args: {
    name: 'name',
    label: 'Search',
    placeholder: 'Search for something...',
  },
  render: () => (
    <FormWrapper schema={basicSchema} defaultValues={{ name: '' }}>
      <RHFInput
        name='name'
        label='Search'
        placeholder='Search for something...'
        endIcon={<Mail className='h-4 w-4' />}
        onEndIconClick={() => console.log('End icon clicked')}
      />
    </FormWrapper>
  ),
};

export const AllVariants: Story = {
  args: {
    name: 'name',
    label: 'Default Input',
    placeholder: 'Default variant',
  },
  render: () => (
    <div className='space-y-6 w-full max-w-md'>
      <h2 className='text-xl font-semibold'>Input Variants</h2>

      <FormWrapper schema={basicSchema} defaultValues={{ name: '' }}>
        <RHFInput
          name='name'
          label='Default Input'
          placeholder='Default variant'
        />
      </FormWrapper>

      <FormWrapper schema={basicSchema} defaultValues={{ name: '' }}>
        <RHFInput
          name='name'
          label='Input with Icon'
          placeholder='With start icon'
          startIcon={<User className='h-4 w-4' />}
        />
      </FormWrapper>

      <FormWrapper schema={basicSchema} defaultValues={{ name: '' }}>
        <RHFInput
          name='name'
          label='Disabled Input'
          placeholder='Disabled state'
          disabled
        />
      </FormWrapper>

      <FormWrapper schema={basicSchema} defaultValues={{ name: '' }}>
        <RHFInput
          name='name'
          label='Required Input'
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
