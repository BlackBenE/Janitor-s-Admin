import React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import {
  Payment as PaymentIcon,
  Email as EmailIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

interface PaymentActionsProps {
  selectedPayments: string[];
  onBulkMarkPaid: () => void;
  onBulkSendReminders: () => void;
  onBulkCancel: () => void;
  onBulkExport: () => void;
}

export const PaymentActions: React.FC<PaymentActionsProps> = ({
  selectedPayments,
  onBulkMarkPaid,
  onBulkSendReminders,
  onBulkCancel,
  onBulkExport,
}) => {
  if (selectedPayments.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
      <Tooltip title={`Mark ${selectedPayments.length} payment(s) as paid`}>
        <Button
          variant="contained"
          size="small"
          startIcon={<PaymentIcon />}
          onClick={onBulkMarkPaid}
          color="success"
        >
          Mark as Paid ({selectedPayments.length})
        </Button>
      </Tooltip>

      <Tooltip
        title={`Send reminders for ${selectedPayments.length} payment(s)`}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<EmailIcon />}
          onClick={onBulkSendReminders}
        >
          Send Reminders
        </Button>
      </Tooltip>

      <Tooltip title={`Cancel ${selectedPayments.length} payment(s)`}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CancelIcon />}
          onClick={onBulkCancel}
          color="error"
        >
          Cancel
        </Button>
      </Tooltip>

      <Tooltip title={`Export ${selectedPayments.length} payment(s)`}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={onBulkExport}
        >
          Export
        </Button>
      </Tooltip>
    </Box>
  );
};
