import { useQuery } from "@tanstack/react-query";
import { dataProvider } from "../../../providers/dataProvider";
import { DateRange } from "../../../types/analytics";
import { Database } from "../../../types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"];

/**
 * Hook pour les queries analytics Supabase
 */
export const useAnalyticsQueries = (dateRange: DateRange) => {
  // Récupérer tous les utilisateurs
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["analytics", "profiles"],
    queryFn: async () => {
      const response = await dataProvider.getList("profiles");
      return response.success ? response.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Récupérer toutes les réservations
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: [
      "analytics",
      "bookings",
      dateRange.from.toISOString(),
      dateRange.to.toISOString(),
    ],
    queryFn: async () => {
      const response = await dataProvider.getList("bookings");
      return response.success
        ? response.data?.filter((booking: Booking) => {
            if (!booking.created_at) return false;
            const createdAt = new Date(booking.created_at);
            return createdAt >= dateRange.from && createdAt <= dateRange.to;
          })
        : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Récupérer tous les paiements
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["analytics", "payments"],
    queryFn: async () => {
      const response = await dataProvider.getList("payments");
      return response.success ? response.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Récupérer tous les services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["analytics", "services"],
    queryFn: async () => {
      const response = await dataProvider.getList("services");
      return response.success ? response.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Récupérer toutes les demandes de services
  const { data: serviceRequests, isLoading: serviceRequestsLoading } = useQuery(
    {
      queryKey: ["analytics", "service_requests"],
      queryFn: async () => {
        const response = await dataProvider.getList("service_requests");
        return response.success ? response.data : [];
      },
      staleTime: 5 * 60 * 1000,
    }
  );

  return {
    profiles: (profiles as Profile[]) || [],
    bookings: (bookings as Booking[]) || [],
    payments: (payments as Payment[]) || [],
    services: (services as Service[]) || [],
    serviceRequests: (serviceRequests as ServiceRequest[]) || [],
    isLoading:
      profilesLoading ||
      bookingsLoading ||
      paymentsLoading ||
      servicesLoading ||
      serviceRequestsLoading,
  };
};
