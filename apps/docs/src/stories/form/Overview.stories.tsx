import React from 'react';

import {
  RHFAutocomplete,
  RHFCheckbox,
  RHFInput,
  RHFRadio,
  RHFSelect,
  RHFTextarea,
} from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Mail, MapPin, MessageSquare, Phone, User } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const meta = {
  title: 'Form/RHF/Overview',
  component: RHFInput, // Using RHFInput as the main component for the overview
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'This overview demonstrates all React Hook Form components working together in a comprehensive form. It shows how to integrate multiple field types with proper validation and styling.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RHFInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Comprehensive schema for the overview form
const overviewSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),

  // Address Information
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  country: z.string().min(1, 'Please select a country'),

  // Preferences
  gender: z.enum(['male', 'female', 'other', 'prefer-not']),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),

  // Additional Information
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),

  // Terms and Preferences
  newsletter: z.boolean(),
  marketing: z.boolean(),
  terms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
});

type OverviewFormData = z.infer<typeof overviewSchema>;

// Sample data
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

// Form wrapper component
const OverviewFormWrapper = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<OverviewFormData>({
    resolver: zodResolver(overviewSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      gender: 'prefer-not',
      interests: [],
      bio: '',
      newsletter: false,
      marketing: false,
      terms: false,
    },
  });

  const onSubmit = (data: OverviewFormData) => {
    console.log('Form submitted:', data);
    alert('Form submitted successfully! Check the console for data.');
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full max-w-2xl space-y-6'
      >
        {children}
        <div className='pt-4'>
          <button
            type='submit'
            disabled={form.formState.isSubmitting}
            className='w-full bg-[color:var(--color-primary-500)] text-white py-3 px-6 rounded-lg font-medium hover:bg-[color:var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {form.formState.isSubmitting
              ? 'Submitting...'
              : 'Submit Application'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export const CompleteForm: Story = {
  args: {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
  },
  render: () => (
    <div className='w-full max-w-4xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-[color:var(--color-text-primary)] mb-2'>
          Complete Application Form
        </h1>
        <p className='text-[color:var(--color-text-secondary)]'>
          This form demonstrates all React Hook Form components working together
        </p>
      </div>

      <OverviewFormWrapper>
        {/* Personal Information Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-[color:var(--color-text-primary)] border-b pb-2'>
            Personal Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <RHFInput
              name='firstName'
              label='First Name'
              placeholder='Enter your first name'
              startIcon={<User className='h-4 w-4' />}
              required
            />

            <RHFInput
              name='lastName'
              label='Last Name'
              placeholder='Enter your last name'
              startIcon={<User className='h-4 w-4' />}
              required
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
          </div>
        </div>

        {/* Address Information Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-[color:var(--color-text-primary)] border-b pb-2'>
            Address Information
          </h2>

          <RHFInput
            name='address'
            label='Street Address'
            placeholder='Enter your street address'
            startIcon={<MapPin className='h-4 w-4' />}
            required
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <RHFInput
              name='city'
              label='City'
              placeholder='Enter your city'
              required
            />

            <RHFSelect
              name='country'
              label='Country'
              options={countries}
              placeholder='Select your country'
              required
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-[color:var(--color-text-primary)] border-b pb-2'>
            Preferences
          </h2>

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

          <RHFAutocomplete
            name='interests'
            label='Interests'
            options={interests}
            placeholder='Select your interests...'
            multiple
            required
          />
        </div>

        {/* Additional Information Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-[color:var(--color-text-primary)] border-b pb-2'>
            Additional Information
          </h2>

          <RHFTextarea
            name='bio'
            label='Bio'
            placeholder='Tell us about yourself...'
            startIcon={<MessageSquare className='h-4 w-4' />}
            autoGrow
            required
          />
        </div>

        {/* Terms and Preferences Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-[color:var(--color-text-primary)] border-b pb-2'>
            Terms and Preferences
          </h2>

          <div className='space-y-3'>
            <RHFCheckbox
              name='newsletter'
              label='Subscribe to our newsletter'
            />

            <RHFCheckbox
              name='marketing'
              label='Receive marketing communications'
            />

            <RHFCheckbox
              name='terms'
              label='I agree to the terms and conditions'
              required
            />
          </div>
        </div>
      </OverviewFormWrapper>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const ComponentShowcase: Story = {
  args: {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
  },
  render: () => (
    <div className='w-full max-w-4xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-[color:var(--color-text-primary)] mb-2'>
          Component Showcase
        </h1>
        <p className='text-[color:var(--color-text-secondary)]'>
          Individual examples of each RHF component
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Input Examples */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold text-[color:var(--color-text-primary)]'>
            Input Components
          </h2>

          <OverviewFormWrapper>
            <RHFInput
              name='firstName'
              label='Text Input'
              placeholder='Enter text...'
              startIcon={<User className='h-4 w-4' />}
            />

            <RHFInput
              name='email'
              label='Email Input'
              type='email'
              placeholder='Enter email...'
              startIcon={<Mail className='h-4 w-4' />}
            />

            <RHFInput
              name='phone'
              label='Phone Input'
              type='tel'
              placeholder='Enter phone...'
              startIcon={<Phone className='h-4 w-4' />}
            />
          </OverviewFormWrapper>
        </div>

        {/* Select Examples */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold text-[color:var(--color-text-primary)]'>
            Select Components
          </h2>

          <OverviewFormWrapper>
            <RHFSelect
              name='country'
              label='Single Select'
              options={countries.slice(0, 4)}
              placeholder='Select country...'
            />

            <RHFAutocomplete
              name='interests'
              label='Autocomplete (Single)'
              options={interests.slice(0, 4)}
              placeholder='Select interest...'
            />

            <RHFAutocomplete
              name='interests'
              label='Autocomplete (Multiple)'
              options={interests.slice(0, 4)}
              placeholder='Select interests...'
              multiple
            />
          </OverviewFormWrapper>
        </div>

        {/* Checkbox and Radio Examples */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold text-[color:var(--color-text-primary)]'>
            Checkbox Components
          </h2>

          <OverviewFormWrapper>
            <RHFCheckbox name='newsletter' label='Subscribe to newsletter' />

            <RHFCheckbox name='marketing' label='Receive marketing emails' />

            <RHFCheckbox name='terms' label='I agree to terms' required />
          </OverviewFormWrapper>
        </div>

        {/* Radio Examples */}
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold text-[color:var(--color-text-primary)]'>
            Radio Components
          </h2>

          <OverviewFormWrapper>
            <div className='space-y-3'>
              <label className='text-sm font-medium text-[color:var(--color-text-secondary)]'>
                Gender
              </label>
              <div className='space-y-2'>
                <RHFRadio name='gender' value='male' label='Male' />
                <RHFRadio name='gender' value='female' label='Female' />
                <RHFRadio name='gender' value='other' label='Other' />
              </div>
            </div>
          </OverviewFormWrapper>
        </div>

        {/* Textarea Examples */}
        <div className='space-y-4 lg:col-span-2'>
          <h2 className='text-lg font-semibold text-[color:var(--color-text-primary)]'>
            Textarea Components
          </h2>

          <OverviewFormWrapper>
            <RHFTextarea
              name='bio'
              label='Bio'
              placeholder='Tell us about yourself...'
              startIcon={<MessageSquare className='h-4 w-4' />}
            />

            <RHFTextarea
              name='bio'
              label='Auto-grow Textarea'
              placeholder='This textarea will grow with content...'
              autoGrow
            />
          </OverviewFormWrapper>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const CodeExamples: Story = {
  args: {
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
  },
  render: () => (
    <div className='w-full max-w-4xl mx-auto p-6 space-y-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-[color:var(--color-text-primary)] mb-2'>
          Code Examples
        </h1>
        <p className='text-[color:var(--color-text-secondary)]'>
          Complete implementation examples for different use cases
        </p>
      </div>

      <div className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold mb-4'>Basic Form Setup</h2>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  RHFInput, 
  RHFSelect, 
  RHFCheckbox, 
  RHFRadio, 
  RHFTextarea, 
  RHFAutocomplete 
} from '@/components/form';

// Define your schema
const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  country: z.string().min(1, 'Please select a country'),
  gender: z.enum(['male', 'female', 'other']),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  newsletter: z.boolean(),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      gender: 'other',
      interests: [],
      bio: '',
      newsletter: false,
      terms: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Your form fields here */}
    </form>
  );
}`}
          </pre>
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-4'>
            Complete Form Implementation
          </h2>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`return (
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    {/* Personal Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RHFInput
        name="firstName"
        label="First Name"
        placeholder="Enter your first name"
        required
      />
      <RHFInput
        name="lastName"
        label="Last Name"
        placeholder="Enter your last name"
        required
      />
    </div>

    <RHFInput
      name="email"
      label="Email Address"
      type="email"
      placeholder="Enter your email"
      required
    />

    <RHFSelect
      name="country"
      label="Country"
      options={countries}
      placeholder="Select your country"
      required
    />

    {/* Gender Selection */}
    <div className="space-y-2">
      <label className="text-sm font-medium">Gender</label>
      <RHFRadio name="gender" value="male" label="Male" />
      <RHFRadio name="gender" value="female" label="Female" />
      <RHFRadio name="gender" value="other" label="Other" />
    </div>

    <RHFAutocomplete
      name="interests"
      label="Interests"
      options={interests}
      placeholder="Select your interests..."
      multiple
      required
    />

    <RHFTextarea
      name="bio"
      label="Bio"
      placeholder="Tell us about yourself..."
      autoGrow
      required
    />

    <div className="space-y-3">
      <RHFCheckbox
        name="newsletter"
        label="Subscribe to newsletter"
      />
      <RHFCheckbox
        name="terms"
        label="I agree to the terms and conditions"
        required
      />
    </div>

    <button type="submit">Submit</button>
  </form>
);`}
          </pre>
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-4'>Advanced Patterns</h2>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`// Conditional validation
const schema = z.object({
  email: z.string().email(),
  confirmEmail: z.string(),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Emails don't match",
  path: ["confirmEmail"],
});

// Dynamic options
const [options, setOptions] = useState([]);

useEffect(() => {
  fetchOptions().then(setOptions);
}, []);

// Custom error messages
<RHFInput
  name="email"
  label="Email"
  formError="This is a custom error message"
  required
/>

// Icon integration
<RHFInput
  name="email"
  label="Email"
  startIcon={<Mail className="h-4 w-4" />}
  onStartIconClick={() => console.log('Icon clicked')}
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
