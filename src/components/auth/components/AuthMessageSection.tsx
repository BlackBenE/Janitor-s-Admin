import React from "react";
import { Alert } from "@mui/material";
import { AuthMessage } from "../../../types/auth";

interface AuthMessageSectionProps {
  message: AuthMessage | null;
  onClearMessage: () => void;
}

/**
 * Section d'affichage des messages d'état de l'authentification
 */
export const AuthMessageSection: React.FC<AuthMessageSectionProps> = ({
  message,
  onClearMessage,
}) => {
  if (!message) return null;

  return (
    <Alert
      severity={message.type}
      sx={{ marginBottom: 2 }}
      onClose={onClearMessage}
    >
      {message.text}
    </Alert>
  );
};
