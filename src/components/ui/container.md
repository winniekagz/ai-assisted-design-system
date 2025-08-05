# Container Component

A highly reusable container component with customizable styling and layout options.

## Features

- **Flexible Width**: Support for full width and fit width
- **Customizable Styling**: Configurable background colors, borders, shadows, and spacing
- **Pixel-Perfect Control**: Direct control over gap, padding, and border radius in pixels
- **TypeScript Support**: Fully typed with comprehensive prop interfaces
- **Accessibility**: Proper data attributes for styling and testing

## Props

| Prop        | Type                                                             | Default   | Description                                     |
| ----------- | ---------------------------------------------------------------- | --------- | ----------------------------------------------- |
| `children`  | `React.ReactNode`                                                | -         | The content to be rendered inside the container |
| `width`     | `"full" \| "fit"`                                                | `"fit"`   | The width variant of the container              |
| `variant`   | `"white" \| "transparent" \| "gray" \| "primary" \| "secondary"` | `"white"` | The background color variant                    |
| `gap`       | `number`                                                         | `16`      | The gap between child elements in pixels        |
| `padding`   | `number`                                                         | `2`       | The padding in pixels                           |
| `radius`    | `number`                                                         | `10`      | The border radius in pixels                     |
| `bordered`  | `boolean`                                                        | `false`   | Whether to show a border                        |
| `shadowed`  | `boolean`                                                        | `false`   | Whether to show a shadow                        |
| `className` | `string`                                                         | -         | Additional CSS classes                          |

## Usage Examples

### Basic Usage

```tsx
import { Container } from '@/components/ui/container';

function MyComponent() {
  return (
    <Container>
      <div>Content 1</div>
      <div>Content 2</div>
      <div>Content 3</div>
    </Container>
  );
}
```

### Full Width Container

```tsx
<Container width='full'>
  <div>This container takes full width</div>
</Container>
```

### Custom Styling

```tsx
<Container
  width='fit'
  variant='gray'
  gap={24}
  padding={8}
  radius={16}
  bordered={true}
  shadowed={true}
>
  <div>Custom styled content</div>
</Container>
```

### Different Variants

```tsx
{
  /* White background (default) */
}
<Container variant='white'>
  <div>White background</div>
</Container>;

{
  /* Transparent background */
}
<Container variant='transparent'>
  <div>Transparent background</div>
</Container>;

{
  /* Gray background */
}
<Container variant='gray'>
  <div>Gray background</div>
</Container>;

{
  /* Primary color background */
}
<Container variant='primary'>
  <div>Primary background</div>
</Container>;

{
  /* Secondary color background */
}
<Container variant='secondary'>
  <div>Secondary background</div>
</Container>;
```

### With Custom Classes

```tsx
<Container
  className='hover:scale-105 transition-transform'
  gap={20}
  padding={4}
>
  <div>Hover effect applied</div>
</Container>
```

### Nested Containers

```tsx
<Container width='full' gap={16} padding={8}>
  <Container width='fit' variant='gray' gap={8} padding={4}>
    <div>Nested container</div>
  </Container>
  <Container width='fit' variant='primary' gap={8} padding={4}>
    <div>Another nested container</div>
  </Container>
</Container>
```

## Default Styling

The component comes with these default values:

- **Background**: White (`bg-white`)
- **Border**: None
- **Shadow**: None
- **Gap**: 16px
- **Padding**: 2px
- **Border Radius**: 10px
- **Width**: Fit content
- **Layout**: Flex column

## Accessibility

The component includes a `data-slot="container"` attribute for styling and testing purposes.

## TypeScript

The component is fully typed with a comprehensive `ContainerProps` interface that extends `React.ComponentProps<"div">`, ensuring full compatibility with all standard div props.
