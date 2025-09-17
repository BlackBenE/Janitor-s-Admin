import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataProvider } from "../providers/dataProvider";
import type { Database } from "../types/database.types";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];
type NotificationInsert =
  Database["public"]["Tables"]["notifications"]["Insert"];

// Notification statistics interface
export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: Record<string, number>;
  recentCount: number; // Last 24 hours
  weeklyCount: number; // Last 7 days
  readRate: number; // Percentage of read notifications
}

// Notification summary for dashboard
export interface NotificationSummary {
  urgent: Notification[];
  recent: Notification[];
  unreadCount: number;
  totalToday: number;
  trending: "up" | "down" | "stable";
}

// Notification management data
export interface NotificationGroup {
  type: string;
  count: number;
  unreadCount: number;
  notifications: Notification[];
  lastNotification?: Notification;
}

// Create notification data
export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedId?: string;
}

// Bulk notification operations
export interface BulkNotificationAction {
  notificationIds: string[];
  action: "mark_read" | "mark_unread" | "delete";
}

// Query keys for cache management
const NOTIFICATIONS_QUERY_KEYS = {
  all: ["notifications"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...NOTIFICATIONS_QUERY_KEYS.all, "list", filters] as const,
  user: (userId: string) =>
    [...NOTIFICATIONS_QUERY_KEYS.all, "user", userId] as const,
  stats: () => [...NOTIFICATIONS_QUERY_KEYS.all, "stats"] as const,
  summary: () => [...NOTIFICATIONS_QUERY_KEYS.all, "summary"] as const,
  groups: () => [...NOTIFICATIONS_QUERY_KEYS.all, "groups"] as const,
  unread: (userId?: string) =>
    [...NOTIFICATIONS_QUERY_KEYS.all, "unread", userId] as const,
  byType: (type: string) =>
    [...NOTIFICATIONS_QUERY_KEYS.all, "type", type] as const,
};

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Helper function to calculate date ranges
  const getDateRanges = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return { today, yesterday, weekAgo };
  };

  // Get all notifications with optional filters
  const useNotificationsList = (filters?: Record<string, unknown>) => {
    return useQuery({
      queryKey: NOTIFICATIONS_QUERY_KEYS.list(filters),
      queryFn: async (): Promise<Notification[]> => {
        const response = await dataProvider.getList(
          "notifications",
          {
            orderBy: "created_at",
          },
          filters
        );

        return response.success && response.data ? response.data.reverse() : [];
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    });
  };

  // Get notifications for specific user
  const useUserNotifications = (userId: string) => {
    return useQuery({
      queryKey: NOTIFICATIONS_QUERY_KEYS.user(userId),
      queryFn: async (): Promise<Notification[]> => {
        if (!userId) return [];

        const response = await dataProvider.getList(
          "notifications",
          {
            orderBy: "created_at",
          },
          {
            user_id: `eq.${userId}`,
          }
        );

        return response.success && response.data ? response.data.reverse() : [];
      },
      enabled: !!userId,
      staleTime: 1 * 60 * 1000, // 1 minute
      refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
    });
  };

  // Get unread notifications
  const useUnreadNotifications = (userId?: string) => {
    return useQuery({
      queryKey: NOTIFICATIONS_QUERY_KEYS.unread(userId),
      queryFn: async (): Promise<Notification[]> => {
        const filters: Record<string, string> = {};

        if (userId) {
          filters.user_id = `eq.${userId}`;
        }

        const response = await dataProvider.getList(
          "notifications",
          {
            orderBy: "created_at",
          },
          filters
        );

        if (!response.success || !response.data) return [];

        // Filter unread notifications in JavaScript since read is boolean
        const unreadNotifications = response.data.filter(
          (notification) => !notification.read
        );
        return unreadNotifications.reverse(); // Most recent first
      },
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 1 * 60 * 1000, // Refresh every minute
    });
  };

  // Get notifications by type
  const useNotificationsByType = (type: string) => {
    return useQuery({
      queryKey: NOTIFICATIONS_QUERY_KEYS.byType(type),
      queryFn: async (): Promise<Notification[]> => {
        if (!type) return [];

        const response = await dataProvider.getList(
          "notifications",
          {
            orderBy: "created_at",
          },
          {
            type: `eq.${type}`,
          }
        );

        return response.success && response.data ? response.data.reverse() : [];
      },
      enabled: !!type,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get notification statistics
  const useNotificationStats = () => {
    return useQuery({
      queryKey: NOTIFICATIONS_QUERY_KEYS.stats(),
      queryFn: async (): Promise<NotificationStats> => {
        const { today, weekAgo } = getDateRanges();

        const [allNotifications, recentNotifications, weeklyNotifications] =
          await Promise.all([
            dataProvider.getList("notifications", {}),
            dataProvider.getList(
              "notifications",
              {},
              {
                created_at: `gte.${today.toISOString()}`,
              }
            ),
            dataProvider.getList(
              "notifications",
              {},
              {
                created_at: `gte.${weekAgo.toISOString()}`,
              }
            ),
          ]);

        const notifications =
          allNotifications.success && allNotifications.data
            ? allNotifications.data
            : [];
        const recent =
          recentNotifications.success && recentNotifications.data
            ? recentNotifications.data
            : [];
        const weekly =
          weeklyNotifications.success && weeklyNotifications.data
            ? weeklyNotifications.data
            : [];

        // Calculate statistics
        const total = notifications.length;
        const unread = notifications.filter((n) => !n.read).length;
        const read = notifications.filter((n) => n.read).length;
        const readRate =
          total > 0 ? Math.round((read / total) * 100 * 100) / 100 : 0;

        // Group by type
        const byType: Record<string, number> = {};
        notifications.forEach((notification) => {
          byType[notification.type] = (byType[notification.type] || 0) + 1;
        });

        return {
          total,
          unread,
          read,
          byType,
          recentCount: recent.length,
          weeklyCount: weekly.length,
          readRate,
        };
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
    });
  };

  // Get notification summary for dashboard
  const useNotificationSummary = () => {
    return useQuery({
      queryKey: NOTIFICATIONS_QUERY_KEYS.summary(),
      queryFn: async (): Promise<NotificationSummary> => {
        const { today, yesterday } = getDateRanges();

        const [
          recentNotifications,
          todayNotifications,
          yesterdayNotifications,
          allNotifications,
        ] = await Promise.all([
          dataProvider.getList("notifications", {
            orderBy: "created_at",
            limit: 10,
          }),
          dataProvider.getList(
            "notifications",
            {},
            {
              created_at: `gte.${today.toISOString()}`,
            }
          ),
          dataProvider.getList(
            "notifications",
            {},
            {
              created_at: `gte.${yesterday.toISOString()}&lt.${today.toISOString()}`,
            }
          ),
          dataProvider.getList("notifications", {}),
        ]);

        const recent =
          recentNotifications.success && recentNotifications.data
            ? recentNotifications.data.reverse()
            : [];
        const todayCount =
          todayNotifications.success && todayNotifications.data
            ? todayNotifications.data.length
            : 0;
        const yesterdayCount =
          yesterdayNotifications.success && yesterdayNotifications.data
            ? yesterdayNotifications.data.length
            : 0;
        const allNotifs =
          allNotifications.success && allNotifications.data
            ? allNotifications.data
            : [];

        // Filter unread notifications in JavaScript
        const unread = allNotifs.filter((notification) => !notification.read);

        // Identify urgent notifications (unread and less than 2 hours old)
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const urgent = unread.filter((notification) => {
          const createdAt = new Date(notification.created_at || "");
          return !notification.read && createdAt > twoHoursAgo;
        });

        // Calculate trend
        const getTrend = (): "up" | "down" | "stable" => {
          if (yesterdayCount === 0) return todayCount > 0 ? "up" : "stable";
          const change = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
          if (change > 10) return "up";
          if (change < -10) return "down";
          return "stable";
        };

        return {
          urgent,
          recent,
          unreadCount: unread.length,
          totalToday: todayCount,
          trending: getTrend(),
        };
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    });
  };

  // Get notifications grouped by type
  const useNotificationGroups = () => {
    return useQuery({
      queryKey: NOTIFICATIONS_QUERY_KEYS.groups(),
      queryFn: async (): Promise<NotificationGroup[]> => {
        const response = await dataProvider.getList("notifications", {
          orderBy: "created_at",
        });

        const notifications =
          response.success && response.data ? response.data.reverse() : [];

        // Group notifications by type
        const groupsMap = new Map<string, Notification[]>();

        notifications.forEach((notification) => {
          const type = notification.type;
          if (!groupsMap.has(type)) {
            groupsMap.set(type, []);
          }
          groupsMap.get(type)?.push(notification);
        });

        // Convert to NotificationGroup format
        const groups: NotificationGroup[] = [];

        groupsMap.forEach((typeNotifications, type) => {
          const unreadCount = typeNotifications.filter((n) => !n.read).length;
          const lastNotification = typeNotifications[0]; // Already sorted by created_at desc

          groups.push({
            type,
            count: typeNotifications.length,
            unreadCount,
            notifications: typeNotifications,
            lastNotification,
          });
        });

        // Sort groups by total count (descending)
        groups.sort((a, b) => b.count - a.count);

        return groups;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Create new notification
  const useCreateNotification = () => {
    return useMutation({
      mutationFn: async (
        data: CreateNotificationData
      ): Promise<Notification> => {
        const notificationData: NotificationInsert = {
          user_id: data.userId,
          title: data.title,
          message: data.message,
          type: data.type,
          related_id: data.relatedId,
          read: false,
        };

        const response = await dataProvider.create(
          "notifications",
          notificationData
        );

        if (!response.success || !response.data) {
          const errorMessage =
            typeof response.error === "string"
              ? response.error
              : "Failed to create notification";
          throw new Error(errorMessage);
        }

        return response.data;
      },
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.all,
        });
        queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.user(data.user_id),
        });
      },
    });
  };

  // Mark notification as read
  const useMarkAsRead = () => {
    return useMutation({
      mutationFn: async (notificationId: string): Promise<Notification> => {
        const response = await dataProvider.update(
          "notifications",
          notificationId,
          {
            read: true,
          }
        );

        if (!response.success || !response.data) {
          const errorMessage =
            typeof response.error === "string"
              ? response.error
              : "Failed to mark notification as read";
          throw new Error(errorMessage);
        }

        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.all,
        });
        queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.user(data.user_id),
        });
      },
    });
  };

  // Mark notification as unread
  const useMarkAsUnread = () => {
    return useMutation({
      mutationFn: async (notificationId: string): Promise<Notification> => {
        const response = await dataProvider.update(
          "notifications",
          notificationId,
          {
            read: false,
          }
        );

        if (!response.success || !response.data) {
          const errorMessage =
            typeof response.error === "string"
              ? response.error
              : "Failed to mark notification as unread";
          throw new Error(errorMessage);
        }

        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.all,
        });
        queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.user(data.user_id),
        });
      },
    });
  };

  // Delete notification
  const useDeleteNotification = () => {
    return useMutation({
      mutationFn: async (notificationId: string): Promise<void> => {
        const response = await dataProvider.delete(
          "notifications",
          notificationId
        );

        if (!response.success) {
          const errorMessage =
            typeof response.error === "string"
              ? response.error
              : "Failed to delete notification";
          throw new Error(errorMessage);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.all,
        });
      },
    });
  };

  // Bulk operations on notifications
  const useBulkNotificationActions = () => {
    return useMutation({
      mutationFn: async ({
        notificationIds,
        action,
      }: BulkNotificationAction): Promise<void> => {
        const promises = notificationIds.map(async (id) => {
          switch (action) {
            case "mark_read":
              return dataProvider.update("notifications", id, { read: true });
            case "mark_unread":
              return dataProvider.update("notifications", id, { read: false });
            case "delete":
              return dataProvider.delete("notifications", id);
            default:
              throw new Error(`Unknown action: ${action}`);
          }
        });

        const results = await Promise.all(promises);
        const failedActions = results.filter((result) => !result.success);

        if (failedActions.length > 0) {
          throw new Error(
            `Failed to ${action} ${failedActions.length} notifications`
          );
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.all,
        });
      },
    });
  };

  // Mark all notifications as read for a user
  const useMarkAllAsRead = () => {
    return useMutation({
      mutationFn: async (userId?: string): Promise<void> => {
        // Get all unread notifications
        const filters: Record<string, string> = {
          read: "eq.false",
        };

        if (userId) {
          filters.user_id = `eq.${userId}`;
        }

        const response = await dataProvider.getList(
          "notifications",
          {},
          filters
        );

        if (!response.success || !response.data) {
          return;
        }

        // Mark all as read
        const updatePromises = response.data.map((notification) =>
          dataProvider.update("notifications", notification.id, { read: true })
        );

        const results = await Promise.all(updatePromises);
        const failedUpdates = results.filter((result) => !result.success);

        if (failedUpdates.length > 0) {
          throw new Error(
            `Failed to mark ${failedUpdates.length} notifications as read`
          );
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.all,
        });
      },
    });
  };

  // Send notification to multiple users
  const useBroadcastNotification = () => {
    return useMutation({
      mutationFn: async ({
        userIds,
        title,
        message,
        type,
        relatedId,
      }: {
        userIds: string[];
        title: string;
        message: string;
        type: string;
        relatedId?: string;
      }): Promise<Notification[]> => {
        const createPromises = userIds.map((userId) =>
          dataProvider.create("notifications", {
            user_id: userId,
            title,
            message,
            type,
            related_id: relatedId,
            read: false,
          })
        );

        const results = await Promise.all(createPromises);
        const failedCreations = results.filter((result) => !result.success);

        if (failedCreations.length > 0) {
          throw new Error(
            `Failed to send notification to ${failedCreations.length} users`
          );
        }

        return results
          .filter((result) => result.success)
          .map((result) => result.data!);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEYS.all,
        });
      },
    });
  };

  // Utility functions
  const invalidateNotifications = () => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all });
  };

  const refreshNotifications = () => {
    return Promise.all([
      queryClient.refetchQueries({
        queryKey: NOTIFICATIONS_QUERY_KEYS.stats(),
      }),
      queryClient.refetchQueries({
        queryKey: NOTIFICATIONS_QUERY_KEYS.summary(),
      }),
      queryClient.refetchQueries({
        queryKey: NOTIFICATIONS_QUERY_KEYS.groups(),
      }),
    ]);
  };

  return {
    // Query hooks
    useNotificationsList,
    useUserNotifications,
    useUnreadNotifications,
    useNotificationsByType,
    useNotificationStats,
    useNotificationSummary,
    useNotificationGroups,

    // Mutation hooks
    useCreateNotification,
    useMarkAsRead,
    useMarkAsUnread,
    useDeleteNotification,
    useBulkNotificationActions,
    useMarkAllAsRead,
    useBroadcastNotification,

    // Utilities
    invalidateNotifications,
    refreshNotifications,

    // Query keys for external use
    queryKeys: NOTIFICATIONS_QUERY_KEYS,
  };
};
