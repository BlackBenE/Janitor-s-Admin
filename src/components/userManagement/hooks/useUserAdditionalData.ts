import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import { Payment, Review } from "../../../types/userManagement";

/**
 * Hook pour récupérer les données additionnelles des utilisateurs
 * (paiements, avis, etc.)
 */
export const useUserAdditionalData = () => {
  // Récupérer les paiements d'un utilisateur
  const getUserPayments = async (userId: string): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        bookings (
          check_in,
          check_out,
          properties (
            title,
            city
          )
        ),
        service_requests (
          requested_date,
          services (
            name,
            category
          )
        )
      `
      )
      .eq("payer_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Récupérer les revenus d'un utilisateur (pour les propriétaires et prestataires)
  const getUserEarnings = async (userId: string): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        bookings (
          check_in,
          check_out,
          properties (
            title,
            city
          )
        ),
        service_requests (
          requested_date,
          services (
            name,
            category
          )
        )
      `
      )
      .eq("payee_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Récupérer les avis d'un utilisateur (en tant qu'évaluateur)
  const getUserReviewsAsReviewer = async (
    userId: string
  ): Promise<Review[]> => {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        bookings (
          properties (
            title,
            city
          )
        ),
        service_requests (
          services (
            name,
            category
          )
        )
      `
      )
      .eq("reviewer_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Récupérer les avis reçus par un utilisateur (en tant qu'évalué)
  const getUserReviewsAsReviewee = async (
    userId: string
  ): Promise<Review[]> => {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        bookings (
          properties (
            title,
            city
          )
        ),
        service_requests (
          services (
            name,
            category
          )
        )
      `
      )
      .eq("reviewee_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Calculer les statistiques d'un utilisateur
  const getUserStats = async (userId: string) => {
    try {
      const [payments, earnings, reviewsGiven, reviewsReceived] =
        await Promise.all([
          getUserPayments(userId),
          getUserEarnings(userId),
          getUserReviewsAsReviewer(userId),
          getUserReviewsAsReviewee(userId),
        ]);

      // Calculer les statistiques
      const totalSpent = payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const totalEarned = earnings.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const averageRatingGiven =
        reviewsGiven.length > 0
          ? reviewsGiven.reduce((sum, review) => sum + review.rating, 0) /
            reviewsGiven.length
          : 0;
      const averageRatingReceived =
        reviewsReceived.length > 0
          ? reviewsReceived.reduce((sum, review) => sum + review.rating, 0) /
            reviewsReceived.length
          : 0;

      return {
        totalSpent,
        totalEarned,
        totalPayments: payments.length,
        totalEarnings: earnings.length,
        reviewsGiven: reviewsGiven.length,
        reviewsReceived: reviewsReceived.length,
        averageRatingGiven: Math.round(averageRatingGiven * 10) / 10,
        averageRatingReceived: Math.round(averageRatingReceived * 10) / 10,
        recentPayments: payments.slice(0, 5),
        recentEarnings: earnings.slice(0, 5),
        recentReviewsGiven: reviewsGiven.slice(0, 5),
        recentReviewsReceived: reviewsReceived.slice(0, 5),
      };
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques:", error);
      throw error;
    }
  };

  return {
    getUserPayments,
    getUserEarnings,
    getUserReviewsAsReviewer,
    getUserReviewsAsReviewee,
    getUserStats,
  };
};
