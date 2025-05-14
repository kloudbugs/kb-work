import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Settings, 
  Shield, 
  Users, 
  DollarSign, 
  Lock, 
  Key, 
  KeyRound,
  UserCog,
  Search,
  Save
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Feature access level types
type AccessLevel = 'admin' | 'premium' | 'basic' | 'disabled';

// Feature definition
interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'mining' | 'analytics' | 'dashboard' | 'tools' | 'security' | 'other';
  defaultAccess: AccessLevel;
  currentAccess: AccessLevel;
  component: string; // Component path/name
  modified: boolean;
}

export function FeaturePermissionManager() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Load available features
  useEffect(() => {
    const loadFeatures = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest('/api/admin/features');
        if (response.data && response.data.features) {
          const featuresWithModified = response.data.features.map((f: Feature) => ({
            ...f,
            modified: false
          }));
          setFeatures(featuresWithModified);
        } else {
          // If API is not ready yet, use default feature list
          setFeatures(getDefaultFeatures());
        }
      } catch (error) {
        console.error('Failed to load features:', error);
        // Use default feature list if API fails
        setFeatures(getDefaultFeatures());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeatures();
  }, []);
  
  // Get default features for development or when API is unavailable
  const getDefaultFeatures = (): Feature[] => {
    return [
      {
        id: 'user-tracker',
        name: 'Active User Tracker',
        description: 'Real-time monitoring of user activity and mining statistics',
        category: 'analytics',
        defaultAccess: 'admin',
        currentAccess: 'admin',
        component: 'admin/ActiveUserTracker',
        modified: false
      },
      {
        id: 'ghost-mining',
        name: 'Ghost Mining Simulator',
        description: 'Create virtual miners without database entries',
        category: 'mining',
        defaultAccess: 'admin',
        currentAccess: 'admin',
        component: 'admin/GhostMiningSimulator',
        modified: false
      },
      {
        id: 'hashrate-booster',
        name: 'Hashrate Booster',
        description: 'Boost mining hashrates for selected users',
        category: 'mining',
        defaultAccess: 'admin',
        currentAccess: 'admin',
        component: 'admin/HashRateBooster',
        modified: false
      },
      {
        id: 'network-dashboard',
        name: 'Network Mining Dashboard',
        description: 'Cosmic visualization of mining activity',
        category: 'dashboard',
        defaultAccess: 'basic',
        currentAccess: 'basic',
        component: 'pages/NetworkDashboard',
        modified: false
      },
      {
        id: 'impact-alerts',
        name: 'Impact Alert System',
        description: 'Notifications when mining contributes to real-world causes',
        category: 'tools',
        defaultAccess: 'basic',
        currentAccess: 'basic',
        component: 'ui/ImpactAlertSystem',
        modified: false
      },
      {
        id: 'vr-command',
        name: 'VR Command Center',
        description: 'Virtual reality interface for controlling mining operations',
        category: 'dashboard',
        defaultAccess: 'premium',
        currentAccess: 'premium',
        component: 'admin/VRCommandCenter',
        modified: false
      },
      {
        id: 'media-controller',
        name: 'Media Controller',
        description: 'Manage media assets and presentations',
        category: 'tools',
        defaultAccess: 'admin',
        currentAccess: 'admin',
        component: 'admin/MediaController',
        modified: false
      },
      {
        id: 'visual-environment',
        name: 'Visual Environment Controller',
        description: 'Customize visual effects and environment settings',
        category: 'dashboard',
        defaultAccess: 'premium',
        currentAccess: 'premium', 
        component: 'admin/VisualEnvironmentController',
        modified: false
      },
      {
        id: 'multi-view',
        name: 'Multi-View Dashboard',
        description: 'Monitor multiple mining operations simultaneously',
        category: 'dashboard',
        defaultAccess: 'premium',
        currentAccess: 'premium',
        component: 'admin/MultiViewDashboard',
        modified: false
      },
      {
        id: 'network-broadcaster',
        name: 'Network Broadcaster',
        description: 'Broadcast messages and alerts to all users',
        category: 'tools',
        defaultAccess: 'admin',
        currentAccess: 'admin',
        component: 'admin/NetworkBroadcaster',
        modified: false
      },
      {
        id: 'system-emergency',
        name: 'Emergency System Controller',
        description: 'Emergency controls and safety features',
        category: 'security',
        defaultAccess: 'admin',
        currentAccess: 'admin',
        component: 'admin/EmergencySystemController',
        modified: false
      },
      {
        id: 'campaign-manager',
        name: 'Campaign Manager',
        description: 'Manage marketing and promotional campaigns',
        category: 'tools',
        defaultAccess: 'admin',
        currentAccess: 'admin',
        component: 'admin/CampaignManager',
        modified: false
      },
      {
        id: 'kloud-ai',
        name: 'KloudAI Controller',
        description: 'AI-powered mining optimization and prediction',
        category: 'mining',
        defaultAccess: 'premium',
        currentAccess: 'premium',
        component: 'admin/KloudAIController',
        modified: false
      }
    ];
  };
  
  // Handle access level change for a feature
  const handleAccessChange = (featureId: string, newAccess: AccessLevel) => {
    setFeatures(prevFeatures => 
      prevFeatures.map(feature => 
        feature.id === featureId 
          ? { 
              ...feature, 
              currentAccess: newAccess, 
              modified: feature.defaultAccess !== newAccess
            } 
          : feature
      )
    );
    setHasChanges(true);
  };
  
  // Handle reset of feature to default access level
  const handleResetFeature = (featureId: string) => {
    setFeatures(prevFeatures => 
      prevFeatures.map(feature => 
        feature.id === featureId 
          ? { 
              ...feature, 
              currentAccess: feature.defaultAccess, 
              modified: false
            } 
          : feature
      )
    );
    
    // Check if there are still modified features
    const stillHasChanges = features.some(
      f => f.id !== featureId && f.modified
    );
    
    setHasChanges(stillHasChanges);
  };
  
  // Save all feature changes
  const saveChanges = async () => {
    setIsLoading(true);
    try {
      const modifiedFeatures = features
        .filter(f => f.modified)
        .map(({ id, currentAccess }) => ({ id, access: currentAccess }));
      
      if (modifiedFeatures.length === 0) {
        return;
      }
      
      await apiRequest('/api/admin/features', {
        method: 'POST',
        data: { features: modifiedFeatures }
      });
      
      // Mark all as no longer modified after successful save
      setFeatures(prevFeatures => 
        prevFeatures.map(feature => ({ ...feature, modified: false }))
      );
      
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save feature changes:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset all changes to default
  const resetAllChanges = () => {
    setFeatures(prevFeatures => 
      prevFeatures.map(feature => ({ 
        ...feature, 
        currentAccess: feature.defaultAccess,
        modified: false 
      }))
    );
    setHasChanges(false);
  };
  
  // Filter features based on search and category
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group features by category for the summary view
  const featuresByCategory = features.reduce<Record<string, number>>((acc, feature) => {
    acc[feature.category] = (acc[feature.category] || 0) + 1;
    return acc;
  }, {});
  
  // Count features by access level
  const accessLevelCounts = features.reduce<Record<AccessLevel, number>>((acc, feature) => {
    acc[feature.currentAccess] = (acc[feature.currentAccess] || 0) + 1;
    return acc;
  }, { admin: 0, premium: 0, basic: 0, disabled: 0 });
  
  // Helper to get access level badge color
  const getAccessLevelColor = (level: AccessLevel) => {
    switch (level) {
      case 'admin': return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'premium': return 'bg-amber-500/20 text-amber-500 border-amber-500/50';
      case 'basic': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'disabled': return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };
  
  // Helper to get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mining': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'analytics': return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      case 'dashboard': return 'bg-cyan-500/20 text-cyan-500 border-cyan-500/50';
      case 'tools': return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'security': return 'bg-rose-500/20 text-rose-500 border-rose-500/50';
      default: return 'bg-slate-500/20 text-slate-500 border-slate-500/50';
    }
  };
  
  return (
    <Card className="shadow-md border-0 bg-gradient-to-br from-slate-900 to-slate-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-400" />
              Feature Permission Manager
            </CardTitle>
            <CardDescription className="text-gray-400">
              Control which features are available to different user tiers
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-3">
            {hasChanges && (
              <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                Unsaved Changes
              </Badge>
            )}
            <Button 
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
              disabled={!hasChanges || isLoading}
              onClick={saveChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            
            <Button 
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              disabled={!hasChanges || isLoading}
              onClick={resetAllChanges}
            >
              Reset All
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="list">
          <TabsList className="w-full mb-4 bg-slate-950">
            <TabsTrigger value="list" className="flex-1 data-[state=active]:text-blue-400">
              <Settings className="h-4 w-4 mr-2" /> Feature List
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex-1 data-[state=active]:text-blue-400">
              <Users className="h-4 w-4 mr-2" /> Access Summary
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-0">
            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search features..."
                  className="pl-9 bg-slate-850 border-slate-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-slate-850 border-slate-700 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-850 border-slate-700 text-white">
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="mining">Mining</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Feature list table */}
            <div className="rounded-md border border-slate-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-850 hover:bg-slate-850 border-b border-slate-700">
                    <TableHead className="text-slate-400 w-[250px]">Feature</TableHead>
                    <TableHead className="text-slate-400">Description</TableHead>
                    <TableHead className="text-slate-400 w-[120px]">Category</TableHead>
                    <TableHead className="text-slate-400 w-[280px]">Access Level</TableHead>
                    <TableHead className="text-slate-400 w-[80px] text-right">Reset</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeatures.length > 0 ? (
                    filteredFeatures.map(feature => (
                      <TableRow 
                        key={feature.id} 
                        className={`border-b border-slate-700/50 ${feature.modified ? 'bg-amber-900/10' : ''}`}
                      >
                        <TableCell className="font-medium text-white">
                          {feature.name}
                          {feature.modified && (
                            <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-400 border-amber-500/30">
                              Modified
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {feature.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getCategoryColor(feature.category)}`}>
                            {feature.category.charAt(0).toUpperCase() + feature.category.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-3">
                            {(['admin', 'premium', 'basic', 'disabled'] as AccessLevel[]).map(level => (
                              <div key={level} className="flex items-center space-x-1.5">
                                <Switch
                                  id={`${feature.id}-${level}`}
                                  checked={feature.currentAccess === level}
                                  onCheckedChange={() => handleAccessChange(feature.id, level)}
                                  className={feature.currentAccess === level 
                                    ? `data-[state=checked]:bg-${level === 'admin' ? 'red' : level === 'premium' ? 'amber' : level === 'basic' ? 'green' : 'gray'}-500` 
                                    : ''
                                  }
                                />
                                <Label 
                                  htmlFor={`${feature.id}-${level}`}
                                  className={`text-xs ${feature.currentAccess === level 
                                    ? level === 'admin' 
                                      ? 'text-red-400' 
                                      : level === 'premium' 
                                        ? 'text-amber-400' 
                                        : level === 'basic' 
                                          ? 'text-green-400' 
                                          : 'text-gray-400'
                                    : 'text-gray-500'
                                  }`}
                                >
                                  {level.charAt(0).toUpperCase() + level.slice(1)}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!feature.modified}
                            onClick={() => handleResetFeature(feature.id)}
                            className="h-7 w-7 rounded text-gray-400 hover:text-white hover:bg-slate-700"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                        No features match your search criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="summary" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-850 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-400" />
                    Access Level Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(Object.entries(accessLevelCounts) as [AccessLevel, number][]).map(([level, count]) => (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Badge variant="outline" className={`${getAccessLevelColor(level)}`}>
                            {level === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                            {level === 'premium' && <DollarSign className="h-3 w-3 mr-1" />}
                            {level === 'basic' && <Users className="h-3 w-3 mr-1" />}
                            {level === 'disabled' && <Lock className="h-3 w-3 mr-1" />}
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Badge>
                          <span className="text-gray-400 text-sm">{count} features</span>
                        </div>
                        <div 
                          className="h-2 bg-slate-800 rounded-full overflow-hidden"
                          style={{ width: '60%' }}
                        >
                          <div 
                            className={`h-full ${
                              level === 'admin' ? 'bg-red-500' : 
                              level === 'premium' ? 'bg-amber-500' : 
                              level === 'basic' ? 'bg-green-500' : 
                              'bg-gray-500'
                            }`}
                            style={{ width: `${(count / features.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-850 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-blue-400" />
                    Category Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(featuresByCategory).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Badge variant="outline" className={`${getCategoryColor(category)}`}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </Badge>
                          <span className="text-gray-400 text-sm">{count} features</span>
                        </div>
                        <div 
                          className="h-2 bg-slate-800 rounded-full overflow-hidden"
                          style={{ width: '60%' }}
                        >
                          <div 
                            className={`h-full ${
                              category === 'mining' ? 'bg-blue-500' : 
                              category === 'analytics' ? 'bg-purple-500' : 
                              category === 'dashboard' ? 'bg-cyan-500' : 
                              category === 'tools' ? 'bg-orange-500' : 
                              category === 'security' ? 'bg-rose-500' : 
                              'bg-slate-500'
                            }`}
                            style={{ width: `${(count / features.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-850 border-slate-700 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Key className="h-5 w-5 text-blue-400" />
                    Access Level Descriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-900 p-3 border border-red-500/30">
                      <h3 className="text-red-400 font-medium flex items-center mb-1.5">
                        <Shield className="h-4 w-4 mr-1.5" /> Admin
                      </h3>
                      <p className="text-sm text-gray-400">
                        Restricted to administrators only. These features provide complete control 
                        over the platform and include system configuration, user management, and 
                        high-level security operations.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-slate-900 p-3 border border-amber-500/30">
                      <h3 className="text-amber-400 font-medium flex items-center mb-1.5">
                        <DollarSign className="h-4 w-4 mr-1.5" /> Premium
                      </h3>
                      <p className="text-sm text-gray-400">
                        Available to premium tier subscribers. These advanced features provide 
                        enhanced mining capabilities, detailed analytics, and specialized tools 
                        that give paying users a competitive advantage.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-slate-900 p-3 border border-green-500/30">
                      <h3 className="text-green-400 font-medium flex items-center mb-1.5">
                        <Users className="h-4 w-4 mr-1.5" /> Basic
                      </h3>
                      <p className="text-sm text-gray-400">
                        Available to all authenticated users. These core features provide the 
                        essential functionality needed for the mining platform, including basic 
                        mining operations, simple dashboards, and standard tools.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-slate-900 p-3 border border-gray-500/30">
                      <h3 className="text-gray-400 font-medium flex items-center mb-1.5">
                        <Lock className="h-4 w-4 mr-1.5" /> Disabled
                      </h3>
                      <p className="text-sm text-gray-400">
                        Features that are currently turned off platform-wide. This can be used for 
                        features in development, deprecated functionality, or temporarily disabled 
                        features during maintenance or updates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-slate-700 pt-4 flex justify-between items-center text-gray-500 text-xs">
        <span>
          {filteredFeatures.length} of {features.length} features displayed
        </span>
        
        <div className="flex items-center">
          <span className="mr-2">
            Legend:
          </span>
          <Badge variant="outline" className="bg-amber-900/10 text-amber-400 border-amber-500/30 mr-2">
            Modified
          </Badge>
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
            Default
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}