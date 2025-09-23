import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  CircularProgress,
  Typography,
  Alert,
  Container,
} from "@mui/material";
import { AuthProvider, useAuth } from "./providers/authProvider";
import { useAuditLog } from "./hooks/userManagement/useAuditLog";
import { routes } from "./routes/routes";

// MUI Theme for admin panel
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Professional loading component with MUI
const LoadingScreen: React.FC<{ error?: string | null }> = ({ error }) => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "background.default",
    }}
  >
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center" }}>
        {/* Loading spinner */}
        <CircularProgress
          size={60}
          thickness={4}
          sx={{ mb: 3, color: "primary.main" }}
        />

        {/* Loading text */}
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
        >
          Loading Admin Panel...
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Please wait while we initialize your session
        </Typography>

        {/* Error message if any */}
        {error && (
          <Alert severity="error" sx={{ mt: 2, textAlign: "left" }}>
            <strong>Authentication Error:</strong> {error}
          </Alert>
        )}
      </Box>
    </Container>
  </Box>
);

// Separate component to use auth context
const AppContent: React.FC = () => {
  const { session, isAdmin, loading, error } = useAuth();

  // Activer l'audit et le session tracking automatiquement
  useAuditLog(); // Enhanced debugging for development
  if (import.meta.env.DEV) {
    console.log("Auth State Debug:", {
      session: !!session,
      sessionUser: session?.user?.email,
      isAdmin: isAdmin(),
      loading,
      error,
      timestamp: new Date().toISOString(),
      currentPath: window.location.pathname,
    });
  }

  // Show loading spinner while auth is initializing
  if (loading) {
    console.log("App is in loading state, showing LoadingScreen");
    return <LoadingScreen error={error} />;
  }

  // Log redirect decision
  const isAuthenticated = session && isAdmin();
  const redirectTo = isAuthenticated ? "/dashboard" : "/auth";
  const currentPath = window.location.pathname;

  console.log("Redirect Logic:", {
    isAuthenticated,
    redirectTo,
    currentPath,
    shouldRedirect: currentPath === "/",
  });

  return (
    <Router>
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="/" element={<Navigate to={redirectTo} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Router>
  );
};

function App(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <AppContent />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
