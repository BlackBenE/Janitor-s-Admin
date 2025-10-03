import AdminLayout from "../AdminLayout";
import DashboardItem from "../DashboardItem";
import { Box, Grid } from "@mui/material";
import InfoCard from "../InfoCard";
import DataTable from "../Table";
import { useQuoteRequests } from "../../hooks/quote-requests/useQuoteRequests";

/**
 * QuoteRequestsPage Component
 *
 * Monitors and manages service quote requests and ongoing interventions.
 * Displays quote request statistics and data table.
 *
 * Features:
 * - Quote request statistics overview (4 metric cards)
 * - Service providers data table
 * - Accept/Reject quote requests
 * - Edit/Delete actions for requests
 */
const QuoteRequestsPage = () => {
  const {
    serviceRequests,
    useServiceRequestStats,
    acceptServiceRequest,
    rejectServiceRequest,
  } = useQuoteRequests();

  const { data: stats } = useServiceRequestStats();

  // Mapping pour l'affichage
  const data = serviceRequests;

  // Colonnes pour le tableau
  const columns = [
    { field: "Request ID", headerName: "Request ID" },
    { field: "Client", headerName: "Client" },
    { field: "Service", headerName: "Service" },
    { field: "Location", headerName: "Location" },
    { field: "Priority", headerName: "Priority" },
    { field: "Status", headerName: "Status" },
    { field: "Responses", headerName: "Responses" },
    { field: "Actions", headerName: "Actions" },
  ];

  const handleEdit = (id: string) => {
    console.log("Edit quote request:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete quote request:", id);
  };

  return (
    <AdminLayout>
      {/* Page Header - EXACT comme l'original */}
      <Box>
        <h2>Demandes de devis</h2>
        <p>
          Surveillez et gérez les demandes de devis de service et les
          interventions en cours.
        </p>
      </Box>

      {/* Statistics Cards Grid - EXACT comme l'original */}
      <Grid container spacing={3} sx={{ width: "100%", display: "flex" }}>
        <Grid
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: "flex", flex: 1, minWidth: 0 }}
        >
          <DashboardItem>
            <InfoCard
              title="Total des demandes"
              value={stats?.total || 0}
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
              title="Devis en attente"
              value={stats?.pending || 0}
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
              title="Emplois actifs"
              value={stats?.inProgress || 0}
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
              title="Taux d'achèvement"
              value={stats?.completed || 0}
              progressText="-5 from yesterday"
              showTrending={false}
              progressTextColor="text.secondary"
            />
          </DashboardItem>
        </Grid>
      </Grid>

      {/* Data Table Section - EXACT comme l'original */}
      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <h3>Gestion des demandes de devis</h3>
        <p>Suivre les demandes de service et les réponses des fournisseurs</p>
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
