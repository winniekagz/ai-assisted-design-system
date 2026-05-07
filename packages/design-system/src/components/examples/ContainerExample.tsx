import { Container } from '@/components/ui/container';
import { Typography } from '../ui/typography';

function ExampleBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className='rounded-[var(--radius-sm)] bg-[color:var(--bg-secondary)] p-[var(--spacing-sm)] text-[color:var(--text-paragraph)]'>
      {children}
    </div>
  );
}

export function ContainerExample() {
  return (
    <div className='mx-auto max-w-[800px] p-[var(--spacing-lg)]'>
      <Typography variant='h4' className='mb-[var(--spacing-md)] font-bold'>
        Container Component Examples
      </Typography>

      <section className='mb-[var(--spacing-2xl)]'>
        <Typography variant='h5' className='mb-[var(--spacing-sm)]'>
          Basic Usage
        </Typography>
        <Container>
          <ExampleBlock>
            Default token surface, gap, padding, and radius.
          </ExampleBlock>
          <ExampleBlock>No border, no shadow, fit width.</ExampleBlock>
        </Container>
      </section>

      <section className='mb-[var(--spacing-2xl)]'>
        <Typography variant='h5' className='mb-[var(--spacing-sm)]'>
          Full Width Container
        </Typography>
        <Container width='full' padding='md'>
          <ExampleBlock>
            This container takes the full width of its parent.
          </ExampleBlock>
          <ExampleBlock>
            Useful for layout containers and sections.
          </ExampleBlock>
        </Container>
      </section>

      <section className='mb-[var(--spacing-2xl)]'>
        <Typography variant='h5' className='mb-[var(--spacing-sm)]'>
          Background Variants
        </Typography>
        <div className='flex flex-wrap gap-[var(--spacing-md)]'>
          <Container variant='surface' bordered padding='sm' radius='md'>
            Surface
          </Container>
          <Container variant='transparent' bordered padding='sm' radius='md'>
            Transparent
          </Container>
          <Container variant='secondary' bordered padding='sm' radius='md'>
            Secondary
          </Container>
          <Container variant='primary' padding='sm' radius='md'>
            Primary
          </Container>
        </div>
      </section>

      <section className='mb-[var(--spacing-2xl)]'>
        <Typography variant='h5' className='mb-[var(--spacing-sm)]'>
          Token Spacing
        </Typography>
        <div className='flex flex-wrap gap-[var(--spacing-md)]'>
          <Container gap='sm' padding='sm' radius='md'>
            <ExampleBlock>Small gap</ExampleBlock>
            <ExampleBlock>Small padding</ExampleBlock>
          </Container>
          <Container gap='xl' padding='lg' radius='xl'>
            <ExampleBlock>Large gap</ExampleBlock>
            <ExampleBlock>Large padding</ExampleBlock>
          </Container>
        </div>
      </section>

      <section className='mb-[var(--spacing-2xl)]'>
        <Typography variant='h5' className='mb-[var(--spacing-sm)]'>
          With Border and Shadow
        </Typography>
        <Container width='full' bordered shadowed padding='md' radius='lg'>
          <ExampleBlock>
            This container has token-driven border and shadow treatment.
          </ExampleBlock>
          <ExampleBlock>
            Useful for cards, modals, and elevated content.
          </ExampleBlock>
        </Container>
      </section>
    </div>
  );
}
