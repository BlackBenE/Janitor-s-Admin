import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import {
  Service,
  ServiceInsert,
  ServiceUpdate,
  ServiceRequest,
  Intervention,
} from "../../../types/userManagement";

/**
 * Hook pour gérer les services des prestataires
 */
export const useServices = () => {
  const queryClient = useQueryClient();

  // Récupérer tous les services
  const {
    data: services,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Récupérer les services d'un prestataire spécifique
  const getProviderServices = async (
    providerId: string
  ): Promise<Service[]> => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Récupérer les demandes de service pour un prestataire
  const getProviderServiceRequests = async (
    providerId: string
  ): Promise<ServiceRequest[]> => {
    const { data, error } = await supabase
      .from("service_requests")
      .select(
        `
        *,
        profiles:user_id (
          full_name,
          email
        ),
        services:service_id (
          title,
          price
        )
      `
      )
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Récupérer les interventions d'un prestataire
  const getProviderInterventions = async (
    providerId: string
  ): Promise<Intervention[]> => {
    const { data, error } = await supabase
      .from("interventions")
      .select(
        `
        *,
        service_requests:request_id (
          user_id,
          profiles:user_id (
            full_name,
            email
          ),
          services:service_id (
            title
          )
        )
      `
      )
      .eq("provider_id", providerId)
      .order("scheduled_date", { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Créer un nouveau service
  const createService = useMutation({
    mutationFn: async (service: ServiceInsert): Promise<Service> => {
      const { data, error } = await supabase
        .from("services")
        .insert(service)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  // Mettre à jour un service
  const updateService = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ServiceUpdate;
    }): Promise<Service> => {
      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  // Activer/Désactiver un service
  const toggleServiceStatus = useMutation({
    mutationFn: async ({
      id,
      active,
    }: {
      id: string;
      active: boolean;
    }): Promise<Service> => {
      const { data, error } = await supabase
        .from("services")
        .update({ active })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  return {
    services,
    isLoading,
    error,
    refetch,
    getProviderServices,
    getProviderServiceRequests,
    getProviderInterventions,
    createService,
    updateService,
    toggleServiceStatus,
  };
};
