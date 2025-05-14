import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Shield, Heart, Lock, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import teraLogoPath from '@/assets/tera-logo.png';

// Local storage key for the family access code
const FAMILY_ACCESS_KEY = 'tera_family_access_code';

const FamilyAccessPage = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Check for stored access code on component mount
  useEffect(() => {
    const storedAccessCode = localStorage.getItem(FAMILY_ACCESS_KEY);
    if (storedAccessCode) {
      // Auto-submit the stored access code
      console.log("Found stored family access code, auto-submitting");
      verifyAccessCode(storedAccessCode);
    }
  }, []);

  // Function to verify access code with the server
  const verifyAccessCode = async (code: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/family-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: code })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Save valid access code to localStorage for future use
        localStorage.setItem(FAMILY_ACCESS_KEY, code);
        
        toast({
          title: "Welcome to Tera's Legacy",
          description: "You now have exclusive family access to view Tera's memorial and legacy.",
          variant: "default",
        });
        navigate('/tera-token/legacy');
      } else {
        // If using stored code and it fails, clear it
        if (localStorage.getItem(FAMILY_ACCESS_KEY) === code) {
          localStorage.removeItem(FAMILY_ACCESS_KEY);
        }
        setError(data.message || 'Invalid access code. Please try again.');
      }
    } catch (err) {
      setError('Unable to verify access code. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyAccessCode(accessCode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-95 relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-70"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 5 + 3}s infinite ease-in-out ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing center */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-auto p-8 rounded-xl backdrop-blur-md bg-black/40 border border-purple-500/20 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={teraLogoPath} alt="Tera Logo" className="h-24 w-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            Family Connection Access
          </h1>
          <p className="text-gray-400">Enter your special access code to view Tera's memorial</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Key className="h-5 w-5 text-amber-400" />
              </div>
              <Input
                id="access-code"
                type="password"
                placeholder="Enter your family access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
                className="pl-10 py-6 bg-gray-900/60 border-purple-700/30 focus:border-amber-400 focus:ring-amber-400/20 text-white"
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm flex items-center mt-2"
              >
                <Shield className="h-4 w-4 mr-1" /> {error}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !accessCode}
            className="w-full py-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Lock className="h-5 w-5 mr-2" /> Access Memorial
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400 flex items-center justify-center">
            <Heart className="h-4 w-4 text-amber-400 mr-2" />
            <span>This exclusive access is provided for Tera's family to view her memorial.</span>
          </p>
          <p className="text-center text-xs text-gray-500 mt-4">
            The Tera-Token was created in her memory to support justice for incarcerated individuals. 
            <br />Your access to this memorial helps keep her legacy alive.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default FamilyAccessPage;