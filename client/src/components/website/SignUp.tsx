import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import WebsiteLayout from "./WebsiteLayout";
import { NetworkNodesBackground } from "@/components/ui/NetworkNodesBackground";

// Form validation schema
const signupSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  bitcoinAddress: z.string().min(26, {
    message: "Please enter a valid Bitcoin address",
  }).max(35, {
    message: "Please enter a valid Bitcoin address",
  }).optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize audio player with auto-play
  useEffect(() => {
    // Create audio element
    const audio = new Audio("/music/Deep (prod. Stewart Villain).mp3");
    audioRef.current = audio;
    
    // Set initial properties
    audio.volume = volume;
    audio.loop = true;
    
    // Try to autoplay
    const playPromise = audio.play();
    
    // Handle autoplay restrictions
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Autoplay started successfully
          setIsPlaying(true);
        })
        .catch(error => {
          // Autoplay was prevented
          console.log("Autoplay prevented:", error);
          setIsPlaying(false);
        });
    }
    
    // Cleanup on unmount
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      bitcoinAddress: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      setSuccess(true);
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WebsiteLayout>
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 min-h-screen">
        {/* Music Player Controls */}
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900/80 backdrop-blur-md p-3 rounded-full border border-purple-500/30 shadow-xl flex items-center space-x-3">
          <button
            onClick={togglePlayPause}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition duration-300"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVolume(Math.max(0, volume - 0.1))}
              className="text-gray-400 hover:text-white transition"
              title="Decrease Volume"
            >
              <VolumeX size={18} />
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-purple-500"
            />
            
            <button
              onClick={() => setVolume(Math.min(1, volume + 0.1))}
              className="text-gray-400 hover:text-white transition"
              title="Increase Volume"
            >
              <Volume2 size={18} />
            </button>
          </div>
          
          <div className="text-xs text-gray-300 font-medium ml-2">
            Now Playing: Deep
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl border border-blue-500/20 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden z-0">
              <NetworkNodesBackground nodeCount={15} parentSelector="#signup-form" />
            </div>
            
            <div id="signup-form" className="relative z-10">
              {success ? (
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500" style={{ 
                    textShadow: '0 0 20px rgba(148, 85, 255, 0.8)',
                    fontFamily: "'Orbitron', sans-serif" 
                  }}>
                    REGISTRATION SUCCESSFUL
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 mx-auto rounded-full opacity-60 animate-pulse mb-8"></div>
                  
                  <p className="text-gray-300 mb-4">
                    Your account has been created successfully. You can now log in and start mining.
                  </p>
                  
                  <p className="text-gray-300 mb-8">
                    Remember to have your Bitcoin wallet ready for payments and receiving your mining earnings.
                  </p>
                  
                  <div className="flex flex-col space-y-4">
                    <Link href="/login">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Log In to Your Account
                      </Button>
                    </Link>
                    
                    <Link href="/">
                      <Button variant="outline" className="w-full border-blue-500/40 text-blue-400 hover:bg-blue-500/10">
                        Return to Homepage
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500" style={{ 
                    textShadow: '0 0 20px rgba(148, 85, 255, 0.8)',
                    fontFamily: "'Orbitron', sans-serif" 
                  }}>
                    CREATE YOUR ACCOUNT
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 mx-auto rounded-full opacity-60 animate-pulse mb-8"></div>
                  
                  <p className="text-gray-300 mb-6 text-center">
                    Join the blockchain mining revolution and start earning while supporting civil rights initiatives. 
                  </p>
                  
                  {error && (
                    <div className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded mb-6">
                      {error}
                    </div>
                  )}
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Choose a username" 
                                {...field} 
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email" 
                                type="email"
                                {...field} 
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Password</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Create a password" 
                                type="password"
                                {...field} 
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bitcoinAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Bitcoin Wallet Address (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your Bitcoin address for payouts" 
                                {...field} 
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-gray-400 mt-1">
                              You can also add or change this later in your account settings
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating Account...
                            </span>
                          ) : (
                            "Sign Up"
                          )}
                        </Button>
                      </div>
                      
                      <div className="mt-4 text-center text-gray-400 text-sm">
                        Already have an account?{" "}
                        <Link href="/login">
                          <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                            Log In
                          </span>
                        </Link>
                      </div>
                      
                      <div className="text-xs text-gray-500 text-center">
                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                      </div>
                    </form>
                  </Form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
}