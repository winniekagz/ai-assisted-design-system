# Form Components

This directory contains form field components that integrate with React Hook Form (RHF) and standalone form field components.

## React Hook Form Components

These components are designed to work seamlessly with React Hook Form, providing automatic validation, error handling, and form state management.

### Available Components

- `RHFInput` - Text input field with RHF integration
- `RHFSelect` - Dropdown select with RHF integration
- `RHFTextarea` - Multi-line text area with RHF integration
- `RHFCheckbox` - Checkbox with RHF integration
- `RHFRadio` - Radio button with RHF integration
- `RHFAutocomplete` - Autocomplete field with RHF integration

### Basic Usage

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RHFInput, RHFSelect } from '@/components/form';

// Define validation schema
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  country: z.string().min(1, 'Please select a country'),
});

type FormData = z.infer<typeof formSchema>;

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      email: '',
      country: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <RHFInput
        name='firstName'
        label='First Name'
        placeholder='Enter your first name'
        required
      />
      <RHFInput
        name='email'
        label='Email'
        type='email'
        placeholder='Enter your email'
        required
      />
      <RHFSelect
        name='country'
        label='Country'
        placeholder='Select your country'
        options={[
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
        ]}
        required
      />
      <button type='submit'>Submit</button>
    </form>
  );
}
```

### Component Props

All RHF components extend the base props:

```tsx
interface BaseRHFProps {
  name: string; // Field name for RHF
  label?: string; // Field label
  formError?: string; // Manual error message
  disabled?: boolean; // Disable the field
  required?: boolean; // Show required indicator
  className?: string; // Additional CSS classes
}
```

## Standalone Form Field Components

These components can be used independently without React Hook Form integration.

### Available Components

- `Input` - Text input field
- `Select` - Dropdown select
- `Textarea` - Multi-line text area
- `Checkbox` - Checkbox component
- `Radio` - Radio button component
- `Autocomplete` - Autocomplete field

### Basic Usage

```tsx
import { Input, Select, Checkbox } from '@/components/ui/form-fields';

function MyForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    country: '',
    newsletter: false,
  });

  return (
    <form>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>First Name</label>
        <Input
          value={formData.firstName}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              firstName: e.target.value,
            }))
          }
          placeholder='Enter your first name'
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium'>Country</label>
        <Select
          value={formData.country}
          onValueChange={value =>
            setFormData(prev => ({
              ...prev,
              country: value,
            }))
          }
          options={[
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
          ]}
          placeholder='Select your country'
        />
      </div>

      <div className='flex items-center space-x-2'>
        <Checkbox
          id='newsletter'
          checked={formData.newsletter}
          onCheckedChange={checked =>
            setFormData(prev => ({
              ...prev,
              newsletter: checked,
            }))
          }
        />
        <label htmlFor='newsletter' className='text-sm'>
          Subscribe to newsletter
        </label>
      </div>
    </form>
  );
}
```

## Input Variants and States

The `Input` component supports various variants and states:

```tsx
// Variants
<Input variant="default" placeholder="Default" />
<Input variant="outline" placeholder="Outline" />
<Input variant="text" placeholder="Text" />

// States
<Input error placeholder="Error state" />
<Input success placeholder="Success state" />
<Input disabled placeholder="Disabled" />

// Sizes
<Input size="sm" placeholder="Small" />
<Input size="default" placeholder="Default" />
<Input size="lg" placeholder="Large" />
```

## Form Validation

### React Hook Form with Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const form = useForm({
  resolver: zodResolver(schema),
});
```

### Manual Validation

```tsx
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};

  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Demo

Visit `/form-demo` to see comprehensive examples of all form components in action, including:

- React Hook Form integration with validation
- Standalone form field usage
- Different input variants and states
- Form submission handling
- Error state demonstrations

## Best Practices

1. **Use React Hook Form** for complex forms with validation
2. **Use standalone components** for simple forms or when you need more control
3. **Always provide labels** for accessibility
4. **Use appropriate input types** (email, tel, password, etc.)
5. **Implement proper error handling** and user feedback
6. **Test form validation** thoroughly
7. **Consider accessibility** with proper ARIA labels and keyboard navigation
