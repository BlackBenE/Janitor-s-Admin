import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import AdminLayout from "../components/AdminLayout";
import InfoCard from "../components/InfoCard";
import DashboardItem from "../components/DashboardItem";
import DataTable from "../components/Table";
import { useList, useDelete } from "../hooks/useCrud";
import { Tables } from "../types/database.types";
import { supabase } from "../lib/supabase";

type Profile = Tables<"profiles">;

function UserManagementPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [directQueryResult, setDirectQueryResult] = useState<{
    allUsers: Profile[] | null;
    count: number | null;
    allUsersError: Error | null;
    limitedUsers: Profile[] | null;
    limitedError: Error | null;
  } | null>(null);

  // Direct Supabase query for debugging
  useEffect(() => {
    const testDirectQuery = async () => {
      console.log("Testing direct Supabase query...");

      // Test with different approaches
      const {
        data: allUsers,
        error: allUsersError,
        count,
      } = await supabase.from("profiles").select("*", { count: "exact" });

      console.log("Direct query - All users:", allUsers);
      console.log("Direct query - Count:", count);
      console.log("Direct query - Error:", allUsersError);

      // Test with limit
      const { data: limitedUsers, error: limitedError } = await supabase
        .from("profiles")
        .select("*")
        .limit(100);

      console.log("Direct query - Limited users:", limitedUsers);
      console.log("Direct query - Limited error:", limitedError);

      setDirectQueryResult({
        allUsers,
        count,
        allUsersError,
        limitedUsers,
        limitedError,
      });
    };

    testDirectQuery();
  }, []);

  // Use Admiral CRUD system to fetch users
  const {
    data: users,
    loading,
    error,
    refetch,
  } = useList<Profile>("profiles", {
    pagination: { page: 1, perPage: 1000 }, // Fetch up to 1000 users
    sort: { field: "created_at", order: "DESC" }, // Sort by newest first
  });
  const { deleteOne, loading: deleteLoading } = useDelete<Profile>("profiles");

  // Debug: Log the users data to see what we're getting
  console.log("Admiral CRUD - Users data:", users);
  console.log("Admiral CRUD - Users count:", users.length);
  console.log("Admiral CRUD - Loading:", loading);
  console.log("Admiral CRUD - Error:", error);
  console.log("Direct query result:", directQueryResult);

  // Calculate statistics
  const userStats = useMemo(() => {
    const totalUsers = users.length;
    const activeSubscriptions = users.filter((u) => u.vip_subscription).length;
    const monthlyRevenue = 15000; // Mock data - you can calculate from actual subscription data
    const supportTickets = 23; // Mock data - you can fetch from actual support tickets

    return {
      totalUsers,
      activeSubscriptions,
      monthlyRevenue,
      supportTickets,
    };
  }, [users]);

  const handleDeleteClick = (user: Profile) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      await deleteOne(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      refetch();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

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
    switch (role) {
      case "admin":
        return "error";
      case "property_owner":
        return "primary";
      case "service_provider":
        return "secondary";
      case "traveler":
        return "success";
      default:
        return "default";
    }
  };

  // Define table columns
  const columns: GridColDef[] = [
    { field: "full_name", headerName: "Full Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value.replace("_", " ")}
          color={getRoleColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "profile_validated",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Validated" : "Pending"}
          color={params.value ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "vip_subscription",
      headerName: "VIP",
      width: 100,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? <Chip label="VIP" color="primary" size="small" /> : "—",
    },
    {
      field: "created_at",
      headerName: "Joined",
      width: 120,
      renderCell: (params: GridRenderCellParams) =>
        new Date(params.value).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <Box>
          <Typography variant="h4">Loading users...</Typography>
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Box>
          <Typography variant="h4" color="error">
            Error loading users: {error.message}
          </Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Manage platform users, roles, and permissions
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid
        container
        spacing={3}
        sx={{ width: "100%", display: "flex", mb: 3 }}
      >
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 0 }}
        >
          <DashboardItem>
            <InfoCard
              title="Total Users"
              icon={PersonOutlineIcon}
              value={userStats.totalUsers}
              bottomLeft="All registered users"
              progressText={`${userStats.totalUsers} total`}
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
              title="Active Subscriptions"
              icon={SubscriptionsIcon}
              value={userStats.activeSubscriptions}
              bottomLeft="VIP subscribers"
              progressText={`${userStats.activeSubscriptions} active`}
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
              title="Revenue (Monthly)"
              icon={EuroOutlinedIcon}
              value={userStats.monthlyRevenue}
              bottomLeft="Current month"
              progressText={`€${userStats.monthlyRevenue.toLocaleString()}`}
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
              title="Support Tickets"
              icon={SupportAgentIcon}
              value={userStats.supportTickets}
              bottomLeft="Open tickets"
              progressText={`${userStats.supportTickets} pending`}
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
      </Grid>

      {/* User Management Section */}
      <Box sx={{ border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h3">
            Platform Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor user accounts
          </Typography>
        </Box>

        <DataTable
          columns={columns}
          data={users}
          renderActions={(row: Profile) => (
            <>
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  // Handle edit - you can implement navigation to edit form
                  console.log("Edit user:", row.id);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteClick(row)}
                disabled={deleteLoading}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user &quot;
            {userToDelete?.full_name || userToDelete?.email}&quot;? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default UserManagementPage;
