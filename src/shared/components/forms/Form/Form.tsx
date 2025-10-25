import React from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { COMMON_LABELS, formatMessage } from '@/shared/constants';

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'number' | 'tel';
  required?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
};

interface FormProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  submitButtonText: string;
  isLoading?: boolean;
}

export const Form: React.FC<FormProps> = ({
  title,
  fields,
  onSubmit,
  submitButtonText,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.name] || '';

      if (field.required && !value) {
        newErrors[field.name] = formatMessage(COMMON_LABELS.validation.required, {
          field: field.label,
        });
      } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = COMMON_LABELS.validation.emailInvalid;
        }
      } else if (field.minLength && value.length < field.minLength) {
        newErrors[field.name] = formatMessage(COMMON_LABELS.validation.minCharsRequired, {
          min: field.minLength,
        });
      } else if (field.maxLength && value.length > field.maxLength) {
        newErrors[field.name] = formatMessage(COMMON_LABELS.validation.maxCharsAllowed, {
          max: field.maxLength,
        });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await onSubmit(formData);
        // Réinitialiser le formulaire après succès
        setFormData({});
      } catch (error) {
        console.error(COMMON_LABELS.forms.submissionError, error);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        {title}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {fields.map((field) => (
          <TextField
            key={field.name}
            fullWidth
            margin="normal"
            name={field.name}
            label={field.label}
            type={field.type}
            required={field.required}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={handleChange}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            multiline={field.type === 'textarea'}
            rows={field.type === 'textarea' ? 4 : 1}
            inputProps={{
              minLength: field.minLength,
              maxLength: field.maxLength,
            }}
          />
        ))}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : submitButtonText}
        </Button>
      </Box>
    </Paper>
  );
};

export default Form;
