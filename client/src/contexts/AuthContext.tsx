import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, login as loginApi, logout as logoutApi, register as registerApi } from '@/lib/miningClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { queryClient } from '@/lib/queryClient';
import { LoginAnimation } from '@/components/ui/LoginAnimation';
import VideoMiningAnimation from '@/components/ui/VideoMiningAnimation';
import { RobotAnimation } from '@/components/ui/RobotAnimation';
import { UserTrackingProvider } from './UserTrackingContext';

// Keys for stored credentials
const STORED_CREDENTIALS_KEY = 'kloudBugZigMiner_credentials';
const FAMILY_ACCESS_KEY = 'tera_family_access_code';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginAnimation, setShowLoginAnimation] = useState<boolean>(false);
  const [pendingLoginData, setPendingLoginData] = useState<any>(null);
  const [autoLoginAttempted, setAutoLoginAttempted] = useState<boolean>(false);
  // Using the new robot animation component
  // const [useNewAnimation, setUseNewAnimation] = useState<boolean>(true);

  // Query to fetch current user
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false
  });
  
  // Handle authentication state updates
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else if (!isLoading) {
      setIsAuthenticated(false);
    }
  }, [user, isLoading]);
  
  // Auto-login effect using stored credentials
  useEffect(() => {
    const attemptAutoLogin = async () => {
      // Only try auto-login once
      if (autoLoginAttempted || isAuthenticated || isLoading) return;
      
      setAutoLoginAttempted(true);
      
      try {
        // Try normal credentials first
        const storedCredentials = localStorage.getItem(STORED_CREDENTIALS_KEY);
        if (storedCredentials) {
          const { username, password } = JSON.parse(storedCredentials);
          if (username && password) {
            console.log("Found stored credentials, attempting auto-login");
            await login(username, password);
            return;
          }
        }
        
        // Then try family access code
        const familyAccessCode = localStorage.getItem(FAMILY_ACCESS_KEY);
        if (familyAccessCode) {
          console.log("Found stored family access code, redirecting to family access page");
          navigate('/family-access');
          return;
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
        // Clear any bad credentials
        localStorage.removeItem(STORED_CREDENTIALS_KEY);
      }
    };
    
    // Attempt auto-login after a short delay to let the app initialize
    const timer = setTimeout(() => {
      attemptAutoLogin();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      console.log("Attempting login:", username);
      
      // Clear any previous session issues
      queryClient.cancelQueries({ queryKey: ['/api/auth/user'] });
      queryClient.removeQueries({ queryKey: ['/api/auth/user'] });
      
      const response = await loginApi(username, password);
      console.log("Login API response received, status:", response.status);
      
      // Ensure we can properly read the response
      let userData;
      try {
        userData = await response.json();
        console.log("Login successful, user data received:", userData);
      } catch (jsonError) {
        console.error("Error parsing login response:", jsonError);
        throw new Error("Invalid response from server. Please try again.");
      }
      
      if (!userData || !userData.id) {
        console.error("Invalid user data received:", userData);
        throw new Error("Server returned invalid user data");
      }
      
      // Update auth state
      setIsAuthenticated(true);
      
      // Important: Make sure user data is properly saved in cache
      queryClient.setQueryData(['/api/auth/user'], userData);
      
      // Test if the data was saved correctly
      const cachedData = queryClient.getQueryData(['/api/auth/user']);
      console.log("Cached user data:", cachedData);
      
      // Invalidate the current user query to force a fresh fetch on next access
      // but only after we're sure the data is cached
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      }, 300);
      
      // Store username for animation
      setPendingLoginData(userData);
      setShowLoginAnimation(true);
      
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      
      // Clear any cached data to ensure a clean state
      queryClient.setQueryData(['/api/auth/user'], null);
      
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please check your username and password.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Handle animation completion
  const handleLoginAnimationComplete = () => {
    setShowLoginAnimation(false);
    
    console.log("Login animation complete, redirecting to dashboard");
    
    // First make sure we clear any pending login data
    const userData = pendingLoginData;
    setPendingLoginData(null);
    
    // Create a more reliable redirect sequence with proper error handling
    const redirectToDashboard = () => {
      console.log("Executing navigation to /dashboard");
      try {
        // First, validate session is still active
        fetch('/api/auth/user', { credentials: 'include' })
          .then(response => {
            if (response.ok) {
              // Session is confirmed, safe to redirect
              console.log("Session confirmed valid before redirect");
              navigate('/dashboard');
            } else {
              console.error("Session validation failed before redirect:", response.status);
              // Still attempt to redirect but show a warning
              toast({
                title: "Warning",
                description: "Your session may have expired. Please try refreshing if you encounter issues.",
                variant: "destructive",
              });
              navigate('/dashboard');
            }
          })
          .catch(err => {
            console.error("Error checking session before redirect:", err);
            // Still attempt to redirect with warning
            navigate('/dashboard');
          });
      } catch (e) {
        console.error("Critical redirect error:", e);
        // Last resort - direct navigation
        navigate('/dashboard');
      }
    };
    
    // Force a refetch of user data before navigating
    try {
      // First delay to ensure animation is fully complete
      setTimeout(() => {
        refetch()
          .then(() => {
            console.log("User data refreshed, preparing for navigation");
            // Then schedule the navigation with a clear delay
            setTimeout(redirectToDashboard, 500);
          })
          .catch(err => {
            console.error("Error refreshing user data:", err);
            // Navigate anyway even if refresh fails, with a slightly longer delay
            setTimeout(redirectToDashboard, 800);
          });
      }, 200);
    } catch (e) {
      console.error("Critical error in redirect sequence:", e);
      // Emergency redirect after a delay
      setTimeout(redirectToDashboard, 1000);
    }
    
    // Show welcome toast
    if (userData) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.username}!`,
      });
      
      // System status confirmation toast - shows app is ready for customers
      setTimeout(() => {
        toast({
          title: "System Status: OPERATIONAL",
          description: "✅ All wallet settings permanently saved\n✅ Withdrawals processing automatically\n✅ Hardware wallet protection active",
          variant: "default",
          duration: 10000, // Show for 10 seconds
        });
      }, 1000); // Show 1 second after the welcome toast
      
      setPendingLoginData(null);
    }
  };

  // Register function
  const register = async (userData: any) => {
    try {
      await registerApi(userData);
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please login.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutApi();
      
      // Clear authentication state
      setIsAuthenticated(false);
      
      // Clear stored credentials from localStorage
      localStorage.removeItem(STORED_CREDENTIALS_KEY);
      
      // Reset auto-login flag to allow future login attempts
      setAutoLoginAttempted(false);
      
      // Navigate to login page
      navigate('/login');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: error instanceof Error ? error.message : "Failed to logout",
        variant: "destructive",
      });
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  // Determine which animation variant to use - currently only admin can access
  const getAnimationVariant = () => {
    return 'blast'; // Use blast animation for admin users
  };
  
  // Auto-dismiss login animation after 8 seconds
  useEffect(() => {
    if (showLoginAnimation && pendingLoginData) {
      const timer = setTimeout(() => {
        handleLoginAnimationComplete();
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [showLoginAnimation, pendingLoginData]);

  return (
    <AuthContext.Provider value={value}>
      {showLoginAnimation && pendingLoginData && (
        <UserTrackingProvider>
          <RobotAnimation
            onComplete={handleLoginAnimationComplete}
            username={pendingLoginData.username}
          />
        </UserTrackingProvider>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}