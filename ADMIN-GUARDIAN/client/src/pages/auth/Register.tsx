import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Zap className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Register to start mining with ZigMiner
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walletAddress">Bitcoin Wallet Address</Label>
              <Input
                id="walletAddress"
                placeholder="Enter your Bitcoin wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                This is where your mining rewards will be sent
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline hover:text-primary-dark">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
