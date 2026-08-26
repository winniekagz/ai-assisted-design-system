import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BellRing, Sparkles } from 'lucide-react';
import { Button } from './button';
import { Toast, Toaster, toast, type ToastVariant } from './toast';

const variants: ToastVariant[] = [
  'success',
  'info',
  'warning',
  'error',
  'pending',
];

const variantCopy: Record<
  ToastVariant,
  { title: string; description: string }
> = {
  default: {
    title: 'Default toast message',
    description: 'General confirmation appears here.',
  },
  success: {
    title: 'Success toast message',
    description: 'Success toast message appears here.',
  },
  info: {
    title: 'Info toast message',
    description: 'Info toast message appears here.',
  },
  warning: {
    title: 'Warning toast message',
    description: 'Warning toast message appears here.',
  },
  error: {
    title: 'Error toast message',
    description: 'Error toast message appears here.',
  },
  pending: {
    title: 'Pending toast message',
    description: 'Pending toast message appears here.',
  },
};

const meta = {
  title: 'Components/Toast',
  component: Toast,
  decorators: [
    Story => (
      <div className='min-h-[420px] p-6'>
        <Story />
        <Toaster />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Reusable Sonner toasts styled with ComponentIQ tokens. Use `Toaster` once near the app root, then call `toast({ variant, title, description, icon, colors, action })`.',
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className='grid max-w-[420px] gap-4'>
      {variants.map(variant => (
        <Toast
          key={variant}
          variant={variant}
          title={variantCopy[variant].title}
          description={variantCopy[variant].description}
        />
      ))}
    </div>
  ),
};

export const ImperativeTrigger: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      {variants.map(variant => (
        <Button
          key={variant}
          type='button'
          variant={variant === 'error' ? 'destructive' : 'outlined'}
          onClick={() =>
            toast({
              variant,
              title: variantCopy[variant].title,
              description:
                'This toast is created through the reusable Sonner API.',
            })
          }
        >
          Show {variant}
        </Button>
      ))}
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      type='button'
      variant='contained'
      onClick={() =>
        toast({
          variant: 'success',
          title: 'Invite sent',
          description: 'Winnie can now review the component library.',
          action: {
            label: 'View',
            onClick: () => {
              toast({
                variant: 'info',
                title: 'Opening invite',
                description: 'Action callbacks can run any app behavior.',
              });
            },
          },
        })
      }
    >
      Show action toast
    </Button>
  ),
};

export const CustomColorsAndIcon: Story = {
  render: () => (
    <div className='grid max-w-[420px] gap-4'>
      <Toast
        variant='default'
        title='Brand toast message'
        description='Pass an icon and shared color values for a product-specific tone.'
        icon={<Sparkles className='size-4' aria-hidden='true' />}
        colors={{
          accent: 'var(--color-secondary)',
          background: 'var(--secondary-50)',
          border:
            'color-mix(in oklab, var(--color-secondary) 22%, transparent)',
        }}
      />
      <Button
        type='button'
        variant='outlined'
        onClick={() =>
          toast({
            title: 'Custom notification',
            description:
              'The horizontal pastel/50 gradient still comes from tokens.',
            icon: <BellRing className='size-4' aria-hidden='true' />,
            colors: {
              accent: 'var(--color-secondary)',
              background: 'var(--secondary-50)',
              border:
                'color-mix(in oklab, var(--color-secondary) 22%, transparent)',
            },
          })
        }
      >
        Show custom toast
      </Button>
    </div>
  ),
};
