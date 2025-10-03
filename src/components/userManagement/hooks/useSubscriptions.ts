import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { Database } from "../../../types/database.types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type SubscriptionInsert =
  Database["public"]["Tables"]["subscriptions"]["Insert"];
type SubscriptionUpdate =
  Database["public"]["Tables"]["subscriptions"]["Update"];

// Hook complet pour les abonnements utilisateur avec CRUD
export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // READ - Récupérer les abonnements d'un utilisateur
  const getUserSubscriptions = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setSubscriptions(data || []);
      return data || [];
    } catch (err: any) {
      const errorMessage = "Erreur lors du chargement des abonnements";
      setError(errorMessage);
      console.error("Error fetching subscriptions:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // CREATE - Créer un nouvel abonnement
  const createSubscription = async (subscriptionData: SubscriptionInsert) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await supabase
        .from("subscriptions")
        .insert(subscriptionData)
        .select()
        .single();

      if (createError) throw createError;

      // Rafraîchir la liste
      await getUserSubscriptions(subscriptionData.user_id);

      return data;
    } catch (err: any) {
      const errorMessage = "Erreur lors de la création de l'abonnement";
      setError(errorMessage);
      console.error("Error creating subscription:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE - Modifier un abonnement existant
  const updateSubscription = async (
    subscriptionId: string,
    updates: SubscriptionUpdate
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", subscriptionId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Mettre à jour la liste locale
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? { ...sub, ...data } : sub
        )
      );

      return data;
    } catch (err: any) {
      const errorMessage = "Erreur lors de la modification de l'abonnement";
      setError(errorMessage);
      console.error("Error updating subscription:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // RENEW - Renouveler un abonnement (compatible avec la modal)
  const renewSubscription = {
    mutateAsync: async (data: {
      subscriptionId: string;
      newPeriodEnd: string;
      amount?: number;
    }) => {
      const { subscriptionId, newPeriodEnd, amount } = data;

      return updateSubscription(subscriptionId, {
        current_period_start: new Date().toISOString(),
        current_period_end: newPeriodEnd,
        status: "active",
        ...(amount && { amount }),
      });
    },
    isPending: loading,
  };

  // CANCEL - Annuler un abonnement
  const cancelSubscription = async (subscriptionId: string) => {
    return updateSubscription(subscriptionId, {
      status: "cancelled",
    });
  };

  // PAUSE - Suspendre un abonnement
  const pauseSubscription = async (subscriptionId: string) => {
    return updateSubscription(subscriptionId, {
      status: "paused",
    });
  };

  // REACTIVATE - Réactiver un abonnement
  const reactivateSubscription = async (subscriptionId: string) => {
    return updateSubscription(subscriptionId, {
      status: "active",
    });
  };

  // STATISTICS - Obtenir les statistiques d'abonnements
  const getSubscriptionStats = async (userId: string) => {
    try {
      const { data, error: statsError } = await supabase
        .from("subscriptions")
        .select("status, amount, subscription_type")
        .eq("user_id", userId);

      if (statsError) throw statsError;

      const stats = {
        total: data?.length || 0,
        active: data?.filter((s) => s.status === "active").length || 0,
        cancelled: data?.filter((s) => s.status === "cancelled").length || 0,
        paused: data?.filter((s) => s.status === "paused").length || 0,
        monthlyRevenue:
          data
            ?.filter((s) => s.status === "active")
            ?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0,
        subscriptionTypes: Array.from(
          new Set(data?.map((s) => s.subscription_type) || [])
        ),
      };

      return stats;
    } catch (err: any) {
      console.error("Error fetching subscription stats:", err);
      return {
        total: 0,
        active: 0,
        cancelled: 0,
        paused: 0,
        monthlyRevenue: 0,
        subscriptionTypes: [],
      };
    }
  };

  // GET ACTIVE - Récupérer seulement les abonnements actifs
  const getActiveSubscriptions = async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching active subscriptions:", err);
      return [];
    }
  };

  return {
    // State
    subscriptions,
    loading,
    error,

    // CRUD Operations
    getUserSubscriptions, // READ
    createSubscription, // CREATE
    updateSubscription, // UPDATE
    cancelSubscription, // DELETE (soft)

    // Specific Operations
    renewSubscription, // Compatible avec modal
    pauseSubscription,
    reactivateSubscription,

    // Utilities
    getSubscriptionStats,
    getActiveSubscriptions,
  };
};
