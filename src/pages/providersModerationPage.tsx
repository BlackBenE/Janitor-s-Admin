import Box from "@mui/material/Box";

import AdminLayout from "../components/AdminLayout";
import DataTable from "../components/Table";

function ProvidersModerationPage() {
  const columns = [
    { field: "Provider", headerName: "Provider" },
    { field: "Service", headerName: "Service" },
    { field: "Location", headerName: "Location" },
    { field: "Rating", headerName: "Rating" },
    { field: "Status", headerName: "Status" },
    { field: "Documents", headerName: "Submitted" },

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
        <h2>Service Provider Moderation</h2>
        <p>
          Review and manage service provider profiles, documents, and
          verifications.
        </p>
      </Box>
      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <h3>Service Providers</h3>
        <p>Moderate provider applications and profiles</p>
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
}

export default ProvidersModerationPage;

// // Example usage in Providers Moderation Page
// const {
//   usePendingProviders,
//   useProviderStats,
//   verifyProvider,
//   rejectProvider,
//   suspendProvider,
//   verifyManyProviders
// } = useProviders();

// const { data: pendingProviders, isLoading } = usePendingProviders();
// const { data: stats } = useProviderStats();

// // Verify a provider
// const handleVerify = (providerId: string) => {
//   verifyProvider.mutate(providerId);
// };

// // Reject a provider
// const handleReject = (providerId: string) => {
//   rejectProvider.mutate(providerId);
// };

// // View stats
// console.log(`Pending Verification: ${stats?.pending}`);
// console.log(`Total Verified: ${stats?.verified}`);
// console.log(`Active Services: ${stats?.activeServices}`);
