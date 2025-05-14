import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Menu, X } from "lucide-react";
import { NetworkNodesBackground } from "@/components/ui/NetworkNodesBackground";
import CoffeeCup from "@/components/ui/CoffeeCup";
import { useState } from "react";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
    console.log("Mobile menu toggled:", !mobileMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: String(error),
        variant: "destructive"
      });
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="relative bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-blue-600/30 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i}
              className="absolute h-full w-8 bg-blue-400/80 rounded-full blur-sm"
              style={{
                left: `${i * 10}%`,
                animation: `moveLeftToRight 8s infinite linear`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 py-2">
          
          <div className="flex justify-between items-center">
            {/* Left image - KloudBugs Logo */}
            <div className="hidden md:block w-20 h-20 mr-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border border-purple-500/40 flex items-center justify-center overflow-hidden shadow-lg shadow-purple-900/30">
                <img 
                  src="/logo1.png" 
                  alt="KloudBugs Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <Link href="/">
              <div className="flex items-center cursor-pointer relative">
                {/* Network nodes floating around the text */}
                <div id="header-title-container" className="relative flex items-center">
                  <NetworkNodesBackground nodeCount={8} parentSelector="#header-title-container" />
                  <CoffeeCup />
                  <span className="font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 drop-shadow-md" style={{ 
                    textShadow: '0 0 15px rgba(137, 78, 234, 0.8), 0 0 30px rgba(104, 58, 214, 0.6)',
                    letterSpacing: '0.05em',
                    fontFamily: "'Orbitron', sans-serif",
                    position: 'relative',
                    animation: 'pulse-glow 3s infinite',
                    zIndex: 10
                  }}>
                    KLOUD-BUGS CAFE
                  </span>
                  <CoffeeCup />
                </div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-12">
              <Link href="/">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-900/70 border border-blue-500/40 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-900/20 mr-3">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 transition-colors cursor-pointer font-bold tracking-wide" style={{ 
                    fontFamily: "'Orbitron', sans-serif",
                    textShadow: '0 0 10px rgba(137, 78, 234, 0.4)'
                  }}>HOME</span>
                </div>
              </Link>


            </nav>
            


            <div className="flex items-center space-x-4">
              {/* Mobile menu button removed from here */}
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center mr-2">
                    <div className="w-8 h-8 rounded-full bg-blue-800/60 border border-blue-500/50 flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-blue-300" />
                    </div>
                    <span className="text-blue-300 font-medium hidden md:block">{user?.username}</span>
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10 font-bold tracking-wide hidden md:flex" 
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    LOGOUT
                  </Button>
                  
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      DASHBOARD
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10 font-bold tracking-wide hidden md:flex" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      LOGIN
                    </Button>
                  </Link>
                  <Link href="/mining">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      ENTER CAFE
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu overlay - Enhanced with cosmic design */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-black via-purple-900/90 to-black md:hidden flex flex-col">
          {/* Background stars effect */}
          <div className="absolute inset-0 overflow-hidden z-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animation: `twinkle ${Math.random() * 5 + 3}s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
          
          <div className="absolute top-6 right-6">
            <button 
              className="text-white p-3 bg-purple-800/50 rounded-full border border-purple-500/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-8 w-8" />
            </button>
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center space-y-5 p-4">
            <img 
              src="/logo1.png" 
              alt="MPT - Mining Power Token" 
              className="w-24 h-24 object-contain mb-6"
            />
            
            {[
              { path: "/", label: "HOME", color: "from-blue-600 to-blue-800" }
            ].map((item, index) => (
              <Link 
                key={index} 
                href={item.path} 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full max-w-xs transform transition-all duration-300 hover:scale-105"
                style={{
                  animation: 'fadeInUp 0.4s ease-out forwards',
                  animationDelay: `${0.1 + index * 0.1}s`,
                  opacity: 0
                }}
              >
                <div 
                  className={`text-white text-xl font-bold bg-gradient-to-r ${item.color} px-8 py-4 rounded-lg w-full text-center shadow-lg border border-white/10`}
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {item.label}
                </div>
              </Link>
            ))}
            
            <div className="mt-10 text-center" style={{
              animation: 'fadeInUp 0.4s ease-out forwards',
              animationDelay: '0.7s',
              opacity: 0
            }}>
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 italic mb-3 font-medium" style={{ 
                textShadow: '0 0 10px rgba(137, 78, 234, 0.5)'
              }}>
                Coffee Beans for Everyone • Brewing Digital Rewards
              </p>
              <div className="flex items-center justify-center">
                <CoffeeCup />
                <p className="text-gray-400 text-sm">
                  KLOUD-BUGS CAFE
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Fixed Mobile Menu Button */}
      <div 
        className="fixed bottom-6 right-6 md:hidden z-50"
        onClick={toggleMobileMenu}
      >
        <button 
          className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-purple-500/50 border-4 border-white flex items-center justify-center menu-button-pulse"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="h-10 w-10" />
          ) : (
            <>
              <Menu className="h-10 w-10" />
            </>
          )}
        </button>
      </div>
      
{/* Footer has been removed */}
    </div>
  );
}