import { useMemo } from 'react';
import {
  useProfiles,
  useBookings,
  usePayments,
  useServices,
  useServiceRequests,
} from '@/shared/hooks';
import { DateRange } from '../../../types/analytics';
import { Database } from '../../../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type ServiceRequest = Database['public']['Tables']['service_requests']['Row'];

export const useAnalyticsQueries = (dateRange: DateRange) => {
  const { data: allProfilesRaw = [], isLoading: profilesLoading } = useProfiles();
  const { data: allBookings = [], isLoading: bookingsLoading } = useBookings();
  const { data: allPayments = [], isLoading: paymentsLoading } = usePayments();
  const { data: allServices = [], isLoading: servicesLoading } = useServices();
  const { data: allServiceRequests = [], isLoading: serviceRequestsLoading } = useServiceRequests();

  const allProfiles = useMemo(() => {
    return allProfilesRaw.filter((p: Profile) => p.role !== 'admin');
  }, [allProfilesRaw]);

  const bookings = useMemo(() => {
    return allBookings.filter((booking: Booking) => {
      if (!booking.created_at) return false;
      const createdAt = new Date(booking.created_at);
      return createdAt >= dateRange.from && createdAt <= dateRange.to;
    });
  }, [allBookings, dateRange]);

  return {
    profiles: (allProfiles as Profile[]) || [],
    bookings: (bookings as Booking[]) || [],
    payments: (allPayments as Payment[]) || [],
    services: (allServices as Service[]) || [],
    serviceRequests: (allServiceRequests as ServiceRequest[]) || [],
    isLoading:
      profilesLoading ||
      bookingsLoading ||
      paymentsLoading ||
      servicesLoading ||
      serviceRequestsLoading,
  };
};
