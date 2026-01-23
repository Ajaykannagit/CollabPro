// Notifications Panel - displays user notifications

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/hooks/useDatabase';

export function NotificationsPanel() {
  const { data: notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Notifications</h1>
          <p className="text-slate-400">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`cursor-pointer transition-all ${!notification.read ? 'border-primary bg-primary/5' : 'opacity-60'
              }`}
            onClick={() => notification.id && markAsRead(notification.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-500/10 text-green-500' :
                  notification.type === 'error' ? 'bg-red-500/10 text-red-500' :
                    notification.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-blue-500/10 text-blue-500'
                  }`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-100">{notification.title}</h3>
                    {!notification.read && (
                      <Badge variant="default" className="ml-2">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
