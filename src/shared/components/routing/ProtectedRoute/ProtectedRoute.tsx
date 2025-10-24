import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '@/core/providers/auth.provider';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean; // Optional: for different access levels
  fallbackPath?: string; // Optional: custom redirect path
}

const ProtectedRoute = ({
  children,
  requireAdmin = true,
  fallbackPath = '/auth',
}: ProtectedRouteProps) => {
  const { session, isAdmin, loading, error } = useAuth();
  const location = useLocation();

  // Show loading only if auth is still initializing
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress size={40} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Verifying access permissions...
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, maxWidth: 400 }}>
            {error}
          </Alert>
        )}
      </Box>
    );
  }

  // Check if user has session
  if (!session) {
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          px: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body2">
            You don&apos;t have admin privileges to access this page. Please contact your
            administrator if you believe this is an error.
          </Typography>
        </Alert>
        <Navigate to="/auth" replace />
      </Box>
    );
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
