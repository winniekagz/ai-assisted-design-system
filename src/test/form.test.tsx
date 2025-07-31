import {
  RHFCheckbox,
  RHFInput,
  RHFRadio,
  RHFSelect,
  RHFTextarea,
} from '@/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

// Test schema with validation
const testSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  country: z.string().min(1, 'Please select a country'),
  gender: z.enum(['male', 'female', 'other']),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

type TestFormData = z.infer<typeof testSchema>;

// Test wrapper component
const TestFormWrapper = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: '',
      email: '',
      country: '',
      gender: 'other',
      bio: '',
      terms: false,
    },
  });

  const onSubmit = (data: TestFormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
        <button type='submit'>Submit</button>
      </form>
    </FormProvider>
  );
};

describe('React Hook Form Components', () => {
  describe('RHFInput', () => {
    it('should show validation error when submitting with invalid data', async () => {
      render(
        <TestFormWrapper>
          <RHFInput name='name' label='Name' required />
          <RHFInput name='email' label='Email' type='email' required />
        </TestFormWrapper>
      );

      // Submit form without filling required fields
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      // Wait for validation errors to appear
      await waitFor(() => {
        expect(
          screen.getByText('Name must be at least 2 characters')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Please enter a valid email address')
        ).toBeInTheDocument();
      });
    });

    it('should clear error when user enters valid data', async () => {
      render(
        <TestFormWrapper>
          <RHFInput name='name' label='Name' required />
        </TestFormWrapper>
      );

      const nameInput = screen.getByLabelText('Name');
      const submitButton = screen.getByText('Submit');

      // Submit with invalid data
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(
          screen.getByText('Name must be at least 2 characters')
        ).toBeInTheDocument();
      });

      // Enter valid data
      fireEvent.change(nameInput, { target: { value: 'John' } });
      fireEvent.blur(nameInput);

      // Error should be cleared
      await waitFor(() => {
        expect(
          screen.queryByText('Name must be at least 2 characters')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('RHFSelect', () => {
    it('should show validation error for required select field', async () => {
      const options = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
      ];

      render(
        <TestFormWrapper>
          <RHFSelect
            name='country'
            label='Country'
            options={options}
            required
          />
        </TestFormWrapper>
      );

      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please select a country')).toBeInTheDocument();
      });
    });
  });

  describe('RHFCheckbox', () => {
    it('should show validation error for required checkbox', async () => {
      render(
        <TestFormWrapper>
          <RHFCheckbox name='terms' label='I agree to the terms' required />
        </TestFormWrapper>
      );

      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('You must accept the terms')
        ).toBeInTheDocument();
      });
    });

    it('should clear error when checkbox is checked', async () => {
      render(
        <TestFormWrapper>
          <RHFCheckbox name='terms' label='I agree to the terms' required />
        </TestFormWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      const submitButton = screen.getByText('Submit');

      // Submit without checking
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(
          screen.getByText('You must accept the terms')
        ).toBeInTheDocument();
      });

      // Check the checkbox
      fireEvent.click(checkbox);

      // Error should be cleared
      await waitFor(() => {
        expect(
          screen.queryByText('You must accept the terms')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('RHFTextarea', () => {
    it('should show validation error for short bio', async () => {
      render(
        <TestFormWrapper>
          <RHFTextarea name='bio' label='Bio' required />
        </TestFormWrapper>
      );

      const bioTextarea = screen.getByLabelText('Bio');
      const submitButton = screen.getByText('Submit');

      // Enter short text
      fireEvent.change(bioTextarea, { target: { value: 'Short' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Bio must be at least 10 characters')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Form Integration', () => {
    it('should handle complete form submission with validation', async () => {
      const options = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
      ];

      render(
        <TestFormWrapper>
          <RHFInput name='name' label='Name' required />
          <RHFInput name='email' label='Email' type='email' required />
          <RHFSelect
            name='country'
            label='Country'
            options={options}
            required
          />
          <div>
            <label>Gender</label>
            <RHFRadio name='gender' value='male' label='Male' />
            <RHFRadio name='gender' value='female' label='Female' />
            <RHFRadio name='gender' value='other' label='Other' />
          </div>
          <RHFTextarea name='bio' label='Bio' required />
          <RHFCheckbox name='terms' label='I agree to the terms' required />
        </TestFormWrapper>
      );

      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      // Should show multiple validation errors
      await waitFor(() => {
        expect(
          screen.getByText('Name must be at least 2 characters')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Please enter a valid email address')
        ).toBeInTheDocument();
        expect(screen.getByText('Please select a country')).toBeInTheDocument();
        expect(
          screen.getByText('Bio must be at least 10 characters')
        ).toBeInTheDocument();
        expect(
          screen.getByText('You must accept the terms')
        ).toBeInTheDocument();
      });
    });

    it('should submit successfully with valid data', async () => {
      const options = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
      ];

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      render(
        <TestFormWrapper>
          <RHFInput name='name' label='Name' required />
          <RHFInput name='email' label='Email' type='email' required />
          <RHFSelect
            name='country'
            label='Country'
            options={options}
            required
          />
          <RHFTextarea name='bio' label='Bio' required />
          <RHFCheckbox name='terms' label='I agree to the terms' required />
        </TestFormWrapper>
      );

      // Fill in valid data
      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Country'), {
        target: { value: 'us' },
      });
      fireEvent.change(screen.getByLabelText('Bio'), {
        target: {
          value:
            'This is a valid bio that meets the minimum length requirement.',
        },
      });
      fireEvent.click(screen.getByRole('checkbox'));

      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      // Should not show any validation errors
      await waitFor(() => {
        expect(screen.queryByText(/must be at least/)).not.toBeInTheDocument();
        expect(
          screen.queryByText(/Please enter a valid/)
        ).not.toBeInTheDocument();
        expect(screen.queryByText(/Please select/)).not.toBeInTheDocument();
        expect(screen.queryByText(/You must accept/)).not.toBeInTheDocument();
      });

      // Verify form data was logged
      expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
        name: 'John Doe',
        email: 'john@example.com',
        country: 'us',
        gender: 'other',
        bio: 'This is a valid bio that meets the minimum length requirement.',
        terms: true,
      });

      consoleSpy.mockRestore();
    });
  });
});
