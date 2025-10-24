import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar";
import CustomAppBar from "./CustomAppBar";
import Divider from "@mui/material/Divider";

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <CustomAppBar />
          <Divider />
        </Box>
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            px: { xs: 2, md: 6, lg: 10 },
            py: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout;
