import React, { useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

import AdminLayout from "../AdminLayout";
import { LoadingIndicator } from "../shared";
import DataTable from "../Table";
import { LABELS } from "../../constants";

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
      showNotification(LABELS.quoteRequests.messages.deleteSuccess);
      refetch();
    } catch (error) {
      showNotification(LABELS.quoteRequests.messages.deleteError, "error");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveQuoteRequest.mutateAsync(id);
      showNotification(LABELS.quoteRequests.messages.approveSuccess);
      refetch();
    } catch (error) {
      showNotification(LABELS.quoteRequests.messages.approveError, "error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectQuoteRequest.mutateAsync({
        id,
        reason: LABELS.quoteRequests.messages.rejectedByAdmin,
      });
      showNotification(LABELS.quoteRequests.messages.rejectSuccess);
      refetch();
    } catch (error) {
      showNotification(LABELS.quoteRequests.messages.rejectError, "error");
    }
  };

  // Colonnes pour le tableau
  const columns = [
    { field: "id", headerName: LABELS.quoteRequests.table.headers.requestId },
    {
      field: "requester_id",
      headerName: LABELS.quoteRequests.table.headers.clientId,
    },
    {
      field: "service_id",
      headerName: LABELS.quoteRequests.table.headers.serviceId,
    },
    { field: "status", headerName: LABELS.quoteRequests.table.headers.status },
    {
      field: "total_amount",
      headerName: LABELS.quoteRequests.table.headers.amount,
      render: (value: number) => formatters.currency(value || 0),
    },
    {
      field: "created_at",
      headerName: LABELS.quoteRequests.table.headers.createdAt,
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
          <p>
            {LABELS.quoteRequests.messages.loadError}: {error.message}
          </p>
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
          showNotification(
            LABELS.quoteRequests.messages.exportInProgress,
            "info"
          );
          // TODO: Implémenter l'export
        }}
        onAddQuoteRequest={() => {
          showNotification(
            LABELS.quoteRequests.messages.addToImplement,
            "info"
          );
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
        <h3>
          {LABELS.quoteRequests.table.title} ({quoteRequests.length})
        </h3>
        <p>{LABELS.quoteRequests.table.subtitle}</p>
        <DataTable
          columns={columns}
          data={quoteRequests as any[]}
          renderActions={(quoteRequest: any) => (
            <>
              <button onClick={() => handleEdit(quoteRequest)}>
                {LABELS.quoteRequests.actions.edit}
              </button>
              {quoteRequest.status === "pending" && (
                <>
                  <button onClick={() => handleApprove(quoteRequest.id)}>
                    {LABELS.quoteRequests.actions.approve}
                  </button>
                  <button onClick={() => handleReject(quoteRequest.id)}>
                    {LABELS.quoteRequests.actions.reject}
                  </button>
                </>
              )}
              <button onClick={() => handleDelete(quoteRequest.id)}>
                {LABELS.quoteRequests.actions.delete}
              </button>
            </>
          )}
        />
      </Box>
    </AdminLayout>
  );
};

export default QuoteRequestsPage;
