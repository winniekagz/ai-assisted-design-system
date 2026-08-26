import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  type InputOTPSize,
} from '@/components/ui/form-fields/input-otp';

function OTPSlots({ length = 6 }: { length?: number }) {
  return (
    <InputOTPGroup>
      {Array.from({ length }, (_, index) => (
        <InputOTPSlot key={index} index={index} />
      ))}
    </InputOTPGroup>
  );
}

function SplitOTPSlots() {
  return (
    <>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </>
  );
}

function ResendOTPExample() {
  const [value, setValue] = React.useState('126973');

  return (
    <div className='grid gap-[var(--spacing-sm)]'>
      <InputOTP
        aria-label='One-time passcode'
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={value}
        onChange={setValue}
      >
        <OTPSlots />
      </InputOTP>
      <p className='text-[length:var(--font-size-xs)] leading-[var(--line-height-snug)] text-[color:var(--text-muted)] [font-family:var(--font-rubik)]'>
        Resend available:{' '}
        <button
          type='button'
          className='font-[var(--font-weight-medium)] text-[color:var(--helper-link)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]'
        >
          Resend OTP
        </button>
      </p>
    </div>
  );
}

function ControlledOTPExample() {
  const [value, setValue] = React.useState('');

  return (
    <InputOTP
      label='Verification code'
      helperText={
        value.length === 6 ? 'Code complete.' : 'Enter the 6 digit code.'
      }
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      value={value}
      onChange={setValue}
      onComplete={() => undefined}
    >
      <OTPSlots />
    </InputOTP>
  );
}

function PrefilledOTPExample({
  value,
  error,
  success,
  helperText,
  disabled,
}: {
  value: string;
  error?: boolean;
  success?: boolean;
  helperText?: string;
  disabled?: boolean;
}) {
  const [code, setCode] = React.useState(value);

  return (
    <InputOTP
      label='Verification code'
      error={error}
      success={success}
      helperText={helperText}
      disabled={disabled}
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      value={code}
      onChange={setCode}
    >
      <OTPSlots />
    </InputOTP>
  );
}

function VariantShowcase({
  title,
  variants,
}: {
  title: string;
  variants: Array<{ label: string; code: string; node: React.ReactNode }>;
}) {
  const [sel, setSel] = React.useState(0);

  return (
    <div className='w-full space-y-[var(--spacing-md)]'>
      <h2 className='text-[length:var(--font-size-heading-6)] font-[var(--font-weight-bold)] text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
        {title}
      </h2>
      <div className='grid grid-cols-1 gap-[var(--spacing-sm)] sm:grid-cols-2'>
        {variants.map((v, i) => (
          <div
            key={v.label}
            role='button'
            tabIndex={0}
            aria-pressed={sel === i}
            onClick={() => setSel(i)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSel(i);
              }
            }}
            className={`flex flex-col items-start gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border p-[var(--spacing-md)] text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] ${
              sel === i
                ? 'border-[color:var(--color-primary)] bg-[color:var(--bg-hover)]'
                : 'border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] hover:bg-[color:var(--bg-hover)]'
            }`}
          >
            <span className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] [font-family:var(--font-rubik)]'>
              {v.label}
            </span>
            <div className='w-full' onClick={event => event.stopPropagation()}>
              {v.node}
            </div>
          </div>
        ))}
      </div>
      <div className='rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--bg-secondary)] p-[var(--spacing-md)]'>
        <p className='mb-[var(--spacing-sm)] text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] [font-family:var(--font-rubik)]'>
          {variants[sel].label}
        </p>
        <pre className='overflow-x-auto whitespace-pre-wrap font-mono text-[length:var(--font-size-xs)] text-[color:var(--text-paragraph)]'>
          <code>{variants[sel].code}</code>
        </pre>
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/FormFields/InputOTP',
  component: InputOTP,
  parameters: {
    layout: 'padded',
    docs: {
      story: {
        inline: false,
        iframeHeight: 220,
      },
      source: {
        type: 'dynamic',
        language: 'tsx',
      },
      canvas: {
        sourceState: 'shown',
      },
      description: {
        component: `
Token-driven one-time-password input built on \`input-otp\`, following the shadcn Input OTP composition model. It uses the same field API as ComponentIQ Input: \`label\`, \`helperText\`, \`error\`, \`success\`, \`required\`, \`disabled\`, and \`size\`.

### When to use
- Entering short verification codes, login codes, recovery codes, or PINs.
- When users may paste a full code from email, SMS, or an authenticator.
- Use a normal **Input** for longer free-form text.

### Usage
\`\`\`tsx
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from 'componentiq';

<InputOTP
  label="Verification code"
  helperText="Enter the 6 digit code."
  maxLength={6}
  pattern={REGEXP_ONLY_DIGITS}
>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`label\` | string | — | Renders a \`<label>\` wired to the hidden OTP input |
| \`helperText\` | string | — | Hint or validation message below the slots |
| \`error\` | boolean | false | Red slots + helper text + \`aria-invalid\` |
| \`success\` | boolean | false | Green slots + helper text |
| \`required\` | boolean | false | Adds a red \`*\` to the label and native required attribute |
| \`size\` | \`"sm" \\| "default" \\| "lg"\` | "default" | Slot size: 36 / 44 / 48 px |
| \`maxLength\` | number | Required | Number of OTP characters |
| \`pattern\` | string | — | Use \`REGEXP_ONLY_DIGITS\` or \`REGEXP_ONLY_DIGITS_AND_CHARS\` |
| \`value\` / \`onChange\` | string / function | — | Controlled value support |
| \`onComplete\` | function | — | Fires when all slots are filled |

### Accessibility
- Built on \`input-otp\`, which provides a real input for keyboard, screen reader, paste, and password-manager support.
- \`label\` is connected with \`htmlFor\` and generated \`id\` when needed.
- \`aria-describedby\` links helper text to the field.
- \`aria-invalid="true"\` is applied to the input and visible slots in error state.
- Slots are visual mirrors of the input value; users still interact with one accessible OTP input.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label rendered above the OTP slots.',
      table: { type: { summary: 'string' } },
    },
    helperText: {
      control: 'text',
      description: 'Helper or validation message shown below the OTP slots.',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Slot size. Matches the Input size scale.',
      table: {
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: "'default'" },
      },
    },
    error: {
      control: 'boolean',
      description: 'Shows error styling and sets `aria-invalid="true"`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    success: {
      control: 'boolean',
      description: 'Shows success styling.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Marks the OTP input as required.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the OTP input.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maxLength: {
      control: 'number',
      description: 'Number of OTP characters.',
      table: { type: { summary: 'number' } },
    },
    pattern: {
      control: 'text',
      description:
        'Input pattern. Use the exported regex helpers for common cases.',
      table: { type: { summary: 'string' } },
    },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    label: 'Verification code',
    helperText: 'Enter the 6 digit code.',
    maxLength: 6,
    pattern: REGEXP_ONLY_DIGITS,
  },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <VariantShowcase
      title='Input OTP'
      variants={[
        {
          label: 'Default',
          code: `<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
          node: (
            <InputOTP
              aria-label='One-time passcode'
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
            >
              <OTPSlots />
            </InputOTP>
          ),
        },
        {
          label: 'With label and helper',
          code: `<InputOTP label="Verification code" helperText="Enter the 6 digit code." maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
          node: (
            <InputOTP
              label='Verification code'
              helperText='Enter the 6 digit code.'
              maxLength={6}
            >
              <OTPSlots />
            </InputOTP>
          ),
        },
        {
          label: 'Resend footer',
          code: `<InputOTP aria-label="One-time passcode" maxLength={6} value={value} onChange={setValue}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
<p>Resend available: <button type="button">Resend OTP</button></p>`,
          node: <ResendOTPExample />,
        },
        {
          label: 'Separated groups',
          code: `<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
          node: (
            <InputOTP aria-label='One-time passcode' maxLength={6}>
              <SplitOTPSlots />
            </InputOTP>
          ),
        },
        {
          label: 'Error',
          code: `<InputOTP label="Verification code" error helperText="Code is incorrect." maxLength={6} value={value} onChange={setValue}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
          node: (
            <PrefilledOTPExample
              value='000000'
              error
              helperText='Code is incorrect.'
            />
          ),
        },
        {
          label: 'Success',
          code: `<InputOTP label="Verification code" success helperText="Code verified." maxLength={6} value={value} onChange={setValue}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
          node: (
            <PrefilledOTPExample
              value='126973'
              success
              helperText='Code verified.'
            />
          ),
        },
      ]}
    />
  ),
  decorators: [
    Story => (
      <div className='w-full max-w-4xl'>
        <Story />
      </div>
    ),
  ],
};

const fieldDecorator = [
  (Story: React.ComponentType) => (
    <div className='w-[min(480px,calc(100vw-32px))]'>
      <Story />
    </div>
  ),
];

export const Default: Story = {
  decorators: fieldDecorator,
  render: args => (
    <InputOTP {...args}>
      <OTPSlots />
    </InputOTP>
  ),
};

export const ResendFooter: Story = {
  decorators: fieldDecorator,
  render: () => <ResendOTPExample />,
};

export const Controlled: Story = {
  decorators: fieldDecorator,
  render: () => <ControlledOTPExample />,
};

export const ErrorState: Story = {
  decorators: fieldDecorator,
  render: () => (
    <PrefilledOTPExample value='000000' error helperText='Code is incorrect.' />
  ),
};

export const SuccessState: Story = {
  decorators: fieldDecorator,
  render: () => (
    <PrefilledOTPExample value='126973' success helperText='Code verified.' />
  ),
};

export const Disabled: Story = {
  decorators: fieldDecorator,
  render: () => (
    <PrefilledOTPExample
      value='126973'
      disabled
      helperText='This code cannot be edited.'
    />
  ),
};

export const Small: Story = {
  decorators: fieldDecorator,
  render: args => (
    <InputOTP {...args} size={'sm' satisfies InputOTPSize}>
      <OTPSlots />
    </InputOTP>
  ),
};

export const Large: Story = {
  decorators: fieldDecorator,
  render: args => (
    <InputOTP {...args} size={'lg' satisfies InputOTPSize}>
      <OTPSlots />
    </InputOTP>
  ),
};

export const Alphanumeric: Story = {
  decorators: fieldDecorator,
  render: args => (
    <InputOTP
      {...args}
      helperText='Letters and numbers are accepted.'
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
    >
      <OTPSlots />
    </InputOTP>
  ),
};
