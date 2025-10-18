import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { Database } from "../../../types/database.types";

type Service = Database["public"]["Tables"]["services"]["Row"];
type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

// Hook complet pour les services avec CRUD
export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // READ - Services d'un utilisateur (en tant que client via bookings)
  const getUserServices = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Récupérer les services via les réservations de l'utilisateur
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(
          `
          *,
          properties (
            id,
            title,
            services (
              id,
              name,
              category,
              base_price,
              description,
              is_active,
              provider_id,
              profiles (
                full_name,
                email
              )
            )
          )
        `
        )
        .eq("traveler_id", userId);

      if (bookingsError) throw bookingsError;

      // Extraire les services uniques
      const uniqueServices = new Map();
      bookingsData?.forEach((booking) => {
        booking.properties?.services?.forEach((service: any) => {
          uniqueServices.set(service.id, service);
        });
      });

      const servicesArray = Array.from(uniqueServices.values());
      setServices(servicesArray);
      return servicesArray;
    } catch (err: any) {
      const errorMessage = "Erreur lors du chargement des services utilisateur";
      setError(errorMessage);
      console.error("Error fetching user services:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // READ - Services d'un prestataire
  const getProviderServices = async (providerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("services")
        .select(
          `
          *,
          profiles (
            full_name,
            email
          )
        `
        )
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setServices(data || []);
      return data || [];
    } catch (err: any) {
      const errorMessage =
        "Erreur lors du chargement des services du prestataire";
      setError(errorMessage);
      console.error("Error fetching provider services:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // CREATE - Créer un nouveau service
  const createService = async (serviceData: ServiceInsert) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await supabase
        .from("services")
        .insert(serviceData)
        .select()
        .single();

      if (createError) throw createError;

      // Rafraîchir la liste des services du prestataire
      await getProviderServices(serviceData.provider_id);

      return data;
    } catch (err: any) {
      const errorMessage = "Erreur lors de la création du service";
      setError(errorMessage);
      console.error("Error creating service:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE - Modifier un service existant
  const updateService = async (serviceId: string, updates: ServiceUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from("services")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", serviceId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Mettre à jour la liste locale
      setServices((prev) =>
        prev.map((service) =>
          service.id === serviceId ? { ...service, ...data } : service
        )
      );

      return data;
    } catch (err: any) {
      const errorMessage = "Erreur lors de la modification du service";
      setError(errorMessage);
      console.error("Error updating service:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Désactiver un service (soft delete)
  const removeService = async (serviceId: string) => {
    return updateService(serviceId, {
      is_active: false,
      updated_at: new Date().toISOString(),
    });
  };

  // ACTIVATE - Réactiver un service
  const activateService = async (serviceId: string) => {
    return updateService(serviceId, {
      is_active: true,
      updated_at: new Date().toISOString(),
    });
  };

  // ASSIGN - Assigner un service à un utilisateur (via réservation)
  const assignService = async (
    userId: string,
    serviceId: string,
    bookingData?: any
  ) => {
    try {
      // Cette fonction pourrait créer une réservation
      // Dans une vraie implémentation, cela créerait une réservation
      // incluant le service spécifié
      return Promise.resolve();
    } catch (err: any) {
      console.error("Error assigning service:", err);
      throw err;
    }
  };

  // GET SERVICE REQUESTS - Obtenir les demandes de service
  const getProviderServiceRequests = async (providerId: string) => {
    try {
      // Récupérer les réservations pour les services de ce prestataire
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          `
          *,
          properties (
            services (
              provider_id,
              name,
              category
            )
          )
        `
        )
        .eq("properties.services.provider_id", providerId)
        .eq("status", "pending");

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching service requests:", err);
      return [];
    }
  };

  // GET INTERVENTIONS - Obtenir les interventions
  const getProviderInterventions = async (providerId: string) => {
    try {
      // Récupérer les réservations confirmées comme interventions
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          `
          *,
          properties (
            title,
            address,
            services (
              provider_id,
              name,
              category,
              base_price
            )
          )
        `
        )
        .eq("properties.services.provider_id", providerId)
        .eq("status", "confirmed")
        .order("check_in", { ascending: true });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err: any) {
      console.error("Error fetching interventions:", err);
      return [];
    }
  };

  // STATISTICS - Statistiques des services
  const getServiceStats = async (providerId: string) => {
    try {
      const { data, error: statsError } = await supabase
        .from("services")
        .select("is_active, category, base_price")
        .eq("provider_id", providerId);

      if (statsError) throw statsError;

      const stats = {
        total: data?.length || 0,
        active: data?.filter((s) => s.is_active).length || 0,
        inactive: data?.filter((s) => !s.is_active).length || 0,
        categories: Array.from(new Set(data?.map((s) => s.category) || [])),
        averagePrice: data?.length
          ? data.reduce((sum, s) => sum + s.base_price, 0) / data.length
          : 0,
      };

      return stats;
    } catch (err: any) {
      console.error("Error fetching service stats:", err);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        categories: [],
        averagePrice: 0,
      };
    }
  };

  // SEARCH - Rechercher des services
  const searchServices = async (
    query: string,
    filters?: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      isActive?: boolean;
    }
  ) => {
    try {
      let queryBuilder = supabase
        .from("services")
        .select(
          `
          *,
          profiles (
            full_name,
            email
          )
        `
        )
        .ilike("name", `%${query}%`);

      if (filters?.category) {
        queryBuilder = queryBuilder.eq("category", filters.category);
      }
      if (filters?.minPrice) {
        queryBuilder = queryBuilder.gte("base_price", filters.minPrice);
      }
      if (filters?.maxPrice) {
        queryBuilder = queryBuilder.lte("base_price", filters.maxPrice);
      }
      if (filters?.isActive !== undefined) {
        queryBuilder = queryBuilder.eq("is_active", filters.isActive);
      }

      const { data, error: searchError } = await queryBuilder;
      if (searchError) throw searchError;

      return data || [];
    } catch (err: any) {
      console.error("Error searching services:", err);
      return [];
    }
  };

  return {
    // State
    services,
    loading,
    error,

    // CRUD Operations
    getUserServices, // READ (pour clients)
    getProviderServices, // READ (pour prestataires)
    createService, // CREATE
    updateService, // UPDATE
    removeService, // DELETE (soft)

    // Specific Operations
    activateService,
    assignService, // Assigner via réservation

    // Provider-specific
    getProviderServiceRequests,
    getProviderInterventions,

    // Utilities
    getServiceStats,
    searchServices,
  };
};
