import { useQuery } from "@tanstack/react-query";
import { dataProvider } from "../../providers/dataProvider";
import { Database } from "../../types/database.types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];

export interface UserActivityData {
  userId: string;
  totalBookings: number;
  lastBookingDate: string | null;
  totalSpent: number;
  completedBookings: number;
  pendingBookings: number;
}

export const useUserActivity = (userIds: string[]) => {
  return useQuery({
    queryKey: ["user-activity", userIds],
    queryFn: async (): Promise<Record<string, UserActivityData>> => {
      if (userIds.length === 0) {
        return {};
      }

      const [bookingsResponse, paymentsResponse] = await Promise.all([
        dataProvider.getList("bookings", {}),
        dataProvider.getList("payments", {}),
      ]);

      const bookings =
        bookingsResponse.success && bookingsResponse.data
          ? bookingsResponse.data
          : [];
      const payments =
        paymentsResponse.success && paymentsResponse.data
          ? paymentsResponse.data
          : [];

      const activityData: Record<string, UserActivityData> = {};

      userIds.forEach((userId) => {
        activityData[userId] = {
          userId,
          totalBookings: 0,
          lastBookingDate: null,
          totalSpent: 0,
          completedBookings: 0,
          pendingBookings: 0,
        };
      });

      bookings.forEach((booking: Booking) => {
        const userId = booking.traveler_id;
        if (activityData[userId]) {
          activityData[userId].totalBookings++;

          if (booking.created_at) {
            const bookingDate = booking.created_at;
            if (
              !activityData[userId].lastBookingDate ||
              bookingDate > activityData[userId].lastBookingDate
            ) {
              activityData[userId].lastBookingDate = bookingDate;
            }
          }

          if (booking.status === "completed") {
            activityData[userId].completedBookings++;
          } else if (
            booking.status === "pending" ||
            booking.status === "confirmed"
          ) {
            activityData[userId].pendingBookings++;
          }
        }
      });

      // Process payments data to calculate total spent
      payments.forEach((payment: Payment) => {
        const userId = payment.payer_id;
        if (activityData[userId] && payment.status === "completed") {
          activityData[userId].totalSpent += payment.amount;
        }
      });

      // Round total spent to 2 decimal places
      Object.values(activityData).forEach((data) => {
        data.totalSpent = Math.round(data.totalSpent * 100) / 100;
      });

      return activityData;
    },
    enabled: userIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  });
};
