# Typography Component

A comprehensive typography component that provides consistent text styling across your application using design tokens.

## Features

- **Multiple Variants**: Headings (h1-h6), body text, display text, code, and specialized variants
- **Color Options**: Default, primary, secondary, muted, destructive, success, warning, and info colors
- **Font Weights**: Normal, medium, semibold, and bold
- **Text Alignment**: Left, center, right, and justify
- **Accessibility**: Proper semantic HTML elements and ARIA support
- **Design Tokens**: Uses your design system tokens for consistent styling
- **Responsive**: Works across all screen sizes

## Usage

```tsx
import { Typography } from '@/components/ui/typography';

// Basic usage
<Typography variant="h1">Main Title</Typography>
<Typography variant="body1">Regular paragraph text</Typography>

// With color and weight
<Typography variant="body1" textColor="primary" weight="semibold">
  Important text
</Typography>

// With alignment
<Typography variant="h2" align="center">
  Centered heading
</Typography>

// Code text
<Typography variant="code">const example = "code";</Typography>
```

## Props

| Prop        | Type        | Default     | Description                            |
| ----------- | ----------- | ----------- | -------------------------------------- |
| `variant`   | `string`    | `'body1'`   | The typography variant to use          |
| `textColor` | `string`    | `'default'` | The text color variant                 |
| `weight`    | `string`    | `'normal'`  | The font weight                        |
| `align`     | `string`    | `'left'`    | The text alignment                     |
| `truncate`  | `boolean`   | `false`     | Whether to truncate text with ellipsis |
| `as`        | `string`    | `auto`      | The HTML element to render as          |
| `asChild`   | `boolean`   | `false`     | Whether to render as a child component |
| `children`  | `ReactNode` | -           | The content to display                 |

## Variants

### Headings

- `h1` - Main page title (75px)
- `h2` - Section title (50px)
- `h3` - Subsection title (30px)
- `h4` - Card title (21px)
- `h5` - Small title (1.5em)
- `h6` - Caption title (1.25rem)

### Body Text

- `body1` - Primary body text (1rem)
- `body2` - Secondary body text (0.87rem)

### Specialized

- `caption` - Caption text (14px)
- `small` - Small text (14px)
- `link` - Link text with hover effects (16px)

### Display

- `display1` - Large display text (2.25rem)
- `display2` - Extra large display text (3rem)
- `display3` - Massive display text (3.75rem)

### Code

- `code` - Inline code snippet
- `pre` - Code block

## Colors

- `default` - Default text color
- `primary` - Primary brand color
- `secondary` - Secondary brand color
- `muted` - Muted text color
- `destructive` - Error/destructive color
- `success` - Success color
- `warning` - Warning color
- `info` - Information color

## Weights

- `normal` - Font weight 400
- `medium` - Font weight 500
- `semibold` - Font weight 600
- `bold` - Font weight 700

## Alignment

- `left` - Left alignment (default)
- `center` - Center alignment
- `right` - Right alignment
- `justify` - Justified text

## Examples

### Basic Headings

```tsx
<Typography variant="h1">Page Title</Typography>
<Typography variant="h2">Section Title</Typography>
<Typography variant="h3">Subsection Title</Typography>
```

### Body Text

```tsx
<Typography variant="body1">
  This is the primary body text used for most content.
</Typography>
<Typography variant="body2">
  This is secondary body text for supporting content.
</Typography>
```

### Colored Text

```tsx
<Typography variant="body1" textColor="primary">
  Primary colored text
</Typography>
<Typography variant="body1" textColor="destructive">
  Error message text
</Typography>
```

### Weighted Text

```tsx
<Typography variant="body1" weight="normal">Normal text</Typography>
<Typography variant="body1" weight="medium">Medium text</Typography>
<Typography variant="body1" weight="semibold">Semibold text</Typography>
<Typography variant="body1" weight="bold">Bold text</Typography>
```

### Aligned Text

```tsx
<Typography variant="h2" align="center">Centered Heading</Typography>
<Typography variant="body1" align="right">Right-aligned text</Typography>
<Typography variant="body1" align="justify">
  Justified text creates even margins on both sides.
</Typography>
```

### Code Text

```tsx
<Typography variant="code">const example = "code snippet";</Typography>
<Typography variant="pre">
  {`function example() {
  console.log("This is a code block");
  return "Hello World";
}`}
</Typography>
```

### Custom Elements

```tsx
<Typography variant='body1' as='label'>
  This renders as a label element
</Typography>
```

### Truncated Text

```tsx
<Typography variant='body1' truncate>
  This very long text will be truncated with an ellipsis when it exceeds the
  container width.
</Typography>
```

## Design Tokens

The component uses your design system tokens for consistent styling:

- **Font Family**: Uses `--font-rubik` token
- **Font Sizes**: Uses tokens like `--font-size-h1`, `--font-size-body1`, etc.
- **Line Heights**: Uses tokens like `--line-height-h1`, `--line-height-body1`, etc.
- **Letter Spacing**: Uses tokens like `--letter-spacing-h1`, `--letter-spacing-body1`, etc.
- **Colors**: Uses semantic color tokens like `--text-primary`, `--primary`, etc.

## Accessibility

- Automatically renders appropriate semantic HTML elements (h1-h6 for headings, p for body text, etc.)
- Supports ARIA attributes through standard HTML attributes
- Maintains proper heading hierarchy
- Provides proper contrast ratios through design tokens

## Best Practices

1. **Use semantic variants**: Use h1-h6 for headings, body1/body2 for paragraphs
2. **Maintain hierarchy**: Don't skip heading levels (h1 → h3)
3. **Choose appropriate colors**: Use semantic colors for their intended purpose
4. **Consider readability**: Use appropriate weights and sizes for your content
5. **Test truncation**: Ensure truncated text doesn't break your layout

## Migration from Plain HTML

Replace your existing typography with the component:

```tsx
// Before
<h1 className="text-4xl font-bold">Title</h1>
<p className="text-base">Content</p>

// After
<Typography variant="h1">Title</Typography>
<Typography variant="body1">Content</Typography>
```
