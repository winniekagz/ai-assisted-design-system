import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Clock,
  XCircle,
  CheckSquare,
  AlertCircle,
  Info,
  Star,
  Heart,
} from 'lucide-react';
import { BadgeStatusConfig } from '../types/badgw';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined', 'pastel'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: { type: 'select' },
      options: ['success', 'pending', 'error', 'completed'],
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['start', 'end'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Custom status configuration for stories
const customStatusConfig: BadgeStatusConfig = {
  success: {
    label: 'Approved',
    colors: {
      filled: { bg: 'bg-emerald-600', text: 'text-white' },
      outlined: {
        bg: 'bg-transparent',
        text: 'text-emerald-600',
        border: 'border-emerald-600',
      },
      pastel: { bg: 'bg-emerald-50', text: 'text-emerald-800' },
    },
  },
  pending: {
    label: 'In Review',
    colors: {
      filled: { bg: 'bg-amber-600', text: 'text-white' },
      outlined: {
        bg: 'bg-transparent',
        text: 'text-amber-600',
        border: 'border-amber-600',
      },
      pastel: { bg: 'bg-amber-50', text: 'text-amber-800' },
    },
  },
  error: {
    label: 'Failed',
    colors: {
      filled: { bg: 'bg-rose-600', text: 'text-white' },
      outlined: {
        bg: 'bg-transparent',
        text: 'text-rose-600',
        border: 'border-rose-600',
      },
      pastel: { bg: 'bg-rose-50', text: 'text-rose-800' },
    },
  },
  completed: {
    label: 'Done',
    colors: {
      filled: { bg: 'bg-indigo-600', text: 'text-white' },
      outlined: {
        bg: 'bg-transparent',
        text: 'text-indigo-600',
        border: 'border-indigo-600',
      },
      pastel: { bg: 'bg-indigo-50', text: 'text-indigo-800' },
    },
  },
};

export const Default: Story = {
  args: {
    children: 'Default Badge',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: 'Filled Badge',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Badge',
  },
};

export const Pastel: Story = {
  args: {
    variant: 'pastel',
    children: 'Pastel Badge',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Badge size='sm'>Small</Badge>
      <Badge size='md'>Medium</Badge>
      <Badge size='lg'>Large</Badge>
      <Badge size='xl'>Extra Large</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <Badge status='success' />
      <Badge status='pending' />
      <Badge status='error' />
      <Badge status='completed' />
    </div>
  ),
};

export const StatusWithVariants: Story = {
  render: () => (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-3'>
        <Badge status='success' variant='filled' />
        <Badge status='pending' variant='filled' />
        <Badge status='error' variant='filled' />
        <Badge status='completed' variant='filled' />
      </div>
      <div className='flex flex-wrap gap-3'>
        <Badge status='success' variant='outlined' />
        <Badge status='pending' variant='outlined' />
        <Badge status='error' variant='outlined' />
        <Badge status='completed' variant='outlined' />
      </div>
      <div className='flex flex-wrap gap-3'>
        <Badge status='success' variant='pastel' />
        <Badge status='pending' variant='pastel' />
        <Badge status='error' variant='pastel' />
        <Badge status='completed' variant='pastel' />
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-3'>
        <Badge status='success' icon={CheckCircle} />
        <Badge status='pending' icon={Clock} />
        <Badge status='error' icon={XCircle} />
        <Badge status='completed' icon={CheckSquare} />
      </div>
      <div className='flex flex-wrap gap-3'>
        <Badge status='success' icon={CheckCircle} iconPosition='end' />
        <Badge status='pending' icon={Clock} iconPosition='end' />
        <Badge status='error' icon={XCircle} iconPosition='end' />
        <Badge status='completed' icon={CheckSquare} iconPosition='end' />
      </div>
    </div>
  ),
};

export const CustomContentWithIcons: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <Badge variant='filled' icon={Star} iconPosition='start'>
        Featured
      </Badge>
      <Badge variant='outlined' icon={Heart} iconPosition='end'>
        Favorite
      </Badge>
      <Badge variant='pastel' icon={Info} iconPosition='start'>
        Information
      </Badge>
      <Badge variant='filled' icon={AlertCircle} iconPosition='end'>
        Warning
      </Badge>
    </div>
  ),
};

export const CustomStatusConfig: Story = {
  render: () => (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>Default Status Config</h3>
      <div className='flex flex-wrap gap-3'>
        <Badge status='success' variant='filled' />
        <Badge status='pending' variant='filled' />
        <Badge status='error' variant='filled' />
        <Badge status='completed' variant='filled' />
      </div>

      <h3 className='text-lg font-medium'>Custom Status Config</h3>
      <div className='flex flex-wrap gap-3'>
        <Badge
          status='success'
          variant='filled'
          statusConfig={customStatusConfig}
        />
        <Badge
          status='pending'
          variant='filled'
          statusConfig={customStatusConfig}
        />
        <Badge
          status='error'
          variant='filled'
          statusConfig={customStatusConfig}
        />
        <Badge
          status='completed'
          variant='filled'
          statusConfig={customStatusConfig}
        />
      </div>
    </div>
  ),
};

export const InteractiveExamples: Story = {
  render: () => (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      <div className='p-4 border rounded-lg'>
        <h3 className='font-medium mb-3'>Order Status</h3>
        <div className='space-y-2'>
          <Badge status='pending' icon={Clock} size='sm' />
          <Badge status='completed' icon={CheckCircle} size='sm' />
          <Badge status='error' icon={XCircle} size='sm' />
        </div>
      </div>

      <div className='p-4 border rounded-lg'>
        <h3 className='font-medium mb-3'>User Roles</h3>
        <div className='space-y-2'>
          <Badge variant='outlined' icon={CheckCircle} iconPosition='start'>
            Admin
          </Badge>
          <Badge variant='outlined' icon={Clock} iconPosition='start'>
            Moderator
          </Badge>
          <Badge variant='outlined' icon={Info} iconPosition='start'>
            User
          </Badge>
        </div>
      </div>

      <div className='p-4 border rounded-lg'>
        <h3 className='font-medium mb-3'>Priority Levels</h3>
        <div className='space-y-2'>
          <Badge variant='pastel' status='error' icon={AlertCircle}>
            High Priority
          </Badge>
          <Badge variant='pastel' status='pending' icon={Clock}>
            Medium Priority
          </Badge>
          <Badge variant='pastel' status='completed' icon={CheckCircle}>
            Low Priority
          </Badge>
        </div>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium mb-3'>Filled Variant</h3>
        <div className='flex flex-wrap gap-3'>
          <Badge variant='filled' status='success' />
          <Badge variant='filled' status='pending' />
          <Badge variant='filled' status='error' />
          <Badge variant='filled' status='completed' />
        </div>
      </div>

      <div>
        <h3 className='text-lg font-medium mb-3'>Outlined Variant</h3>
        <div className='flex flex-wrap gap-3'>
          <Badge variant='outlined' status='success' />
          <Badge variant='outlined' status='pending' />
          <Badge variant='outlined' status='error' />
          <Badge variant='outlined' status='completed' />
        </div>
      </div>

      <div>
        <h3 className='text-lg font-medium mb-3'>Pastel Variant</h3>
        <div className='flex flex-wrap gap-3'>
          <Badge variant='pastel' status='success' />
          <Badge variant='pastel' status='pending' />
          <Badge variant='pastel' status='error' />
          <Badge variant='pastel' status='completed' />
        </div>
      </div>
    </div>
  ),
};
