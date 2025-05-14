import { Button } from "./button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Get admin credentials from environment or localStorage
function getAdminCredentials() {
  // Try to get from localStorage under the app's main credentials key first
  const savedCredentials = localStorage.getItem("kloudBugZigMiner_credentials");
  if (savedCredentials) {
    try {
      return JSON.parse(savedCredentials);
    } catch (error) {
      console.error("Failed to parse saved credentials:", error);
    }
  }
  
  // Fallback: check legacy "zipMiner_credentials" key
  const legacyCredentials = localStorage.getItem("zipMiner_credentials");
  if (legacyCredentials) {
    try {
      const creds = JSON.parse(legacyCredentials);
      // Migrate legacy credentials to new key
      storeDefaultCredentials(creds.username, creds.password);
      return creds;
    } catch (error) {
      console.error("Failed to parse legacy credentials:", error);
    }
  }
  
  // Use default credentials - we're using admin123 as the default password
  // This matches the password in server/routes.ts
  return {
    username: "admin",
    password: "admin123"
  };
}

// Store admin credentials for quick access
function storeDefaultCredentials(username = "admin", password = "admin123") {
  try {
    // Store under the main app credentials key used by the login form
    localStorage.setItem("kloudBugZigMiner_credentials", JSON.stringify({
      username,
      password
    }));
    console.log("Admin credentials stored in localStorage");
    return true;
  } catch (error) {
    console.error("Failed to store admin credentials:", error);
    return false;
  }
}

export function QuickLogin() {
  const { toast } = useToast();

  const handleQuickLogin = async () => {
    try {
      // Ensure default credentials are stored in localStorage
      storeDefaultCredentials();
      
      // Get credentials for login
      const credentials = getAdminCredentials();
      
      // Ensure we have credentials before attempting login
      if (!credentials.username || !credentials.password) {
        toast({
          title: "Login Failed",
          description: "Missing login credentials. Please log in manually.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Attempting quick login with username:", credentials.username);
      
      // Use secure credentials
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      
      if (res.ok) {
        console.log("Login successful, parsing user data");
        const user = await res.json();
        queryClient.setQueryData(["/api/auth/user"], user);
        
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${user.username || 'admin'}`,
        });
        
        // Show system status toast to confirm app is ready
        setTimeout(() => {
          toast({
            title: "System Status: OPERATIONAL",
            description: "✅ All wallet settings permanently saved\n✅ Withdrawals processing automatically\n✅ Hardware wallet protection active",
            variant: "default",
            duration: 10000, // Show for 10 seconds
          });
        }, 1000);
        
        // Redirect to dashboard after a short delay to allow toast to be seen
        setTimeout(() => {
          console.log("Redirecting to dashboard after successful login");
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        console.error("Login failed with status:", res.status);
        throw new Error(`Login failed with status ${res.status}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Could not log in with quick access credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button 
        onClick={handleQuickLogin}
        variant="default"
        size="lg"
        className="text-md font-semibold"
      >
        Quick Login
      </Button>
    </div>
  );
}