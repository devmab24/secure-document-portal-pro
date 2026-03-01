import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  reference_id: string | null;
  reference_type: string | null;
  is_read: boolean;
  created_at: string;
}

export class NotificationService {
  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
    return count || 0;
  }

  static async getNotifications(userId: string, limit = 20): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
    return (data as Notification[]) || [];
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) console.error("Error marking notification as read:", error);
  }

  static async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) console.error("Error marking all as read:", error);
  }

  static async createNotification(params: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    referenceId?: string;
    referenceType?: string;
  }): Promise<void> {
    const { error } = await supabase.from("notifications").insert({
      user_id: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      reference_id: params.referenceId || null,
      reference_type: params.referenceType || null,
    });

    if (error) console.error("Error creating notification:", error);
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) console.error("Error deleting notification:", error);
  }
}
