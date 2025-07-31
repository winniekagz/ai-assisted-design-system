'use client';

import {
  RHFAutocomplete,
  RHFCheckbox,
  RHFInput,
  RHFRadio,
  RHFSelect,
  RHFTextarea,
  type SelectOption,
} from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Phone, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Zod Schema for form validation
const userRegistrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  country: z.string().min(1, 'Please select a country'),
  gender: z.enum(['male', 'female', 'other', 'prefer-not']),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  newsletter: z.boolean(),
  terms: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),
});

type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;

// Sample data for select options
const countries: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

const interests: SelectOption[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'sports', label: 'Sports' },
  { value: 'music', label: 'Music' },
  { value: 'travel', label: 'Travel' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'reading', label: 'Reading' },
];

export function UserRegistrationForm() {
  const form = useForm<UserRegistrationFormData>({
    resolver: zodResolver(userRegistrationSchema),
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
      newsletter: false,
      terms: false,
      bio: '',
    },
  });

  const onSubmit = (data: UserRegistrationFormData) => {
    console.log('Form submitted:', data);
    // Handle form submission here
    alert('Form submitted successfully!');
  };

  return (
    <div className='max-w-2xl mx-auto p-6 space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-[color:var(--color-text-primary)]'>
          User Registration
        </h1>
        <p className='text-[color:var(--color-text-secondary)] mt-2'>
          Please fill out the form below to create your account
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Personal Information Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-[color:var(--color-text-primary)]'>
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

        {/* Address Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-[color:var(--color-text-primary)]'>
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
          <h2 className='text-xl font-semibold text-[color:var(--color-text-primary)]'>
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
            placeholder='Select your interests'
            multiple
            required
          />
        </div>

        {/* Bio Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-[color:var(--color-text-primary)]'>
            About You
          </h2>

          <RHFTextarea
            name='bio'
            label='Bio'
            placeholder='Tell us about yourself...'
            autoGrow
            required
          />
        </div>

        {/* Terms and Newsletter */}
        <div className='space-y-4'>
          <RHFCheckbox name='newsletter' label='Subscribe to our newsletter' />

          <RHFCheckbox
            name='terms'
            label='I agree to the terms and conditions'
            required
          />
        </div>

        {/* Submit Button */}
        <div className='pt-4'>
          <button
            type='submit'
            disabled={form.formState.isSubmitting}
            className='w-full bg-[color:var(--color-primary-500)] text-white py-3 px-6 rounded-lg font-medium hover:bg-[color:var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {form.formState.isSubmitting
              ? 'Creating Account...'
              : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
}
