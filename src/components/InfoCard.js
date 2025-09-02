import { Card, CardContent, Box, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function InfoCard({
  title,
  icon: Icon,
  value,
  bottomLeft,
  progressText,
  showTrending = true,
  progressTextColor = "text.primary",
}) {
  return (
    <Card
      sx={{
        minWidth: 250,
        color: "text.primary",
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
          <Typography variant="body2">{title}</Typography>
          <Icon fontSize="small" />
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
          {showTrending && <TrendingUpIcon color="success" sx={{ mr: 1 }} />}
          <Typography variant="body2" color={progressTextColor}>
            {progressText}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default InfoCard;
