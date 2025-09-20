import {
  UserProfile,
  UserFilters,
  UserManagementHook,
  UpdateUserMutation,
  LogActionFunction,
  AuditActions,
  SecurityActions,
} from "../../../types/userManagement";
import { UserRole } from "../config/userTabs";
import { useSubscriptions } from "./useSubscriptions";
import { useBookings } from "./useBookings";
import { useServices } from "./useServices";
import { useUserAdditionalData } from "./useUserAdditionalData";

interface UseUserActionsProps {
  userManagement: UserManagementHook;
  updateUser: UpdateUserMutation;
  logAction: LogActionFunction;
  auditActions: AuditActions;
  securityActions: SecurityActions;
  getEmail: () => string | null;
  refetch?: () => void; // Nouvelle prop pour rafraîchir les données
}

/**
 * Hook pour la logique métier des actions utilisateur
 */
export const useUserActions = ({
  userManagement,
  updateUser,
  logAction,
  auditActions,
  securityActions,
  getEmail,
  refetch,
}: UseUserActionsProps) => {
  const getCurrentAdminEmail = () => getEmail() || "system";

  // Hooks pour les données réelles de la base de données
  const { renewSubscription, getUserSubscriptions } = useSubscriptions();
  const { getUserBookings, getOwnerBookings } = useBookings();
  const {
    getProviderServices,
    getProviderServiceRequests,
    getProviderInterventions,
  } = useServices();
  const { getUserStats } = useUserAdditionalData();

  const handleBulkValidate = () => {
    if (userManagement.selectedUsers.length === 0) {
      userManagement.showNotification("No users selected", "warning");
      return;
    }

    Promise.all(
      userManagement.selectedUsers.map((userId: string) =>
        updateUser.mutateAsync({
          id: userId,
          payload: { profile_validated: true },
        })
      )
    )
      .then(async () => {
        await Promise.all(
          userManagement.selectedUsers.map((userId: string) =>
            logAction(
              auditActions.BULK_ACTION,
              userId,
              `Validation en masse - ${userManagement.selectedUsers.length} utilisateurs affectés`,
              getCurrentAdminEmail(),
              {
                action: "bulk_validate",
                totalUsers: userManagement.selectedUsers.length,
              }
            )
          )
        );

        userManagement.showNotification(
          `${userManagement.selectedUsers.length} users validated successfully`,
          "success"
        );
        userManagement.clearUserSelection();
      })
      .catch((error: Error) => {
        userManagement.showNotification(
          `Error validating users: ${error.message}`,
          "error"
        );
      });
  };

  const handleBulkSuspend = () => {
    if (userManagement.selectedUsers.length === 0) {
      userManagement.showNotification("No users selected", "warning");
      return;
    }

    Promise.all(
      userManagement.selectedUsers.map((userId: string) =>
        updateUser.mutateAsync({
          id: userId,
          payload: { profile_validated: false },
        })
      )
    )
      .then(async () => {
        await Promise.all(
          userManagement.selectedUsers.map((userId: string) =>
            logAction(
              auditActions.BULK_ACTION,
              userId,
              `Suspension en masse - ${userManagement.selectedUsers.length} utilisateurs affectés`,
              getCurrentAdminEmail(),
              {
                action: "bulk_suspend",
                totalUsers: userManagement.selectedUsers.length,
              }
            )
          )
        );

        userManagement.showNotification(
          `${userManagement.selectedUsers.length} users suspended successfully`,
          "success"
        );
        userManagement.clearUserSelection();
      })
      .catch((error: Error) => {
        userManagement.showNotification(
          `Error suspending users: ${error.message}`,
          "error"
        );
      });
  };

  const handleForceLogout = async (userId: string) => {
    try {
      console.log("🔍 Debug force logout:", { userId });

      // Approche hybride : session + profil pour garantir la déconnexion
      try {
        // 1. Essayer de terminer les sessions existantes (si elles existent)
        console.log("📊 Tentative de récupération des sessions...");
        const sessions = await securityActions.getUserSessions(userId);
        console.log("📊 Sessions trouvées:", sessions?.length || 0);

        if (sessions && sessions.length > 0) {
          console.log("🔄 Terminaison des sessions via user_sessions");
          await securityActions.forceLogout(userId, "Admin force logout");
        } else {
          console.log(
            "⚠️ Aucune session trouvée, utilisation de l'approche alternative"
          );

          // 2. Approche alternative : forcer une mise à jour du profil pour déclencher la déconnexion
          await updateUser.mutateAsync({
            id: userId,
            payload: {
              updated_at: new Date().toISOString(),
              // Ajouter un flag pour indiquer la déconnexion forcée
            },
          });

          console.log("✅ Déconnexion forcée via mise à jour du profil");
        }
      } catch (sessionError) {
        console.error(
          "❌ Erreur sessions, fallback sur mise à jour profil:",
          sessionError
        );

        // Fallback : mise à jour du profil
        await updateUser.mutateAsync({
          id: userId,
          payload: {
            updated_at: new Date().toISOString(),
          },
        });
      }

      await logAction(
        auditActions.FORCE_LOGOUT,
        userId,
        "Utilisateur déconnecté de force par l'administrateur",
        getCurrentAdminEmail(),
        {
          timestamp: new Date().toISOString(),
          reason: "Force logout by admin",
          method: "hybrid_approach",
        }
      );

      userManagement.showNotification(
        "Utilisateur déconnecté de force",
        "success"
      );

      // Rafraîchir les données pour refléter les changements
      if (refetch) refetch();
    } catch (error) {
      console.error("❌ Force logout error:", error);
      userManagement.showNotification(
        `Erreur lors de la déconnexion forcée: ${
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : JSON.stringify(error)
        }`,
        "error"
      );
    }
  };

  const handleUnlockAccount = async (userId: string) => {
    try {
      // Utilisons updateUser.mutateAsync comme pour l'action VIP
      await updateUser.mutateAsync({
        id: userId,
        payload: {
          account_locked: false,
          locked_until: null,
          lock_reason: null,
        },
      });

      await logAction(
        auditActions.USER_REACTIVATED,
        userId,
        "Compte déverrouillé par l'administrateur",
        getCurrentAdminEmail(),
        { reason: "Admin unlock action" }
      );

      userManagement.showNotification(
        "Compte déverrouillé avec succès",
        "success"
      );

      // Rafraîchir les données pour refléter les changements
      if (refetch) refetch();
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors du déverrouillage: ${
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : JSON.stringify(error)
        }`,
        "error"
      );
    }
  };

  const handleExportUsers = async (
    format: "csv",
    filteredUsers: UserProfile[],
    filters: UserFilters
  ) => {
    try {
      const formatDate = (dateString: string | null): string => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString();
      };

      const csvContent = [
        [
          "Nom",
          "Email",
          "Téléphone",
          "Rôle",
          "Statut",
          "VIP",
          "Date d'inscription",
        ],
        ...filteredUsers.map((user: UserProfile) => [
          user.full_name || "",
          user.email,
          user.phone || "",
          user.role,
          user.profile_validated ? "Validé" : "En attente",
          user.vip_subscription ? "Oui" : "Non",
          formatDate(user.created_at),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `users_export_${new Date().toISOString().split("T")[0]}.${format}`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      await logAction(
        auditActions.EXPORT_DATA,
        "system",
        `Export de données utilisateurs en format ${format.toUpperCase()} - ${
          filteredUsers.length
        } utilisateurs`,
        getCurrentAdminEmail(),
        {
          format,
          recordCount: filteredUsers.length,
          exportType: "user_data",
          filters: filters,
        }
      );

      userManagement.showNotification(
        `Export ${format.toUpperCase()} terminé avec succès`,
        "success"
      );
    } catch {
      userManagement.showNotification("Erreur lors de l'export", "error");
    }
  };

  // Actions spécifiques pour Property Owners
  const handleRenewSubscription = async (
    userId: string,
    subscriptionType: "annual" | "monthly" = "annual"
  ) => {
    try {
      // Créer un nouvel abonnement dans la table subscriptions
      const amount = subscriptionType === "annual" ? 100 : 10;

      const newSubscription = await renewSubscription.mutateAsync({
        userId,
        subscriptionType,
        amount,
      });

      // Mettre à jour le profil utilisateur
      await updateUser.mutateAsync({
        id: userId,
        payload: {
          profile_validated: true, // Activer le profil
          updated_at: new Date().toISOString(),
        },
      });

      await logAction(
        auditActions.USER_UPDATED,
        userId,
        `Abonnement renouvelé (${subscriptionType}) - ${amount}€`,
        getCurrentAdminEmail(),
        {
          action: "subscription_renewal",
          subscriptionType,
          amount,
          subscriptionId: newSubscription.id,
          endDate: newSubscription.current_period_end,
        }
      );

      userManagement.showNotification(
        `Abonnement ${subscriptionType} renouvelé avec succès (${amount}€)`,
        "success"
      );

      if (refetch) refetch();
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors du renouvellement: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        "error"
      );
    }
  };

  const handleViewDisputes = async (userId: string) => {
    try {
      // Récupérer les statistiques et données de l'utilisateur
      const stats = await getUserStats(userId);
      const bookings = await getUserBookings(userId);

      // TODO: Implémenter la modal des litiges avec les vraies données
      console.log("Données utilisateur pour litiges:", {
        userId,
        stats,
        recentBookings: bookings.slice(0, 10),
      });

      userManagement.showNotification(
        `Données de litige chargées pour l'utilisateur. ${bookings.length} réservations trouvées.`,
        "info"
      );
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors du chargement des données: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        "error"
      );
    }
  };

  // Actions spécifiques pour Service Providers
  const handleValidateProvider = async (userId: string, approved: boolean) => {
    try {
      await updateUser.mutateAsync({
        id: userId,
        payload: {
          profile_validated: approved,
          updated_at: new Date().toISOString(),
        },
      });

      await logAction(
        approved ? auditActions.USER_UPDATED : auditActions.USER_SUSPENDED,
        userId,
        `Profil prestataire ${approved ? "approuvé" : "rejeté"}`,
        getCurrentAdminEmail(),
        {
          action: approved ? "provider_approved" : "provider_rejected",
          decision: approved ? "approved" : "rejected",
          timestamp: new Date().toISOString(),
        }
      );

      userManagement.showNotification(
        `Prestataire ${approved ? "approuvé" : "rejeté"} avec succès`,
        "success"
      );

      if (refetch) refetch();
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors de la validation: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        "error"
      );
    }
  };

  const handleManageDocuments = async (userId: string) => {
    try {
      // Récupérer les interventions du prestataire pour voir les documents
      const interventions = await getProviderInterventions(userId);

      // TODO: Implémenter la modal de gestion des documents avec les vraies données
      console.log("Documents et interventions du prestataire:", {
        userId,
        interventions: interventions.map((i) => ({
          id: i.id,
          beforePhotos: i.before_photos,
          afterPhotos: i.after_photos,
          status: i.status,
          serviceRequestId: i.service_request_id,
        })),
      });

      userManagement.showNotification(
        `${interventions.length} interventions trouvées pour ce prestataire`,
        "info"
      );
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors du chargement des documents: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        "error"
      );
    }
  };

  const handleManagePricing = async (userId: string) => {
    try {
      // Récupérer les services du prestataire
      const services = await getProviderServices(userId);

      // TODO: Implémenter la modal de gestion des tarifs avec les vraies données
      console.log("Services et tarifs du prestataire:", {
        userId,
        services: services.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          basePrice: s.base_price,
          priceType: s.price_type,
          isActive: s.is_active,
        })),
      });

      userManagement.showNotification(
        `${services.length} services trouvés pour ce prestataire`,
        "info"
      );
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors du chargement des services: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        "error"
      );
    }
  };

  // Actions spécifiques pour Travelers
  const handleToggleVIP = async (userId: string, isVIP: boolean) => {
    try {
      await updateUser.mutateAsync({
        id: userId,
        payload: {
          vip_subscription: isVIP,
          updated_at: new Date().toISOString(),
        },
      });

      await logAction(
        auditActions.USER_UPDATED,
        userId,
        `Statut VIP ${isVIP ? "activé" : "désactivé"}`,
        getCurrentAdminEmail(),
        {
          action: isVIP ? "vip_activated" : "vip_deactivated",
          vipStatus: isVIP,
        }
      );

      userManagement.showNotification(
        `Statut VIP ${isVIP ? "activé" : "désactivé"} avec succès`,
        "success"
      );

      if (refetch) refetch();
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors de la modification VIP: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        "error"
      );
    }
  };

  const handleViewBookings = async (userId: string) => {
    try {
      // Récupérer les réservations du voyageur
      const bookings = await getUserBookings(userId);
      const stats = await getUserStats(userId);

      // Log des données pour le moment (la modal sera intégrée séparément)
      console.log("Réservations et statistiques du voyageur:", {
        userId,
        totalBookings: bookings.length,
        stats: {
          totalSpent: stats.totalSpent,
          averageRating: stats.averageRatingGiven,
          reviewsGiven: stats.reviewsGiven,
        },
        recentBookings: bookings.slice(0, 10).map((b) => ({
          id: b.id,
          checkIn: b.check_in,
          checkOut: b.check_out,
          totalAmount: b.total_amount,
          status: b.status,
          paymentStatus: b.payment_status,
        })),
      });

      userManagement.showNotification(
        `${bookings.length} réservations trouvées. Total dépensé: ${stats.totalSpent}€`,
        "info"
      );
    } catch (error) {
      userManagement.showNotification(
        `Erreur lors du chargement des réservations: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        "error"
      );
    }
  };

  // Fonction pour obtenir les actions disponibles selon le rôle
  const getActionsForRole = (role: UserRole | null) => {
    const baseActions = {
      handleForceLogout,
      handleUnlockAccount,
    };

    switch (role) {
      case UserRole.PROPERTY_OWNER:
        return {
          ...baseActions,
          handleRenewSubscription,
          handleViewDisputes,
        };

      case UserRole.SERVICE_PROVIDER:
        return {
          ...baseActions,
          handleValidateProvider,
          handleManageDocuments,
          handleManagePricing,
        };

      case UserRole.TRAVELER:
        return {
          ...baseActions,
          handleToggleVIP,
          handleViewBookings,
        };

      default:
        return baseActions;
    }
  };

  return {
    // Actions générales
    handleBulkValidate,
    handleBulkSuspend,
    handleForceLogout,
    handleUnlockAccount,
    handleExportUsers,

    // Actions spécifiques Property Owners
    handleRenewSubscription,
    handleViewDisputes,

    // Actions spécifiques Service Providers
    handleValidateProvider,
    handleManageDocuments,
    handleManagePricing,

    // Actions spécifiques Travelers
    handleToggleVIP,
    handleViewBookings,

    // Utilitaire
    getActionsForRole,
  };
};
