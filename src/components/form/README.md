# React Hook Form Integration

This directory contains the React Hook Form (RHF) adapters that seamlessly integrate your existing ShadCN UI components with form handling and validation.

## 🏗️ Architecture

### Folder Structure

```
src/components/form/
├── index.ts              # Main exports
├── types.ts              # Shared type definitions
├── rhf-input.tsx         # RHF Input adapter
├── rhf-select.tsx        # RHF Select adapter
├── rhf-checkbox.tsx      # RHF Checkbox adapter
├── rhf-radio.tsx         # RHF Radio adapter
├── rhf-textarea.tsx      # RHF Textarea adapter
├── rhf-autocomplete.tsx  # RHF Autocomplete adapter
└── README.md            # This documentation
```

### Design Principles

1. **Unopinionated Base Components**: Your existing ShadCN components remain unchanged and reusable
2. **Adapter Pattern**: RHF adapters wrap base components without tight coupling
3. **Type Safety**: Full TypeScript support with inferred types from Zod schemas
4. **Consistent API**: All adapters follow the same interface pattern
5. **Error Handling**: Automatic validation error display and styling

## 🚀 Usage

### Basic Setup

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RHFInput, RHFSelect, RHFCheckbox } from '@/components/form';

// Define your schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Please select a country'),
  newsletter: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      country: '',
      newsletter: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
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

## 📋 Available Components

### RHFInput

```tsx
<RHFInput
  name='fieldName'
  label='Field Label'
  placeholder='Enter value...'
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
/>
```

### RHFCheckbox

```tsx
<RHFCheckbox name='fieldName' label='Checkbox Label' required />
```

### RHFRadio

```tsx
<RHFRadio name='fieldName' value='option1' label='Radio Option 1' />
```

### RHFTextarea

```tsx
<RHFTextarea
  name='fieldName'
  label='Textarea Label'
  placeholder='Enter text...'
  autoGrow
  required
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
/>
```

## 🎨 Styling

All components use your existing color tokens from `global.css`:

- **Text Colors**: `--color-text-primary`, `--color-text-secondary`
- **Border Colors**: `--color-border-default`, `--color-border-error`
- **Error Colors**: `--color-error-500`
- **Primary Colors**: `--color-primary-500`, `--color-primary-600`

## 🔧 Advanced Features

### Custom Error Messages

```tsx
<RHFInput name='email' label='Email' formError='Custom error message' />
```

### Icon Integration

```tsx
import { Mail, User } from 'lucide-react';

<RHFInput
  name='email'
  label='Email'
  startIcon={<Mail className='h-4 w-4' />}
  onStartIconClick={() => console.log('Icon clicked')}
/>;
```

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

## 🧪 Testing

Each component is fully typed and can be tested with your existing testing setup:

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

## 🔄 Migration Guide

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

## 🎯 Best Practices

1. **Always use FormProvider**: Wrap your form with `FormProvider` from react-hook-form
2. **Define schemas with Zod**: Use Zod for type-safe validation
3. **Use meaningful field names**: Field names should match your data structure
4. **Provide default values**: Set appropriate default values in useForm
5. **Handle submission properly**: Use form.handleSubmit for submission
6. **Test form interactions**: Test form validation and submission flows

## 🚨 Common Issues

### FormProvider Missing

```tsx
// ❌ This won't work
<RHFInput name="email" />

// ✅ Wrap with FormProvider
<FormProvider {...methods}>
  <RHFInput name="email" />
</FormProvider>
```

### Missing Dependencies

```tsx
// Make sure these are installed
npm install react-hook-form @hookform/resolvers zod
```

### Type Errors

```tsx
// Use proper typing
const form = useForm<YourFormType>({
  resolver: zodResolver(yourSchema),
});
```

## 📚 Additional Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [ShadCN UI Components](https://ui.shadcn.com/)
