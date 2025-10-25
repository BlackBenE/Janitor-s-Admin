import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import SearchBar from '@/shared/components/forms/SearchBar';
import CacheStatusIndicator from '@/shared/components/feedback/CacheStatusIndicator';

function CustomAppBar(): React.JSX.Element {
  return (
    <>
      <Box sx={{ flexGrow: 2 }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ boxShadow: 'none' }}>
          <Toolbar>
            {/* Barre de recherche - Cachée */}
            {/* <Box sx={{ flexGrow: 2 }}>
              <SearchBar />
            </Box> */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
              <CacheStatusIndicator />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default CustomAppBar;
