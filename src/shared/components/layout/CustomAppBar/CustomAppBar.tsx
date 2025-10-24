import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
import IconButtonWithBadge from '@/shared/components/feedback/IconButtonWithBadge';
import CommunicationDrawer from '@/shared/components/communication/CommunicationDrawer';
import SearchBar from '@/shared/components/forms/SearchBar';
import CacheStatusIndicator from '@/shared/components/feedback/CacheStatusIndicator';

function CustomAppBar(): React.JSX.Element {
  const [communicationDrawerOpen, setCommunicationDrawerOpen] = React.useState(false);

  const handleCommunicationClick = () => {
    setCommunicationDrawerOpen(true);
  };

  return (
    <>
      <Box sx={{ flexGrow: 2 }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ boxShadow: 'none' }}>
          <Toolbar>
            <Box sx={{ flexGrow: 2 }}>
              <SearchBar />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
              <CacheStatusIndicator />
            </Box>

            <IconButtonWithBadge
              icon={MailIcon}
              badgeContent={5}
              color="error"
              onClick={handleCommunicationClick}
            />
          </Toolbar>
        </AppBar>
      </Box>

      {/* Communication Drawer */}
      <CommunicationDrawer
        open={communicationDrawerOpen}
        onClose={() => setCommunicationDrawerOpen(false)}
      />
    </>
  );
}

export default CustomAppBar;
