import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AdminLayout from "../components/AdminLayout";
import InfoCard from "../components/InfoCard";
import DashboardItem from "../components/DashboardItem";
import DataTable from "../components/Table";
import { useUsers } from "../hooks/useUsers";
import { useUserActivity } from "../hooks/useUserActivity";
import { useAuditLog } from "../hooks/useAuditLog";
import { useSecurityActions } from "../hooks/useSecurityActions";
import { Database } from "../types/database.types";
import {
  Chip,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
} from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import LockResetIcon from "@mui/icons-material/LockReset";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DownloadIcon from "@mui/icons-material/Download";
import SecurityIcon from "@mui/icons-material/Security";
import DataModal from "../components/Modal";
import { useState } from "react";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

function UserManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    subscription: "",
    search: "",
  });
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // États pour Phase 2 - Audit et Sécurité
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<
    {
      id: number;
      action: string;
      details: string;
      timestamp: string;
      admin_user: string;
    }[]
  >([]);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [passwordResetUserId, setPasswordResetUserId] = useState<string | null>(
    null
  );
  const [auditTabValue, setAuditTabValue] = useState(0);

  const { users, isLoading, error, updateUser } = useUsers({
    orderBy: "created_at",
  });

  // Get user IDs for activity data
  const userIds = users.map((user: UserProfile) => user.id);
  const { data: activityData, isLoading: activityLoading } =
    useUserActivity(userIds);

  // Hooks pour l'audit et la sécurité
  const { getAuditLogs, logAction, auditActions } = useAuditLog();
  const { resetPassword, forceLogout } = useSecurityActions();

  // Helper function to show notifications
  const showNotification = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setNotification({ open: true, message, severity });
  };

  // Helper function to format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user: UserProfile) => {
    const matchesSearch =
      !filters.search ||
      user.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.phone?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus =
      !filters.status ||
      (filters.status === "validated" && user.profile_validated) ||
      (filters.status === "pending" && !user.profile_validated);
    const matchesSubscription =
      !filters.subscription ||
      (filters.subscription === "vip" && user.vip_subscription) ||
      (filters.subscription === "standard" && !user.vip_subscription);

    return matchesSearch && matchesRole && matchesStatus && matchesSubscription;
  });

  const getRoleColor = (
    role: string
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (role.toLowerCase()) {
      case "admin":
        return "error";
      case "property_owner":
        return "primary";
      case "service_provider":
        return "info";
      case "customer":
        return "default";
      default:
        return "default";
    }
  };

  const columns = [
    {
      field: "select",
      headerName: "",
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Checkbox
          checked={selectedUsers.includes(params.row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers((prev) => [...prev, params.row.id]);
            } else {
              setSelectedUsers((prev) =>
                prev.filter((id) => id !== params.row.id)
              );
            }
          }}
          size="small"
        />
      ),
    },
    {
      field: "full_name",
      headerName: "User",
      minWidth: 200,
      flex: 1,
      valueGetter: (value: string | null, row: UserProfile) =>
        `${row.full_name || "Unnamed User"} ${row.email}`,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Box>
          <Box sx={{ fontWeight: "medium" }}>
            {params.row.full_name || "Unnamed User"}
          </Box>
          <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            {params.row.email}
          </Box>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      valueGetter: (value: string) => value?.replace("_", " ") || "",
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Chip
          label={params.row.role.replace("_", " ")}
          color={getRoleColor(params.row.role)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "vip_subscription",
      headerName: "Subscription",
      valueGetter: (value: boolean) => (value ? "VIP" : "Standard"),
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Chip
          label={params.row.vip_subscription ? "VIP" : "Standard"}
          color={params.row.vip_subscription ? "warning" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "profile_validated",
      headerName: "Status",
      valueGetter: (value: boolean) => (value ? "Validated" : "Pending"),
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Chip
          label={params.row.profile_validated ? "Validated" : "Pending"}
          color={params.row.profile_validated ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "activity",
      headerName: "Activity",
      sortable: false,
      filterable: false,
      valueGetter: (value: string | null, row: UserProfile) => {
        const activity = activityData?.[row.id];
        return activity ? `${activity.totalBookings} bookings` : "0 bookings";
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => {
        const activity = activityData?.[params.row.id];
        if (!activity) {
          return <Box sx={{ color: "text.secondary" }}>Loading...</Box>;
        }

        return (
          <Box>
            <Box sx={{ fontWeight: "medium", fontSize: "0.875rem" }}>
              {activity.totalBookings} bookings
            </Box>
            <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              Last: {formatDate(activity.lastBookingDate)}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "spending",
      headerName: "Spending",
      sortable: false,
      filterable: false,
      valueGetter: (value: string | null, row: UserProfile) => {
        const activity = activityData?.[row.id];
        return activity ? activity.totalSpent : 0;
      },
      renderCell: (params: GridRenderCellParams<UserProfile>) => {
        const activity = activityData?.[params.row.id];
        if (!activity) {
          return <Box sx={{ color: "text.secondary" }}>Loading...</Box>;
        }

        return (
          <Box sx={{ fontWeight: "medium" }}>
            {formatCurrency(activity.totalSpent)}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Voir les détails">
            <IconButton size="small" onClick={() => handleShowUser(params.row)}>
              <RemoveRedEyeOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Audit & Historique">
            <IconButton
              size="small"
              onClick={() => handleShowAudit(params.row.id)}
            >
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Réinitialiser le mot de passe">
            <IconButton
              size="small"
              onClick={() => handlePasswordReset(params.row.id)}
            >
              <LockResetIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Déconnexion forcée">
            <IconButton
              size="small"
              onClick={() => handleForceLogout(params.row.id)}
            >
              <ExitToAppIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setEditForm(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setEditForm({});
  };

  const handleShowUser = (user: UserProfile) => {
    setSelectedUser(user);
    setEditForm({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile_validated: user.profile_validated,
      vip_subscription: user.vip_subscription,
    });
    setModalOpen(true);
  };

  const handleInputChange = (
    field: keyof UserProfile,
    value: string | boolean | null
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveUser = () => {
    if (selectedUser && Object.keys(editForm).length > 0) {
      updateUser.mutate(
        {
          id: selectedUser.id,
          payload: editForm,
        },
        {
          onSuccess: async () => {
            // Log l'action d'audit
            const changedFields = Object.keys(editForm);
            await logAction(
              auditActions.USER_UPDATED,
              selectedUser.id,
              `Champs modifiés: ${changedFields.join(", ")}`,
              "admin@example.com",
              { changedFields, oldValues: selectedUser, newValues: editForm }
            );

            showNotification("User updated successfully", "success");
            handleCloseModal();
          },
          onError: (error) => {
            showNotification(`Error updating user: ${error.message}`, "error");
          },
        }
      );
    }
  };

  const handleSuspendUser = () => {
    if (selectedUser) {
      // Suspend user by invalidating profile
      updateUser.mutate(
        {
          id: selectedUser.id,
          payload: {
            profile_validated: false,
          },
        },
        {
          onSuccess: async () => {
            // Log l'action d'audit
            await logAction(
              auditActions.USER_SUSPENDED,
              selectedUser.id,
              "Compte suspendu par l'administrateur",
              "admin@example.com",
              {
                reason: "admin_action",
                previousStatus: selectedUser.profile_validated,
              }
            );

            showNotification("User suspended successfully", "success");
            handleCloseModal();
          },
          onError: (error) => {
            showNotification(
              `Error suspending user: ${error.message}`,
              "error"
            );
          },
        }
      );
    }
  };

  const handleCreateUser = () => {
    // TODO: Fix createUser mutation signature
    if (Object.keys(editForm).length > 0 && editForm.email && editForm.role) {
      showNotification(
        "Create user functionality will be implemented soon",
        "info"
      );
      handleCloseCreateModal();
      // const newUser = {
      //   ...editForm,
      //   email: editForm.email!,
      //   role: editForm.role!,
      // };

      // createUser.mutate(newUser, {
      //   onSuccess: () => {
      //     showNotification("User created successfully", "success");
      //     handleCloseCreateModal();
      //   },
      //   onError: (error) => {
      //     showNotification(`Error creating user: ${error.message}`, "error");
      //   }
      // });
    } else {
      showNotification("Email and role are required", "warning");
    }
  };

  const handleBulkSuspend = () => {
    if (selectedUsers.length === 0) {
      showNotification("No users selected", "warning");
      return;
    }

    Promise.all(
      selectedUsers.map((userId) =>
        updateUser.mutateAsync({
          id: userId,
          payload: { profile_validated: false },
        })
      )
    )
      .then(async () => {
        // Log l'action d'audit pour chaque utilisateur
        await Promise.all(
          selectedUsers.map((userId) =>
            logAction(
              auditActions.BULK_ACTION,
              userId,
              `Suspension en masse - ${selectedUsers.length} utilisateurs affectés`,
              "admin@example.com",
              { action: "bulk_suspend", totalUsers: selectedUsers.length }
            )
          )
        );

        showNotification(
          `${selectedUsers.length} users suspended successfully`,
          "success"
        );
        setSelectedUsers([]);
      })
      .catch((error) => {
        showNotification(`Error suspending users: ${error.message}`, "error");
      });
  };

  const handleBulkValidate = () => {
    if (selectedUsers.length === 0) {
      showNotification("No users selected", "warning");
      return;
    }

    Promise.all(
      selectedUsers.map((userId) =>
        updateUser.mutateAsync({
          id: userId,
          payload: { profile_validated: true },
        })
      )
    )
      .then(async () => {
        // Log l'action d'audit pour chaque utilisateur
        await Promise.all(
          selectedUsers.map((userId) =>
            logAction(
              auditActions.BULK_ACTION,
              userId,
              `Validation en masse - ${selectedUsers.length} utilisateurs affectés`,
              "admin@example.com",
              { action: "bulk_validate", totalUsers: selectedUsers.length }
            )
          )
        );

        showNotification(
          `${selectedUsers.length} users validated successfully`,
          "success"
        );
        setSelectedUsers([]);
      })
      .catch((error) => {
        showNotification(`Error validating users: ${error.message}`, "error");
      });
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    setEditForm({});
  };

  // Calculate statistics from filtered users data
  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter(
    (user: UserProfile) => user.profile_validated
  ).length;

  const pendingValidations = filteredUsers.filter(
    (user: UserProfile) => !user.profile_validated
  ).length;

  // Calculate activity statistics
  const totalRevenue = activityData
    ? Object.values(activityData).reduce(
        (sum, activity) => sum + activity.totalSpent,
        0
      )
    : 0;
  const totalBookings = activityData
    ? Object.values(activityData).reduce(
        (sum, activity) => sum + activity.totalBookings,
        0
      )
    : 0;

  const monthlyGrowth = "+12.5%";
  const activeGrowth = "+8.3%";

  // Phase 2 - Fonctions d'audit et de sécurité
  const fetchAuditLogs = async (userId: string) => {
    try {
      const logs = await getAuditLogs(userId);
      setAuditLogs(logs);
    } catch {
      showNotification("Erreur lors du chargement des logs d'audit", "error");
    }
  };

  const handleShowAudit = (userId: string) => {
    setShowAuditModal(true);
    fetchAuditLogs(userId);
  };

  const handlePasswordReset = (userId: string) => {
    setPasswordResetUserId(userId);
    setShowPasswordResetModal(true);
  };

  const handleConfirmPasswordReset = async () => {
    if (!passwordResetUserId) return;

    try {
      await resetPassword(
        passwordResetUserId,
        "Admin-initiated password reset"
      );

      // Log l'action d'audit
      await logAction(
        auditActions.PASSWORD_RESET,
        passwordResetUserId,
        "Email de réinitialisation envoyé par l'administrateur",
        "admin@example.com"
      );

      showNotification(
        "Email de réinitialisation envoyé avec succès",
        "success"
      );
      setShowPasswordResetModal(false);
      setPasswordResetUserId(null);
    } catch {
      showNotification(
        "Erreur lors de l'envoi de l'email de réinitialisation",
        "error"
      );
    }
  };

  const handleForceLogout = async (userId: string) => {
    try {
      await forceLogout(userId, "Force logout by admin");

      // Log l'action d'audit
      await logAction(
        auditActions.FORCE_LOGOUT,
        userId,
        "Déconnexion forcée par l'administrateur",
        "admin@example.com"
      );

      showNotification("Utilisateur déconnecté de force", "success");
    } catch {
      showNotification("Erreur lors de la déconnexion forcée", "error");
    }
  };

  const handleExportUsers = async (format: "csv" | "excel") => {
    try {
      const csvContent = [
        [
          "Nom",
          "Email",
          "Téléphone",
          "Rôle",
          "Statut",
          "VIP",
          "Date d'inscription",
        ],
        ...filteredUsers.map((user: UserProfile) => [
          user.full_name || "",
          user.email,
          user.phone || "",
          user.role,
          user.profile_validated ? "Validé" : "En attente",
          user.vip_subscription ? "Oui" : "Non",
          formatDate(user.created_at),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `users_export_${new Date().toISOString().split("T")[0]}.${format}`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Log l'action d'audit
      await logAction(
        auditActions.EXPORT_DATA,
        "system", // Pas d'utilisateur spécifique pour l'export
        `Export de données utilisateurs en format ${format.toUpperCase()} - ${
          filteredUsers.length
        } utilisateurs`,
        "admin@example.com",
        {
          format,
          recordCount: filteredUsers.length,
          exportType: "user_data",
          filters: filters,
        }
      );

      showNotification(
        `Export ${format.toUpperCase()} terminé avec succès`,
        "success"
      );
    } catch {
      showNotification("Erreur lors de l'export", "error");
    }
  };

  return (
    <AdminLayout>
      <Box>
        <h2>User Management</h2>
        <p>
          Manage users, subscriptions, and account activities across the
          platform.
        </p>
      </Box>
      <Grid container spacing={3} sx={{ width: "100%", display: "flex" }}>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 0 }}
        >
          <DashboardItem>
            <InfoCard
              title="Total Users"
              value={totalUsers}
              progressText={`${monthlyGrowth} this month`}
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 220 }}
        >
          <DashboardItem>
            <InfoCard
              title="Pending Validations"
              value={pendingValidations}
              progressText={`${pendingValidations} requiring review`}
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 220 }}
        >
          <DashboardItem>
            <InfoCard
              title="Active Users"
              value={activeUsers}
              progressText={`${activeGrowth} from last month`}
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 220 }}
        >
          <DashboardItem>
            <InfoCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              progressText={`${totalBookings} total bookings`}
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
      </Grid>

      {error && (
        <Box sx={{ color: "error.main", mb: 2 }}>
          Error loading users:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Box>
      )}

      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <h3>Users</h3>
            <p>Manage user accounts and subscriptions</p>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Exporter en CSV">
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportUsers("csv")}
              >
                CSV
              </Button>
            </Tooltip>
            <Tooltip title="Exporter en Excel">
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportUsers("excel")}
              >
                Excel
              </Button>
            </Tooltip>
            <Fab
              color="primary"
              size="medium"
              onClick={() => setCreateModalOpen(true)}
              sx={{ ml: 1 }}
            >
              <AddIcon />
            </Fab>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={filters.role}
              label="Role"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, role: e.target.value }))
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="property_owner">Property Owner</MenuItem>
              <MenuItem value="service_provider">Service Provider</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="validated">Validated</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Subscription</InputLabel>
            <Select
              value={filters.subscription}
              label="Subscription"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  subscription: e.target.value,
                }))
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="vip">VIP</MenuItem>
              <MenuItem value="standard">Standard</MenuItem>
            </Select>
          </FormControl>

          {selectedUsers.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={handleBulkValidate}
              >
                Validate Selected ({selectedUsers.length})
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleBulkSuspend}
              >
                Suspend Selected ({selectedUsers.length})
              </Button>
            </Box>
          )}
        </Box>

        <DataTable
          columns={columns}
          data={filteredUsers}
          renderActions={(row: UserProfile) => (
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<RemoveRedEyeOutlinedIcon />}
                onClick={() => handleEditUser(row)}
                sx={{
                  minWidth: "80px",
                  textTransform: "none",
                  fontSize: "0.75rem",
                  px: 1.5,
                  py: 0.5,
                }}
              >
                View
              </Button>
            </Box>
          )}
        />
        {(isLoading || activityLoading) && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            Loading {isLoading ? "users" : "activity data"}...
          </Box>
        )}
      </Box>

      {/* User Management Modal */}
      <DataModal open={modalOpen} onClose={handleCloseModal}>
        {selectedUser && (
          <Box sx={{ p: 3, width: "100%" }}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ mb: 2, color: "primary.main" }}>
                  Personal Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={editForm.full_name || ""}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={editForm.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  variant="outlined"
                  size="small"
                  type="email"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={editForm.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Role"
                  value={editForm.role || ""}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  variant="outlined"
                  size="small"
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="customer">Customer</option>
                  <option value="property_owner">Property Owner</option>
                  <option value="service_provider">Service Provider</option>
                  <option value="admin">Admin</option>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography sx={{ mb: 2, mt: 2, color: "primary.main" }}>
                  Status and Settings
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editForm.profile_validated || false}
                      onChange={(e) =>
                        handleInputChange("profile_validated", e.target.checked)
                      }
                      color="success"
                    />
                  }
                  label="Profile Validated"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editForm.vip_subscription || false}
                      onChange={(e) =>
                        handleInputChange("vip_subscription", e.target.checked)
                      }
                      color="warning"
                    />
                  }
                  label="VIP Subscription"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography sx={{ mb: 2, mt: 2, color: "primary.main" }}>
                  Additional Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Created Date"
                  value={
                    selectedUser.created_at
                      ? new Date(selectedUser.created_at).toLocaleDateString()
                      : ""
                  }
                  variant="outlined"
                  size="small"
                  disabled
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Updated"
                  value={
                    selectedUser.updated_at
                      ? new Date(selectedUser.updated_at).toLocaleDateString()
                      : ""
                  }
                  variant="outlined"
                  size="small"
                  disabled
                />
              </Grid>

              {/* User Activity */}
              {activityData?.[selectedUser.id] && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, mt: 2, color: "primary.main" }}
                    >
                      Activity
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Total Bookings"
                      value={activityData[selectedUser.id].totalBookings}
                      variant="outlined"
                      size="small"
                      disabled
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Total Spent"
                      value={formatCurrency(
                        activityData[selectedUser.id].totalSpent
                      )}
                      variant="outlined"
                      size="small"
                      disabled
                    />
                  </Grid>
                </>
              )}
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleSuspendUser}
              >
                Suspend
              </Button>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveUser}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </DataModal>

      {/* Create User Modal */}
      <DataModal open={createModalOpen} onClose={handleCloseCreateModal}>
        <Box sx={{ p: 3, width: "100%" }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            Create New User
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Full Name"
                value={editForm.full_name || ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Email"
                value={editForm.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                variant="outlined"
                size="small"
                type="email"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone"
                value={editForm.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Role"
                value={editForm.role || ""}
                onChange={(e) => handleInputChange("role", e.target.value)}
                variant="outlined"
                size="small"
                select
                SelectProps={{ native: true }}
              >
                <option value="">Select Role</option>
                <option value="customer">Customer</option>
                <option value="property_owner">Property Owner</option>
                <option value="service_provider">Service Provider</option>
                <option value="admin">Admin</option>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.profile_validated || false}
                    onChange={(e) =>
                      handleInputChange("profile_validated", e.target.checked)
                    }
                    color="success"
                  />
                }
                label="Profile Validated"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.vip_subscription || false}
                    onChange={(e) =>
                      handleInputChange("vip_subscription", e.target.checked)
                    }
                    color="warning"
                  />
                }
                label="VIP Subscription"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" onClick={handleCloseCreateModal}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateUser}
            >
              Create User
            </Button>
          </Box>
        </Box>
      </DataModal>

      {/* Modal d'Audit et Historique */}
      <Dialog
        open={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SecurityIcon />
          Audit et Historique de l&apos;Utilisateur
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={auditTabValue}
            onChange={(_, newValue) => setAuditTabValue(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="Logs d'Audit" />
            <Tab label="Activité de Connexion" />
            <Tab label="Modifications du Profil" />
          </Tabs>

          {auditTabValue === 0 && (
            <List>
              {auditLogs.map((log) => (
                <ListItem key={log.id} divider>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={log.action}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {log.details}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(log.timestamp).toLocaleString()} - Par:{" "}
                          {log.admin_user}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {auditLogs.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Aucun log d'audit trouvé"
                    secondary="Aucune activité récente n'a été enregistrée pour cet utilisateur."
                  />
                </ListItem>
              )}
            </List>
          )}

          {auditTabValue === 1 && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Dernière connexion"
                  secondary="Il y a 2 heures depuis Paris, France"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Sessions actives"
                  secondary="2 sessions actives (Web, Mobile)"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Adresses IP récentes"
                  secondary="192.168.1.1, 10.0.0.1"
                />
              </ListItem>
            </List>
          )}

          {auditTabValue === 2 && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Email modifié"
                  secondary="Il y a 1 semaine - Changé par l'utilisateur"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Téléphone ajouté"
                  secondary="Il y a 2 semaines - Ajouté par l'utilisateur"
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAuditModal(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Réinitialisation de Mot de Passe */}
      <Dialog
        open={showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LockResetIcon />
          Réinitialiser le Mot de Passe
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Êtes-vous sûr de vouloir envoyer un email de réinitialisation de mot
            de passe à cet utilisateur ?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            L&apos;utilisateur recevra un email avec un lien sécurisé pour
            réinitialiser son mot de passe. Le lien expirera dans 24 heures.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordResetModal(false)}>
            Annuler
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmPasswordReset}
          >
            Envoyer l`&apos;Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}
export default UserManagementPage;
