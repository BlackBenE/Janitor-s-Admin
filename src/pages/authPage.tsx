import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import Form, { FormField } from "../components/Form";
import { useAuth } from "../providers/authProvider";

type AuthView = "signin" | "signup" | "forgot-password";

const signinFields: FormField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    minLength: 6,
  },
];

const signupFields: FormField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    minLength: 8,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true,
    minLength: 8,
  },
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    required: true,
  },

  {
    name: "phone",
    label: "Phone number",
    type: "number",
    required: true,
  },
];

const forgotPasswordFields: FormField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
  },
];

function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>("signin");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, signUp, resetPassword, session, isAdmin, loading, error } =
    useAuth();

  useEffect(() => {
    if (!loading && session && isAdmin()) {
      console.log("User already authenticated, should redirect to dashboard");
    }
  }, [session, isAdmin, loading]);

  // Show global auth errors
  useEffect(() => {
    if (error) {
      setMessage({
        type: "error",
        text: error,
      });
    }
  }, [error]);

  // Redirect authenticated admin users
  if (!loading && session && isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading while auth is initializing
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white" }} />
      </Box>
    );
  }

  const handleSignIn = async (data: Record<string, string>) => {
    try {
      setMessage(null);
      setIsSubmitting(true);

      const result = await signIn(data.email, data.password);

      if (result.error) {
        setMessage({
          type: "error",
          text: result.error.message,
        });
      } else {
        setMessage({
          type: "success",
          text: "Sign in successful! Redirecting...",
        });
        // Navigation will be handled by the useEffect/Navigate component
      }
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: (error as Error).message || "Sign in failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (data: Record<string, string>) => {
    try {
      setMessage(null);
      setIsSubmitting(true);

      if (data.password !== data.confirmPassword) {
        setMessage({ type: "error", text: "Passwords don't match" });
        return;
      }

      const result = await signUp(
        data.email,
        data.password,
        data.fullName,
        data.phone
      );

      if (result.error) {
        setMessage({
          type: "error",
          text: result.error.message,
        });
      } else {
        setMessage({
          type: "success",
          text: "Admin account created successfully. Please sign in.",
        });
        setCurrentView("signin");
      }
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: (error as Error).message || "Sign up failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (data: Record<string, string>) => {
    try {
      setMessage(null);
      setIsSubmitting(true);

      const result = await resetPassword(data.email);

      if (result.error) {
        setMessage({
          type: "error",
          text: result.error.message,
        });
      } else {
        setMessage({
          type: "success",
          text: "Password reset email sent. Check your inbox.",
        });
      }
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: (error as Error).message || "Password reset failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    switch (currentView) {
      case "signin":
        return (
          <Form
            title="Admin Sign In"
            fields={signinFields}
            onSubmit={handleSignIn}
            submitButtonText={isSubmitting ? "Signing In..." : "Sign In"}
          />
        );
      case "signup":
        return (
          <Form
            title="Create Admin Account"
            fields={signupFields}
            onSubmit={handleSignUp}
            submitButtonText={
              isSubmitting ? "Creating Account..." : "Create Account"
            }
          />
        );
      case "forgot-password":
        return (
          <Form
            title="Reset Password"
            fields={forgotPasswordFields}
            onSubmit={handleForgotPassword}
            submitButtonText={isSubmitting ? "Sending..." : "Send Reset Email"}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              marginBottom: 3,
            }}
          >
            Admin Portal
          </Typography>

          <Tabs
            value={currentView}
            onChange={(_, newValue) => {
              setCurrentView(newValue);
              setMessage(null);
            }}
            centered
            sx={{ marginBottom: 3 }}
          >
            <Tab label="Sign In" value="signin" />
            <Tab label="Create Admin" value="signup" />
            <Tab label="Reset Password" value="forgot-password" />
          </Tabs>

          {message && (
            <Alert
              severity={message.type}
              sx={{ marginBottom: 2 }}
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          )}

          {renderForm()}

          {currentView !== "signin" && (
            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Button variant="text" onClick={() => setCurrentView("signin")}>
                Back to Sign In
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default AuthPage;
