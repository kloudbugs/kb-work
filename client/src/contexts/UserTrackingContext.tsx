import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';

type UserActivity = {
  userId: string;
  username: string;
  loginTime: Date;
  logoutTime?: Date;
  lastActive: Date;
  status: 'active' | 'inactive' | 'away';
};

type UserTrackingContextType = {
  reportUserLogin: (username: string) => void;
  reportUserLogout: () => void;
  reportUserActivity: () => void;
  activeUsers: UserActivity[];
};

const UserTrackingContext = createContext<UserTrackingContextType | null>(null);

export function UserTrackingProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [activeUsers, setActiveUsers] = useState<UserActivity[]>([]);
  const [lastActivityTime, setLastActivityTime] = useState<Date>(new Date());

  // Send heartbeat to server every 30 seconds
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const heartbeatInterval = setInterval(() => {
      reportUserActivity();
    }, 30000);

    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    const handleActivity = () => setLastActivityTime(new Date());
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(heartbeatInterval);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, user]);

  // Report login to admin
  const reportUserLogin = async (username: string) => {
    if (!user || !user.id) return;
    
    try {
      await apiRequest('POST', '/api/activity', {
        action: 'login',
        sessionId: user.id.toString(),
        userId: user.id,
        username: username || user.username,
        timestamp: new Date().toISOString()
      });
      
      // Fetch current active users
      try {
        const response = await fetch('/api/users/active', { 
          credentials: 'include' 
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.users) {
            setActiveUsers(data.users);
          }
        }
      } catch (fetchError) {
        console.warn('Failed to fetch active users:', fetchError);
      }
    } catch (error) {
      console.error('Failed to report user login:', error);
    }
  };

  // Report logout to admin
  const reportUserLogout = async () => {
    if (!user || !user.id) return;
    
    try {
      await apiRequest('POST', '/api/activity', {
        action: 'logout',
        sessionId: user.id.toString(),
        userId: user.id,
        username: user.username,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to report user logout:', error);
    }
  };

  // Report user activity heartbeat
  const reportUserActivity = async () => {
    if (!user || !user.id) return;
    
    try {
      await apiRequest('POST', '/api/activity', {
        action: 'heartbeat',
        sessionId: user.id.toString(),
        userId: user.id,
        username: user.username,
        timestamp: new Date().toISOString(),
        lastActive: lastActivityTime.toISOString()
      });
      
      // Refresh active users list
      try {
        const response = await fetch('/api/active-users', { 
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.users) {
            setActiveUsers(data.users);
          }
        }
      } catch (fetchError) {
        console.warn('Failed to fetch active users:', fetchError);
      }
    } catch (error) {
      console.error('Failed to report user activity:', error);
    }
  };

  // Set up window unload handler for logout tracking
  useEffect(() => {
    const handleUnload = () => {
      // Use synchronous API for unload event
      if (user && user.id) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/activity', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
          action: 'logout',
          sessionId: user.id.toString(),
          userId: user.id,
          username: user.username,
          timestamp: new Date().toISOString()
        }));
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [user]);

  return (
    <UserTrackingContext.Provider value={{ 
      reportUserLogin, 
      reportUserLogout, 
      reportUserActivity,
      activeUsers
    }}>
      {children}
    </UserTrackingContext.Provider>
  );
}

export const useUserTracking = () => {
  const context = useContext(UserTrackingContext);
  if (context === null) {
    throw new Error('useUserTracking must be used within a UserTrackingProvider');
  }
  return context;
};

export default UserTrackingContext;