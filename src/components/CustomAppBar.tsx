import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MailIcon from "@mui/icons-material/Mail";
import Box from "@mui/material/Box";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButtonWithBadge from "./IconButtonWithBadge";
import { useNotifications } from "../hooks/shared/useNotifications";
import CommunicationDrawer from "./CommunicationDrawer";
import NotificationDrawer from "./NotificationDrawer";
import SearchBar from "./SearchBar";

function CustomAppBar(): React.JSX.Element {
  const [notificationDrawerOpen, setNotificationDrawerOpen] =
    React.useState(false);
  const [communicationDrawerOpen, setCommunicationDrawerOpen] =
    React.useState(false);

  const { useNotificationStats } = useNotifications();
  const { data: stats } = useNotificationStats();

  const handleNotificationClick = () => {
    setNotificationDrawerOpen(true);
  };

  const handleCommunicationClick = () => {
    setCommunicationDrawerOpen(true);
  };

  return (
    <>
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

            <IconButtonWithBadge
              icon={MailIcon}
              badgeContent={5}
              color="error"
              onClick={handleCommunicationClick}
            />
            <IconButtonWithBadge
              icon={NotificationsIcon}
              badgeContent={stats?.unread || 0}
              color="secondary"
              onClick={handleNotificationClick}
            />
          </Toolbar>
        </AppBar>
      </Box>

      {/* Drawers */}
      <NotificationDrawer
        open={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
      <CommunicationDrawer
        open={communicationDrawerOpen}
        onClose={() => setCommunicationDrawerOpen(false)}
      />
    </>
  );
}

export default CustomAppBar;
