import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routes } from "./routes/routes";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/loginPage";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App(): React.ReactElement {
  const { session, initialize, loading } = useAuth();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  // For debugging
  console.log("Auth State:", { session, loading });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route
              path="/login"
              element={
                !session ? <LoginPage /> : <Navigate to="/dashboard" replace />
              }
            />
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  session ? route.element : <Navigate to="/login" replace />
                }
              />
            ))}
            <Route
              path="/"
              element={
                <Navigate to={session ? "/dashboard" : "/login"} replace />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
