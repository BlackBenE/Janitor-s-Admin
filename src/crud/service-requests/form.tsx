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
  Stack,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useCreate, useUpdate, useGetOne } from "../../hooks/useCrud";
import type { Database } from "../../types/database.types";

type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"];
type ServiceRequestInsert =
  Database["public"]["Tables"]["service_requests"]["Insert"];

interface ServiceRequestFormData {
  requester_id: string;
  service_id: string;
  property_id: string;
  requested_date: string;
  total_amount: number;
  quantity: number;
  notes: string;
  status: string;
  distance_km: number;
  duration_minutes: number;
}

interface FormErrors {
  requester_id?: string;
  service_id?: string;
  requested_date?: string;
  total_amount?: string;
  quantity?: string;
}

const ServiceRequestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: serviceRequest, loading: isLoadingServiceRequest } =
    useGetOne<ServiceRequest>("service_requests", id || "");

  const createMutation = useCreate<ServiceRequestInsert>("service_requests");
  const updateMutation = useUpdate<Partial<ServiceRequest>>("service_requests");

  const [formData, setFormData] = useState<ServiceRequestFormData>({
    requester_id: "",
    service_id: "",
    property_id: "",
    requested_date: new Date().toISOString().split("T")[0],
    total_amount: 0,
    quantity: 1,
    notes: "",
    status: "pending",
    distance_km: 0,
    duration_minutes: 60,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Load service request data for editing
  useEffect(() => {
    if (serviceRequest && isEdit) {
      setFormData({
        requester_id: serviceRequest.requester_id || "",
        service_id: serviceRequest.service_id || "",
        property_id: serviceRequest.property_id || "",
        requested_date: serviceRequest.requested_date
          ? serviceRequest.requested_date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        total_amount: serviceRequest.total_amount || 0,
        quantity: serviceRequest.quantity || 1,
        notes: serviceRequest.notes || "",
        status: serviceRequest.status || "pending",
        distance_km: serviceRequest.distance_km || 0,
        duration_minutes: serviceRequest.duration_minutes || 60,
      });
    }
  }, [serviceRequest, isEdit]);

  const handleInputChange =
    (field: keyof ServiceRequestFormData) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.requester_id.trim()) {
      newErrors.requester_id = "Requester ID is required";
    }

    if (!formData.service_id.trim()) {
      newErrors.service_id = "Service ID is required";
    }

    if (!formData.requested_date) {
      newErrors.requested_date = "Requested date is required";
    }

    if (formData.total_amount <= 0) {
      newErrors.total_amount = "Total amount must be greater than 0";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
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
      const submitData = {
        ...formData,
        requested_date: formData.requested_date + "T00:00:00.000Z",
        property_id: formData.property_id || null,
        notes: formData.notes || null,
        distance_km: formData.distance_km || null,
        duration_minutes: formData.duration_minutes || null,
      };

      if (isEdit && id) {
        await updateMutation.update(id, submitData);
      } else {
        await createMutation.create(submitData);
      }
      navigate("/quote-requests");
    } catch (error) {
      console.error("Error saving service request:", error);
    }
  };

  const handleCancel = () => {
    navigate("/quote-requests");
  };

  if (isEdit && isLoadingServiceRequest) {
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
            {isEdit ? "Edit Service Request" : "Create Service Request"}
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
              <Typography variant="h6">Request Information</Typography>

              <TextField
                fullWidth
                label="Requester ID *"
                value={formData.requester_id}
                onChange={handleInputChange("requester_id")}
                error={Boolean(errors.requester_id)}
                helperText={
                  errors.requester_id ||
                  "Enter the user ID of the person making the request"
                }
                disabled={isLoading}
              />

              <TextField
                fullWidth
                label="Service ID *"
                value={formData.service_id}
                onChange={handleInputChange("service_id")}
                error={Boolean(errors.service_id)}
                helperText={errors.service_id || "Enter the service ID"}
                disabled={isLoading}
              />

              <TextField
                fullWidth
                label="Property ID"
                value={formData.property_id}
                onChange={handleInputChange("property_id")}
                helperText="Enter the property ID (optional)"
                disabled={isLoading}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Requested Date *"
                  type="date"
                  value={formData.requested_date}
                  onChange={handleInputChange("requested_date")}
                  error={Boolean(errors.requested_date)}
                  helperText={errors.requested_date}
                  disabled={isLoading}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ minWidth: 200 }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={handleInputChange("status")}
                    disabled={isLoading}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Service Details */}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Service Details
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Total Amount (€) *"
                  type="number"
                  value={formData.total_amount}
                  onChange={handleInputChange("total_amount")}
                  error={Boolean(errors.total_amount)}
                  helperText={errors.total_amount}
                  disabled={isLoading}
                  sx={{ minWidth: 150 }}
                />

                <TextField
                  label="Quantity *"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange("quantity")}
                  error={Boolean(errors.quantity)}
                  helperText={errors.quantity}
                  disabled={isLoading}
                  sx={{ minWidth: 150 }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Distance (km)"
                  type="number"
                  value={formData.distance_km}
                  onChange={handleInputChange("distance_km")}
                  disabled={isLoading}
                  sx={{ minWidth: 150 }}
                />

                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={handleInputChange("duration_minutes")}
                  disabled={isLoading}
                  sx={{ minWidth: 150 }}
                />
              </Box>

              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleInputChange("notes")}
                disabled={isLoading}
                helperText="Additional information about the service request"
              />

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
                  {isEdit ? "Update Service Request" : "Create Service Request"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServiceRequestForm;
