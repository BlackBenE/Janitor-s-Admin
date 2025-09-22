import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import {
  Subscription,
  SubscriptionInsert,
  SubscriptionUpdate,
} from "../../../types/userManagement";

/**
 * Hook pour gérer les abonnements des utilisateurs
 */
export const useSubscriptions = () => {
  const queryClient = useQueryClient();

  // Récupérer tous les abonnements
  const {
    data: subscriptions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async (): Promise<Subscription[]> => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Récupérer les abonnements d'un utilisateur spécifique
  const getUserSubscriptions = async (
    userId: string
  ): Promise<Subscription[]> => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Créer un nouvel abonnement
  const createSubscription = useMutation({
    mutationFn: async (
      subscription: SubscriptionInsert
    ): Promise<Subscription> => {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert(subscription)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  // Mettre à jour un abonnement
  const updateSubscription = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: SubscriptionUpdate;
    }): Promise<Subscription> => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  // Renouveler un abonnement (créer un nouveau)
  const renewSubscription = useMutation({
    mutationFn: async ({
      userId,
      subscriptionType,
      amount,
    }: {
      userId: string;
      subscriptionType: string;
      amount: number;
    }): Promise<Subscription> => {
      const now = new Date();
      const endDate = new Date();

      // Calculer la durée selon le type d'abonnement
      if (subscriptionType === "annual") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else if (subscriptionType === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const newSubscription: SubscriptionInsert = {
        user_id: userId,
        subscription_type: subscriptionType,
        amount,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
      };

      const { data, error } = await supabase
        .from("subscriptions")
        .insert(newSubscription)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });

  return {
    subscriptions,
    isLoading,
    error,
    refetch,
    getUserSubscriptions,
    createSubscription,
    updateSubscription,
    renewSubscription,
  };
};
