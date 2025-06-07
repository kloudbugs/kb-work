import { useMining } from "@/contexts/mining-context";
import { useAuth } from "@/contexts/auth-context";
import { LogOut, Shield, AlertCircle, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function Header() {
  const { logout, user } = useAuth();
  const [securityNotifications] = useState(2);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-neutral-900 border-b border-indigo-800/30 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="text-indigo-400 h-6 w-6 mr-3" />
          <div>
            <h1 className="text-white text-xl font-medium">KLOUD BUGS Mining Command Center</h1>
            <div className="text-xs text-indigo-400 font-mono">TERA-GUARDIAN-ALPHA-1</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MiningStatus />
          
          <SecurityIndicator count={securityNotifications} />
          
          <div className="flex items-center ml-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-neutral-800 border border-indigo-800/30">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-left text-white">{user?.username || 'User'}</div>
                <div className="text-xs text-indigo-400 text-left">Access Level: Admin</div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-400 hover:bg-red-900/30 ml-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function SecurityIndicator({ count }: { count: number }) {
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full w-10 h-10 bg-neutral-800 border border-indigo-800/30 hover:bg-indigo-900/20"
      >
        <AlertCircle className="h-5 w-5 text-indigo-400" />
      </Button>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
}

function MiningStatus() {
  const { miningStats } = useMining();
  const isActive = miningStats?.isActive || false;
  
  return (
    <div className="flex items-center">
      <div className="px-3 py-1 bg-neutral-800 border border-indigo-800/30 rounded-lg flex items-center">
        {isActive ? (
          <>
            <Activity className="h-4 w-4 text-green-400 mining-active mr-2" />
            <span className="text-green-400 text-sm font-mono">MINING ACTIVE</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4 text-neutral-400 mr-2" />
            <span className="text-neutral-400 text-sm font-mono">MINING INACTIVE</span>
          </>
        )}
      </div>
    </div>
  );
}
