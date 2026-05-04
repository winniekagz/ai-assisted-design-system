import { Button } from '@/components/ui/button';
import { fireEvent, render, screen } from '@testing-library/react';
import { Download, Heart } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders different variants', () => {
    const { rerender } = render(<Button variant='contained'>Contained</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');

    rerender(<Button variant='outlined'>Outlined</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-border');

    rerender(<Button variant='text'>Text</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Button size='sm'>Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8');

    rerender(<Button size='default'>Default</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-[30px]', 'py-[10px]');

    rerender(<Button size='lg'>Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  it('renders with start icon', () => {
    render(<Button startIcon={<Download />}>Download</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Download');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with end icon', () => {
    render(<Button endIcon={<Heart />}>Like</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Like');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with both icons', () => {
    render(
      <Button startIcon={<Download />} endIcon={<Heart />}>
        Download & Like
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Download & Like');
    const icons = button.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
  });

  it('renders full width', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not trigger click when loading', () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Loading
      </Button>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders as child element', () => {
    render(
      <Button asChild>
        <a href='/test'>Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies custom className', () => {
    render(<Button className='custom-class'>Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders icon only button', () => {
    render(
      <Button size='icon' aria-label='Settings'>
        <Download />
      </Button>
    );

    const button = screen.getByRole('button', { name: /settings/i });
    expect(button).toHaveClass('h-9', 'w-9');
  });

  it('supports backward compatibility with leftIcon/rightIcon', () => {
    render(
      <Button leftIcon={<Download />} rightIcon={<Heart />}>
        Backward Compatible
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Backward Compatible');
    const icons = button.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
  });

  it('handles accessibility attributes', () => {
    render(
      <Button
        aria-label='Custom label'
        aria-describedby='description'
        aria-pressed='false'
      >
        Accessible
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom label');
    expect(button).toHaveAttribute('aria-describedby', 'description');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
});
