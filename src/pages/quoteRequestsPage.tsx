import AdminLayout from "../components/AdminLayout";
import DashboardItem from "../components/DashboardItem";
import { Box, Grid } from "@mui/material";
import InfoCard from "../components/InfoCard";
import DataTable from "../components/Table";

const QuoteRequestsPage = () => {
  const columns = [
    { field: "Request ID", headerName: "Request ID" },
    { field: "Client", headerName: "Client" },
    { field: "Service", headerName: "Service" },
    { field: "Location", headerName: "Location" },
    { field: "Priority", headerName: "Priority" },
    { field: "Status", headerName: "Status" },
    { field: "Responses", headerName: "Responses" },
    { field: "Actions", headerName: "Actions" },

    // ...other columns
  ];

  const data = [
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
    {
      Provider: "ABC Cleaning Services",
      Service: "Cleaning",
      Location: "New York",
      Rating: "4.8",
      Status: "Pending",
      Documents: "Uploaded",
    },
  ];

  return (
    <AdminLayout>
      <Box>
        <h2>Quote Requests</h2>
        <p>
          Monitor and manage service quote requests and ongoing interventions.
        </p>
      </Box>
      <Grid container spacing={3} sx={{ width: "100%", display: "flex" }}>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 0 }}
        >
          <DashboardItem>
            <InfoCard
              title="Total Requests"
              value={1200}
              progressText="+170 this month"
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
              title="Pending Quotes"
              value={1200}
              progressText="+95 this month"
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
              title="Active Jobs"
              value={1200}
              progressText="+15.3% from last month"
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
              title="Completion Rate"
              value={1200}
              progressText="-5 from yesterday"
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <h3>Users</h3>
        <p>Manage user accounts and subscriptions</p>
        <DataTable
          columns={columns}
          data={data}
          renderActions={() => (
            <>
              <button>Edit</button>
              <button>Delete</button>
            </>
          )}
        />
      </Box>
    </AdminLayout>
  );
};

export default QuoteRequestsPage;

// // Example usage in Quote Requests Page
// const {
//   usePendingServiceRequests,
//   useServiceRequestStats,
//   acceptServiceRequest,
//   rejectServiceRequest,
//   acceptManyServiceRequests
// } = useQuoteRequests();

// const { data: pendingRequests, isLoading } = usePendingServiceRequests();
// const { data: stats } = useServiceRequestStats();

// // Accept a quote request
// const handleAccept = (requestId: string) => {
//   acceptServiceRequest.mutate(requestId);
// };

// // View stats
// console.log(`Total Revenue: $${stats?.totalRevenue}`);
// console.log(`Pending: ${stats?.pending}`);
