'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Typography } from '../ui/typography';
import {
  Autocomplete,
  Checkbox,
  DatePicker,
  Input,
  RadioGroup,
  Select,
  Textarea,
  type DatePickerValue,
} from '../ui/form-fields';

type SelectOption = {
  value: string;
  label: string;
};

const emptyDate: DatePickerValue = {
  startDate: null,
  endDate: null,
};

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
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    message: '',
    newsletter: false,
    notifications: 'email',
    interests: [] as string[],
    terms: false,
    startDate: emptyDate,
    dateRange: emptyDate,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form data:', formData);
    alert('Form submitted successfully. Check console for data.');
  };

  const updateField = <Field extends keyof typeof formData>(
    field: Field,
    value: (typeof formData)[Field]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className='space-y-8 p-6'>
      <div>
        <Typography variant='h3'>Form Components Demo</Typography>
        <Typography variant='body2' className='mt-2 text-muted-foreground'>
          Standalone fields composed with local React state and ComponentIQ
          semantic tokens.
        </Typography>
      </div>

      <Card className='p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>First Name</label>
              <Input
                value={formData.firstName}
                onChange={event => updateField('firstName', event.target.value)}
                placeholder='Enter your first name'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Last Name</label>
              <Input
                value={formData.lastName}
                onChange={event => updateField('lastName', event.target.value)}
                placeholder='Enter your last name'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Email Address</label>
              <Input
                type='email'
                value={formData.email}
                onChange={event => updateField('email', event.target.value)}
                placeholder='Enter your email'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Country</label>
              <Select
                value={formData.country}
                onChange={event => updateField('country', event.target.value)}
                placeholder='Select your country'
              >
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
              value={formData.message}
              onChange={event => updateField('message', event.target.value)}
              placeholder='Enter your message'
              rows={4}
            />
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Start Date</label>
              <DatePicker
                value={formData.startDate}
                onChange={value => updateField('startDate', value)}
                variant='single'
                placeholder='Pick a date'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Date Range</label>
              <DatePicker
                value={formData.dateRange}
                onChange={value => updateField('dateRange', value)}
                variant='range'
                placeholder='Pick a date range'
              />
            </div>
          </div>

          <div className='space-y-4'>
            <Typography variant='h6'>Preferences</Typography>

            <Checkbox
              id='newsletter'
              checked={formData.newsletter}
              onChange={event =>
                updateField('newsletter', event.target.checked)
              }
              label='Subscribe to newsletter'
            />

            <div className='space-y-2'>
              <Typography variant='body2' className='font-medium'>
                Notification Preferences
              </Typography>
              <div className='space-y-2'>
                <RadioGroup
                  options={notificationOptions}
                  value={formData.notifications}
                  onValueChange={v => updateField('notifications', v)}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Areas of Interest</label>
              <Autocomplete
                options={interests}
                placeholder='Select your interests'
                multiple
                selectedValues={formData.interests}
                onSelectedValuesChange={value =>
                  updateField('interests', value)
                }
              />
            </div>

            <Checkbox
              id='terms'
              checked={formData.terms}
              onChange={event => updateField('terms', event.target.checked)}
              label='I agree to the terms and conditions'
              required
            />
          </div>

          <Button type='submit' className='w-full'>
            Submit Form
          </Button>
        </form>
      </Card>

      <Card className='p-6'>
        <Typography variant='h4' className='mb-4'>
          Form Field Variants & States
        </Typography>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
            <label className='text-sm font-medium'>Restricted Date</label>
            <DatePicker
              value={emptyDate}
              onChange={() => {}}
              variant='single'
              placeholder='Next 30 days'
              minDate={new Date()}
              maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Read Only Date</label>
            <DatePicker
              value={{ startDate: new Date(), endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Read only'
              readOnly
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
