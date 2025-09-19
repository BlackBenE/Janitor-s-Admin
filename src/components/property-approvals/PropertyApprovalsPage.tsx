import React from "react";
import AdminLayout from "../AdminLayout";
import { Box } from "@mui/material";
import DataTable from "../Table";
import { usePropertyApprovals } from "../../hooks/property-approvals/usePropertyApprovals";

/**
 * PropertyApprovalsPage Component
 *
 * Reviews and moderates property listings submitted by landlords.
 * Simple interface with header and property listings table.
 *
 * Features:
 * - Property listings management table
 * - Approve/Reject property submissions
 * - Edit/Delete actions for properties
 * - Property status tracking
 */
const PropertyApprovalsPage = () => {
  const { columns, data } = usePropertyApprovals();

  return (
    <AdminLayout>
      {/* Page Header - EXACT comme l'original */}
      <Box>
        <h2>Property Management</h2>
        <p>Review and moderate property listings submitted by landlords.</p>
      </Box>

      {/* Property Listings Table - EXACT comme l'original */}
      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <h3>Property Listings</h3>
        <p>Manage property submissions and approvals</p>
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

export default PropertyApprovalsPage;
