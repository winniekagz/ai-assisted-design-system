import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from '@/components/ui/form-fields/checkbox';
import { RadioGroup } from '@/components/ui/form-fields/radio-group';
import { Switch } from '@/components/ui/form-fields/switch';
import DatePicker, { DatePickerValue } from '@/components/ui/form-fields/DatePicker';

const meta = {
  title: 'Components/FormFields/SettingsForm',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const planOptions = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
];

function SectionDivider() {
  return <hr className='border-[color:var(--border-subtle)]' />;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className='font-[family-name:var(--font-heading)] font-[var(--font-weight-bold)] text-[color:var(--text-title)] text-[length:var(--font-size-heading-6)]'>
      {children}
    </h3>
  );
}

function SettingsFormComponent() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
    newsletter: false,
  });

  const [plan, setPlan] = React.useState('pro');

  const [preferences, setPreferences] = React.useState({
    darkMode: false,
    autoSave: true,
    emailDigest: false,
  });

  const [dob, setDob] = React.useState<DatePickerValue>({
    startDate: null,
    endDate: null,
  });

  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className='bg-[color:var(--bg-default)] min-h-screen p-[var(--spacing-lg)]'>
      <div className='max-w-2xl mx-auto'>
        {/* Page title */}
        <h1
          className='font-[family-name:var(--font-heading)] font-[var(--font-weight-bold)] text-[color:var(--text-title)] mb-[var(--spacing-lg)]'
          style={{ fontSize: 'var(--font-size-heading-4, 1.5rem)' }}
        >
          Account Settings
        </h1>

        {/* Card */}
        <div className='bg-[color:var(--bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] p-[var(--spacing-lg)] space-y-[var(--spacing-lg)]'>

          {/* Notifications section */}
          <section className='space-y-[var(--spacing-md)]'>
            <SectionHeading>Notifications</SectionHeading>
            <p className='text-[length:var(--font-size-sm)] text-[color:var(--text-secondary)] font-[family-name:var(--font-rubik)]'>
              Choose which notifications you would like to receive.
            </p>
            <div className='space-y-[var(--spacing-sm)]'>
              <Checkbox
                label='Email notifications'
                checked={notifications.email}
                onCheckedChange={v =>
                  setNotifications(n => ({ ...n, email: v === true }))
                }
              />
              <Checkbox
                label='SMS notifications'
                checked={notifications.sms}
                onCheckedChange={v =>
                  setNotifications(n => ({ ...n, sms: v === true }))
                }
              />
              <Checkbox
                label='Push notifications'
                checked={notifications.push}
                onCheckedChange={v =>
                  setNotifications(n => ({ ...n, push: v === true }))
                }
              />
              <Checkbox
                label='Newsletter & product updates'
                checked={notifications.newsletter}
                onCheckedChange={v =>
                  setNotifications(n => ({ ...n, newsletter: v === true }))
                }
              />
            </div>
          </section>

          <SectionDivider />

          {/* Subscription plan section */}
          <section className='space-y-[var(--spacing-md)]'>
            <SectionHeading>Subscription Plan</SectionHeading>
            <p className='text-[length:var(--font-size-sm)] text-[color:var(--text-secondary)] font-[family-name:var(--font-rubik)]'>
              Select the plan that best fits your needs.
            </p>
            <RadioGroup
              options={planOptions}
              value={plan}
              onValueChange={setPlan}
            />
          </section>

          <SectionDivider />

          {/* Preferences section */}
          <section className='space-y-[var(--spacing-md)]'>
            <SectionHeading>Preferences</SectionHeading>
            <p className='text-[length:var(--font-size-sm)] text-[color:var(--text-secondary)] font-[family-name:var(--font-rubik)]'>
              Customise your experience.
            </p>
            <div className='space-y-[var(--spacing-sm)]'>
              <Switch
                label='Dark mode'
                checked={preferences.darkMode}
                onCheckedChange={v =>
                  setPreferences(p => ({ ...p, darkMode: v }))
                }
              />
              <Switch
                label='Auto-save drafts'
                checked={preferences.autoSave}
                onCheckedChange={v =>
                  setPreferences(p => ({ ...p, autoSave: v }))
                }
              />
              <Switch
                label='Weekly email digest'
                checked={preferences.emailDigest}
                onCheckedChange={v =>
                  setPreferences(p => ({ ...p, emailDigest: v }))
                }
              />
            </div>
          </section>

          <SectionDivider />

          {/* Date of Birth section */}
          <section className='space-y-[var(--spacing-md)]'>
            <SectionHeading>Date of Birth</SectionHeading>
            <p className='text-[length:var(--font-size-sm)] text-[color:var(--text-secondary)] font-[family-name:var(--font-rubik)]'>
              Used to personalise your experience and verify eligibility.
            </p>
            <div className='max-w-xs'>
              <DatePicker
                value={dob}
                onChange={setDob}
                variant='single'
                placeholder='Select date of birth'
              />
            </div>
          </section>

          <SectionDivider />

          {/* Save button */}
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={handleSave}
              className='px-[var(--spacing-lg)] py-[var(--spacing-sm)] rounded-[var(--radius-md)] font-[family-name:var(--font-rubik)] font-[var(--font-weight-medium)] text-[length:var(--font-size-sm)] transition-colors cursor-pointer'
              style={{
                backgroundColor: saved
                  ? 'var(--helper-success)'
                  : 'var(--color-primary)',
                color: 'var(--text-inverse, #fff)',
              }}
            >
              {saved ? 'Saved!' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SettingsForm: Story = {
  render: () => <SettingsFormComponent />,
};
