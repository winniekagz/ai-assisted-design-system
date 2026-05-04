import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ComponentIqProvider,
  Input,
  Typography,
  type ComponentIqTokens,
} from '../index';

const meta = {
  title: 'Design System/ComponentIqProvider',
  component: ComponentIqProvider,
  parameters: {
    docs: {
      description: {
        component:
          'Use ComponentIqProvider to pass custom design tokens into the component library. Tokens are converted to CSS variables that existing components consume.',
      },
    },
  },
} satisfies Meta<typeof ComponentIqProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

const sampleTokens: ComponentIqTokens = {
  colors: {
    primary: '#0F766E',
    primaryForeground: '#FFFFFF',
    secondary: '#2563EB',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    secondaryBackground: '#E0F2FE',
    foreground: '#0F172A',
    muted: '#475569',
    border: '#CBD5E1',
    focus: '#0F766E',
    success: '#15803D',
    warning: '#B45309',
    destructive: '#B91C1C',
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    headingFontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },
  radius: {
    md: '10px',
    lg: '16px',
  },
};

export const CustomTokens: Story = {
  render: () => (
    <ComponentIqProvider
      tokens={sampleTokens}
      className='min-h-screen bg-background p-6'
    >
      <Card className='max-w-xl border border-border bg-card'>
        <CardHeader>
          <CardTitle>
            <Typography variant='h4'>Custom brand tokens</Typography>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Typography variant='body1'>
            This preview is using custom color, radius, and font tokens from
            ComponentIqProvider.
          </Typography>
          <Input placeholder='Designer email' />
          <div className='flex flex-wrap gap-2'>
            <Badge status='success'>Approved</Badge>
            <Badge status='pending'>Needs review</Badge>
          </div>
          <Button>Save token set</Button>
        </CardContent>
      </Card>
    </ComponentIqProvider>
  ),
};
