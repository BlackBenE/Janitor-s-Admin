import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

export const DashboardStatsSkeleton = () => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      {[1, 2, 3, 4].map((item) => (
        <Box key={item} sx={{ flex: "1 1 220px" }}>
          <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={34} sx={{ my: 1 }} />
            <Skeleton variant="text" width="30%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const DashboardChartsSkeleton = () => {
  return (
    <Box
      sx={{
        mb: 8,
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {[1, 2].map((item) => (
        <Box
          key={item}
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 8px)",
            },
            bgcolor: "background.paper",
            borderRadius: 1,
            p: 2,
          }}
        >
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Box>
      ))}
    </Box>
  );
};

export const DashboardActivitiesSkeleton = () => {
  return (
    <Box
      sx={{
        mt: 2,
        border: "1px solid #ddd",
        borderRadius: 4,
        p: 2,
      }}
    >
      <Skeleton variant="text" width="20%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />

      {[1, 2, 3].map((item) => (
        <Box
          key={item}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            "&:last-child": { borderBottom: "none" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ mr: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={100} height={32} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
