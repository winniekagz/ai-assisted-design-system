import { Typography } from '@/components/ui/typography';

export function TypographyUsage() {
  return (
    <div className='space-y-8 max-w-4xl mx-auto p-6'>
      {/* Page Header */}
      <div className='space-y-4'>
        <Typography variant='h1' align='center'>
          Welcome to Our Platform
        </Typography>
        <Typography variant='body1' align='center' textColor='muted'>
          A comprehensive guide to using our typography system
        </Typography>
      </div>

      {/* Section Headers */}
      <section className='space-y-4'>
        <Typography variant='h2'>Getting Started</Typography>
        <Typography variant='body1'>
          This example demonstrates how to use the Typography component
          effectively in your applications. The component provides consistent
          text styling across your entire application using design tokens.
        </Typography>
        <Typography variant='body2' textColor='muted'>
          Each variant is designed to serve a specific purpose in your content
          hierarchy.
        </Typography>
      </section>

      {/* Content Sections */}
      <section className='space-y-4'>
        <Typography variant='h3'>Content Structure</Typography>

        <Typography variant='h4'>Primary Content</Typography>
        <Typography variant='body1'>
          This is your primary body text. It should be used for most content
          including paragraphs, descriptions, and general text. The body1
          variant provides excellent readability and is perfect for longer
          content.
        </Typography>

        <Typography variant='h4'>Supporting Content</Typography>
        <Typography variant='body2' textColor='muted'>
          This is secondary body text, slightly smaller than body1. It's perfect
          for supporting text, captions, and less prominent content that still
          needs to be readable.
        </Typography>
      </section>

      {/* Interactive Elements */}
      <section className='space-y-4'>
        <Typography variant='h3'>Interactive Elements</Typography>

        <Typography variant='link' as='a' href='#'>
          This is a link styled with the link variant
        </Typography>

        <Typography variant='body1'>
          You can also use the{' '}
          <Typography variant='link' as='a' href='#'>
            link variant inline
          </Typography>{' '}
          within other text.
        </Typography>
      </section>

      {/* Code Examples */}
      <section className='space-y-4'>
        <Typography variant='h3'>Code Examples</Typography>

        <Typography variant='body1'>
          Here's an example of inline code:
        </Typography>
        <Typography variant='code'>const example = "typography";</Typography>

        <Typography variant='body1'>And here's a code block:</Typography>
        <Typography variant='pre'>
          {`import { Typography } from '@/components/ui/typography';

function Example() {
  return (
    <Typography variant="h1">
      Hello World
    </Typography>
  );
}`}
        </Typography>
      </section>

      {/* Color Examples */}
      <section className='space-y-4'>
        <Typography variant='h3'>Color Variants</Typography>

        <div className='space-y-2'>
          <Typography variant='body1' textColor='default'>
            Default colored text
          </Typography>
          <Typography variant='body1' textColor='primary'>
            Primary colored text
          </Typography>
          <Typography variant='body1' textColor='secondary'>
            Secondary colored text
          </Typography>
          <Typography variant='body1' textColor='muted'>
            Muted colored text
          </Typography>
          <Typography variant='body1' textColor='destructive'>
            Destructive colored text
          </Typography>
          <Typography variant='body1' textColor='success'>
            Success colored text
          </Typography>
          <Typography variant='body1' textColor='warning'>
            Warning colored text
          </Typography>
          <Typography variant='body1' textColor='info'>
            Info colored text
          </Typography>
        </div>
      </section>

      {/* Weight Examples */}
      <section className='space-y-4'>
        <Typography variant='h3'>Font Weights</Typography>

        <div className='space-y-2'>
          <Typography variant='body1' weight='normal'>
            Normal weight text (400)
          </Typography>
          <Typography variant='body1' weight='medium'>
            Medium weight text (500)
          </Typography>
          <Typography variant='body1' weight='semibold'>
            Semibold weight text (600)
          </Typography>
          <Typography variant='body1' weight='bold'>
            Bold weight text (700)
          </Typography>
        </div>
      </section>

      {/* Alignment Examples */}
      <section className='space-y-4'>
        <Typography variant='h3'>Text Alignment</Typography>

        <div className='space-y-2'>
          <Typography variant='body1' align='left'>
            Left aligned text (default)
          </Typography>
          <Typography variant='body1' align='center'>
            Center aligned text
          </Typography>
          <Typography variant='body1' align='right'>
            Right aligned text
          </Typography>
          <Typography variant='body1' align='justify'>
            Justified text creates even margins on both sides. This is useful
            for longer paragraphs and formal documents where you want a clean,
            uniform appearance.
          </Typography>
        </div>
      </section>

      {/* Display Text */}
      <section className='space-y-4'>
        <Typography variant='h3'>Display Text</Typography>

        <div className='space-y-4'>
          <Typography variant='display1'>
            Display 1 - Large display text
          </Typography>
          <Typography variant='display2'>
            Display 2 - Extra large display text
          </Typography>
          <Typography variant='display3'>
            Display 3 - Massive display text
          </Typography>
        </div>
      </section>

      {/* Truncation Example */}
      <section className='space-y-4'>
        <Typography variant='h3'>Text Truncation</Typography>

        <div className='w-64 border p-4'>
          <Typography variant='body1' truncate>
            This is a very long text that will be truncated with an ellipsis
            when it exceeds the container width. This demonstrates the truncate
            functionality.
          </Typography>
        </div>
      </section>

      {/* Custom Elements */}
      <section className='space-y-4'>
        <Typography variant='h3'>Custom HTML Elements</Typography>

        <div className='space-y-2'>
          <Typography variant='body1' as='label'>
            This text is rendered as a label element
          </Typography>
          <Typography variant='body1' as='span'>
            This text is rendered as a span element
          </Typography>
          <Typography variant='h4' as='div'>
            This heading is rendered as a div element
          </Typography>
        </div>
      </section>

      {/* Responsive Example */}
      <section className='space-y-4'>
        <Typography variant='h3'>Responsive Design</Typography>

        <Typography variant='body1'>
          The Typography component works seamlessly across all screen sizes. The
          design tokens ensure consistent spacing and sizing regardless of the
          device or viewport.
        </Typography>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Typography variant='h4'>Mobile</Typography>
            <Typography variant='body2' textColor='muted'>
              Optimized for small screens with appropriate sizing
            </Typography>
          </div>
          <div>
            <Typography variant='h4'>Desktop</Typography>
            <Typography variant='body2' textColor='muted'>
              Enhanced readability on larger displays
            </Typography>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className='space-y-4'>
        <Typography variant='h3'>Best Practices</Typography>

        <div className='space-y-4'>
          <div>
            <Typography variant='h4'>Semantic HTML</Typography>
            <Typography variant='body1'>
              The component automatically renders appropriate semantic HTML
              elements. Use h1-h6 for headings and body1/body2 for paragraphs.
            </Typography>
          </div>

          <div>
            <Typography variant='h4'>Accessibility</Typography>
            <Typography variant='body1'>
              Maintain proper heading hierarchy and use semantic colors for
              their intended purpose. The component supports all standard HTML
              attributes.
            </Typography>
          </div>

          <div>
            <Typography variant='h4'>Consistency</Typography>
            <Typography variant='body1'>
              Use the design tokens consistently across your application. The
              Typography component ensures your text styling remains uniform.
            </Typography>
          </div>
        </div>
      </section>
    </div>
  );
}
