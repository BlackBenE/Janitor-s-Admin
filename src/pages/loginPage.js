import { Box, Typography, Paper } from "@mui/material";
import LoginForm from "../components/LoginForm";
import React from "react";

function Login() {
  // Example submit handler
  const handleLogin = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    // Add your login logic here
    console.log("Email:", email, "Password:", password);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 350, width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>
        <LoginForm onSubmit={handleLogin} />
      </Paper>
    </Box>
  );
}

export default Login;
