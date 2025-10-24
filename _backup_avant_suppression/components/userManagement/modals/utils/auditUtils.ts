/**
 * Utilitaires pour le modal d'audit
 */
import { formatDate } from "../../../../utils";

export { formatDate };

export const getActionColor = (action: string) => {
  const colors: Record<
    string,
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
  > = {
    CREATE: "success",
    UPDATE: "info",
    DELETE: "error",
    LOGIN: "primary",
    LOGOUT: "default",
  };
  return colors[action] || "default";
};

export const getActionIcon = (action: string) => {
  // Retourne les icônes appropriées pour chaque type d'action
  const icons: Record<string, string> = {
    CREATE: "add_circle",
    UPDATE: "edit",
    DELETE: "delete",
    LOGIN: "login",
    LOGOUT: "logout",
  };
  return icons[action] || "help";
};
