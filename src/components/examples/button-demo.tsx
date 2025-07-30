'use client';

import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Download,
  Heart,
  Mail,
  Plus,
  Settings,
  Star,
  Trash2,
} from 'lucide-react';

export const ButtonDemo = () => {
  return (
    <div className='p-8 space-y-8'>
      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Button Variants</h2>
        <div className='flex flex-wrap gap-4'>
          <Button variant='contained'>Contained</Button>
          <Button variant='outlined'>Outlined</Button>
          <Button variant='text'>Text</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='destructive'>Destructive</Button>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Button Sizes</h2>
        <div className='flex flex-wrap items-center gap-4'>
          <Button variant='contained' size='sm'>
            Small
          </Button>
          <Button variant='contained' size='default'>
            Default (30px × 10px)
          </Button>
          <Button variant='contained' size='lg'>
            Large
          </Button>
          <Button variant='contained' size='xl'>
            Extra Large
          </Button>
          <Button variant='contained' size='icon' aria-label='Settings'>
            <Settings />
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Button States</h2>
        <div className='flex flex-wrap gap-4'>
          <Button variant='contained'>Normal</Button>
          <Button variant='contained' disabled>
            Disabled
          </Button>
          <Button variant='contained' loading>
            Loading
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Start & End Icons</h2>
        <div className='flex flex-wrap gap-4'>
          {/* Start Icon */}
          <Button variant='contained' startIcon={<Download />}>
            Download
          </Button>

          {/* End Icon */}
          <Button variant='outlined' endIcon={<ArrowRight />}>
            Continue
          </Button>

          {/* Both Icons */}
          <Button variant='secondary' startIcon={<Mail />} endIcon={<Star />}>
            Send Email
          </Button>

          {/* Backward compatibility */}
          <Button variant='ghost' leftIcon={<Heart />} rightIcon={<Plus />}>
            Add to Favorites
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Full Width Buttons</h2>
        <div className='space-y-4 max-w-md'>
          <Button variant='contained' fullWidth>
            Full Width Contained
          </Button>
          <Button variant='outlined' fullWidth startIcon={<Download />}>
            Full Width with Icon
          </Button>
          <Button variant='text' fullWidth endIcon={<ArrowRight />}>
            Full Width Text
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Accessibility Features</h2>
        <div className='flex flex-wrap gap-4'>
          <Button
            variant='contained'
            aria-label='Add new item'
            startIcon={<Plus />}
          >
            Add Item
          </Button>
          <Button variant='outlined' aria-describedby='button-desc'>
            Submit
          </Button>
          <div id='button-desc' className='sr-only'>
            This button submits the form
          </div>
          <Button
            variant='destructive'
            aria-label='Delete item'
            startIcon={<Trash2 />}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Interactive Examples</h2>
        <div className='flex flex-wrap gap-4'>
          <Button
            variant='contained'
            onClick={() => alert('Button clicked!')}
            startIcon={<Heart />}
          >
            Like Post
          </Button>
          <Button
            variant='outlined'
            fullWidth
            onClick={() => alert('Form submitted!')}
            endIcon={<ArrowRight />}
          >
            Submit Form
          </Button>
          <Button
            variant='text'
            onClick={() => (window.location.hash = 'section')}
            aria-label='Navigate to section'
          >
            Go to Section
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Design Token Integration</h2>
        <p className='text-muted-foreground'>
          All buttons use the design tokens from tokens.css. The default size
          now uses 30px horizontal padding and 10px vertical padding as
          requested.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted rounded-lg'>
          <div className='space-y-2'>
            <h3 className='font-semibold'>Primary Colors</h3>
            <div className='flex gap-2'>
              <Button variant='contained' size='sm'>
                Primary
              </Button>
              <Button variant='outlined' size='sm'>
                Outlined
              </Button>
              <Button variant='text' size='sm'>
                Text
              </Button>
            </div>
          </div>
          <div className='space-y-2'>
            <h3 className='font-semibold'>Secondary Colors</h3>
            <div className='flex gap-2'>
              <Button variant='secondary' size='sm'>
                Secondary
              </Button>
              <Button variant='ghost' size='sm'>
                Ghost
              </Button>
            </div>
          </div>
          <div className='space-y-2'>
            <h3 className='font-semibold'>Destructive</h3>
            <div className='flex gap-2'>
              <Button variant='destructive' size='sm'>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemo;
