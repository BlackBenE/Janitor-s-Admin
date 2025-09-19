import React from "react";
import { Box, Button } from "@mui/material";
import { AuthView } from "../../types/auth";

interface AuthNavigationProps {
  currentView: AuthView;
  onBackToSignIn: () => void;
}

export const AuthNavigation: React.FC<AuthNavigationProps> = ({
  currentView,
  onBackToSignIn,
}) => {
  if (currentView === "signin") {
    return null;
  }

  return (
    <Box sx={{ textAlign: "center", marginTop: 2 }}>
      <Button variant="text" onClick={onBackToSignIn}>
        Back to Sign In
      </Button>
    </Box>
  );
};
