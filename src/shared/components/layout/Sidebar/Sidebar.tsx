import React, { FC } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ProfileButton from '@/shared/components/layout/ProfileButton';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '@/routes/routes';
import { alpha, useTheme } from '@mui/material/styles';
import { SvgIconComponent } from '@mui/icons-material';
import { COMMON_LABELS } from '@/shared/constants';

interface Route {
  path: string;
  icon?: SvgIconComponent;
  element: React.ReactNode;
}

interface SidebarProps {
  className?: string;
}

const Sidebar: FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box
      className={className}
      sx={{
        width: 300,
        bgcolor: '#FAFAFA',
        minHeight: '100vh',
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Box
            component="div"
            sx={{
              fontWeight: 'bold',
              fontSize: 18,
              color: theme.palette.text.primary,
              mt: 1,
            }}
          >
            {COMMON_LABELS.navigation.adminDashboard}
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ px: 1.5 }}>
          {routes
            .filter(
              (route: Route) =>
                route.path !== '/auth' &&
                route.path !== '/reset-password' &&
                route.path !== '/profile'
            )
            .map((route: Route) => {
              const isSelected = location.pathname === route.path;

              // Mapping des routes vers les labels
              const routeLabelMap: Record<string, string> = {
                '/': COMMON_LABELS.navigation.dashboard,
                '/user-management': COMMON_LABELS.navigation.userManagement,
                '/payments': COMMON_LABELS.navigation.payments,
                '/analytics': COMMON_LABELS.navigation.analytics,
                '/services': COMMON_LABELS.navigation.services,
                '/property-approvals': COMMON_LABELS.navigation.propertyApprovals,
                '/quote-requests': COMMON_LABELS.navigation.quoteRequests,
                '/services-catalog': COMMON_LABELS.navigation.servicesCatalog,
                '/financial-overview': COMMON_LABELS.navigation.financialOverview,
              };

              const formattedLabel =
                routeLabelMap[route.path] ||
                route.path
                  .replace('/', '')
                  .replace(/-/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                COMMON_LABELS.navigation.dashboard;

              return (
                <ListItem
                  key={route.path}
                  component={Link}
                  to={route.path}
                  disablePadding
                  sx={{
                    mb: 0.5,
                    borderRadius: 1,
                    minHeight: 40,
                    width: '100%',
                    color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                    backgroundColor: isSelected
                      ? alpha(theme.palette.primary.main, 0.08)
                      : 'transparent',
                    transition: theme.transitions.create(['background-color', 'color'], {
                      duration: theme.transitions.duration.short,
                    }),
                    '&:hover': {
                      backgroundColor: isSelected
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.primary.main, 0.04),
                    },
                    '& .MuiListItemIcon-root': {
                      color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                      minWidth: 36,
                      transition: theme.transitions.create('color'),
                    },
                    '& .MuiListItemText-primary': {
                      fontSize: 14,
                      fontWeight: isSelected ? 600 : 400,
                    },
                    px: 1.5,
                  }}
                >
                  {route.icon && (
                    <ListItemIcon>
                      <route.icon />
                    </ListItemIcon>
                  )}
                  <ListItemText primary={formattedLabel} />
                </ListItem>
              );
            })}
        </List>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ width: '100%', px: 1 }}>
          <ProfileButton compact />
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
