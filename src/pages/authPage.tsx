import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import Form, { FormField } from "../components/Form";
import { useAuth } from "../hooks/useAuth";

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
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSignIn = async (data: Record<string, string>) => {
    try {
      setMessage(null);
      await signIn(data.email, data.password);
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: (error as Error).message || "Sign in failed",
      });
    }
  };

  const handleSignUp = async (data: Record<string, string>) => {
    try {
      setMessage(null);
      if (data.password !== data.confirmPassword) {
        setMessage({ type: "error", text: "Passwords don't match" });
        return;
      }
      await signUp(data.email, data.password, data.fullName);
      setMessage({
        type: "success",
        text: "Admin account created successfully. Please sign in.",
      });
      setCurrentView("signin");
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: (error as Error).message || "Sign up failed",
      });
    }
  };

  const handleForgotPassword = async (data: Record<string, string>) => {
    try {
      setMessage(null);
      await resetPassword(data.email);
      setMessage({
        type: "success",
        text: "Password reset email sent. Check your inbox.",
      });
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: (error as Error).message || "Password reset failed",
      });
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
            submitButtonText="Sign In"
          />
        );
      case "signup":
        return (
          <Form
            title="Create Admin Account"
            fields={signupFields}
            onSubmit={handleSignUp}
            submitButtonText="Create Account"
          />
        );
      case "forgot-password":
        return (
          <Form
            title="Reset Password"
            fields={forgotPasswordFields}
            onSubmit={handleForgotPassword}
            submitButtonText="Send Reset Email"
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
