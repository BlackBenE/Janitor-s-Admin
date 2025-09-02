import Box from "@mui/material/Box";
import Sidebar from "./Sidebar";
import CustomAppBar from "./CustomAppBar";
import Divider from "@mui/material/Divider";

function AdminLayout({ children }) {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <CustomAppBar />
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            flexGrow: 1,
            px: { xs: 2, md: 6, lg: 10 },
            py: 2,
            overflow: "auto",
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
export default AdminLayout;
