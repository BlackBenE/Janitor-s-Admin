/**
 * Utilitaires pour ServicesModal
 * Fonctions helper extraites pour réduire la taille du composant principal
 */

export const getStatusColor = (
  status: string
): "primary" | "success" | "error" | "warning" | "default" => {
  switch (status) {
    case "completed":
    case "approved":
    case "active":
      return "success";
    case "pending":
    case "in_progress":
      return "warning";
    case "cancelled":
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("fr-FR");
};

export const calculateServiceStats = (
  services: any[],
  serviceRequests: any[],
  interventions: any[]
) => {
  const activeServices = services.filter((s) => s.is_active);
  const totalEarnings = serviceRequests.reduce(
    (sum: number, req: any) => sum + (req.total_amount || 0),
    0
  );
  const completedInterventions = interventions.filter(
    (i) => i.status === "completed"
  );

  return {
    activeServices,
    totalEarnings,
    completedInterventions,
  };
};
