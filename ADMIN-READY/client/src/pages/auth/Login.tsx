import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, Server, Lock, Cpu } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ElectricBorder } from "@/components/ui/ElectricBorder";
import { NetworkNodesBackground } from "@/components/ui/NetworkNodesBackground";

export default function Login() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Login form submitted with username:", username);
    
    // Clear any existing auth errors from previous attempts
    localStorage.removeItem("auth_error");
    
    // Client-side validation first
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Login Error",
        description: "Username and password are required",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Error handling mechanism with retry
    const attemptLogin = async (retryCount = 0): Promise<boolean> => {
      try {
        console.log(`Attempting login via auth context (attempt ${retryCount + 1})...`);
        
        // Set a timeout to catch hangs
        const loginPromise = login(username, password);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Login request timed out")), 15000);
        });
        
        // Race between login and timeout
        await Promise.race([loginPromise, timeoutPromise]);
        
        console.log("Login successful in login component");
        return true; // Success
      } catch (error) {
        console.error(`Login attempt ${retryCount + 1} failed:`, error);
        
        // Record the error for diagnostics
        try {
          localStorage.setItem("auth_error", JSON.stringify({
            time: new Date().toISOString(),
            message: error instanceof Error ? error.message : String(error),
            attempt: retryCount + 1
          }));
        } catch (e) {
          // Ignore storage errors
        }
        
        // Check for network or connection errors that might benefit from retry
        const isNetworkError = error instanceof Error && 
          (error.message.includes('network') || 
           error.message.includes('connection') ||
           error.message.includes('timeout') ||
           error.message.includes('abort'));
        
        // Retry logic for potentially transient issues
        if (isNetworkError && retryCount < 2) {
          console.log(`Retrying login after network error (attempt ${retryCount + 1})...`);
          
          // Show retry toast
          toast({
            title: "Connection Issue",
            description: "Retrying connection to server...",
            duration: 3000
          });
          
          // Wait a bit before retrying (escalating delay)
          await new Promise(resolve => setTimeout(resolve, 1500 * (retryCount + 1)));
          return attemptLogin(retryCount + 1);
        }
        
        // Non-recoverable error or max retries reached
        console.error("Login error in Login component:", error);
        
        // Show a more specific error toast
        toast({
          title: "Login Failed",
          description: error instanceof Error 
            ? error.message 
            : "There was a problem connecting to the server. Please try again.",
          variant: "destructive"
        });
        
        return false; // Login failed
      }
    };
    
    // Attempt the login with retry capability
    const loginSuccess = await attemptLogin();
    
    // If login succeeded, handle credential storage
    if (loginSuccess) {
      // If "Remember Me" is checked, save credentials to localStorage
      if (rememberMe) {
        try {
          localStorage.setItem(
            "kloudBugZigMiner_credentials", 
            JSON.stringify({ username, password })
          );
          toast({
            title: "Credentials Saved",
            description: "Your login credentials have been saved for future use",
          });
        } catch (storageError) {
          console.error("Failed to save credentials:", storageError);
          // Non-blocking error - just log it
        }
      } else {
        // If not checked, remove any saved credentials
        try {
          localStorage.removeItem("kloudBugZigMiner_credentials");
        } catch (storageError) {
          console.error("Failed to remove credentials:", storageError);
          // Non-blocking error - just log it
        }
      }
    }
    
    setIsLoading(false);
  };

  // Add state for digital auth animation
  const [loginAnimationActive, setLoginAnimationActive] = useState(false);
  
  // Enhanced submit handler to trigger the animation
  const handleSubmitWithAnimation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginAnimationActive(true);
    
    // Allow animation to start before actual login process
    setTimeout(() => {
      handleSubmit(e);
    }, 800);
  };
  
  // Background particles for cyber effect
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.5 + 0.2
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4 relative overflow-hidden">
      {/* Growing Network Nodes Background */}
      <div className="absolute inset-0 z-0">
        <NetworkNodesBackground 
          parentSelector=".min-h-screen" 
          nodeCount={80} 
          nodeColor="rgba(147, 51, 234, 0.5)" 
          connectionColor="rgba(147, 51, 234, 0.2)" 
          sendNodesToOrbit={true}
          nodesGrowEffect={true}
          growthScale={1.5}
          pulseIntensity={0.8}
        />
      </div>
      
      {/* Digital background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-purple-500 rounded-full opacity-30"
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
            animate={{ 
              y: [`${particle.y}%`, `${(particle.y + 100) % 100}%`],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{ 
              duration: 20 / particle.speed,
              repeat: Infinity,
              ease: "linear" 
            }}
          />
        ))}
      </div>
      
      {/* Digital scanning effect that becomes more intense during login */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-cyan-900/0 via-cyan-900/10 to-cyan-900/0 pointer-events-none"
        animate={{ 
          opacity: loginAnimationActive ? [0.1, 0.5, 0.1] : [0.05, 0.2, 0.05],
          backgroundPosition: ["0% 0%", "0% 100%"]
        }}
        transition={{ 
          duration: loginAnimationActive ? 1.5 : 8, 
          repeat: Infinity,
          ease: loginAnimationActive ? "easeInOut" : "linear"
        }}
        style={{ backgroundSize: "100% 100%" }}
      />
      
      {/* Radial glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-cyan-900/20 blur-3xl pointer-events-none"
        initial={{ scale: 0.8, opacity: 0.1 }}
        animate={{ 
          scale: loginAnimationActive ? [0.8, 1.2, 0.8] : [0.8, 1, 0.8],
          opacity: loginAnimationActive ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: loginAnimationActive ? 2 : 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ 
          width: "120%", 
          height: "120%", 
          left: "-10%", 
          top: "-10%" 
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <ElectricBorder 
          cornerSize="md" 
          cornerAccentColor="border-cyan-500"
          edgeGlowColor="rgba(6, 182, 212, 0.5)"
        >
          <Card className="bg-black/70 backdrop-blur-lg border-none">
            <CardHeader className="space-y-3 text-center relative pb-4">
              {/* Digital circuits animation around the icon when logging in */}
              {loginAnimationActive && (
                <motion.div 
                  className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full absolute">
                    <motion.circle 
                      cx="50" cy="50" r="40" 
                      fill="none" 
                      stroke="rgba(6, 182, 212, 0.3)" 
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1, rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.circle 
                      cx="50" cy="50" r="30" 
                      fill="none" 
                      stroke="rgba(6, 182, 212, 0.5)" 
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1, rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>
                </motion.div>
              )}
              
              <motion.div 
                className="flex justify-center mb-2"
                animate={loginAnimationActive ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 0, 0]
                } : {}}
                transition={loginAnimationActive ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              >
                <motion.div 
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center relative"
                  initial={{ boxShadow: "0 0 0 rgba(6, 182, 212, 0)" }}
                  animate={{ 
                    boxShadow: loginAnimationActive 
                      ? ["0 0 0px rgba(6, 182, 212, 0.3)", "0 0 30px rgba(6, 182, 212, 0.7)", "0 0 0px rgba(6, 182, 212, 0.3)"]
                      : ["0 0 0px rgba(6, 182, 212, 0.3)", "0 0 15px rgba(6, 182, 212, 0.5)", "0 0 0px rgba(6, 182, 212, 0.3)"]
                  }}
                  transition={{ 
                    duration: loginAnimationActive ? 1 : 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    animate={{ rotate: loginAnimationActive ? [0, 360] : [0, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="h-8 w-8 text-cyan-100" />
                  </motion.div>
                  
                  {/* Digital scanning line */}
                  {loginAnimationActive && (
                    <motion.div 
                      className="absolute inset-0 overflow-hidden rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div 
                        className="absolute w-full h-1 bg-cyan-400/60 blur-sm"
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
              
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                KLOUD-BUGS MINING CAFE
              </CardTitle>
              
              <motion.div
                className="w-48 h-1 mt-1 mx-auto rounded-full overflow-hidden"
                initial={{ width: 100 }}
                animate={{ width: 192 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: 'linear' 
                  }}
                  style={{ backgroundSize: '200% 100%' }}
                />
              </motion.div>
              
              <CardDescription className="text-cyan-100/80">
                Enter your credentials to access mining dashboard
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmitWithAnimation}>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-cyan-400" />
                    <Label htmlFor="username" className="text-cyan-100">Username</Label>
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-gray-900/50 border-cyan-900/50 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 text-cyan-100 placeholder:text-cyan-500/30"
                    />
                    
                    {/* Scanning effect on input focus */}
                    <motion.div 
                      className="absolute bottom-0 left-0 h-[1px] bg-cyan-500/70"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: username ? "100%" : "0%",
                        opacity: [0.3, 0.7, 0.3]
                      }}
                      transition={{ 
                        width: { duration: 0.3 },
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-cyan-400" />
                    <Label htmlFor="password" className="text-cyan-100">Password</Label>
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-900/50 border-cyan-900/50 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 text-cyan-100 placeholder:text-cyan-500/30"
                    />
                    
                    {/* Scanning effect on input focus */}
                    <motion.div 
                      className="absolute bottom-0 left-0 h-[1px] bg-cyan-500/70"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: password ? "100%" : "0%",
                        opacity: [0.3, 0.7, 0.3]
                      }}
                      transition={{ 
                        width: { duration: 0.3 },
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rememberMe" 
                    checked={rememberMe} 
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="border-cyan-700 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer text-cyan-200/80">
                    Remember credentials
                  </Label>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pb-6">
                <div className="w-full relative">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    {/* Digital scan effect on hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0"
                      initial={{ opacity: 0, left: "-100%" }}
                      animate={loginAnimationActive ? { 
                        opacity: 1,
                        left: ["0%", "100%"] 
                      } : {}}
                      transition={loginAnimationActive ? { 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                      } : {}}
                      style={{ width: "100%" }}
                    />
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div 
                          className="h-4 w-4 rounded-full border-2 border-transparent border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-sm font-medium">AUTHENTICATING...</span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium">ACCESS MINING DASHBOARD</span>
                    )}
                  </Button>
                  
                  {/* Add circuit traces around the button */}
                  <svg viewBox="0 0 100 20" className="absolute -bottom-4 left-0 w-full h-4 opacity-70">
                    <motion.path 
                      d="M0,10 H20 L25,5 H40 L45,10 H100" 
                      fill="none" 
                      stroke="rgba(6, 182, 212, 0.5)" 
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>
                </div>
                
                <div className="text-center text-xs">
                  <span className="text-cyan-200/50">Don't have an account?</span>{" "}
                  <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </ElectricBorder>
      </motion.div>
    </div>
  );
}
