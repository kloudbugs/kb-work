import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Switch 
} from '@/components/ui/switch';
import { 
  Textarea 
} from '@/components/ui/textarea';
import { 
  Badge 
} from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Power, 
  AlertTriangle, 
  ShieldAlert, 
  AlertCircle, 
  LogOut, 
  Cpu, 
  Wallet, 
  Server, 
  Database, 
  Radio, 
  Users, 
  PowerOff,
  Sparkles,
  Loader2,
  Clock,
  Shield,
  Lock,
  RotateCcw,
  AlertOctagon,
  TerminalSquare,
  CircleDot,
  BellRing,
  Timer,
  Siren,
  Hourglass,
  FileWarning,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface EmergencySystemControllerProps {
  className?: string;
}

// System components that can be managed
const SYSTEM_COMPONENTS = [
  { id: 'mining', name: 'Mining System', icon: <Cpu className="h-4 w-4" />, isActive: true },
  { id: 'wallet', name: 'Wallet System', icon: <Wallet className="h-4 w-4" />, isActive: true },
  { id: 'server', name: 'Server Infrastructure', icon: <Server className="h-4 w-4" />, isActive: true },
  { id: 'database', name: 'Database', icon: <Database className="h-4 w-4" />, isActive: true },
  { id: 'vr', name: 'VR Environment', icon: <Sparkles className="h-4 w-4" />, isActive: true },
  { id: 'notifications', name: 'Notification System', icon: <BellRing className="h-4 w-4" />, isActive: true },
  { id: 'users', name: 'User Access', icon: <Users className="h-4 w-4" />, isActive: true },
  { id: 'network', name: 'Network Communication', icon: <Radio className="h-4 w-4" />, isActive: true },
];

// Emergency protocols
const EMERGENCY_PROTOCOLS = [
  { id: 'soft-restart', name: 'Soft Restart', description: 'Gracefully restart all services without disrupting user sessions', level: 'low', icon: <RotateCcw className="h-5 w-5 text-blue-500" /> },
  { id: 'maintenance-mode', name: 'Maintenance Mode', description: 'Put the system in maintenance mode, allowing admin access only', level: 'medium', icon: <Shield className="h-5 w-5 text-yellow-500" /> },
  { id: 'temporary-lockdown', name: 'Temporary Lockdown', description: 'Temporarily lock all transactions and mining operations', level: 'medium', icon: <Lock className="h-5 w-5 text-amber-500" /> },
  { id: 'security-alert', name: 'Security Alert', description: 'Isolate sensitive components and enhance security monitoring', level: 'high', icon: <AlertOctagon className="h-5 w-5 text-orange-500" /> },
  { id: 'emergency-shutdown', name: 'Emergency Shutdown', description: 'Immediately shut down all system components', level: 'critical', icon: <Power className="h-5 w-5 text-red-500" /> },
];

// Recovery modes
const RECOVERY_MODES = [
  { id: 'auto', name: 'Automatic Recovery', description: 'System will attempt to recover automatically after shutdown' },
  { id: 'manual', name: 'Manual Recovery', description: 'System will remain offline until manually restarted' },
  { id: 'progressive', name: 'Progressive Recovery', description: 'System components will be restored one by one in sequence' },
];

// System status interface
interface SystemStatus {
  overallStatus: 'operational' | 'degraded' | 'maintenance' | 'emergency' | 'offline';
  componentStatus: {
    [key: string]: boolean;
  };
  lastIncident?: {
    timestamp: Date;
    protocol: string;
    reason: string;
    duration: number; // in minutes
  };
  isInEmergencyMode: boolean;
  scheduledRecovery?: Date;
  currentProtocol?: string;
}

export function EmergencySystemController({ className = '' }: EmergencySystemControllerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Default system status
  const defaultStatus: SystemStatus = {
    overallStatus: 'operational',
    componentStatus: SYSTEM_COMPONENTS.reduce((acc, component) => ({ 
      ...acc, 
      [component.id]: component.isActive 
    }), {}),
    isInEmergencyMode: false
  };
  
  // State
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(defaultStatus);
  const [selectedProtocol, setSelectedProtocol] = useState<string>('soft-restart');
  const [emergencyReason, setEmergencyReason] = useState<string>('');
  const [isExecutingProtocol, setIsExecutingProtocol] = useState<boolean>(false);
  const [recoveryMode, setRecoveryMode] = useState<string>('manual');
  const [recoveryTimer, setRecoveryTimer] = useState<number | null>(null);
  const [recoveryTimeMinutes, setRecoveryTimeMinutes] = useState<number>(30);
  const [requiresConfirmation, setRequiresConfirmation] = useState<boolean>(true);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [emergencyLogs, setEmergencyLogs] = useState<{
    timestamp: Date;
    action: string;
    details: string;
    status: 'info' | 'warning' | 'error' | 'success';
  }[]>([]);
  
  // Load system status from localStorage on mount
  useEffect(() => {
    const storedStatus = localStorage.getItem('emergencySystemStatus');
    if (storedStatus) {
      try {
        const parsedStatus = JSON.parse(storedStatus);
        
        // Convert string date back to Date object if it exists
        if (parsedStatus.lastIncident?.timestamp) {
          parsedStatus.lastIncident.timestamp = new Date(parsedStatus.lastIncident.timestamp);
        }
        
        if (parsedStatus.scheduledRecovery) {
          parsedStatus.scheduledRecovery = new Date(parsedStatus.scheduledRecovery);
        }
        
        setSystemStatus(parsedStatus);
        
        // If in emergency mode, setup recovery timer if scheduled
        if (parsedStatus.isInEmergencyMode && parsedStatus.scheduledRecovery) {
          const now = new Date();
          const recoveryTime = new Date(parsedStatus.scheduledRecovery);
          if (recoveryTime > now) {
            const timeLeftMs = recoveryTime.getTime() - now.getTime();
            const timeLeftMin = Math.ceil(timeLeftMs / (1000 * 60));
            setRecoveryTimer(timeLeftMin);
          }
        }
      } catch (e) {
        console.error('Error parsing stored emergency system status:', e);
      }
    }
    
    // Load emergency logs
    const storedLogs = localStorage.getItem('emergencySystemLogs');
    if (storedLogs) {
      try {
        const parsedLogs = JSON.parse(storedLogs);
        // Convert string dates back to Date objects
        const logsWithDates = parsedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
        setEmergencyLogs(logsWithDates);
      } catch (e) {
        console.error('Error parsing stored emergency logs:', e);
      }
    }
  }, []);
  
  // Update recovery timer
  useEffect(() => {
    if (recoveryTimer === null || !systemStatus.isInEmergencyMode) return;
    
    const interval = setInterval(() => {
      setRecoveryTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          if (recoveryMode === 'auto' || recoveryMode === 'progressive') {
            // Auto recover
            recoverSystem();
          }
          return null;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [recoveryTimer, systemStatus.isInEmergencyMode, recoveryMode]);
  
  // Verify admin password
  const verifyPassword = () => {
    // In a real system, this would be a secure API call
    // Using a mock password for demonstration
    if (adminPassword === 'kloudbug-admin-2025') {
      setIsAdminAuthenticated(true);
      toast({
        title: "Admin Access Granted",
        description: "You now have access to emergency system controls.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect administrator password.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  // Execute emergency protocol
  const executeProtocol = () => {
    if (!isAdminAuthenticated) return;
    
    // Validate reason for emergency action if required
    if (requiresConfirmation && !emergencyReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for executing this emergency protocol.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsExecutingProtocol(true);
    
    // Get protocol details
    const protocol = EMERGENCY_PROTOCOLS.find(p => p.id === selectedProtocol);
    if (!protocol) return;
    
    // Calculate severity based on protocol
    let newStatus: 'operational' | 'degraded' | 'maintenance' | 'emergency' | 'offline' = 'operational';
    switch (protocol.level) {
      case 'low':
        newStatus = 'degraded';
        break;
      case 'medium':
        newStatus = 'maintenance';
        break;
      case 'high':
        newStatus = 'emergency';
        break;
      case 'critical':
        newStatus = 'offline';
        break;
    }
    
    // Determine which components to affect based on protocol
    let updatedComponentStatus = { ...systemStatus.componentStatus };
    
    if (selectedProtocol === 'emergency-shutdown') {
      // Shut down all components
      updatedComponentStatus = Object.keys(updatedComponentStatus).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {});
    } else if (selectedProtocol === 'security-alert') {
      // Shut down vulnerable components, keep essential ones
      updatedComponentStatus = {
        ...updatedComponentStatus,
        vr: false,
        users: false
      };
    } else if (selectedProtocol === 'temporary-lockdown') {
      // Disable transaction-related components
      updatedComponentStatus = {
        ...updatedComponentStatus,
        wallet: false,
        mining: false
      };
    } else if (selectedProtocol === 'maintenance-mode') {
      // Keep only admin-related components active
      updatedComponentStatus = {
        ...updatedComponentStatus,
        vr: false,
        users: false,
        mining: false
      };
    }
    
    // Calculate recovery time if auto recovery is enabled
    let scheduledRecovery: Date | undefined = undefined;
    if (recoveryMode !== 'manual') {
      scheduledRecovery = new Date();
      scheduledRecovery.setMinutes(scheduledRecovery.getMinutes() + recoveryTimeMinutes);
      setRecoveryTimer(recoveryTimeMinutes);
    }
    
    // Update system status
    const updatedStatus: SystemStatus = {
      overallStatus: newStatus,
      componentStatus: updatedComponentStatus,
      isInEmergencyMode: true,
      currentProtocol: selectedProtocol,
      lastIncident: {
        timestamp: new Date(),
        protocol: selectedProtocol,
        reason: emergencyReason,
        duration: recoveryMode === 'manual' ? 0 : recoveryTimeMinutes
      },
      scheduledRecovery
    };
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Update status
      setSystemStatus(updatedStatus);
      
      // Store in localStorage
      localStorage.setItem('emergencySystemStatus', JSON.stringify(updatedStatus));
      
      // Log the action
      const newLog = {
        timestamp: new Date(),
        action: `Executed ${protocol.name}`,
        details: emergencyReason || 'No reason provided',
        status: protocol.level === 'critical' ? 'error' : 
               protocol.level === 'high' ? 'warning' : 'info'
      };
      
      const updatedLogs = [newLog, ...emergencyLogs];
      setEmergencyLogs(updatedLogs);
      localStorage.setItem('emergencySystemLogs', JSON.stringify(updatedLogs));
      
      // Reset execution state
      setIsExecutingProtocol(false);
      setEmergencyReason('');
      
      // Show toast notification
      toast({
        title: `${protocol.name} Activated`,
        description: recoveryMode === 'manual' 
          ? "System will remain in this state until manually recovered." 
          : `System will automatically recover in ${recoveryTimeMinutes} minutes.`,
        duration: 5000,
      });
      
      // Update UI by invalidating queries
      queryClient.invalidateQueries({ queryKey: ['/api/system/status'] });
    }, 2000);
  };
  
  // Recover system from emergency mode
  const recoverSystem = () => {
    if (!isAdminAuthenticated) return;
    
    setIsExecutingProtocol(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Determine recovery approach based on mode
      let updatedComponentStatus = { ...systemStatus.componentStatus };
      
      if (recoveryMode === 'progressive') {
        // Progressive recovery - one component at a time
        const offComponents = Object.entries(systemStatus.componentStatus)
          .filter(([_, isActive]) => !isActive)
          .map(([id]) => id);
        
        if (offComponents.length > 0) {
          // Turn on the first off component
          updatedComponentStatus = {
            ...updatedComponentStatus,
            [offComponents[0]]: true
          };
          
          // If more components are still off, schedule next recovery
          if (offComponents.length > 1) {
            const scheduledRecovery = new Date();
            scheduledRecovery.setMinutes(scheduledRecovery.getMinutes() + 5); // 5 min per component
            
            setSystemStatus(prev => ({
              ...prev,
              componentStatus: updatedComponentStatus,
              scheduledRecovery,
              overallStatus: 'degraded'
            }));
            
            setRecoveryTimer(5);
            
            // Log progressive recovery
            const newLog = {
              timestamp: new Date(),
              action: `Progressive Recovery - ${SYSTEM_COMPONENTS.find(c => c.id === offComponents[0])?.name} Restored`,
              details: `${offComponents.length - 1} components still pending recovery`,
              status: 'info'
            };
            
            const updatedLogs = [newLog, ...emergencyLogs];
            setEmergencyLogs(updatedLogs);
            localStorage.setItem('emergencySystemLogs', JSON.stringify(updatedLogs));
            
            // Store updated status
            localStorage.setItem('emergencySystemStatus', JSON.stringify({
              ...systemStatus,
              componentStatus: updatedComponentStatus,
              scheduledRecovery,
              overallStatus: 'degraded'
            }));
            
            setIsExecutingProtocol(false);
            return;
          }
        }
      } else {
        // Full recovery - all components at once
        updatedComponentStatus = Object.keys(updatedComponentStatus).reduce((acc, key) => ({
          ...acc,
          [key]: true
        }), {});
      }
      
      // Update system status
      const updatedStatus: SystemStatus = {
        overallStatus: 'operational',
        componentStatus: updatedComponentStatus,
        isInEmergencyMode: false,
        lastIncident: systemStatus.lastIncident,
        currentProtocol: undefined,
        scheduledRecovery: undefined
      };
      
      setSystemStatus(updatedStatus);
      setRecoveryTimer(null);
      
      // Store in localStorage
      localStorage.setItem('emergencySystemStatus', JSON.stringify(updatedStatus));
      
      // Log the action
      const newLog = {
        timestamp: new Date(),
        action: "System Recovery",
        details: "System has been restored to operational status",
        status: 'success'
      };
      
      const updatedLogs = [newLog, ...emergencyLogs];
      setEmergencyLogs(updatedLogs);
      localStorage.setItem('emergencySystemLogs', JSON.stringify(updatedLogs));
      
      // Reset execution state
      setIsExecutingProtocol(false);
      
      // Show toast notification
      toast({
        title: "System Recovery Complete",
        description: "All components have been restored to operational status.",
        duration: 3000,
      });
      
      // Update UI by invalidating queries
      queryClient.invalidateQueries({ queryKey: ['/api/system/status'] });
    }, 2000);
  };
  
  // Reset to normal operation
  const resetSystem = () => {
    if (!isAdminAuthenticated) return;
    
    setIsExecutingProtocol(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Reset to default status
      setSystemStatus(defaultStatus);
      setRecoveryTimer(null);
      
      // Clear from localStorage
      localStorage.setItem('emergencySystemStatus', JSON.stringify(defaultStatus));
      
      // Log the action
      const newLog = {
        timestamp: new Date(),
        action: "System Reset",
        details: "System has been reset to default configuration",
        status: 'info'
      };
      
      const updatedLogs = [newLog, ...emergencyLogs];
      setEmergencyLogs(updatedLogs);
      localStorage.setItem('emergencySystemLogs', JSON.stringify(updatedLogs));
      
      // Reset execution state
      setIsExecutingProtocol(false);
      
      // Show toast notification
      toast({
        title: "System Reset Complete",
        description: "All components have been reset to their default state.",
        duration: 3000,
      });
      
      // Update UI by invalidating queries
      queryClient.invalidateQueries({ queryKey: ['/api/system/status'] });
    }, 2000);
  };
  
  // Format timestamp
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleString();
  };
  
  // Format remaining time
  const formatRemainingTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hours`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  };
  
  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'operational':
        return 'bg-green-600';
      case 'degraded':
        return 'bg-yellow-600';
      case 'maintenance':
        return 'bg-blue-600';
      case 'emergency':
        return 'bg-orange-600';
      case 'offline':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };
  
  // Get protocol badge color
  const getProtocolBadgeColor = (level: string): string => {
    switch (level) {
      case 'low':
        return 'bg-blue-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'high':
        return 'bg-orange-600';
      case 'critical':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };
  
  // If not admin authenticated, show login form
  if (!isAdminAuthenticated) {
    return (
      <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-red-900/20 backdrop-blur-sm border border-red-900/50 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            Emergency System Controls
          </CardTitle>
          <CardDescription>
            Administrator authentication required for emergency system access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-900/20 border border-red-800/50 rounded-md p-4 flex items-start">
              <ShieldAlert className="h-6 w-6 text-red-400 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Restricted Access Zone</h3>
                <p className="text-sm text-gray-300 mt-1">
                  This control panel provides emergency access to shutdown and restart system components. 
                  Administrator authentication is required due to the sensitive nature of these controls.
                </p>
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <Label htmlFor="admin-password">Administrator Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            onClick={verifyPassword}
          >
            <Lock className="h-4 w-4 mr-2" />
            Authenticate for Emergency Access
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-red-900/20 backdrop-blur-sm border border-red-900/50 ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              Emergency System Controls
              {systemStatus.isInEmergencyMode && (
                <Badge className="ml-2 bg-red-600 animate-pulse">Emergency Active</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Execute emergency protocols and manage system components during critical situations.
            </CardDescription>
          </div>
          
          <div>
            <Badge className={`${getStatusColor(systemStatus.overallStatus)}`}>
              System Status: {systemStatus.overallStatus.charAt(0).toUpperCase() + systemStatus.overallStatus.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current system status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SYSTEM_COMPONENTS.map(component => (
              <div 
                key={component.id}
                className={`p-3 rounded-md border ${
                  systemStatus.componentStatus[component.id] 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-red-900/20 border-red-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {component.icon}
                    <span className="ml-2 text-sm">{component.name}</span>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${
                    systemStatus.componentStatus[component.id] ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                <div className="text-xs text-gray-400">
                  {systemStatus.componentStatus[component.id] ? 'Operational' : 'Offline'}
                </div>
              </div>
            ))}
          </div>
          
          {/* Active emergency information */}
          {systemStatus.isInEmergencyMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-800/50 rounded-md p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Power className="h-5 w-5 mr-2 text-red-500" />
                  Emergency Protocol Active
                </h3>
                {recoveryTimer && (
                  <div className="flex items-center">
                    <Hourglass className="h-4 w-4 mr-1 text-amber-400" />
                    <span className="text-amber-400 text-sm">
                      Recovery in {formatRemainingTime(recoveryTimer)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="font-medium text-gray-300 w-32">Protocol:</div>
                  <div className="flex items-center">
                    {EMERGENCY_PROTOCOLS.find(p => p.id === systemStatus.currentProtocol)?.icon}
                    <span className="ml-2 text-white">
                      {EMERGENCY_PROTOCOLS.find(p => p.id === systemStatus.currentProtocol)?.name}
                    </span>
                  </div>
                </div>
                
                {systemStatus.lastIncident && (
                  <>
                    <div className="flex items-start">
                      <div className="font-medium text-gray-300 w-32">Reason:</div>
                      <div className="text-white">{systemStatus.lastIncident.reason}</div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="font-medium text-gray-300 w-32">Activated:</div>
                      <div className="text-white">{formatTimestamp(systemStatus.lastIncident.timestamp)}</div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="font-medium text-gray-300 w-32">Recovery Mode:</div>
                      <Badge className="bg-blue-600">
                        {RECOVERY_MODES.find(m => m.id === recoveryMode)?.name || 'Manual Recovery'}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={recoverSystem}
                  disabled={isExecutingProtocol}
                >
                  {isExecutingProtocol ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4 mr-2" />
                  )}
                  Recover System
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-red-800 hover:bg-red-900/20"
                  onClick={resetSystem}
                  disabled={isExecutingProtocol}
                >
                  Reset to Default
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Emergency protocol selection */}
          {!systemStatus.isInEmergencyMode && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Execute Emergency Protocol</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EMERGENCY_PROTOCOLS.map(protocol => (
                  <div
                    key={protocol.id}
                    className={`p-3 rounded-md border cursor-pointer transition-all ${
                      selectedProtocol === protocol.id 
                        ? 'border-red-500 bg-red-900/20' 
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedProtocol(protocol.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {protocol.icon}
                        <span className="ml-2 font-medium">{protocol.name}</span>
                      </div>
                      <Badge className={getProtocolBadgeColor(protocol.level)}>
                        {protocol.level.charAt(0).toUpperCase() + protocol.level.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{protocol.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-3">
                {/* Recovery mode selection */}
                <div className="space-y-2">
                  <Label htmlFor="recovery-mode">Recovery Mode</Label>
                  <Select value={recoveryMode} onValueChange={setRecoveryMode}>
                    <SelectTrigger id="recovery-mode" className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select recovery mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {RECOVERY_MODES.map(mode => (
                        <SelectItem key={mode.id} value={mode.id}>
                          <div className="flex flex-col">
                            <span>{mode.name}</span>
                            <span className="text-xs text-gray-400">{mode.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Recovery time if not manual */}
                {recoveryMode !== 'manual' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="recovery-time">Auto Recovery Time</Label>
                      <span className="text-sm text-gray-400">{recoveryTimeMinutes} minutes</span>
                    </div>
                    <Select 
                      value={recoveryTimeMinutes.toString()} 
                      onValueChange={(value) => setRecoveryTimeMinutes(parseInt(value))}
                    >
                      <SelectTrigger id="recovery-time" className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select recovery time" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Reason for emergency action */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="emergency-reason">Reason for Emergency Action</Label>
                    <div className="flex items-center">
                      <Label 
                        htmlFor="requires-confirmation" 
                        className="text-xs text-gray-400 mr-2"
                      >
                        Required
                      </Label>
                      <Switch
                        id="requires-confirmation"
                        checked={requiresConfirmation}
                        onCheckedChange={setRequiresConfirmation}
                      />
                    </div>
                  </div>
                  <Textarea
                    id="emergency-reason"
                    placeholder="Describe the reason for executing this emergency protocol..."
                    value={emergencyReason}
                    onChange={(e) => setEmergencyReason(e.target.value)}
                    className="bg-gray-800 border-gray-700 min-h-[80px]"
                  />
                </div>
                
                {/* Execute button */}
                {selectedProtocol === 'emergency-shutdown' ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                        disabled={isExecutingProtocol || (requiresConfirmation && !emergencyReason.trim())}
                      >
                        <Power className="h-4 w-4 mr-2" />
                        Execute Emergency Shutdown
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border-gray-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-500 flex items-center">
                          <AlertOctagon className="h-5 w-5 mr-2" />
                          Confirm Emergency Shutdown
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will immediately shutdown all system components. All users will be disconnected, and all operations will cease.
                          {recoveryMode === 'manual' && " The system will remain offline until manually recovered."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={executeProtocol}
                        >
                          Confirm Shutdown
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700"
                    onClick={executeProtocol}
                    disabled={isExecutingProtocol || (requiresConfirmation && !emergencyReason.trim())}
                  >
                    {isExecutingProtocol ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Executing Protocol...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Execute {EMERGENCY_PROTOCOLS.find(p => p.id === selectedProtocol)?.name}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Emergency logs */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-medium text-gray-300 flex items-center">
              <TerminalSquare className="h-4 w-4 mr-2" />
              Emergency System Logs
            </h3>
            
            {emergencyLogs.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                <FileWarning className="h-8 w-8 mx-auto mb-2" />
                <p>No emergency actions have been recorded</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {emergencyLogs.map((log, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-md border ${
                      log.status === 'error' ? 'bg-red-900/20 border-red-800/50' :
                      log.status === 'warning' ? 'bg-amber-900/20 border-amber-800/50' :
                      log.status === 'success' ? 'bg-green-900/20 border-green-800/50' :
                      'bg-gray-800/70 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium">
                        {log.status === 'error' && <AlertOctagon className="h-4 w-4 text-red-500 inline mr-1" />}
                        {log.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500 inline mr-1" />}
                        {log.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />}
                        {log.status === 'info' && <CircleDot className="h-4 w-4 text-blue-500 inline mr-1" />}
                        {log.action}
                      </div>
                      <div className="text-xs text-gray-400">{formatTimestamp(log.timestamp)}</div>
                    </div>
                    <p className="text-sm text-gray-300">{log.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="ghost" 
          onClick={() => {
            setIsAdminAuthenticated(false);
            setAdminPassword('');
          }}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out of Emergency Controls
        </Button>
        
        <Button 
          variant="outline"
          className="border-red-800"
          onClick={() => {
            // Clear logs
            setEmergencyLogs([]);
            localStorage.removeItem('emergencySystemLogs');
            
            toast({
              title: "Logs Cleared",
              description: "Emergency system logs have been cleared.",
              duration: 3000,
            });
          }}
          disabled={emergencyLogs.length === 0}
        >
          Clear Logs
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EmergencySystemController;