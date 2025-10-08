import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";

// Constants
const MAX_BOOKINGS_LIMIT = 100;
const MAX_PAYMENTS_LIMIT = 100;
const MAX_SUBSCRIPTIONS_LIMIT = 50;
const MOCK_PAYMENT_BASE = 50;
const MOCK_PAYMENT_RANGE = 500;

/**
 * Hook pour récupérer les données financières depuis Supabase
 * Avec fallback en cas de problème de schéma
 */
export const useFinancialQueries = (dateRange: { from: Date; to: Date }) => {
  // Requête pour les réservations - version simplifiée et sécurisée
  const {
    data: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["financial-bookings", dateRange],
    queryFn: async () => {
      try {
        // Essayer d'abord avec les jointures
        const { data, error } = await supabase
          .from("bookings")
          .select(
            `
            *,
            users(id, first_name, last_name, email),
            properties(id, title, price_per_night)
          `
          )
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString())
          .order("created_at", { ascending: false })
          .limit(MAX_BOOKINGS_LIMIT);

        if (error) {
          // Fallback: récupérer juste les bookings
          const { data: simpleData, error: simpleError } = await supabase
            .from("bookings")
            .select("*")
            .gte("created_at", dateRange.from.toISOString())
            .lte("created_at", dateRange.to.toISOString())
            .order("created_at", { ascending: false })
            .limit(MAX_BOOKINGS_LIMIT);

          if (simpleError) throw simpleError;
          return simpleData || [];
        }

        return data || [];
      } catch (err) {
        console.error("Erreur requête bookings:", err);
        // En cas d'échec total, retourner un tableau vide plutôt qu'une erreur
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Requête pour les paiements - version sécurisée
  const {
    data: payments,
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useQuery({
    queryKey: ["financial-payments", dateRange],
    queryFn: async () => {
      try {
        // Vérifier d'abord si la table payments existe
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString())
          .order("created_at", { ascending: false })
          .limit(MAX_PAYMENTS_LIMIT);

        if (error) {
          console.error("Erreur requête payments:", error);
          return [];
        }

        return data || [];
      } catch (err) {
        console.error("Erreur requête payments:", err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // Requête pour les abonnements/utilisateurs actifs - version sécurisée
  const {
    data: subscriptions,
    isLoading: subscriptionsLoading,
    error: subscriptionsError,
  } = useQuery({
    queryKey: ["financial-subscriptions", dateRange],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(MAX_SUBSCRIPTIONS_LIMIT);

        if (error) {
          return [];
        }

        return data || [];
      } catch (err) {
        console.error("Erreur requête subscriptions:", err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });

  return {
    // Données
    bookings: bookings || [],
    payments: payments || [],
    subscriptions: subscriptions || [],

    // États de chargement
    isLoading: bookingsLoading || paymentsLoading || subscriptionsLoading,

    // Erreurs
    error: bookingsError || paymentsError || subscriptionsError,
  };
};

// Fonction helper pour générer des paiements simulés basés sur les bookings
// Mock data supprimé - utilisation des vraies données Supabase uniquement
