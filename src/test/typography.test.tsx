import { Typography } from '@/components/ui/typography';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Typography Component', () => {
  it('renders with default props', () => {
    render(<Typography>Default text</Typography>);
    const element = screen.getByText('Default text');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('P');
  });

  it('renders different heading variants', () => {
    const { rerender } = render(
      <Typography variant='h1'>Heading 1</Typography>
    );
    expect(screen.getByText('Heading 1')).toHaveClass('text-[75px]');

    rerender(<Typography variant='h2'>Heading 2</Typography>);
    expect(screen.getByText('Heading 2')).toHaveClass('text-[50px]');

    rerender(<Typography variant='h3'>Heading 3</Typography>);
    expect(screen.getByText('Heading 3')).toHaveClass('text-[30px]');

    rerender(<Typography variant='h4'>Heading 4</Typography>);
    expect(screen.getByText('Heading 4')).toHaveClass('text-[21px]');

    rerender(<Typography variant='h5'>Heading 5</Typography>);
    expect(screen.getByText('Heading 5')).toHaveClass('text-[1.5em]');

    rerender(<Typography variant='h6'>Heading 6</Typography>);
    expect(screen.getByText('Heading 6')).toHaveClass('text-[1.25rem]');
  });

  it('renders body text variants', () => {
    const { rerender } = render(
      <Typography variant='body1'>Body 1</Typography>
    );
    expect(screen.getByText('Body 1')).toHaveClass('text-[1rem]');

    rerender(<Typography variant='body2'>Body 2</Typography>);
    expect(screen.getByText('Body 2')).toHaveClass('text-[0.87rem]');
  });

  it('renders specialized variants', () => {
    const { rerender } = render(
      <Typography variant='caption'>Caption</Typography>
    );
    expect(screen.getByText('Caption')).toHaveClass('text-[14px]');

    rerender(<Typography variant='small'>Small</Typography>);
    expect(screen.getByText('Small')).toHaveClass('text-[14px]');

    rerender(<Typography variant='link'>Link</Typography>);
    expect(screen.getByText('Link')).toHaveClass('text-[16px]');
  });

  it('renders display variants', () => {
    const { rerender } = render(
      <Typography variant='display1'>Display 1</Typography>
    );
    expect(screen.getByText('Display 1')).toHaveClass('text-[2.25rem]');

    rerender(<Typography variant='display2'>Display 2</Typography>);
    expect(screen.getByText('Display 2')).toHaveClass('text-[3rem]');

    rerender(<Typography variant='display3'>Display 3</Typography>);
    expect(screen.getByText('Display 3')).toHaveClass('text-[3.75rem]');
  });

  it('renders code variants', () => {
    const { rerender } = render(<Typography variant='code'>Code</Typography>);
    expect(screen.getByText('Code')).toHaveClass('font-mono');

    rerender(<Typography variant='pre'>Pre</Typography>);
    expect(screen.getByText('Pre')).toHaveClass('font-mono');
  });

  it('renders different colors', () => {
    const { rerender } = render(
      <Typography textColor='primary'>Primary</Typography>
    );
    expect(screen.getByText('Primary')).toHaveClass('text-primary');

    rerender(<Typography textColor='secondary'>Secondary</Typography>);
    expect(screen.getByText('Secondary')).toHaveClass('text-secondary');

    rerender(<Typography textColor='muted'>Muted</Typography>);
    expect(screen.getByText('Muted')).toHaveClass('text-muted-foreground');

    rerender(<Typography textColor='destructive'>Destructive</Typography>);
    expect(screen.getByText('Destructive')).toHaveClass('text-destructive');

    rerender(<Typography textColor='success'>Success</Typography>);
    expect(screen.getByText('Success')).toHaveClass('text-success-500');

    rerender(<Typography textColor='warning'>Warning</Typography>);
    expect(screen.getByText('Warning')).toHaveClass('text-warning-500');

    rerender(<Typography textColor='info'>Info</Typography>);
    expect(screen.getByText('Info')).toHaveClass('text-info-500');
  });

  it('renders different weights', () => {
    const { rerender } = render(
      <Typography weight='normal'>Normal</Typography>
    );
    expect(screen.getByText('Normal')).toHaveClass('font-normal');

    rerender(<Typography weight='medium'>Medium</Typography>);
    expect(screen.getByText('Medium')).toHaveClass('font-medium');

    rerender(<Typography weight='semibold'>Semibold</Typography>);
    expect(screen.getByText('Semibold')).toHaveClass('font-semibold');

    rerender(<Typography weight='bold'>Bold</Typography>);
    expect(screen.getByText('Bold')).toHaveClass('font-bold');
  });

  it('renders different alignments', () => {
    const { rerender } = render(<Typography align='left'>Left</Typography>);
    expect(screen.getByText('Left')).toHaveClass('text-left');

    rerender(<Typography align='center'>Center</Typography>);
    expect(screen.getByText('Center')).toHaveClass('text-center');

    rerender(<Typography align='right'>Right</Typography>);
    expect(screen.getByText('Right')).toHaveClass('text-right');

    rerender(<Typography align='justify'>Justify</Typography>);
    expect(screen.getByText('Justify')).toHaveClass('text-justify');
  });

  it('renders truncated text', () => {
    render(
      <Typography truncate>Long text that should be truncated</Typography>
    );
    expect(screen.getByText('Long text that should be truncated')).toHaveClass(
      'truncate'
    );
  });

  it('renders as custom HTML elements', () => {
    const { rerender } = render(<Typography as='span'>Span</Typography>);
    expect(screen.getByText('Span').tagName).toBe('SPAN');

    rerender(<Typography as='div'>Div</Typography>);
    expect(screen.getByText('Div').tagName).toBe('DIV');

    rerender(<Typography as='label'>Label</Typography>);
    expect(screen.getByText('Label').tagName).toBe('LABEL');
  });

  it('automatically renders correct HTML elements for variants', () => {
    const { rerender } = render(<Typography variant='h1'>Heading</Typography>);
    expect(screen.getByText('Heading').tagName).toBe('H1');

    rerender(<Typography variant='h2'>Heading</Typography>);
    expect(screen.getByText('Heading').tagName).toBe('H2');

    rerender(<Typography variant='h3'>Heading</Typography>);
    expect(screen.getByText('Heading').tagName).toBe('H3');

    rerender(<Typography variant='code'>Code</Typography>);
    expect(screen.getByText('Code').tagName).toBe('CODE');

    rerender(<Typography variant='pre'>Pre</Typography>);
    expect(screen.getByText('Pre').tagName).toBe('PRE');

    rerender(<Typography variant='body1'>Body</Typography>);
    expect(screen.getByText('Body').tagName).toBe('P');
  });

  it('applies custom className', () => {
    render(<Typography className='custom-class'>Custom</Typography>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('combines multiple props correctly', () => {
    render(
      <Typography
        variant='h1'
        textColor='primary'
        weight='bold'
        align='center'
        className='custom-class'
      >
        Combined
      </Typography>
    );

    const element = screen.getByText('Combined');
    expect(element).toHaveClass('text-[75px]');
    expect(element).toHaveClass('text-primary');
    expect(element).toHaveClass('font-bold');
    expect(element).toHaveClass('text-center');
    expect(element).toHaveClass('custom-class');
  });

  it('renders with asChild prop', () => {
    render(
      <Typography asChild>
        <a href='/test'>Link</a>
      </Typography>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('handles accessibility attributes', () => {
    render(
      <Typography
        variant='h1'
        id='title'
        aria-label='Page title'
        data-testid='typography'
      >
        Accessible
      </Typography>
    );

    const element = screen.getByTestId('typography');
    expect(element).toHaveAttribute('id', 'title');
    expect(element).toHaveAttribute('aria-label', 'Page title');
  });

  it('renders complex content', () => {
    render(
      <Typography variant='body1'>
        Text with <strong>bold</strong> and <em>italic</em> content
      </Typography>
    );

    const element = screen.getByText(/Text with/);
    expect(element).toBeInTheDocument();
    expect(element.querySelector('strong')).toHaveTextContent('bold');
    expect(element.querySelector('em')).toHaveTextContent('italic');
  });
});
