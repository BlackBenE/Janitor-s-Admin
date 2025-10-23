import React, { useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

import AdminLayout from "../AdminLayout";
import { LoadingIndicator } from "../shared";
import DataTable from "../Table";

import { QuoteRequestHeader } from "./components/QuoteRequestHeader";
import { QuoteRequestStatsSection } from "./components/QuoteRequestStatsSection";

// Hooks
import {
  useQuoteRequests,
  useQuoteRequestStats,
  useQuoteRequestManagement,
  useQuoteRequestMutations,
} from "./hooks";

// Types
import { QuoteRequestWithDetails } from "../../types/quoteRequests";

/**
 * QuoteRequestsPage Component
 *
 * Monitors and manages service quote requests and ongoing interventions.
 * Displays quote request statistics and data table.
 *
 * Features:
 * - Quote request statistics overview (4 metric cards)
 * - Quote requests data table with filters and actions
 * - Accept/Reject quote requests
 * - Edit/Delete actions for requests
 */
export const QuoteRequestsPage: React.FC = () => {
  // Management hook for UI state
  const {
    filters,
    updateFilters,
    selectedQuoteRequests,
    handleSelectQuoteRequest,
    handleSelectAllQuoteRequests,
    openEditModal,
    showNotification,
    formatters,
  } = useQuoteRequestManagement();

  // Data hooks
  const {
    data: quoteRequests = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuoteRequests({
    filters,
    orderBy: "created_at",
    orderDirection: "desc",
  });

  const { data: stats } = useQuoteRequestStats();

  const { approveQuoteRequest, rejectQuoteRequest, deleteQuoteRequest } =
    useQuoteRequestMutations();

  // Handlers
  const handleEdit = (quoteRequest: QuoteRequestWithDetails) => {
    openEditModal(quoteRequest);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuoteRequest.mutateAsync(id);
      showNotification("Demande supprimée avec succès");
      refetch();
    } catch (error) {
      showNotification("Erreur lors de la suppression", "error");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveQuoteRequest.mutateAsync(id);
      showNotification("Demande approuvée avec succès");
      refetch();
    } catch (error) {
      showNotification("Erreur lors de l'approbation", "error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectQuoteRequest.mutateAsync({
        id,
        reason: "Rejetée par l'admin",
      });
      showNotification("Demande rejetée avec succès");
      refetch();
    } catch (error) {
      showNotification("Erreur lors du rejet", "error");
    }
  };

  // Colonnes pour le tableau
  const columns = [
    { field: "id", headerName: "Request ID" },
    { field: "requester_id", headerName: "Client ID" },
    { field: "service_id", headerName: "Service ID" },
    { field: "status", headerName: "Status" },
    {
      field: "total_amount",
      headerName: "Montant",
      render: (value: number) => formatters.currency(value || 0),
    },
    {
      field: "created_at",
      headerName: "Date création",
      render: (value: string) => formatters.date(value),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingIndicator />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Box>
          <h2>Erreur</h2>
          <p>Impossible de charger les demandes de devis: {error.message}</p>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <QuoteRequestHeader
        onRefresh={refetch}
        onExport={async () => {
          showNotification("Export en cours...", "info");
          // TODO: Implémenter l'export
        }}
        onAddQuoteRequest={() => {
          showNotification("Ajout de demande - À implémenter", "info");
          // TODO: Ouvrir modal d'ajout
        }}
        isLoading={isFetching}
        totalCount={quoteRequests.length}
      />

      {/* Statistics Section */}
      <QuoteRequestStatsSection
        stats={
          stats || {
            totalRequests: 0,
            pendingRequests: 0,
            acceptedRequests: 0,
            inProgressRequests: 0,
            completedRequests: 0,
            cancelledRequests: 0,
            rejectedRequests: 0,
            totalRevenue: 0,
            averageAmount: 0,
            averageCompletionTime: 0,
          }
        }
        isLoading={!stats}
      />

      {/* Data Table Section */}
      <Box sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 4, p: 2 }}>
        <h3>Gestion des demandes de devis ({quoteRequests.length})</h3>
        <p>Suivre les demandes de service et les réponses des fournisseurs</p>
        <DataTable
          columns={columns}
          data={quoteRequests as any[]}
          renderActions={(quoteRequest: any) => (
            <>
              <button onClick={() => handleEdit(quoteRequest)}>Edit</button>
              {quoteRequest.status === "pending" && (
                <>
                  <button onClick={() => handleApprove(quoteRequest.id)}>
                    Approuver
                  </button>
                  <button onClick={() => handleReject(quoteRequest.id)}>
                    Rejeter
                  </button>
                </>
              )}
              <button onClick={() => handleDelete(quoteRequest.id)}>
                Delete
              </button>
            </>
          )}
        />
      </Box>
    </AdminLayout>
  );
};

export default QuoteRequestsPage;
