'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { Typography } from '../ui/typography';

// Import React Hook Form components
import {
  RHFAutocomplete,
  RHFCheckbox,
  RHFDDatePicker,
  RHFInput,
  RHFRadio,
  RHFSelect,
  RHFTextarea,
  SelectOption,
} from '../form';

// Import regular form field components
import {
  Checkbox,
  DatePicker,
  Input,
  Radio,
  Select,
  Textarea,
} from '../ui/form-fields';

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Please select a country'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  newsletter: z.boolean().optional(),
  notifications: z.enum(['email', 'sms', 'push']),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
  startDate: z
    .object({
      startDate: z.date().nullable(),
      endDate: z.date().nullable(),
    })
    .optional(),
  dateRange: z
    .object({
      startDate: z.date().nullable(),
      endDate: z.date().nullable(),
    })
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

// Sample data
const countries: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'in', label: 'India' },
];

const interests: SelectOption[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
];

const notificationOptions = [
  { value: 'email', label: 'Email Notifications' },
  { value: 'sms', label: 'SMS Notifications' },
  { value: 'push', label: 'Push Notifications' },
];

export function FormDemo() {
  const [regularFormData, setRegularFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    message: '',
    newsletter: false,
    notifications: 'email',
    interests: [] as string[],
    terms: false,
    startDate: { startDate: null, endDate: null },
    dateRange: { startDate: null, endDate: null },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      message: '',
      newsletter: false,
      notifications: 'email',
      interests: [],
      terms: false,
      startDate: { startDate: null, endDate: null },
      dateRange: { startDate: null, endDate: null },
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('RHF Form Data:', data);
    alert('React Hook Form submitted successfully! Check console for data.');
  };

  const handleRegularFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Regular Form Data:', regularFormData);
    alert('Regular form submitted successfully! Check console for data.');
  };

  const handleRegularFormChange = (field: string, value: any) => {
    setRegularFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className='space-y-8 p-6'>
      <Typography variant='h3' className='mb-6'>
        Form Components Demo
      </Typography>

      {/* React Hook Form Demo */}
      <Card className='p-6'>
        <Typography variant='h4' className='mb-4'>
          React Hook Form Components
        </Typography>
        <Typography variant='body2' className='mb-6 text-muted-foreground'>
          These components are integrated with React Hook Form and include
          validation, error handling, and form state management.
        </Typography>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <RHFInput
                name='firstName'
                label='First Name'
                placeholder='Enter your first name'
                required
              />
              <RHFInput
                name='lastName'
                label='Last Name'
                placeholder='Enter your last name'
                required
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <RHFInput
                name='email'
                label='Email Address'
                type='email'
                placeholder='Enter your email'
                required
              />
              <RHFInput
                name='phone'
                label='Phone Number'
                type='tel'
                placeholder='Enter your phone number'
              />
            </div>

            <RHFSelect
              name='country'
              label='Country'
              placeholder='Select your country'
              options={countries}
              required
            />

            <RHFTextarea
              name='message'
              label='Message'
              placeholder='Enter your message (minimum 10 characters)'
              rows={4}
              required
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <RHFDDatePicker
                name='startDate'
                label='Start Date'
                placeholder='Pick a date'
                variant='single'
                required
              />
              <RHFDDatePicker
                name='dateRange'
                label='Date Range'
                placeholder='Pick a date range'
                variant='range'
                required
              />
            </div>

            <div className='space-y-4'>
              <Typography variant='h6'>Preferences</Typography>

              <RHFCheckbox name='newsletter' label='Subscribe to newsletter' />

              <div className='space-y-2'>
                <Typography variant='body2' className='font-medium'>
                  Notification Preferences
                </Typography>
                <div className='space-y-2'>
                  {notificationOptions.map(option => (
                    <RHFRadio
                      key={option.value}
                      name='notifications'
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </div>
              </div>

              <RHFAutocomplete
                name='interests'
                label='Areas of Interest'
                placeholder='Select your interests'
                options={interests}
                required
              />

              <RHFCheckbox
                name='terms'
                label='I agree to the terms and conditions'
                required
              />
            </div>

            <Button type='submit' className='w-full'>
              Submit React Hook Form
            </Button>
          </form>
        </FormProvider>
      </Card>

      <Separator />

      {/* Regular Form Fields Demo */}
      <Card className='p-6'>
        <Typography variant='h4' className='mb-4'>
          Regular Form Field Components
        </Typography>
        <Typography variant='body2' className='mb-6 text-muted-foreground'>
          These are standalone form field components that can be used without
          React Hook Form integration.
        </Typography>

        <form onSubmit={handleRegularFormSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>First Name</label>
              <Input
                value={regularFormData.firstName}
                onChange={e =>
                  handleRegularFormChange('firstName', e.target.value)
                }
                placeholder='Enter your first name'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Last Name</label>
              <Input
                value={regularFormData.lastName}
                onChange={e =>
                  handleRegularFormChange('lastName', e.target.value)
                }
                placeholder='Enter your last name'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Email Address</label>
              <Input
                type='email'
                value={regularFormData.email}
                onChange={e => handleRegularFormChange('email', e.target.value)}
                placeholder='Enter your email'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Country</label>
              <Select
                value={regularFormData.country}
                onChange={e =>
                  handleRegularFormChange('country', e.target.value)
                }
                placeholder='Select your country'
              >
                <option value=''>Select your country</option>
                {countries.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Message</label>
            <Textarea
              value={regularFormData.message}
              onChange={e => handleRegularFormChange('message', e.target.value)}
              placeholder='Enter your message'
              rows={4}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Start Date</label>
              <DatePicker
                value={regularFormData.startDate}
                onChange={value => handleRegularFormChange('startDate', value)}
                variant='single'
                placeholder='Pick a date'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Date Range</label>
              <DatePicker
                value={regularFormData.dateRange}
                onChange={value => handleRegularFormChange('dateRange', value)}
                variant='range'
                placeholder='Pick a date range'
              />
            </div>
          </div>

          <div className='space-y-4'>
            <Typography variant='h6'>Preferences</Typography>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='newsletter'
                checked={regularFormData.newsletter}
                onChange={e =>
                  handleRegularFormChange('newsletter', e.target.checked)
                }
              />
              <label htmlFor='newsletter' className='text-sm'>
                Subscribe to newsletter
              </label>
            </div>

            <div className='space-y-2'>
              <Typography variant='body2' className='font-medium'>
                Notification Preferences
              </Typography>
              <div className='space-y-2'>
                {notificationOptions.map(option => (
                  <div
                    key={option.value}
                    className='flex items-center space-x-2'
                  >
                    <Radio
                      id={option.value}
                      value={option.value}
                      checked={regularFormData.notifications === option.value}
                      onChange={e =>
                        handleRegularFormChange('notifications', e.target.value)
                      }
                    />
                    <label htmlFor={option.value} className='text-sm'>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Areas of Interest</label>
              <div className='text-sm text-muted-foreground'>
                (Autocomplete component - see RHF version for full
                functionality)
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='terms'
                checked={regularFormData.terms}
                onChange={e =>
                  handleRegularFormChange('terms', e.target.checked)
                }
              />
              <label htmlFor='terms' className='text-sm'>
                I agree to the terms and conditions
              </label>
            </div>
          </div>

          <Button type='submit' className='w-full'>
            Submit Regular Form
          </Button>
        </form>
      </Card>

      {/* DatePicker Variants Demo */}
      <Card className='p-6'>
        <Typography variant='h4' className='mb-4'>
          DatePicker Variants & States
        </Typography>
        <Typography variant='body2' className='mb-6 text-muted-foreground'>
          Examples of different DatePicker variants and configurations.
        </Typography>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Single Date Picker</label>
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Select a date'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Range Date Picker</label>
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='range'
              placeholder='Select date range'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Disabled Date Picker</label>
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Disabled picker'
              disabled
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>
              Date Picker with Min/Max
            </label>
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Select date'
              minDate={new Date()}
              maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
            />
          </div>
        </div>
      </Card>

      {/* Form Field Variants Demo */}
      <Card className='p-6'>
        <Typography variant='h4' className='mb-4'>
          Form Field Variants & States
        </Typography>
        <Typography variant='body2' className='mb-6 text-muted-foreground'>
          Examples of different input states and variants.
        </Typography>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Default Input</label>
            <Input placeholder='Default input' />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Error Input</label>
            <Input placeholder='Error state' error />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Success Input</label>
            <Input placeholder='Success state' success />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Disabled Input</label>
            <Input placeholder='Disabled input' disabled />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Small Input</label>
            <Input placeholder='Small size' size='sm' />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Large Input</label>
            <Input placeholder='Large size' size='lg' />
          </div>
        </div>
      </Card>
    </div>
  );
}
