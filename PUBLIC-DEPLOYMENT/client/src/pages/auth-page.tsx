import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useAccess } from "@/contexts/AccessContext";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Bitcoin, Key, Shield, Scale } from "lucide-react";
import { useLocation } from "wouter";
import kloudbugsLogo from '@/assets/kloudbugs_logo.png';
// Using direct URL instead of import for image
const justiceMinerImage = "/justice-miner.png";

export default function AuthPage() {
  const { user, isAuthenticated } = useAuth();
  const { accessVerified } = useAccess();
  const [_, navigate] = useLocation();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      // If the user is authenticated and access is verified, go to dashboard
      if (accessVerified) {
        navigate("/");
      }
    }
  }, [isAuthenticated, accessVerified, navigate]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side: Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 overflow-hidden rounded-full">
                <img 
                  src={kloudbugsLogo} 
                  alt="KloudBugs Logo" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">KLOUD-BUGS MINING CAFE</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Advanced Cryptocurrency Mining Platform
            </p>
          </div>
          
          <AuthTabs />
        </div>
      </div>
      
      {/* Right side: Hero section with cyberpunk mining justice theme */}
      <div className="flex-1 bg-gradient-to-br from-purple-900 to-indigo-900 p-6 flex flex-col justify-center text-white relative overflow-hidden">
        {/* Background with pattern overlay instead of direct image */}
        <div className="absolute inset-0 opacity-50 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjMmEwMDdhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRiMzY4YyIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMCA4NEwyOCAxMDBMNTYgODRMNTYgNTBMMjggMzQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM0MWZjOCIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==')]"></div>
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-indigo-900/80 z-10"></div>
        
        {/* Hero content */}
        <div className="max-w-lg mx-auto relative z-20">
          <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">CRYPTO MINING FOR JUSTICE</h2>
          <p className="text-lg mb-8 drop-shadow-md">
            A comprehensive solution for cryptocurrency mining with a mission to support legal accountability and social justice.
          </p>
          
          <div className="space-y-6 backdrop-blur-sm bg-black/30 p-6 rounded-lg">
            <FeatureItem icon={<Bitcoin size={24} />} title="Multiple Mining Options">
              Cloud mining, local CPU mining, and hardware ASIC integration in one platform.
            </FeatureItem>
            
            <FeatureItem icon={<Shield size={24} />} title="Advanced Security">
              Secure wallet connections and mining pool integration for safe operations.
            </FeatureItem>
            
            <FeatureItem icon={<Scale size={24} />} title="Mining For Justice">
              33% of mining rewards support social justice initiatives with the TERA token.
            </FeatureItem>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="mr-4 bg-white/10 p-3 rounded-lg">{icon}</div>
      <div>
        <h3 className="font-semibold text-xl">{title}</h3>
        <p className="text-white/80">{children}</p>
      </div>
    </div>
  );
}

// Wrap AuthTabs in a custom component to make sure React context is properly used
const AuthTabs = React.memo(function AuthTabsComponent() {
  // Use client-side only rendering to avoid hook issues
  const [isMounted, setIsMounted] = useState(false);
  
  // Only mount the component on the client side to prevent React hook issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Show a simple loading placeholder during SSR or before client mount
  if (!isMounted) {
    return (
      <div className="border rounded-md p-4 w-full">
        <div className="h-8 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-32 bg-gray-100 rounded-md"></div>
      </div>
    );
  }
  
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register (Disabled)</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
});

function LoginForm() {
  // Default admin credentials
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  
  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem("kloudBugZigMiner_credentials");
    if (savedCredentials) {
      try {
        const { username: savedUsername, password: savedPassword } = JSON.parse(savedCredentials);
        setUsername(savedUsername || "admin");
        setPassword(savedPassword || "admin123");
        setRememberMe(true);
      } catch (error) {
        console.error("Failed to parse saved credentials:", error);
      }
    }
  }, []);

  // Get access context to set access verification
  const { setAccessVerified } = useAccess();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);
      
      // If login is successful, mark access as verified
      setAccessVerified(true);
      
      // If "Remember Me" is checked, save credentials to localStorage
      if (rememberMe) {
        localStorage.setItem(
          "kloudBugZigMiner_credentials", 
          JSON.stringify({ username, password })
        );
        toast({
          title: "Credentials Saved",
          description: "Your login credentials have been saved for future use",
        });
      } else {
        // If not checked, remove any saved credentials
        localStorage.removeItem("kloudBugZigMiner_credentials");
      }
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Enter your credentials to access your mining dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rememberMe" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
              Remember credentials
            </Label>
          </div>
          
          <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Quick Access Options:</p>
              <Button 
                type="button"
                variant="outline"
                className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-700"
                onClick={() => {
                  setUsername("user0");
                  setPassword("family");
                  setTimeout(() => {
                    handleSubmit(new Event('click') as unknown as React.FormEvent);
                  }, 100);
                }}
              >
                Family Memorial Access
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  // Show toast when the form is rendered to inform user that registration is disabled
  useEffect(() => {
    toast({
      title: "Registration Disabled",
      description: "New account registration is currently disabled. Please use the admin account to log in.",
      variant: "default",
      duration: 5000,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Inform user that registration is disabled
    toast({
      title: "Registration Disabled",
      description: "New account registration is currently disabled. Please contact the system administrator for login credentials.",
      variant: "destructive",
    });
    return;
    
    // The code below is kept but made unreachable
    /* 
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (!validateBitcoinAddress(walletAddress)) {
      toast({
        title: "Invalid Bitcoin Address",
        description: "Please enter a valid Bitcoin wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username,
        password,
        walletAddress,
      });
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
    */
  };

  // Improved Bitcoin address validation
  const validateBitcoinAddress = (address: string) => {
    // Trim any whitespace
    const trimmedAddress = address.trim();
    
    // Check if empty
    if (!trimmedAddress) return false;
    
    // Legacy addresses (1...)
    const legacyRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    
    // SegWit addresses (3...)
    const segwitRegex = /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    
    // Bech32 addresses (bc1...)
    const bech32Regex = /^(bc1)[a-z0-9]{39,59}$/;
    
    // Taproot addresses (bc1p...)
    const taprootRegex = /^(bc1p)[a-z0-9]{39,59}$/;
    
    // Test each format
    return (
      legacyRegex.test(trimmedAddress) ||
      segwitRegex.test(trimmedAddress) ||
      bech32Regex.test(trimmedAddress) ||
      taprootRegex.test(trimmedAddress)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration Disabled</CardTitle>
        <CardDescription>
          New account registration is currently disabled.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-4 mb-4">
            <h3 className="text-amber-800 dark:text-amber-300 font-medium mb-2">Registration Notice</h3>
            <p className="text-amber-700 dark:text-amber-400 text-sm mb-1">
              New account registration is currently disabled.
            </p>
            <p className="text-amber-700 dark:text-amber-400 text-sm">
              Please contact the system administrator for login credentials.
            </p>
          </div>
          
          <div className="space-y-2 opacity-50">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled
            />
          </div>
          <div className="space-y-2 opacity-50">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled
            />
          </div>
          <div className="space-y-2 opacity-50">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled
            />
          </div>
          <div className="space-y-2 opacity-50">
            <Label htmlFor="walletAddress">Bitcoin Wallet Address</Label>
            <Input
              id="walletAddress"
              placeholder="Enter your Bitcoin wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              disabled
            />
            <p className="text-xs text-gray-500">
              This is where your mining rewards will be sent
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={true}
          >
            Registration Disabled
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}