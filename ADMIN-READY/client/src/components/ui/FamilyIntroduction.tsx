import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Heart, AlertTriangle, Sprout } from "lucide-react";

interface FamilyIntroductionProps {
  onContinue: () => void;
}

export function FamilyIntroduction({ onContinue }: FamilyIntroductionProps) {
  const [accessCodeDialogOpen, setAccessCodeDialogOpen] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  // Handle access code verification
  const handleAccessCodeSubmit = () => {
    // Access code with flexibility for case and formatting
    const userInput = accessCode.toLowerCase().trim();
    
    if (userInput === "tera-token" || 
        userInput === "tera token" || 
        userInput === "teratoken") {
      // Immediately continue to platform upon successful access code entry
      onContinue();
    } else {
      setAccessError(true);
      setAttempts(attempts + 1);
    }
  };
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-gradient-to-b from-gray-900 to-teal-900 overflow-y-auto py-6 md:py-0">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Access Code Dialog */}
      <Dialog open={accessCodeDialogOpen} onOpenChange={setAccessCodeDialogOpen}>
        <DialogContent className="fixed left-0 right-0 md:absolute md:left-auto md:right-auto bg-gray-900 border-2 border-teal-500 shadow-lg shadow-teal-500/20 max-w-md animate-in fade-in-50 duration-300 zoom-in-95 z-[10000] top-[30%] sm:top-[35%] md:top-[70%] md:left-1/2 md:-translate-x-1/2 md:-translate-y-0 mx-auto scale-[0.85] sm:scale-90">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-teal-600 rounded-full p-4 shadow-lg shadow-teal-700/50 animate-bounce">
            <Sprout className="h-8 w-8 text-white" />
          </div>
          
          <DialogHeader className="pt-4">
            <DialogTitle className="text-center text-teal-400 text-2xl font-bold pt-2">
              <span className="flex items-center justify-center gap-2">
                Family Connection Access
              </span>
            </DialogTitle>
            <DialogDescription className="text-center text-teal-100 mt-2">
              Enter the family access code to continue your journey.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="relative">
                <div className="mb-2 flex items-center justify-center gap-2 text-teal-300 text-sm font-medium">
                  <Heart className="h-4 w-4" />
                  <span>FAMILY CONNECTION REQUIRED</span>
                  <Heart className="h-4 w-4" />
                </div>
                
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-teal-600/20 via-blue-500/20 to-teal-600/20 rounded-md ${!accessError ? 'animate-pulse' : ''}`}></div>
                  <Input
                    type="text" 
                    placeholder="Enter Access Code"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      if (accessError) setAccessError(false);
                    }}
                    className={`bg-gray-800 border-2 ${accessError ? 'border-red-500' : 'border-teal-600'} text-teal-100 text-center tracking-wider text-lg py-6 relative z-10`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAccessCodeSubmit();
                      }
                    }}
                    autoFocus
                  />
                </div>
                
                {accessError && (
                  <div className="text-center text-red-500 text-sm mt-3 flex items-center justify-center gap-1 bg-red-900/20 py-2 rounded">
                    <AlertTriangle className="h-4 w-4" />
                    {attempts >= 3 
                      ? "Multiple failed attempts. Please contact support." 
                      : "Invalid access code. Please try again."}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center pt-3">
              <Button 
                onClick={handleAccessCodeSubmit}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg shadow-teal-700/30 border border-teal-500/50"
              >
                <span className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Verify & Connect
                </span>
              </Button>
            </div>

            {/* Password hint removed for security */}

            <div className="text-xs text-center text-gray-400 mt-2">
              <p>Family connections are the foundation of our mission and impact.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* No content here - users go directly to platform after entering the access code */}
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-teal-600/10 backdrop-blur-3xl"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default FamilyIntroduction;