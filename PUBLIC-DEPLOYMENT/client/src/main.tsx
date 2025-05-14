import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { MiningProvider } from "@/contexts/MiningContext";
import { AccessProvider } from "@/contexts/AccessContext";
import { UserTrackingProvider } from "@/contexts/UserTrackingContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

// Import fancy calligraphy fonts
import "@fontsource/pinyon-script/400.css";
import "@fontsource/great-vibes/400.css"; 
import "@fontsource/tangerine/400.css";
import "@fontsource/dancing-script/400.css";

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('[ERROR] Unhandled Promise Rejection:', event.reason);
  
  // Log additional details to help with debugging
  try {
    const errorDetails = {
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      pathname: window.location.pathname
    };
    
    console.error('[ERROR] Details:', errorDetails);
    
    // Attempt to report to the server for later analysis
    fetch('/api/client-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'unhandledRejection',
        ...errorDetails
      }),
      // Don't wait for the response
      keepalive: true
    }).catch(err => {
      // Silent catch - don't create more unhandled rejections
      console.error('[ERROR] Failed to report error:', err);
    });
  } catch (e) {
    // Silent catch
    console.error('[ERROR] Failed to process error details:', e);
  }
});

// Error boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const handleError = (event: PromiseRejectionEvent) => {
      console.log('[ErrorBoundary] Caught unhandled rejection');
      setHasError(true);
      
      toast({
        title: "Application Error",
        description: "An unexpected error occurred. Please try refreshing the page.",
        variant: "destructive",
        duration: 5000
      });
    };
    
    window.addEventListener('unhandledrejection', handleError);
    return () => window.removeEventListener('unhandledrejection', handleError);
  }, [toast]);
  
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">We've encountered an unexpected error. Please try refreshing the page.</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          Refresh the page
        </button>
      </div>
    );
  }
  
  return <>{children}</>;
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <AuthProvider>
        <UserTrackingProvider>
          <AccessProvider>
            <MiningProvider>
              <App />
              <Toaster />
            </MiningProvider>
          </AccessProvider>
        </UserTrackingProvider>
      </AuthProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);
