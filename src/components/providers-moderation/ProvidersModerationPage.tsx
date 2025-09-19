import Box from "@mui/material/Box";

import AdminLayout from "../AdminLayout";
import DataTable from "../Table";
import { useProvidersModeration } from "../../hooks/providers-moderation/useProvidersModeration";

/**
 * ProvidersModerationPage Component
 *
 * Reviews and manages service provider profiles, documents, and verifications.
 * Simple interface with header and service providers table.
 *
 * Features:
 * - Service providers management table
 * - Verify/Reject provider applications
 * - Provider profile moderation
 * - Document verification tracking
 * - Edit/Delete actions for providers
 */
function ProvidersModerationPage() {
  const { columns, data } = useProvidersModeration();

  return (
    <AdminLayout>
      {/* Page Header - EXACT comme l'original */}
      <Box>
        <h2>Service Provider Moderation</h2>
        <p>
          Review and manage service provider profiles, documents, and
          verifications.
        </p>
      </Box>

      {/* Service Providers Table - EXACT comme l'original */}
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
