import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MailIcon from "@mui/icons-material/Mail";
import Box from "@mui/material/Box";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButtonWithBadge from "./IconButtonWithBadge";
import SearchBar from "./SearchBar";

function CustomAppBar(): React.JSX.Element {
  return (
    <Box sx={{ flexGrow: 2 }}>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ boxShadow: "none" }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 2 }}>
            <SearchBar />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }} />
          <IconButtonWithBadge icon={MailIcon} badgeContent={5} color="error" />
          <IconButtonWithBadge
            icon={NotificationsIcon}
            badgeContent={10}
            color="secondary"
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default CustomAppBar;
