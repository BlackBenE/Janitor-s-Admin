import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AdminLayout from "../components/AdminLayout";
import InfoCard from "../components/InfoCard";
import DashboardItem from "../components/DashboardItem";
import DataTable from "../components/Table";
import { useUsers } from "../hooks/useUsers";
import { useUserActivity } from "../hooks/useUserActivity";
import { Database } from "../types/database.types";
import { Chip, IconButton } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

function UserManagementPage() {
  const { users, isLoading, error } = useUsers({
    orderBy: "created_at",
  });

  // Get user IDs for activity data
  const userIds = users.map((user: UserProfile) => user.id);
  const { data: activityData, isLoading: activityLoading } =
    useUserActivity(userIds);

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
      field: "User",
      headerName: "User",
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
      field: "Role",
      headerName: "Role",
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
      field: "Subscription",
      headerName: "Subscription",
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Chip
          label={params.row.vip_subscription ? "VIP" : "Standard"}
          color={params.row.vip_subscription ? "warning" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "Status",
      headerName: "Status",
      renderCell: (params: GridRenderCellParams<UserProfile>) => (
        <Chip
          label={params.row.profile_validated ? "Validated" : "Pending"}
          color={params.row.profile_validated ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "Activity",
      headerName: "Activity",
      width: 150,
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
      field: "Spending",
      headerName: "Spending",
      width: 120,
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
  ];

  const handleEditUser = (user: UserProfile) => {
    console.log("Edit user:", user);
    // TODO: Open edit modal or navigate to edit page
  };

  // const handleDeleteUser = (user: UserProfile) => {
  //   if (
  //     window.confirm(
  //       `Are you sure you want to deleteUserdelete ${user.full_name || user.email}?`
  //     )
  //   ) {
  //     deleteUser.mutate(user.id);
  //   }
  // };

  // const handleToggleValidation = (user: UserProfile) => {
  //   updateUser.mutate({
  //     id: user.id,
  //     payload: {
  //       profile_validated: !user.profile_validated,
  //     },
  //   });
  // };

  // Calculate statistics from users data
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (user: UserProfile) => user.profile_validated
  ).length;

  const pendingValidations = users.filter(
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
        <h3>Users</h3>
        <p>Manage user accounts and subscriptions</p>
        <DataTable
          columns={columns}
          data={users}
          renderActions={(row: UserProfile) => (
            <>
              <IconButton
                size="small"
                onClick={() => handleEditUser(row)}
                color="primary"
              ></IconButton>
            </>
          )}
        />
        {(isLoading || activityLoading) && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            Loading {isLoading ? "users" : "activity data"}...
          </Box>
        )}
      </Box>
    </AdminLayout>
  );
}
export default UserManagementPage;
