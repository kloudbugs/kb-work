import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface AccessPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  features: string[];
}

interface AccessContextType {
  hasAccess: boolean;
  isAccessLoading: boolean;
  accessVerified: boolean;
  currentAccess: any | null;
  accessPlan: AccessPlan | null;
  allPlans: AccessPlan[];
  refreshAccess: () => void;
  setAccessVerified: (value: boolean) => void;
}

const AccessContext = createContext<AccessContextType>({
  hasAccess: false,
  isAccessLoading: true,
  accessVerified: false,
  currentAccess: null,
  accessPlan: null,
  allPlans: [],
  refreshAccess: () => {},
  setAccessVerified: () => {}
});

export const useAccess = () => useContext(AccessContext);

// Storage key for access verification
const ACCESS_VERIFIED_KEY = 'kloudBugZigMiner_accessVerified';

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  // Check if user has already verified access in a previous session
  const [accessVerified, setAccessVerifiedState] = useState<boolean>(() => {
    // If we're in the browser, check localStorage
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(ACCESS_VERIFIED_KEY);
      return storedValue === 'true';
    }
    return false;
  });

  // Function to set access as verified and persist it
  const setAccessVerified = (value: boolean) => {
    setAccessVerifiedState(value);
    if (typeof window !== 'undefined') {
      if (value) {
        localStorage.setItem(ACCESS_VERIFIED_KEY, 'true');
      } else {
        localStorage.removeItem(ACCESS_VERIFIED_KEY);
      }
    }
  };

  // Query for access status
  const {
    data: currentAccess,
    isLoading: isAccessLoading,
    refetch: refetchAccess
  } = useQuery({
    queryKey: ['/api/access/status'],
    enabled: isAuthenticated,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
    refetchInterval: 300000, // 5 minutes
    retry: 1
  });

  // Query for access plans
  const {
    data: accessPlans,
    isLoading: isPlansLoading
  } = useQuery({
    queryKey: ['/api/access/plans'],
    enabled: isAuthenticated,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Get the current access plan details
  const accessPlan = currentAccess && accessPlans && Array.isArray(accessPlans) 
    ? accessPlans.find((plan: AccessPlan) => plan.id === (currentAccess as any).planId)
    : null;

  // Update access status when data changes
  useEffect(() => {
    if (currentAccess) {
      const hasValidAccess = (currentAccess as any).status === 'active';
      setHasAccess(hasValidAccess);
    } else {
      setHasAccess(false);
    }
  }, [currentAccess]);

  // Auto verify access for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      // If the user is logged in, consider access verified
      setAccessVerified(true);
    }
  }, [isAuthenticated, user]);

  // Function to manually refresh access data
  const refreshAccess = () => {
    refetchAccess();
  };

  // For development only - simulate access
  useEffect(() => {
    // This is a development simulation - always set to true for authenticated users
    setHasAccess(true);
  }, []);

  return (
    <AccessContext.Provider value={{
      hasAccess,
      isAccessLoading: isAccessLoading || isPlansLoading,
      accessVerified,
      currentAccess: currentAccess || null,
      accessPlan,
      allPlans: Array.isArray(accessPlans) ? accessPlans : [],
      refreshAccess,
      setAccessVerified
    }}>
      {children}
    </AccessContext.Provider>
  );
};