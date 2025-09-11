import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Chip,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useCreate, useUpdate, useGetOne } from "../../hooks/useCrud";
import type { Database } from "../../types/database.types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];

interface PropertyFormData {
  title: string;
  description: string;
  address: string;
  postal_code: string;
  city: string;
  nightly_rate: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  validation_status: string;
  owner_id: string;
}

interface FormErrors {
  title?: string;
  address?: string;
  city?: string;
  nightly_rate?: string;
  capacity?: string;
  owner_id?: string;
}

const AMENITIES_OPTIONS = [
  "WiFi",
  "Kitchen",
  "Parking",
  "Pool",
  "Gym",
  "Laundry",
  "Balcony",
  "Terrace",
  "Garden",
  "Elevator",
  "Air Conditioning",
  "Heating",
  "TV",
  "Dishwasher",
  "Washing Machine",
  "Dryer",
  "Microwave",
  "Coffee Machine",
  "Hot Tub",
  "Fireplace",
  "Pet Friendly",
  "Smoking Allowed",
  "Wheelchair Accessible",
];

const PropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: property, loading: isLoadingProperty } = useGetOne<Property>(
    "properties",
    id || ""
  );

  const createMutation = useCreate<PropertyInsert>("properties");
  const updateMutation = useUpdate<Partial<Property>>("properties");

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    address: "",
    postal_code: "",
    city: "",
    nightly_rate: 0,
    capacity: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    validation_status: "pending",
    owner_id: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Load property data for editing
  useEffect(() => {
    if (property && isEdit) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        address: property.address || "",
        postal_code: property.postal_code || "",
        city: property.city || "",
        nightly_rate: property.nightly_rate || 0,
        capacity: property.capacity || 1,
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        amenities: property.amenities || [],
        validation_status: property.validation_status || "pending",
        owner_id: property.owner_id || "",
      });
    }
  }, [property, isEdit]);

  const handleInputChange =
    (field: keyof PropertyFormData) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string | string[]>
    ) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const handleAmenitiesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      amenities: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (formData.nightly_rate <= 0) {
      newErrors.nightly_rate = "Nightly rate must be greater than 0";
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0";
    }

    if (!formData.owner_id.trim() && !isEdit) {
      newErrors.owner_id = "Owner ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit && id) {
        await updateMutation.update(id, formData);
      } else {
        await createMutation.create(formData);
      }
      navigate("/property-approvals");
    } catch (error) {
      console.error("Error saving property:", error);
    }
  };

  const handleCancel = () => {
    navigate("/property-approvals");
  };

  if (isEdit && isLoadingProperty) {
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

  const isLoading = createMutation.loading || updateMutation.loading;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            {isEdit ? "Edit Property" : "Create Property"}
          </Typography>

          {(createMutation.error || updateMutation.error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createMutation.error?.message ||
                updateMutation.error?.message ||
                "An error occurred"}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              {/* Basic Information */}
              <Typography variant="h6">Basic Information</Typography>

              <TextField
                fullWidth
                label="Title *"
                value={formData.title}
                onChange={handleInputChange("title")}
                error={Boolean(errors.title)}
                helperText={errors.title}
                disabled={isLoading}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange("description")}
                disabled={isLoading}
              />

              {!isEdit && (
                <TextField
                  fullWidth
                  label="Owner ID *"
                  value={formData.owner_id}
                  onChange={handleInputChange("owner_id")}
                  error={Boolean(errors.owner_id)}
                  helperText={
                    errors.owner_id || "Enter the user ID of the property owner"
                  }
                  disabled={isLoading}
                />
              )}

              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Validation Status</InputLabel>
                  <Select
                    value={formData.validation_status}
                    onChange={handleInputChange("validation_status")}
                    disabled={isLoading}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Location */}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Location
              </Typography>

              <TextField
                fullWidth
                label="Address *"
                value={formData.address}
                onChange={handleInputChange("address")}
                error={Boolean(errors.address)}
                helperText={errors.address}
                disabled={isLoading}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Postal Code"
                  value={formData.postal_code}
                  onChange={handleInputChange("postal_code")}
                  disabled={isLoading}
                  sx={{ minWidth: 150 }}
                />
                <TextField
                  fullWidth
                  label="City *"
                  value={formData.city}
                  onChange={handleInputChange("city")}
                  error={Boolean(errors.city)}
                  helperText={errors.city}
                  disabled={isLoading}
                />
              </Box>

              {/* Property Details */}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Property Details
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Nightly Rate (€) *"
                  type="number"
                  value={formData.nightly_rate}
                  onChange={handleInputChange("nightly_rate")}
                  error={Boolean(errors.nightly_rate)}
                  helperText={errors.nightly_rate}
                  disabled={isLoading}
                  sx={{ minWidth: 150 }}
                />
                <TextField
                  label="Capacity *"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange("capacity")}
                  error={Boolean(errors.capacity)}
                  helperText={errors.capacity}
                  disabled={isLoading}
                  sx={{ minWidth: 150 }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleInputChange("bedrooms")}
                  disabled={isLoading}
                  sx={{ minWidth: 150 }}
                />
                <TextField
                  label="Bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleInputChange("bathrooms")}
                  disabled={isLoading}
                  sx={{ minWidth: 150 }}
                />
              </Box>

              {/* Amenities */}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Amenities
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Amenities</InputLabel>
                <Select
                  multiple
                  value={formData.amenities}
                  onChange={handleAmenitiesChange}
                  input={<OutlinedInput label="Amenities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  disabled={isLoading}
                >
                  {AMENITIES_OPTIONS.map((amenity) => (
                    <MenuItem key={amenity} value={amenity}>
                      {amenity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 3,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? <CircularProgress size={20} /> : undefined
                  }
                >
                  {isEdit ? "Update Property" : "Create Property"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PropertyForm;
