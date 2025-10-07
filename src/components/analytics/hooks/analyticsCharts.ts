import { useCallback } from "react";
import { DateRange } from "../../../types/analytics";
import { Database } from "../../../types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"];

interface AnalyticsChartsInput {
  profiles: Profile[];
  bookings: Booking[];
  payments: Payment[];
  services: Service[];
  serviceRequests: ServiceRequest[];
  dateRange: DateRange;
}

/**
 * Fonctions pour générer les données des graphiques
 */
export const useAnalyticsCharts = () => {
  const generateUserGrowthData = useCallback((input: AnalyticsChartsInput) => {
    const { profiles, payments, dateRange } = input;

    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    const userGrowthData = [];
    const monthsDifference = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) /
        (1000 * 60 * 60 * 24 * 30)
    );
    const maxMonths = Math.min(6, Math.max(1, monthsDifference));

    for (let i = maxMonths - 1; i >= 0; i--) {
      const date = new Date(dateRange.to);
      date.setMonth(date.getMonth() - i);

      if (date < dateRange.from) continue;

      const month = months[date.getMonth()];

      const monthlyUsers = profiles.filter((p) => {
        if (!p.created_at) return false;
        const createdAt = new Date(p.created_at);
        return (
          createdAt >= dateRange.from &&
          createdAt <= dateRange.to &&
          createdAt.getMonth() === date.getMonth() &&
          createdAt.getFullYear() === date.getFullYear()
        );
      }).length;

      const monthlyRevenue = payments
        .filter((p) => {
          if (!p.created_at || p.status !== "paid") return false;
          const paymentDate = new Date(p.created_at);
          return (
            paymentDate >= dateRange.from &&
            paymentDate <= dateRange.to &&
            paymentDate.getMonth() === date.getMonth() &&
            paymentDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, p) => sum + p.amount, 0);

      userGrowthData.push({
        month: `${month} ${date.getFullYear()}`,
        users: monthlyUsers,
        revenue: monthlyRevenue,
      });
    }

    return userGrowthData;
  }, []);

  const generateBookingTrends = useCallback((input: AnalyticsChartsInput) => {
    const { bookings, dateRange } = input;
    const bookingTrends = [];

    const daysDifference = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const maxDays = Math.min(30, Math.max(1, daysDifference));

    if (daysDifference > 30) {
      // Grouper par semaine pour les longues périodes
      const weeksData = [];
      const startDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > endDate) weekEnd.setTime(endDate.getTime());

        const weeklyBookings = bookings.filter((b) => {
          if (!b.created_at) return false;
          const bookingDate = new Date(b.created_at);
          return bookingDate >= currentDate && bookingDate <= weekEnd;
        }).length;

        weeksData.push({
          date: `${currentDate.toLocaleDateString(
            "fr-FR"
          )} - ${weekEnd.toLocaleDateString("fr-FR")}`,
          bookings: weeklyBookings,
        });

        currentDate.setDate(currentDate.getDate() + 7);
      }

      bookingTrends.push(...weeksData.slice(-8));
    } else {
      // Générer jour par jour pour les courtes périodes
      for (let i = maxDays - 1; i >= 0; i--) {
        const date = new Date(dateRange.to);
        date.setDate(date.getDate() - i);

        if (date < dateRange.from) continue;

        const dateStr = date.toLocaleDateString("fr-FR");

        const dailyBookings = bookings.filter((b) => {
          if (!b.created_at) return false;
          const bookingDate = new Date(b.created_at);
          return bookingDate.toDateString() === date.toDateString();
        }).length;

        bookingTrends.push({
          date: dateStr,
          bookings: dailyBookings,
        });
      }
    }

    return bookingTrends;
  }, []);

  const generateTopServices = useCallback((input: AnalyticsChartsInput) => {
    const { services, serviceRequests, dateRange } = input;

    const serviceStats = new Map();
    serviceRequests
      .filter((sr) => {
        if (!sr.created_at) return false;
        const createdAt = new Date(sr.created_at);
        return createdAt >= dateRange.from && createdAt <= dateRange.to;
      })
      .forEach((sr) => {
        const service = services.find((s) => s.id === sr.service_id);
        if (service) {
          const current = serviceStats.get(service.name) || {
            bookings: 0,
            revenue: 0,
          };
          current.bookings++;
          current.revenue += sr.total_amount;
          serviceStats.set(service.name, current);
        }
      });

    return Array.from(serviceStats.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }, []);

  const generateBookingsByStatus = useCallback(
    (input: AnalyticsChartsInput) => {
      const { bookings } = input;

      return [
        {
          status: "Terminées",
          count: bookings.filter((b) => b.status === "completed").length,
        },
        {
          status: "En cours",
          count: bookings.filter(
            (b) => b.status === "pending" || b.status === "confirmed"
          ).length,
        },
        {
          status: "Annulées",
          count: bookings.filter((b) => b.status === "cancelled").length,
        },
      ].filter((item) => item.count > 0);
    },
    []
  );

  return {
    generateUserGrowthData,
    generateBookingTrends,
    generateTopServices,
    generateBookingsByStatus,
  };
};
