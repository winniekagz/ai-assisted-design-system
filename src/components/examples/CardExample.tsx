import { Card, CardContent, CardHeader } from '../ui/card';
import { Typography } from '../ui/typography';

export function CardExample() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant='h4' className='mb-4 font-bold'>
        Card
      </Typography>

      {/* Basic Usage */}
      <section style={{ marginBottom: '40px' }}>
        <Typography variant='h5' className='mb-2'>
          Basic Usage (Default Settings)
        </Typography>
        <Card>
          <CardHeader>
            <Typography variant={'display1'} className='text-secondary-400'>
              Card Header
            </Typography>
          </CardHeader>
          <CardContent className='p-4 flex gap-2'>
            <img
              src='https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg'
              alt='Placeholder'
              width={100}
              height={100}
            />
            <Typography variant={'body1'}>This is a person</Typography>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
