import { useState, useEffect, useCallback } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationService, Notification } from "@/services/notificationService";
import { formatDistanceToNow } from "date-fns";

const typeColors: Record<string, string> = {
  approval: "bg-amber-500",
  document: "bg-blue-500",
  system: "bg-muted-foreground",
  info: "bg-primary",
};

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    const [notifs, count] = await Promise.all([
      NotificationService.getNotifications(user.id, 30),
      NotificationService.getUnreadCount(user.id),
    ]);
    setNotifications(notifs);
    setUnreadCount(count);
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    await NotificationService.markAllAsRead(user.id);
    fetchNotifications();
  };

  const handleDelete = async (id: string) => {
    await NotificationService.deleteNotification(id);
    fetchNotifications();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleMarkAllRead}>
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="max-h-[360px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-3 px-4 py-3 border-b last:border-b-0 transition-colors ${
                  !n.is_read ? "bg-accent/40" : ""
                }`}
              >
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${typeColors[n.type] || typeColors.info}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {!n.is_read && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMarkAsRead(n.id)}>
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(n.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
