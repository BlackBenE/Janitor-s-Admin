import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as BackIcon } from "@mui/icons-material";
import { useFormData, useCreate, useUpdate } from "../../hooks/useCrud";
import { Database } from "../../types/database.types";

type ValidTableName = keyof Database["public"]["Tables"];

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "boolean" | "number" | "textarea";
  required?: boolean;
  options?: { label: string; value: unknown }[];
  multiline?: boolean;
  rows?: number;
}

interface CrudFormProps<T = Record<string, unknown>> {
  resource: ValidTableName;
  id?: string;
  title: string;
  fields: FormField[];
  onSave?: (data: T) => void;
  onCancel?: () => void;
  defaultValues?: Partial<T>;
}

export function CrudForm<T extends Record<string, unknown>>({
  resource,
  id,
  title,
  fields,
  onSave,
  onCancel,
  defaultValues = {},
}: CrudFormProps<T>) {
  const isEdit = Boolean(id);
  const [formData, setFormData] =
    React.useState<Record<string, unknown>>(defaultValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitError, setSubmitError] = React.useState<string>("");

  const {
    data: fetchedData,
    values,
    loading: fetchLoading,
  } = useFormData(resource, id);
  const {
    create,
    loading: createLoading,
    error: createError,
  } = useCreate(resource);
  const {
    update,
    loading: updateLoading,
    error: updateError,
  } = useUpdate(resource);

  const loading = fetchLoading || createLoading || updateLoading;

  React.useEffect(() => {
    if (fetchedData && isEdit) {
      setFormData(fetchedData);
    }
  }, [fetchedData, isEdit]);

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitError("");
      let result;

      if (isEdit && id) {
        result = await update(id, formData);
      } else {
        result = await create(formData);
      }

      if (result && onSave) {
        onSave(result as T);
      }
    } catch (error: unknown) {
      setSubmitError(
        (error as Error).message || "An error occurred while saving"
      );
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || "";
    const error = errors[field.name];
    const fieldOptions = values[field.name] || field.options || [];

    switch (field.type) {
      case "select":
        return (
          <FormControl fullWidth error={!!error} key={field.name}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              label={field.label}
            >
              {fieldOptions.map(
                (option: { label: string; value: string | number }) => (
                  <MenuItem key={String(option.value)} value={option.value}>
                    {option.label}
                  </MenuItem>
                )
              )}
            </Select>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case "boolean":
        return (
          <FormControlLabel
            key={field.name}
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(e) => handleChange(field.name, e.target.checked)}
              />
            }
            label={field.label}
          />
        );

      case "textarea":
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            multiline
            rows={field.rows || 4}
          />
        );

      case "number":
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type="number"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
          />
        );

      default:
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
          />
        );
    }
  };

  if (fetchLoading && isEdit) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        {onCancel && (
          <Button startIcon={<BackIcon />} onClick={onCancel} sx={{ mr: 2 }}>
            Back
          </Button>
        )}
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        {(createError || updateError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {createError?.message || updateError?.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            {fields.map(renderField)}

            <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
              {onCancel && (
                <Button variant="outlined" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SaveIcon />
                }
                disabled={loading}
              >
                {loading ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
