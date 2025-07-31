import { RHFTextarea } from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FileText, MessageSquare, User } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const meta = {
  title: 'Form/RHF/RHFTextarea',
  component: RHFTextarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'RHFTextarea is a React Hook Form adapter for the Textarea component. It provides automatic form integration, validation error display, and type-safe form handling for multi-line text inputs.',
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
      description: 'Label text for the textarea field',
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
    autoGrow: {
      control: 'boolean',
      description: 'Whether the textarea should grow with content',
    },
    startIcon: {
      control: false,
      description: 'Icon to display at the start of the textarea',
    },
    endIcon: {
      control: false,
      description: 'Icon to display at the end of the textarea',
    },
  },
} satisfies Meta<typeof RHFTextarea>;

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
const bioSchema = z.object({
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),
});

const messageSchema = z.object({
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

const descriptionSchema = z.object({
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

const multiFieldSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

export const Default: Story = {
  args: {
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    required: true,
  },
  render: () => (
    <FormWrapper schema={bioSchema} defaultValues={{ bio: '' }}>
      <RHFTextarea
        name='bio'
        label='Bio'
        placeholder='Tell us about yourself...'
        required
      />
    </FormWrapper>
  ),
};

export const WithIcon: Story = {
  args: {
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    required: true,
  },
  render: () => (
    <FormWrapper schema={bioSchema} defaultValues={{ bio: '' }}>
      <RHFTextarea
        name='bio'
        label='Bio'
        placeholder='Tell us about yourself...'
        startIcon={<User className='h-4 w-4' />}
        required
      />
    </FormWrapper>
  ),
};

export const MessageTextarea: Story = {
  args: {
    name: 'message',
    label: 'Message',
    placeholder: 'Enter your message...',
    required: true,
  },
  render: () => (
    <FormWrapper schema={messageSchema} defaultValues={{ message: '' }}>
      <RHFTextarea
        name='message'
        label='Message'
        placeholder='Enter your message...'
        startIcon={<MessageSquare className='h-4 w-4' />}
        required
      />
    </FormWrapper>
  ),
};

export const DescriptionTextarea: Story = {
  args: {
    name: 'description',
    label: 'Description',
    placeholder: 'Provide a detailed description...',
    required: true,
  },
  render: () => (
    <FormWrapper schema={descriptionSchema} defaultValues={{ description: '' }}>
      <RHFTextarea
        name='description'
        label='Description'
        placeholder='Provide a detailed description...'
        startIcon={<FileText className='h-4 w-4' />}
        required
      />
    </FormWrapper>
  ),
};

export const WithDefaultValue: Story = {
  args: {
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    required: true,
  },
  render: () => (
    <FormWrapper
      schema={bioSchema}
      defaultValues={{
        bio: 'I am a software developer with 5 years of experience...',
      }}
    >
      <RHFTextarea
        name='bio'
        label='Bio'
        placeholder='Tell us about yourself...'
        required
      />
    </FormWrapper>
  ),
};

export const AutoGrow: Story = {
  args: {
    name: 'bio',
    label: 'Bio',
    placeholder:
      'Tell us about yourself... (this textarea will grow with content)',
    autoGrow: true,
    required: true,
  },
  render: () => (
    <FormWrapper schema={bioSchema} defaultValues={{ bio: '' }}>
      <RHFTextarea
        name='bio'
        label='Bio'
        placeholder='Tell us about yourself... (this textarea will grow with content)'
        autoGrow
        required
      />
    </FormWrapper>
  ),
};

export const Disabled: Story = {
  args: {
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    disabled: true,
  },
  render: () => (
    <FormWrapper
      schema={bioSchema}
      defaultValues={{
        bio: 'This is a disabled textarea with pre-filled content.',
      }}
    >
      <RHFTextarea
        name='bio'
        label='Bio'
        placeholder='Tell us about yourself...'
        disabled
      />
    </FormWrapper>
  ),
};

export const WithError: Story = {
  args: {
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    formError: 'This is a custom error message',
    required: true,
  },
  render: () => (
    <FormWrapper schema={bioSchema} defaultValues={{ bio: '' }}>
      <RHFTextarea
        name='bio'
        label='Bio'
        placeholder='Tell us about yourself...'
        formError='This is a custom error message'
        required
      />
    </FormWrapper>
  ),
};

export const MultipleFields: Story = {
  args: {
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    required: true,
  },
  render: () => (
    <FormWrapper
      schema={multiFieldSchema}
      defaultValues={{
        bio: '',
        message: '',
        description: '',
      }}
    >
      <RHFTextarea
        name='bio'
        label='Bio'
        placeholder='Tell us about yourself...'
        startIcon={<User className='h-4 w-4' />}
        required
      />
      <RHFTextarea
        name='message'
        label='Message'
        placeholder='Enter your message...'
        startIcon={<MessageSquare className='h-4 w-4' />}
        required
      />
      <RHFTextarea
        name='description'
        label='Description'
        placeholder='Provide a detailed description...'
        startIcon={<FileText className='h-4 w-4' />}
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
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
  },
  render: () => (
    <div className='space-y-6 w-full max-w-md'>
      <h2 className='text-xl font-semibold'>Textarea Variants</h2>

      <FormWrapper schema={bioSchema} defaultValues={{ bio: '' }}>
        <RHFTextarea
          name='bio'
          label='Default Textarea'
          placeholder='Default variant'
        />
      </FormWrapper>

      <FormWrapper schema={bioSchema} defaultValues={{ bio: '' }}>
        <RHFTextarea
          name='bio'
          label='Textarea with Icon'
          placeholder='With start icon'
          startIcon={<User className='h-4 w-4' />}
        />
      </FormWrapper>

      <FormWrapper
        schema={bioSchema}
        defaultValues={{ bio: 'Pre-filled content' }}
      >
        <RHFTextarea
          name='bio'
          label='Textarea with Default Value'
          placeholder='With default value'
        />
      </FormWrapper>

      <FormWrapper
        schema={bioSchema}
        defaultValues={{ bio: 'Disabled content' }}
      >
        <RHFTextarea
          name='bio'
          label='Disabled Textarea'
          placeholder='Disabled state'
          disabled
        />
      </FormWrapper>

      <FormWrapper schema={bioSchema} defaultValues={{ bio: '' }}>
        <RHFTextarea
          name='bio'
          label='Auto-grow Textarea'
          placeholder='This will grow with content'
          autoGrow
        />
      </FormWrapper>

      <FormWrapper schema={bioSchema} defaultValues={{ bio: '' }}>
        <RHFTextarea
          name='bio'
          label='Required Textarea'
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
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    required: true,
  },
  render: () => (
    <div className='space-y-4 w-full max-w-2xl'>
      <h2 className='text-xl font-semibold'>Code Examples</h2>

      <div className='space-y-4'>
        <div>
          <h3 className='text-lg font-medium mb-2'>Basic Usage</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`import { RHFTextarea } from '@/components/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { bio: '' },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <RHFTextarea
        name="bio"
        label="Bio"
        placeholder="Tell us about yourself..."
        required
      />
    </form>
  );
}`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>With Icon</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`import { User } from 'lucide-react';

<RHFTextarea
  name="bio"
  label="Bio"
  placeholder="Tell us about yourself..."
  startIcon={<User className="h-4 w-4" />}
  required
/>`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>Auto-grow Textarea</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`<RHFTextarea
  name="bio"
  label="Bio"
  placeholder="This will grow with content..."
  autoGrow
  required
/>`}
          </pre>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>With Validation</h3>
          <pre className='bg-gray-100 p-4 rounded text-sm overflow-x-auto'>
            {`const schema = z.object({
  bio: z.string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

<RHFTextarea name="bio" label="Bio" required />
<RHFTextarea name="message" label="Message" required />`}
          </pre>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
