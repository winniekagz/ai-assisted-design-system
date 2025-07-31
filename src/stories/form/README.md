# React Hook Form Integration Documentation

This directory contains comprehensive Storybook stories for all React Hook Form (RHF) adapters in the component library. Each component has detailed examples, usage patterns, and code snippets.

## 📁 Story Structure

```
src/stories/form/
├── README.md                    # This documentation
├── RHFInput.stories.tsx         # Input field stories
├── RHFSelect.stories.tsx        # Select dropdown stories
├── RHFCheckbox.stories.tsx      # Checkbox stories
├── RHFRadio.stories.tsx         # Radio button stories
├── RHFTextarea.stories.tsx      # Textarea stories
└── RHFAutocomplete.stories.tsx  # Autocomplete stories
```

## 🎯 Story Categories

Each component story includes:

### 1. **Basic Examples**

- Default usage patterns
- With icons and styling
- Different input types (email, password, tel, etc.)

### 2. **State Variations**

- Default values
- Disabled states
- Required fields
- Error states

### 3. **Complex Patterns**

- Multiple fields in forms
- Validation examples
- Real-world use cases

### 4. **Code Examples**

- Complete implementation snippets
- Best practices
- Common patterns

## 🚀 Quick Start

### Basic Form Setup

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RHFInput, RHFSelect, RHFCheckbox } from '@/components/form';

// Define your schema
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Please select a country'),
  newsletter: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      country: '',
      newsletter: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <RHFInput
        name='name'
        label='Full Name'
        placeholder='Enter your name'
        required
      />

      <RHFInput
        name='email'
        label='Email Address'
        type='email'
        placeholder='Enter your email'
        required
      />

      <RHFSelect
        name='country'
        label='Country'
        options={[
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
        ]}
        required
      />

      <RHFCheckbox name='newsletter' label='Subscribe to newsletter' />

      <button type='submit'>Submit</button>
    </form>
  );
}
```

## 📋 Component Reference

### RHFInput

```tsx
<RHFInput
  name='fieldName'
  label='Field Label'
  placeholder='Enter value...'
  type='text' // text, email, password, tel, url, number
  startIcon={<Icon />}
  endIcon={<Icon />}
  required
  disabled
  className='custom-class'
/>
```

### RHFSelect

```tsx
<RHFSelect
  name='fieldName'
  label='Field Label'
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  placeholder='Select an option...'
  required
  disabled
/>
```

### RHFCheckbox

```tsx
<RHFCheckbox name='fieldName' label='Checkbox Label' required disabled />
```

### RHFRadio

```tsx
<RHFRadio
  name='fieldName'
  value='option1'
  label='Radio Option 1'
  required
  disabled
/>
```

### RHFTextarea

```tsx
<RHFTextarea
  name='fieldName'
  label='Textarea Label'
  placeholder='Enter text...'
  autoGrow
  startIcon={<Icon />}
  endIcon={<Icon />}
  required
  disabled
/>
```

### RHFAutocomplete

```tsx
<RHFAutocomplete
  name='fieldName'
  label='Autocomplete Label'
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  placeholder='Start typing...'
  multiple
  required
  disabled
/>
```

## 🎨 Styling & Theming

All components use the centralized color system from `global.css`:

```css
/* Text Colors */
--color-text-primary
--color-text-secondary

/* Border Colors */
--color-border-default
--color-border-error

/* Error Colors */
--color-error-500

/* Primary Colors */
--color-primary-500
--color-primary-600
```

## 🔧 Advanced Patterns

### Conditional Validation

```tsx
const schema = z
  .object({
    email: z.string().email(),
    confirmEmail: z.string(),
  })
  .refine(data => data.email === data.confirmEmail, {
    message: "Emails don't match",
    path: ['confirmEmail'],
  });
```

### Dynamic Options

```tsx
const [options, setOptions] = useState([]);

useEffect(() => {
  // Fetch options from API
  fetchOptions().then(setOptions);
}, []);

<RHFSelect
  name='dynamicField'
  label='Dynamic Options'
  options={options}
  required
/>;
```

### Custom Error Messages

```tsx
<RHFInput
  name='email'
  label='Email'
  formError='This is a custom error message'
  required
/>
```

### Icon Integration

```tsx
import { Mail, User, Lock } from 'lucide-react';

<RHFInput
  name='email'
  label='Email'
  startIcon={<Mail className='h-4 w-4' />}
  onStartIconClick={() => console.log('Icon clicked')}
/>;
```

## 🧪 Testing Patterns

### Unit Testing

```tsx
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { RHFInput } from '@/components/form';

function TestWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
}

test('RHFInput renders correctly', () => {
  render(
    <TestWrapper>
      <RHFInput name='test' label='Test Input' />
    </TestWrapper>
  );

  expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
});
```

### Integration Testing

```tsx
test('form submission works', async () => {
  const mockSubmit = jest.fn();

  render(
    <TestWrapper>
      <form onSubmit={mockSubmit}>
        <RHFInput name='name' label='Name' required />
        <button type='submit'>Submit</button>
      </form>
    </TestWrapper>
  );

  await userEvent.click(screen.getByText('Submit'));
  expect(mockSubmit).toHaveBeenCalled();
});
```

## 🚨 Common Issues & Solutions

### FormProvider Missing

```tsx
// ❌ This won't work
<RHFInput name="email" />

// ✅ Wrap with FormProvider
<FormProvider {...methods}>
  <RHFInput name="email" />
</FormProvider>
```

### Type Errors

```tsx
// ✅ Use proper typing
const form = useForm<YourFormType>({
  resolver: zodResolver(yourSchema),
});
```

### Validation Not Working

```tsx
// ✅ Make sure schema matches field names
const schema = z.object({
  email: z.string().email(), // Must match name="email"
});

<RHFInput name='email' label='Email' />;
```

### Default Values

```tsx
// ✅ Set default values in useForm
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    email: '',
    country: '',
    newsletter: false,
  },
});
```

## 📚 Best Practices

1. **Always use FormProvider** - Wrap your form with FormProvider from react-hook-form
2. **Define schemas with Zod** - Use Zod for type-safe validation
3. **Use meaningful field names** - Field names should match your data structure
4. **Provide default values** - Set appropriate default values in useForm
5. **Handle submission properly** - Use form.handleSubmit for submission
6. **Test form interactions** - Test form validation and submission flows
7. **Use consistent naming** - Keep field names consistent across your application
8. **Handle loading states** - Show loading indicators during form submission
9. **Provide feedback** - Give users clear feedback on form submission
10. **Accessibility** - Ensure all form fields have proper labels and ARIA attributes

## 🔗 Related Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [ShadCN UI Components](https://ui.shadcn.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎯 Migration Guide

### From Direct Component Usage

```tsx
// Before
<Input name="email" onChange={handleChange} />

// After
<RHFInput name="email" label="Email" />
```

### From Manual Error Handling

```tsx
// Before
<Input
  error={errors.email}
  helperText={errors.email?.message}
/>

// After
<RHFInput name="email" label="Email" />
// Errors are handled automatically
```

### From Custom Form State

```tsx
// Before
const [email, setEmail] = useState('');
const [errors, setErrors] = useState({});

// After
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { email: '' },
});
// State and errors are handled automatically
```

This documentation provides a comprehensive guide to using the React Hook Form integration in your applications. Each story in this directory demonstrates real-world usage patterns and best practices.
