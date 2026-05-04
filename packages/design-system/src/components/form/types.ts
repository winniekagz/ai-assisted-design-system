export interface SelectOption {
  value: string;
  label: string;
}

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface BaseRHFProps {
  name: string;
  label?: string;
  formError?: string; // Changed from error to avoid conflicts
  disabled?: boolean;
  required?: boolean;
  className?: string;
}
