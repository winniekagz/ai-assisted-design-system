import { Container } from '@/components/ui/container';
import { Typography } from '../ui/typography';
import { T } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';

export function ContainerExample() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant='h4' className='mb-4 font-bold'>
        Container Component Examples
      </Typography>

      {/* Basic Usage */}
      <section style={{ marginBottom: '40px' }}>
        <Typography variant='h5' className='mb-2'>
          Basic Usage (Default Settings)
        </Typography>
        <Container>
          <div
            style={{
              padding: '8px',
              background: '#f0f0f0',
              borderRadius: '4px',
            }}
          >
            Default container with white background, 16px gap, 2px padding, 10px
            radius
          </div>
          <div
            style={{
              padding: '8px',
              background: '#f0f0f0',
              borderRadius: '4px',
            }}
          >
            No border, no shadow, fit width
          </div>
        </Container>
      </section>

      {/* Full Width */}
      <section style={{ marginBottom: '40px' }}>
        <Typography variant='h5' className='mb-2'>
          Full Width Container
        </Typography>
        <Container width='full' padding={16}>
          <div
            style={{
              padding: '8px',
              background: '#e3f2fd',
              borderRadius: '4px',
            }}
          >
            This container takes the full width of its parent
          </div>
          <div
            style={{
              padding: '8px',
              background: '#e3f2fd',
              borderRadius: '4px',
            }}
          >
            Useful for layout containers and sections
          </div>
        </Container>
      </section>

      {/* Different Variants */}
      <section style={{ marginBottom: '40px' }}>
        <Typography variant='h5' className='mb-2'>
          Background Variants
        </Typography>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Container variant='white' bordered={true} padding={12} radius={8}>
            <div style={{ padding: '4px' }}>White Background</div>
          </Container>

          <Container
            variant='transparent'
            bordered={true}
            padding={12}
            radius={8}
          >
            <div style={{ padding: '4px' }}>Transparent Background</div>
          </Container>

          <Container variant='gray' bordered={true} padding={12} radius={8}>
            <div style={{ padding: '4px' }}>Gray Background</div>
          </Container>

          <Container variant='primary' padding={12} radius={8}>
            <div style={{ padding: '4px', color: 'white' }}>
              Primary Background
            </div>
          </Container>

          <Container variant='secondary' padding={12} radius={8}>
            <div style={{ padding: '4px', color: 'white' }}>
              Secondary Background
            </div>
          </Container>
        </div>
      </section>

      {/* Custom Spacing */}
      <section style={{ marginBottom: '40px' }}>
        <Typography variant='h5' className='mb-2'>
          Custom Spacing
        </Typography>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Container gap={8} padding={8} radius={8}>
            <div
              style={{
                padding: '4px',
                background: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              Small Gap (8px)
            </div>
            <div
              style={{
                padding: '4px',
                background: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              Small Padding (8px)
            </div>
          </Container>

          <Container gap={32} padding={20} radius={16}>
            <div
              style={{
                padding: '4px',
                background: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              Large Gap (32px)
            </div>
            <div
              style={{
                padding: '4px',
                background: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              Large Padding (20px)
            </div>
          </Container>
        </div>
      </section>

      {/* With Border and Shadow */}
      <section style={{ marginBottom: '40px' }}>
        <Typography variant='h5' className='mb-2'>
          With Border and Shadow
        </Typography>
        <Container
          width='full'
          bordered={true}
          shadowed={true}
          padding={16}
          radius={12}
        >
          <div
            style={{
              padding: '8px',
              background: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            This container has a border and shadow for enhanced visual depth
          </div>
          <div
            style={{
              padding: '8px',
              background: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            Perfect for cards, modals, and elevated content
          </div>
        </Container>
      </section>

      {/* Interactive Example */}
      <section style={{ marginBottom: '40px' }}>
        <Typography variant='h5' className='mb-2'>
          Interactive Container
        </Typography>
        <Container
          width='full'
          bordered={true}
          shadowed={true}
          padding={16}
          radius={12}
          className='hover:shadow-lg transition-shadow cursor-pointer'
        >
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '16px',
              marginBottom: '8px',
            }}
          >
            Interactive Container
          </div>
          <div style={{ color: '#666', marginBottom: '8px' }}>
            Hover over this container to see the shadow effect
          </div>
          <div
            style={{
              padding: '8px',
              background: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            Click me for interaction!
          </div>
        </Container>
      </section>

      {/* Nested Containers */}
      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}
        >
          Nested Containers
        </h2>
        <Container width='full' gap={16} padding={16}>
          <Container width='fit' variant='gray' gap={8} padding={8} radius={8}>
            <div style={{ padding: '4px' }}>Nested Container 1</div>
          </Container>
          <Container
            width='fit'
            variant='primary'
            gap={8}
            padding={8}
            radius={8}
          >
            <div style={{ padding: '4px', color: 'white' }}>
              Nested Container 2
            </div>
          </Container>
          <Container
            width='fit'
            variant='secondary'
            gap={8}
            padding={8}
            radius={8}
          >
            <div style={{ padding: '4px', color: 'white' }}>
              Nested Container 3
            </div>
          </Container>
        </Container>
      </section>
    </div>
  );
}
