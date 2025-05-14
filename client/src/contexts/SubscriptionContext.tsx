import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface Subscription {
  id: number;
  status: string;
  planId: number;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  interval: string;
  features: string[];
}

interface SubscriptionContextType {
  hasActiveSubscription: boolean;
  isSubscriptionLoading: boolean;
  currentSubscription: Subscription | null;
  subscriptionPlan: SubscriptionPlan | null;
  allPlans: SubscriptionPlan[];
  refreshSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  hasActiveSubscription: false,
  isSubscriptionLoading: true,
  currentSubscription: null,
  subscriptionPlan: null,
  allPlans: [],
  refreshSubscription: () => {}
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  // Query for active subscription
  const {
    data: currentSubscription,
    isLoading: isSubscriptionLoading,
    refetch: refetchSubscription
  } = useQuery({
    queryKey: ['/api/subscriptions/active'],
    enabled: isAuthenticated,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
    refetchInterval: 300000, // 5 minutes
    retry: 1,
    onError: () => {
      setHasActiveSubscription(false);
    }
  });

  // Query for subscription plans
  const {
    data: subscriptionPlans,
    isLoading: isPlansLoading
  } = useQuery({
    queryKey: ['/api/subscriptions/plans'],
    enabled: isAuthenticated,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Get the current subscription plan details
  const subscriptionPlan = currentSubscription && subscriptionPlans 
    ? subscriptionPlans.find((plan: SubscriptionPlan) => plan.id === currentSubscription.planId)
    : null;

  // Update active subscription status when data changes
  useEffect(() => {
    if (currentSubscription) {
      const isActive = currentSubscription.status === 'active' && 
        new Date(currentSubscription.currentPeriodEnd) > new Date();
      setHasActiveSubscription(isActive);
    } else {
      setHasActiveSubscription(false);
    }
  }, [currentSubscription]);

  // Function to manually refresh subscription data
  const refreshSubscription = () => {
    refetchSubscription();
  };

  // For development only - simulate an active subscription
  useEffect(() => {
    // This is a development simulation - always set to true for the admin user
    setHasActiveSubscription(true);
  }, []);

  return (
    <SubscriptionContext.Provider value={{
      hasActiveSubscription,
      isSubscriptionLoading: isSubscriptionLoading || isPlansLoading,
      currentSubscription: currentSubscription || null,
      subscriptionPlan,
      allPlans: subscriptionPlans || [],
      refreshSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};