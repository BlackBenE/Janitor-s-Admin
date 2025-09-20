import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "../../../types/database.types";

export type Service = Tables<"services">;
export type ServiceInsert = TablesInsert<"services">;
export type ServiceUpdate = TablesUpdate<"services">;

export type ServiceRequest = Tables<"service_requests">;
export type Intervention = Tables<"interventions">;

/**
 * Hook pour gérer les services et interventions des prestataires
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
    // D'abord récupérer les services du prestataire
    const { data: providerServices, error: servicesError } = await supabase
      .from("services")
      .select("id")
      .eq("provider_id", providerId);

    if (servicesError) throw servicesError;

    if (!providerServices || providerServices.length === 0) {
      return [];
    }

    const serviceIds = providerServices.map((s) => s.id);

    // Ensuite récupérer les demandes pour ces services
    const { data, error } = await supabase
      .from("service_requests")
      .select(
        `
        *,
        services (
          name,
          category
        ),
        properties (
          title,
          address,
          city
        )
      `
      )
      .in("service_id", serviceIds)
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
        service_requests (
          *,
          services (
            name,
            category
          ),
          properties (
            title,
            address,
            city
          )
        )
      `
      )
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false });

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
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
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

  // Activer/désactiver un service
  const toggleServiceStatus = useMutation({
    mutationFn: async ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }): Promise<Service> => {
      const { data, error } = await supabase
        .from("services")
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
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
