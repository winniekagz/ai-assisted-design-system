import { Typography } from '@/components/ui/typography';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive typography component with multiple variants, colors, weights, and alignment options using design tokens.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'body1',
        'body2',
        'caption',
        'small',
        'link',
        'display1',
        'display2',
        'display3',
        'code',
        'pre',
      ],
      description: 'The typography variant to use',
    },
    textColor: {
      control: { type: 'select' },
      options: [
        'default',
        'primary',
        'secondary',
        'muted',
        'destructive',
        'success',
        'warning',
        'info',
      ],
      description: 'The text color variant',
    },
    weight: {
      control: { type: 'select' },
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'The font weight',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
      description: 'The text alignment',
    },
    truncate: {
      control: { type: 'boolean' },
      description: 'Whether to truncate text with ellipsis',
    },
    as: {
      control: { type: 'select' },
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'span',
        'div',
        'code',
        'pre',
        'label',
        'a',
      ],
      description: 'The HTML element to render as',
    },
    children: {
      control: 'text',
      description: 'Typography content',
    },
  },
  args: {
    children: 'Typography Example',
    variant: 'body1',
    textColor: 'default',
    weight: 'normal',
    align: 'left',
    truncate: false,
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

// Heading Variants
export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Heading 1 - Main Page Title',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Heading 2 - Section Title',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Heading 3 - Subsection Title',
  },
};

export const Heading4: Story = {
  args: {
    variant: 'h4',
    children: 'Heading 4 - Card Title',
  },
};

export const Heading5: Story = {
  args: {
    variant: 'h5',
    children: 'Heading 5 - Small Title',
  },
};

export const Heading6: Story = {
  args: {
    variant: 'h6',
    children: 'Heading 6 - Caption Title',
  },
};

// Body Text Variants
export const Body1: Story = {
  args: {
    variant: 'body1',
    children:
      'Body 1 - This is the primary body text used for most content. It provides good readability and is suitable for paragraphs, descriptions, and general content.',
  },
};

export const Body2: Story = {
  args: {
    variant: 'body2',
    children:
      "Body 2 - This is secondary body text, slightly smaller than body1. It's perfect for supporting text, captions, and less prominent content.",
  },
};

// Specialized Variants
export const Caption: Story = {
  args: {
    variant: 'caption',
    children:
      'Caption - This is caption text used for labels, metadata, and small supporting information.',
  },
};

export const Small: Story = {
  args: {
    variant: 'small',
    children:
      'Small - This is small text used for fine print, legal text, and very detailed information.',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children:
      'Link Text - This is styled as a clickable link with hover effects.',
  },
};

// Display Variants
export const Display1: Story = {
  args: {
    variant: 'display1',
    children: 'Display 1 - Large display text for hero sections',
  },
};

export const Display2: Story = {
  args: {
    variant: 'display2',
    children: 'Display 2 - Extra large display text',
  },
};

export const Display3: Story = {
  args: {
    variant: 'display3',
    children: 'Display 3 - Massive display text',
  },
};

// Code Variants
export const Code: Story = {
  args: {
    variant: 'code',
    children: 'const example = "code snippet";',
  },
};

export const Pre: Story = {
  args: {
    variant: 'pre',
    children: `function example() {
  console.log("This is a code block");
  return "Hello World";
}`,
  },
};

// Color Variants
export const PrimaryColor: Story = {
  args: {
    variant: 'body1',
    textColor: 'primary',
    children: 'Primary colored text using the primary color token.',
  },
};

export const SecondaryColor: Story = {
  args: {
    variant: 'body1',
    textColor: 'secondary',
    children: 'Secondary colored text using the secondary color token.',
  },
};

export const MutedColor: Story = {
  args: {
    variant: 'body1',
    textColor: 'muted',
    children: 'Muted colored text for less prominent content.',
  },
};

export const DestructiveColor: Story = {
  args: {
    variant: 'body1',
    textColor: 'destructive',
    children: 'Destructive colored text for error messages and warnings.',
  },
};

export const SuccessColor: Story = {
  args: {
    variant: 'body1',
    textColor: 'success',
    children: 'Success colored text for positive feedback and confirmations.',
  },
};

export const WarningColor: Story = {
  args: {
    variant: 'body1',
    textColor: 'warning',
    children: 'Warning colored text for cautionary messages.',
  },
};

export const InfoColor: Story = {
  args: {
    variant: 'body1',
    textColor: 'info',
    children: 'Info colored text for informational content.',
  },
};

// Weight Variants
export const NormalWeight: Story = {
  args: {
    variant: 'body1',
    weight: 'normal',
    children: 'Normal weight text (400)',
  },
};

export const MediumWeight: Story = {
  args: {
    variant: 'body1',
    weight: 'medium',
    children: 'Medium weight text (500)',
  },
};

export const SemiboldWeight: Story = {
  args: {
    variant: 'body1',
    weight: 'semibold',
    children: 'Semibold weight text (600)',
  },
};

export const BoldWeight: Story = {
  args: {
    variant: 'body1',
    weight: 'bold',
    children: 'Bold weight text (700)',
  },
};

// Alignment Variants
export const LeftAlign: Story = {
  args: {
    variant: 'body1',
    align: 'left',
    children:
      'Left aligned text. This is the default alignment for most content.',
  },
};

export const CenterAlign: Story = {
  args: {
    variant: 'body1',
    align: 'center',
    children:
      'Center aligned text. Perfect for headings and call-to-action text.',
  },
};

export const RightAlign: Story = {
  args: {
    variant: 'body1',
    align: 'right',
    children:
      'Right aligned text. Often used for numbers, dates, and metadata.',
  },
};

export const JustifyAlign: Story = {
  args: {
    variant: 'body1',
    align: 'justify',
    children:
      'Justified text creates even margins on both sides. This is useful for longer paragraphs and formal documents where you want a clean, uniform appearance.',
  },
};

// Truncate Example
export const TruncatedText: Story = {
  args: {
    variant: 'body1',
    truncate: true,
    children:
      'This is a very long text that will be truncated with an ellipsis when it exceeds the container width. This demonstrates the truncate functionality.',
  },
};

// Complex Example with Custom Element
export const CustomElement: Story = {
  args: {
    variant: 'body1',
    as: 'label',
    children: 'This text is rendered as a label element but styled as body1.',
  },
};

// All Variants Grid
export const AllVariants: Story = {
  render: () => (
    <div className='space-y-8 max-w-4xl'>
      <div className='space-y-4'>
        <Typography variant='h1'>Heading 1</Typography>
        <Typography variant='h2'>Heading 2</Typography>
        <Typography variant='h3'>Heading 3</Typography>
        <Typography variant='h4'>Heading 4</Typography>
        <Typography variant='h5'>Heading 5</Typography>
        <Typography variant='h6'>Heading 6</Typography>
      </div>

      <div className='space-y-4'>
        <Typography variant='display1'>Display 1</Typography>
        <Typography variant='display2'>Display 2</Typography>
        <Typography variant='display3'>Display 3</Typography>
      </div>

      <div className='space-y-4'>
        <Typography variant='body1'>
          Body 1 - This is the primary body text used for most content. It
          provides good readability and is suitable for paragraphs,
          descriptions, and general content.
        </Typography>
        <Typography variant='body2'>
          Body 2 - This is secondary body text, slightly smaller than body1.
          It's perfect for supporting text, captions, and less prominent
          content.
        </Typography>
      </div>

      <div className='space-y-4'>
        <Typography variant='caption'>Caption text</Typography>
        <Typography variant='small'>Small text</Typography>
        <Typography variant='link'>Link text</Typography>
      </div>

      <div className='space-y-4'>
        <Typography variant='code'>const example = "code snippet";</Typography>
        <Typography variant='pre'>
          {`function example() {
  console.log("This is a code block");
  return "Hello World";
}`}
        </Typography>
      </div>
    </div>
  ),
};

// Color Palette
export const ColorPalette: Story = {
  render: () => (
    <div className='space-y-4 max-w-2xl'>
      <Typography variant='h3'>Typography Color Palette</Typography>
      <Typography variant='body1' textColor='default'>
        Default color text
      </Typography>
      <Typography variant='body1' textColor='primary'>
        Primary color text
      </Typography>
      <Typography variant='body1' textColor='secondary'>
        Secondary color text
      </Typography>
      <Typography variant='body1' textColor='muted'>
        Muted color text
      </Typography>
      <Typography variant='body1' textColor='destructive'>
        Destructive color text
      </Typography>
      <Typography variant='body1' textColor='success'>
        Success color text
      </Typography>
      <Typography variant='body1' textColor='warning'>
        Warning color text
      </Typography>
      <Typography variant='body1' textColor='info'>
        Info color text
      </Typography>
    </div>
  ),
};
