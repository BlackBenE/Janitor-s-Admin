import Box from "@mui/material/Box";
import { ReactNode } from "react";

function DashboardItem({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        height: "100%",
        display: "flex",
        alignItems: "stretch",
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
}

export default DashboardItem;
