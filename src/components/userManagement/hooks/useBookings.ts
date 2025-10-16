import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { Database } from "../../../types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

// Hook complet pour les réservations utilisateur avec CRUD
export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // READ - Récupérer les réservations d'un utilisateur
  const getUserBookings = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          `
          *,
          properties (
            id,
            title,
            city,
            address
          )
        `
        )
        .eq("traveler_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setBookings(data || []);
      return data || [];
    } catch (err: any) {
      const errorMessage = "Erreur lors du chargement des réservations";
      setError(errorMessage);
      console.error("Error fetching bookings:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // CREATE - Créer une nouvelle réservation
  const createBooking = async (bookingData: BookingInsert) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await supabase
        .from("bookings")
        .insert(bookingData)
        .select()
        .single();

      if (createError) throw createError;

      // Rafraîchir la liste
      if (bookingData.traveler_id) {
        await getUserBookings(bookingData.traveler_id);
      }

      return data;
    } catch (err: any) {
      const errorMessage = "Erreur lors de la création de la réservation";
      setError(errorMessage);
      console.error("Error creating booking:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE - Modifier une réservation existante
  const updateBooking = async (bookingId: string, updates: BookingUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from("bookings")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Mettre à jour la liste locale
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, ...data } : booking
        )
      );

      return data;
    } catch (err: any) {
      const errorMessage = "Erreur lors de la modification de la réservation";
      setError(errorMessage);
      console.error("Error updating booking:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Annuler une réservation (soft delete en changeant le statut)
  const cancelBooking = async (bookingId: string, reason?: string) => {
    return updateBooking(bookingId, {
      status: "cancelled",
      updated_at: new Date().toISOString(),
    });
  };

  // UTILITY - Confirmer une réservation
  const confirmBooking = async (bookingId: string) => {
    return updateBooking(bookingId, {
      status: "confirmed",
      updated_at: new Date().toISOString(),
    });
  };

  // UTILITY - Marquer comme payée
  const markBookingAsPaid = async (
    bookingId: string,
    paymentIntentId?: string
  ) => {
    return updateBooking(bookingId, {
      payment_status: "paid",
      stripe_payment_intent_id: paymentIntentId,
      updated_at: new Date().toISOString(),
    });
  };

  // STATISTICS - Obtenir les statistiques de réservation
  const getBookingStats = async (userId: string) => {
    try {
      const { data, error: statsError } = await supabase
        .from("bookings")
        .select("status, total_amount, commission_amount")
        .eq("traveler_id", userId);

      if (statsError) throw statsError;

      const stats = {
        total: data?.length || 0,
        confirmed: data?.filter((b) => b.status === "confirmed").length || 0,
        pending: data?.filter((b) => b.status === "pending").length || 0,
        cancelled: data?.filter((b) => b.status === "cancelled").length || 0,
        totalRevenue:
          data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
        totalCommission:
          data?.reduce((sum, b) => sum + (b.commission_amount || 0), 0) || 0,
      };

      return stats;
    } catch (err: any) {
      console.error("Error fetching booking stats:", err);
      return {
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        totalRevenue: 0,
        totalCommission: 0,
      };
    }
  };

  return {
    // State
    bookings,
    loading,
    error,

    // CRUD Operations
    getUserBookings, // READ
    createBooking, // CREATE
    updateBooking, // UPDATE
    cancelBooking, // DELETE (soft)

    // Utility functions
    confirmBooking,
    markBookingAsPaid,
    getBookingStats,
  };
};
