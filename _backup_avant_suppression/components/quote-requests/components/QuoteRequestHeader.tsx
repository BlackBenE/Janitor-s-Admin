import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { LABELS } from "../../../constants";

interface QuoteRequestHeaderProps {
  onRefresh: () => void;
  onExport: () => Promise<void>;
  onAddQuoteRequest?: () => void;
  isLoading?: boolean;
  totalCount?: number;
}

export const QuoteRequestHeader: React.FC<QuoteRequestHeaderProps> = ({
  onRefresh,
  onExport,
  onAddQuoteRequest,
  isLoading = false,
  totalCount = 0,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {LABELS.quoteRequests.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {LABELS.quoteRequests.subtitle} ({totalCount}{" "}
          {LABELS.quoteRequests.messages.requestsCount})
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        {onAddQuoteRequest && (
          <Tooltip title={LABELS.quoteRequests.actions.addRequest}>
            <IconButton onClick={onAddQuoteRequest} disabled={isLoading}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={LABELS.quoteRequests.actions.refresh}>
          <IconButton onClick={onRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={LABELS.quoteRequests.actions.export}>
          <IconButton onClick={onExport} disabled={isLoading}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
