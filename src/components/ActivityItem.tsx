import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { orange, blue, green } from "@mui/material/colors";

// Mettez à jour les couleurs pour correspondre au fond de la pastille
type Status = "Pending" | "Review Required" | "Completed";

const statusColors: Record<Status, { text: string; background: string }> = {
  Pending: { text: orange[500], background: orange[50] },
  "Review Required": { text: blue[500], background: blue[50] },
  Completed: { text: green[500], background: green[50] },
};

const statusIcons: Record<Status, React.ReactNode> = {
  Pending: <HourglassEmptyIcon sx={{ color: orange[500] }} />,
  "Review Required": <AccessTimeIcon sx={{ color: blue[500] }} />,
  Completed: <CheckCircleOutlineIcon sx={{ color: green[500] }} />,
};

interface ActivityItemProps {
  status: Status;
  title: string;
  description: string;
  actionLabel?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  status,
  title,
  description,
  actionLabel,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderBottom: "1px solid #e0e0e0", // Bordure fine en bas pour séparer les items
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ mr: 2 }}>{statusIcons[status]}</Box>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>

      {/* Ajout des encadrements pour les statuts */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: "16px", // forme de pastille
            backgroundColor: statusColors[status].background,
            color: statusColors[status].text,
            fontWeight: "bold",
            fontSize: "0.8rem",
          }}
        >
          {status}
        </Box>
        {actionLabel && (
          <Button
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "#1a202c",
              color: "white",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#2d3748",
              },
            }}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ActivityItem;
