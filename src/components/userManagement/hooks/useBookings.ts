import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "../../../types/database.types";

export type Booking = Tables<"bookings">;
export type BookingInsert = TablesInsert<"bookings">;
export type BookingUpdate = TablesUpdate<"bookings">;

/**
 * Hook pour gérer les réservations
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

  // Récupérer les réservations d'un voyageur spécifique
  const getUserBookings = async (userId: string): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        properties:property_id (
          title,
          address,
          city
        )
      `
      )
      .eq("traveler_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Récupérer les réservations pour les propriétés d'un propriétaire
  const getOwnerBookings = async (ownerId: string): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        properties!inner (
          title,
          address,
          city,
          owner_id
        )
      `
      )
      .eq("properties.owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Mettre à jour le statut d'une réservation
  const updateBookingStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }): Promise<Booking> => {
      const { data, error } = await supabase
        .from("bookings")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
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

  return {
    bookings,
    isLoading,
    error,
    refetch,
    getUserBookings,
    getOwnerBookings,
    updateBookingStatus,
  };
};
