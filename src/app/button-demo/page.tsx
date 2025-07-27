import ButtonDemo from '@/components/examples/button-demo';

export default function ButtonDemoPage() {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-4xl font-bold mb-8'>Button Component Demo</h1>
      <p className='text-muted-foreground mb-8'>
        This demo showcases the button component with design tokens integration,
        various variants, states, and accessibility features.
      </p>

      <ButtonDemo />
    </div>
  );
}
