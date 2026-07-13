import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  type ToastVariant,
} from './toast';

const variants: ToastVariant[] = ['info', 'success', 'warning', 'error'];

const meta = {
  title: 'Components/Toast',
  component: Toast,
  decorators: [
    Story => (
      <ToastProvider>
        <div className='min-h-80 p-6'>
          <Story />
        </div>
        <ToastViewport />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className='grid max-w-md gap-3'>
      {variants.map(variant => (
        <Toast key={variant} variant={variant} defaultOpen>
          <div className='min-w-0'>
            <ToastTitle>{variant[0].toUpperCase() + variant.slice(1)} toast</ToastTitle>
            <ToastDescription>
              Concise feedback for a low-risk asynchronous action.
            </ToastDescription>
          </div>
          <ToastClose aria-label='Dismiss notification' />
        </Toast>
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
              title: `${variant[0].toUpperCase() + variant.slice(1)} notification`,
              description: 'This toast is created through the imperative API.',
            })
          }
        >
          Show {variant}
        </Button>
      ))}
    </div>
  ),
};
