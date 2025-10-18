import {
  Card,
  CardContent,
  Box,
  Typography,
  SvgIconProps,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { ComponentType } from "react";

interface InfoCardProps {
  title?: string;
  icon?: ComponentType<SvgIconProps>;
  value?: string | number;
  bottomLeft?: string;
  progressText?: string;
  showTrending?: boolean;
  trendingType?: "up" | "down";
  progressTextColor?: string;
}

function InfoCard({
  title,
  icon: Icon,
  value,
  bottomLeft,
  progressText,
  showTrending = true,
  trendingType = "up",
  progressTextColor = "text.primary",
}: InfoCardProps) {
  return (
    <Card
      sx={{
        width: "100%",
        color: "text.primary",
        background: "none",
        boxShadow: "none",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            {title}
          </Typography>
          {Icon && <Icon fontSize="small" />}
        </Box>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">{bottomLeft}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {showTrending &&
            (trendingType === "up" ? (
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
            ) : (
              <TrendingDownIcon color="error" sx={{ mr: 1 }} />
            ))}
          <Typography variant="body2" color={progressTextColor}>
            {progressText}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default InfoCard;
