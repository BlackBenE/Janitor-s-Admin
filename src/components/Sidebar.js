import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Divider from "@mui/material/Divider";
import ProfileButton from "./profileButton";

import { Link } from "react-router-dom";
import { routes } from "../routes/routes";

function Sidebar() {
  return (
    <Box
      sx={{
        width: 220,
        bgcolor: "#FAFAFA",
        minHeight: "100vh",
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
          }}
        >
          <Box sx={{ fontWeight: "bold", fontSize: 18, color: "black", mt: 1 }}>
            Admin Dashboard
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          {routes
            .filter(
              (route) =>
                route.path !== "/login" &&
                route.path !== "/settings" &&
                route.path !== "/profile"
            )
            .map((route) => (
              <ListItem
                button
                key={route.path}
                component={Link}
                to={route.path}
                sx={{
                  mb: 0.5,
                  borderRadius: 1,
                  minHeight: 40,
                  color: "black",
                  "& .MuiListItemIcon-root": { color: "black" },
                  "& .MuiListItemText-primary": { fontSize: 12 },
                }}
              >
                {route.icon && (
                  <ListItemIcon>
                    <route.icon />
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={
                    route.path
                      .replace("/", "")
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()) || "Dashboard"
                  }
                />
              </ListItem>
            ))}
        </List>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ width: "100%", display: "flex", pl: 1 }}>
          <ProfileButton />
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
