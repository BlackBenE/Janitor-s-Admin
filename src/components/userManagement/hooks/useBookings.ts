import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import {
  Booking,
  BookingInsert,
  BookingUpdate,
} from "../../../types/userManagement";

/**
 * Hook pour gérer les réservations des utilisateurs
 */
export const useBookings = () => {
  const queryClient = useQueryClient();

  // Récupérer toutes les réservations
  const {
    data: bookings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Récupérer les réservations d'un utilisateur spécifique (voyageur)
  const getUserBookings = async (userId: string): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        properties:property_id (
          title,
          address,
          profiles:owner_id (
            full_name,
            email
          )
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Récupérer les réservations pour un propriétaire (ses propriétés)
  const getOwnerBookings = async (ownerId: string): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        properties!inner (
          title,
          address
        ),
        profiles:user_id (
          full_name,
          email
        )
      `
      )
      .eq("properties.owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Créer une nouvelle réservation
  const createBooking = useMutation({
    mutationFn: async (booking: BookingInsert): Promise<Booking> => {
      const { data, error } = await supabase
        .from("bookings")
        .insert(booking)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  // Mettre à jour une réservation
  const updateBooking = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: BookingUpdate;
    }): Promise<Booking> => {
      const { data, error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  // Annuler une réservation
  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string): Promise<Booking> => {
      const { data, error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  return {
    bookings,
    isLoading,
    error,
    refetch,
    getUserBookings,
    getOwnerBookings,
    createBooking,
    updateBooking,
    cancelBooking,
  };
};
