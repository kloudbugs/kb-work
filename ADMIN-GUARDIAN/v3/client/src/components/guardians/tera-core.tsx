import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Brain, 
  Cpu, 
  Activity, 
  Zap, 
  Settings,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface GuardianStatus {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'maintenance' | 'offline';
  aiLoadLevel: number;
  processingPower: number;
  uptime: string;
  lastUpdate: Date;
  activeModules: string[];
}

export default function TeraCore() {
  const [guardians, setGuardians] = useState<GuardianStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState(85);

  useEffect(() => {
    // Initialize TERA Guardian system
    const initializeGuardians = () => {
      const guardianData: GuardianStatus[] = [
        {
          id: 'tera-01',
          name: 'TERA Guardian Alpha',
          status: 'active',
          aiLoadLevel: 78,
          processingPower: 92,
          uptime: '24h 15m',
          lastUpdate: new Date(),
          activeModules: ['Mining Optimizer', 'Security Monitor', 'Performance Analytics']
        },
        {
          id: 'tera-02',
          name: 'TERA Guardian Beta',
          status: 'active',
          aiLoadLevel: 65,
          processingPower: 88,
          uptime: '18h 42m',
          lastUpdate: new Date(),
          activeModules: ['Pool Management', 'Hardware Monitor', 'Profit Optimizer']
        },
        {
          id: 'tera-03',
          name: 'TERA Guardian Gamma',
          status: 'standby',
          aiLoadLevel: 12,
          processingPower: 25,
          uptime: '72h 8m',
          lastUpdate: new Date(),
          activeModules: ['Backup Systems', 'Emergency Response']
        }
      ];
      
      setGuardians(guardianData);
      setIsLoading(false);
    };

    initializeGuardians();
    
    // Real-time system updates
    const interval = setInterval(() => {
      setGuardians(prev => prev.map(guardian => ({
        ...guardian,
        aiLoadLevel: Math.max(10, Math.min(100, guardian.aiLoadLevel + (Math.random() - 0.5) * 10)),
        processingPower: Math.max(20, Math.min(100, guardian.processingPower + (Math.random() - 0.5) * 5)),
        lastUpdate: new Date()
      })));
      
      setSystemHealth(Math.max(70, Math.min(100, systemHealth + (Math.random() - 0.5) * 10)));
    }, 5000);

    return () => clearInterval(interval);
  }, [systemHealth]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'standby': return 'bg-yellow-500';
      case 'maintenance': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4" />;
      case 'standby': return <Activity className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      case 'offline': return <AlertTriangle className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-cosmic-blue" />
        <span className="ml-2 text-lg">Initializing TERA Guardian System...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-cosmic-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth}%</div>
            <Progress value={systemHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Guardians</CardTitle>
            <Brain className="h-4 w-4 text-cosmic-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guardians.filter(g => g.status === 'active').length}/{guardians.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Guardians online and monitoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Load Average</CardTitle>
            <Zap className="h-4 w-4 text-cyber-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(guardians.reduce((sum, g) => sum + g.aiLoadLevel, 0) / guardians.length)}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Average processing load
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Guardian Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {guardians.map((guardian) => (
          <Card key={guardian.id} className="border-2 hover:border-cosmic-blue/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(guardian.status)}
                  <CardTitle className="text-lg">{guardian.name}</CardTitle>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(guardian.status)} text-white`}
                >
                  {guardian.status.toUpperCase()}
                </Badge>
              </div>
              <CardDescription>ID: {guardian.id}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* AI Load Level */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>AI Load Level</span>
                  <span>{guardian.aiLoadLevel}%</span>
                </div>
                <Progress value={guardian.aiLoadLevel} className="h-2" />
              </div>

              {/* Processing Power */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Processing Power</span>
                  <span>{guardian.processingPower}%</span>
                </div>
                <Progress value={guardian.processingPower} className="h-2" />
              </div>

              {/* Uptime */}
              <div className="flex justify-between text-sm">
                <span>Uptime</span>
                <span className="font-mono">{guardian.uptime}</span>
              </div>

              {/* Active Modules */}
              <div>
                <div className="text-sm font-medium mb-2">Active Modules</div>
                <div className="flex flex-wrap gap-1">
                  {guardian.activeModules.map((module, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Last Update */}
              <div className="text-xs text-muted-foreground">
                Last update: {guardian.lastUpdate.toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>TERA Guardian Control Panel</span>
          </CardTitle>
          <CardDescription>
            Manage and monitor your TERA Guardian AI system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Status</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Configuration</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security Settings</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Performance Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}