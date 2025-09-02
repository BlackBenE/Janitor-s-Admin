import React from "react";
import { Box, Button, TextField } from "@mui/material";

function LoginForm({ onSubmit }) {
  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        required
        name="email"
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        required
        name="password"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
}

export default LoginForm;
