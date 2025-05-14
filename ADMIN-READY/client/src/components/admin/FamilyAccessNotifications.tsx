import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, User, Clock, Shield, RefreshCw, Bell, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistance } from 'date-fns';

interface FamilyAccessNotification {
  type: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: {
    method: string;
    code?: string;
    username?: string;
  };
}

interface FamilyAccessNotificationsProps {
  className?: string;
}

export function FamilyAccessNotifications({ className = '' }: FamilyAccessNotificationsProps) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<FamilyAccessNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [newNotifications, setNewNotifications] = useState<string[]>([]);

  // Function to load notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/notifications');
      
      if (!response.ok) {
        throw new Error('Failed to load notifications');
      }
      
      const data = await response.json();
      
      // Get only family access notifications
      const familyNotifications = data.notifications
        .filter((n: FamilyAccessNotification) => n.type === 'FAMILY_ACCESS')
        .sort((a: FamilyAccessNotification, b: FamilyAccessNotification) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
      
      // Check for new notifications
      if (notifications.length > 0) {
        const previousIds = notifications.map(n => n.timestamp);
        const newOnes = familyNotifications
          .filter((n: FamilyAccessNotification) => !previousIds.includes(n.timestamp))
          .map((n: FamilyAccessNotification) => n.timestamp);
        
        if (newOnes.length > 0) {
          setNewNotifications(newOnes);
          
          // Show a toast notification
          toast({
            title: "Family Access Alert",
            description: `${newOnes.length} new family member ${newOnes.length === 1 ? 'login' : 'logins'} detected.`,
            variant: "default",
          });
        }
      }
      
      setNotifications(familyNotifications);
      setLastChecked(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      toast({
        title: "Notification Error",
        description: "Could not load family access notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up periodic checking (every 60 seconds)
    const interval = setInterval(fetchNotifications, 60000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);

  // Format the timestamp to a readable format
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (e) {
      return 'Unknown time';
    }
  };

  // Get a readable version of the login method
  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'direct-login':
        return 'Username/Password';
      case 'access-code':
        return 'Access Code';
      default:
        return method;
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-gray-900/80 to-amber-900/20 backdrop-blur-sm border border-amber-900/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-amber-400" />
            Family Access Monitor
            {notifications.length > 0 && (
              <Badge className="bg-amber-600 ml-2">
                {notifications.length}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={fetchNotifications}
            disabled={loading}
            className="hover:bg-amber-500/10"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-amber-400' : 'text-amber-500'}`} />
          </Button>
        </div>
        <CardDescription>
          Monitor when family members access Tera's memorial content
          {lastChecked && (
            <span className="flex items-center text-xs mt-1 text-amber-500/70">
              <Clock className="h-3 w-3 mr-1" />
              Last checked: {formatDistance(lastChecked, new Date(), { addSuffix: true })}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-amber-900/20 flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-amber-500/50" />
              </div>
              <div className="h-4 w-32 bg-amber-900/20 rounded mb-2"></div>
              <div className="h-3 w-24 bg-amber-900/10 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="py-6 flex flex-col items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-center text-red-400">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchNotifications} 
              className="mt-3 border-red-500 text-red-500 hover:bg-red-500/10"
            >
              Try Again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 flex flex-col items-center">
            <div className="bg-amber-500/10 rounded-full p-3 mb-3">
              <Bell className="h-6 w-6 text-amber-500" />
            </div>
            <p className="text-center text-amber-200">No family access detected yet</p>
            <p className="text-center text-amber-500/70 text-sm mt-1">
              You'll receive notifications when family members log in
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.timestamp}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    p-3 rounded-lg border 
                    ${newNotifications.includes(notification.timestamp) 
                      ? 'bg-amber-500/20 border-amber-500/50 animate-pulse-subtle' 
                      : 'bg-gray-800/50 border-gray-700/50'}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-amber-400" />
                      <h4 className="font-medium text-amber-100">
                        Family Member Login
                      </h4>
                    </div>
                    <Badge className="bg-amber-700/50 text-amber-200 text-xs">
                      {getMethodLabel(notification.details.method)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 ml-6">
                    {formatTime(notification.timestamp)}
                  </p>
                  <div className="mt-2 ml-6 text-xs text-gray-500">
                    IP: {notification.ipAddress}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t border-amber-900/20 pt-4">
        <div className="text-xs text-amber-500/70 flex items-center">
          <Shield className="h-3 w-3 mr-1" />
          Family access events are logged automatically
        </div>
      </CardFooter>
    </Card>
  );
}