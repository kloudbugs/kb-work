import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Target, Zap, Users, User, CheckCircle, Book, Brain, BrainCircuit, GraduationCap, School, 
  Key, Copy, Trash, Eye, EyeOff, Plus, RefreshCw, Lock, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';

// API Key interface
interface ApiKey {
  id: string;
  name: string;
  key: string;
  guardianId: string;
  guardianName: string;
  type: 'tera' | 'zig' | 'oracle';
  permissions: string[];
  status: 'active' | 'revoked' | 'expired';
  created: string;
  expires: string;
  lastUsed: string | null;
}

export default function GuardianTrainingCenter() {
  const { toast } = useToast();
  const [selectedRecruits, setSelectedRecruits] = useState<string[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'api-1',
      name: 'TERA Guardian Access',
      key: 'tg_••••••••••••••••••••••••••',
      guardianId: 'guardian-alpha',
      guardianName: 'Guardian_Alpha',
      type: 'tera',
      permissions: ['read', 'validate', 'monitor'],
      status: 'active',
      created: '2025-04-15T10:30:00Z',
      expires: '2025-10-15T10:30:00Z',
      lastUsed: '2025-05-06T08:42:17Z'
    },
    {
      id: 'api-2',
      name: 'ZIG Protocol Access',
      key: 'zg_••••••••••••••••••••••••••',
      guardianId: 'guardian-beta',
      guardianName: 'Guardian_Beta',
      type: 'zig',
      permissions: ['read', 'validate', 'oracle:read'],
      status: 'active',
      created: '2025-04-18T14:22:00Z',
      expires: '2025-10-18T14:22:00Z',
      lastUsed: '2025-05-05T19:28:45Z'
    },
    {
      id: 'api-3',
      name: 'Oracle Integration Key',
      key: 'or_••••••••••••••••••••••••••',
      guardianId: 'guardian-gamma',
      guardianName: 'Guardian_Gamma',
      type: 'oracle',
      permissions: ['read', 'validate', 'oracle:read', 'oracle:write'],
      status: 'active',
      created: '2025-04-22T09:15:00Z',
      expires: '2025-07-22T09:15:00Z',
      lastUsed: '2025-05-07T02:14:32Z'
    },
    {
      id: 'api-4',
      name: 'TERA Guardian Backup',
      key: 'tg_••••••••••••••••••••••••••',
      guardianId: 'guardian-delta',
      guardianName: 'Guardian_Delta',
      type: 'tera',
      permissions: ['read', 'validate'],
      status: 'revoked',
      created: '2025-03-10T11:45:00Z',
      expires: '2025-09-10T11:45:00Z',
      lastUsed: '2025-04-15T17:33:21Z'
    },
    {
      id: 'api-5',
      name: 'ZIG Protocol Monitor',
      key: 'zg_••••••••••••••••••••••••••',
      guardianId: 'guardian-epsilon',
      guardianName: 'Guardian_Epsilon',
      type: 'zig',
      permissions: ['read', 'monitor'],
      status: 'expired',
      created: '2025-02-05T08:30:00Z',
      expires: '2025-05-05T08:30:00Z',
      lastUsed: '2025-05-04T23:59:59Z'
    }
  ]);
  
  const [isCreateKeyDialogOpen, setIsCreateKeyDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyGuardian, setNewKeyGuardian] = useState('');
  const [newKeyType, setNewKeyType] = useState<'tera' | 'zig' | 'oracle'>('tera');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read']);
  const [newKeyExpiry, setNewKeyExpiry] = useState('6-months');
  
  const [keyBeingRevealedId, setKeyBeingRevealedId] = useState<string | null>(null);
  
  const handleCreateNewKey = () => {
    if (!newKeyName || !newKeyGuardian || !newKeyType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would make an API call to generate and store the key
    const newKey: ApiKey = {
      id: `api-${apiKeys.length + 1}`,
      name: newKeyName,
      key: `${newKeyType.substring(0, 2)}_${'•'.repeat(30)}`,
      guardianId: newKeyGuardian.toLowerCase().replace(/\s+/g, '-'),
      guardianName: newKeyGuardian,
      type: newKeyType,
      permissions: newKeyPermissions,
      status: 'active',
      created: new Date().toISOString(),
      expires: (() => {
        const expiry = new Date();
        if (newKeyExpiry === '1-month') {
          expiry.setMonth(expiry.getMonth() + 1);
        } else if (newKeyExpiry === '3-months') {
          expiry.setMonth(expiry.getMonth() + 3);
        } else if (newKeyExpiry === '6-months') {
          expiry.setMonth(expiry.getMonth() + 6);
        } else if (newKeyExpiry === '1-year') {
          expiry.setFullYear(expiry.getFullYear() + 1);
        }
        return expiry.toISOString();
      })(),
      lastUsed: null
    };
    
    setApiKeys([...apiKeys, newKey]);
    setIsCreateKeyDialogOpen(false);
    resetNewKeyForm();
    
    toast({
      title: "API Key Created",
      description: `New key "${newKeyName}" has been created for ${newKeyGuardian}`,
    });
  };
  
  const resetNewKeyForm = () => {
    setNewKeyName('');
    setNewKeyGuardian('');
    setNewKeyType('tera');
    setNewKeyPermissions(['read']);
    setNewKeyExpiry('6-months');
  };
  
  const handleRevokeKey = (keyId: string) => {
    setApiKeys(
      apiKeys.map(key => 
        key.id === keyId ? { ...key, status: 'revoked' } : key
      )
    );
    
    toast({
      title: "API Key Revoked",
      description: "The API key has been successfully revoked",
    });
  };
  
  const handleTogglePermission = (permission: string) => {
    if (newKeyPermissions.includes(permission)) {
      setNewKeyPermissions(newKeyPermissions.filter(p => p !== permission));
    } else {
      setNewKeyPermissions([...newKeyPermissions, permission]);
    }
  };
  
  const handleCopyKey = (keyText: string) => {
    navigator.clipboard.writeText(keyText)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "API key has been copied to your clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Unable to copy key to clipboard",
          variant: "destructive",
        });
      });
  };
  
  const regenerateKey = (keyId: string) => {
    // In a real implementation, this would make an API call to regenerate the key
    const regeneratedKey = "NEW_KEY_WOULD_BE_GENERATED_HERE";
    
    toast({
      title: "Key Regenerated",
      description: "A new key has been generated. Make sure to save it securely.",
    });
  };
  
  const toggleKeyVisibility = (keyId: string | null) => {
    setKeyBeingRevealedId(keyId);
    
    if (keyId) {
      setTimeout(() => {
        setKeyBeingRevealedId(null);
      }, 10000); // Auto-hide after 10 seconds
    }
  };

  const toggleRecruit = (id: string) => {
    if (selectedRecruits.includes(id)) {
      setSelectedRecruits(selectedRecruits.filter(recruitId => recruitId !== id));
    } else {
      setSelectedRecruits([...selectedRecruits, id]);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Guardian Training Center
            </motion.h1>
            <motion.p 
              className="text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Admin control for guardian training and certification
            </motion.p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-950/30 text-indigo-400 border-indigo-500/40 px-3 py-1">
              Admin Access
            </Badge>
            <Badge variant="outline" className="bg-amber-950/30 text-amber-400 border-amber-500/40 px-3 py-1">
              12 Active Guardians
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5 bg-black/20 border border-indigo-500/20 rounded-md">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-950/40 data-[state=active]:text-indigo-400">
              Overview
            </TabsTrigger>
            <TabsTrigger value="recruits" className="data-[state=active]:bg-indigo-950/40 data-[state=active]:text-indigo-400">
              Recruits
            </TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-indigo-950/40 data-[state=active]:text-indigo-400">
              Training Modules
            </TabsTrigger>
            <TabsTrigger value="certification" className="data-[state=active]:bg-indigo-950/40 data-[state=active]:text-indigo-400">
              Certification
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="data-[state=active]:bg-indigo-950/40 data-[state=active]:text-indigo-400">
              API Keys
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-indigo-400 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Guardian Program Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-indigo-950/20 rounded-lg p-3 border border-indigo-800/30 text-center">
                        <span className="text-2xl font-bold text-indigo-400">12</span>
                        <span className="text-xs text-gray-400 block">Active Guardians</span>
                      </div>
                      <div className="bg-indigo-950/20 rounded-lg p-3 border border-indigo-800/30 text-center">
                        <span className="text-2xl font-bold text-amber-400">7</span>
                        <span className="text-xs text-gray-400 block">ZIG Certified</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-indigo-950/20 rounded-lg p-3 border border-indigo-800/30 text-center">
                        <span className="text-2xl font-bold text-green-400">8</span>
                        <span className="text-xs text-gray-400 block">TERA Certified</span>
                      </div>
                      <div className="bg-indigo-950/20 rounded-lg p-3 border border-indigo-800/30 text-center">
                        <span className="text-2xl font-bold text-red-400">3</span>
                        <span className="text-xs text-gray-400 block">Full Certification</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-indigo-400 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Current Training
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Security Protocols</span>
                        <span className="text-indigo-400">78%</span>
                      </div>
                      <Progress value={78} className="h-2 bg-indigo-950/40" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Tera Protocol</span>
                        <span className="text-indigo-400">64%</span>
                      </div>
                      <Progress value={64} className="h-2 bg-indigo-950/40" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">ZIG Protocol</span>
                        <span className="text-indigo-400">52%</span>
                      </div>
                      <Progress value={52} className="h-2 bg-indigo-950/40" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Network Defense</span>
                        <span className="text-indigo-400">91%</span>
                      </div>
                      <Progress value={91} className="h-2 bg-indigo-950/40" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-indigo-400 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Certification Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-indigo-950/20 rounded-lg p-2 border border-indigo-800/30">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-indigo-400 mr-2" />
                        <span className="text-sm text-gray-300">Basic Training</span>
                      </div>
                      <Badge className="bg-green-700/50 text-green-300 hover:bg-green-700/60">
                        12 Certified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between bg-indigo-950/20 rounded-lg p-2 border border-indigo-800/30">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-indigo-400 mr-2" />
                        <span className="text-sm text-gray-300">TERA Guardian</span>
                      </div>
                      <Badge className="bg-green-700/50 text-green-300 hover:bg-green-700/60">
                        8 Certified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between bg-indigo-950/20 rounded-lg p-2 border border-indigo-800/30">
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 text-amber-400 mr-2" />
                        <span className="text-sm text-gray-300">ZIG Guardian</span>
                      </div>
                      <Badge className="bg-amber-700/50 text-amber-300 hover:bg-amber-700/60">
                        7 Certified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between bg-indigo-950/20 rounded-lg p-2 border border-indigo-800/30">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-red-400 mr-2" />
                        <span className="text-sm text-gray-300">Full Certification</span>
                      </div>
                      <Badge className="bg-red-800/50 text-red-300 hover:bg-red-800/60">
                        3 Certified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-400">Recent Activities</CardTitle>
                <CardDescription>Latest guardian training and certification activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      id: 1, 
                      name: "Guardian_Alpha", 
                      action: "Completed ZIG Protocol Module 3", 
                      status: "Completed", 
                      time: "2 hours ago",
                      icon: <Book className="w-4 h-4 text-green-400" />,
                      badgeColor: "bg-green-700/50 text-green-300"
                    },
                    { 
                      id: 2, 
                      name: "Guardian_Beta", 
                      action: "Started Network Defense Advanced", 
                      status: "In Progress", 
                      time: "5 hours ago",
                      icon: <BrainCircuit className="w-4 h-4 text-blue-400" />,
                      badgeColor: "bg-blue-700/50 text-blue-300"
                    },
                    { 
                      id: 3, 
                      name: "Guardian_Gamma", 
                      action: "Achieved TERA Certification", 
                      status: "Certified", 
                      time: "Yesterday",
                      icon: <Award className="w-4 h-4 text-purple-400" />,
                      badgeColor: "bg-purple-700/50 text-purple-300"
                    },
                    { 
                      id: 4, 
                      name: "Guardian_Delta", 
                      action: "Failed Oracle Integration Test", 
                      status: "Failed", 
                      time: "Yesterday",
                      icon: <Target className="w-4 h-4 text-red-400" />,
                      badgeColor: "bg-red-700/50 text-red-300"
                    },
                    { 
                      id: 5, 
                      name: "Guardian_Epsilon", 
                      action: "Assigned to ZIG Protocol Training", 
                      status: "Assigned", 
                      time: "2 days ago",
                      icon: <Zap className="w-4 h-4 text-amber-400" />,
                      badgeColor: "bg-amber-700/50 text-amber-300"
                    },
                  ].map((activity) => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-indigo-950/10 rounded-lg border border-indigo-800/20">
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">{activity.icon}</div>
                        <div>
                          <div className="font-medium text-gray-300 flex items-center">
                            {activity.name}
                          </div>
                          <div className="text-sm text-gray-400">{activity.action}</div>
                          <div className="text-xs text-gray-500">{activity.time}</div>
                        </div>
                      </div>
                      <Badge className={activity.badgeColor}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-indigo-800/20 bg-indigo-950/10 flex justify-between">
                <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40">
                  View All Activities
                </Button>
                <Button variant="outline" className="border-indigo-500/30 hover:bg-indigo-900/30 hover:text-indigo-300">
                  Generate Activity Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="recruits" className="mt-6 space-y-6">
            <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-indigo-400">Guardian Recruits</CardTitle>
                    <CardDescription>Manage potential guardian candidates</CardDescription>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Add New Recruit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-indigo-800/20">
                  <Table>
                    <TableHeader className="bg-indigo-950/30">
                      <TableRow className="hover:bg-indigo-950/40 border-indigo-800/20">
                        <TableHead className="w-12 text-indigo-400">Select</TableHead>
                        <TableHead className="text-indigo-400">Name</TableHead>
                        <TableHead className="text-indigo-400">Status</TableHead>
                        <TableHead className="text-indigo-400">Progress</TableHead>
                        <TableHead className="text-indigo-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { 
                          id: "recruit-1", 
                          name: "Alice Johnson", 
                          username: "cosmic_miner_42", 
                          status: "Assessment", 
                          progress: 35,
                          badgeColor: "bg-blue-700/50 text-blue-300 border-blue-700/30"
                        },
                        { 
                          id: "recruit-2", 
                          name: "Robert Chen", 
                          username: "crypto_enthusiast", 
                          status: "Background Check", 
                          progress: 65,
                          badgeColor: "bg-amber-700/50 text-amber-300 border-amber-700/30"
                        },
                        { 
                          id: "recruit-3", 
                          name: "Sarah Wilson", 
                          username: "block_wizard", 
                          status: "Training", 
                          progress: 82,
                          badgeColor: "bg-green-700/50 text-green-300 border-green-700/30"
                        },
                        { 
                          id: "recruit-4", 
                          name: "Michael Brown", 
                          username: "hash_master", 
                          status: "Final Review", 
                          progress: 95,
                          badgeColor: "bg-purple-700/50 text-purple-300 border-purple-700/30"
                        },
                        { 
                          id: "recruit-5", 
                          name: "Jennifer Lee", 
                          username: "digital_miner", 
                          status: "Assessment", 
                          progress: 28,
                          badgeColor: "bg-blue-700/50 text-blue-300 border-blue-700/30"
                        },
                      ].map((recruit) => (
                        <TableRow key={recruit.id} className="hover:bg-indigo-950/20 border-indigo-800/20">
                          <TableCell>
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-indigo-500/50 text-indigo-600 focus:ring-indigo-500" 
                              checked={selectedRecruits.includes(recruit.id)}
                              onChange={() => toggleRecruit(recruit.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-300">{recruit.name}</div>
                            <div className="text-sm text-gray-500">@{recruit.username}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={recruit.badgeColor}>
                              {recruit.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={recruit.progress} className="h-2 w-32 bg-indigo-950/40" />
                              <span className="text-sm text-gray-400">{recruit.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-indigo-400">
                                <User className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-indigo-400">
                                <Book className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-indigo-400">
                                <Award className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="border-t border-indigo-800/20 bg-indigo-950/10 flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-indigo-500/30 hover:bg-indigo-900/30 hover:text-indigo-300"
                    disabled={selectedRecruits.length === 0}
                  >
                    Assign Training
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-indigo-500/30 hover:bg-indigo-900/30 hover:text-indigo-300"
                    disabled={selectedRecruits.length === 0}
                  >
                    Advance Status
                  </Button>
                </div>
                <div className="text-sm text-gray-400">
                  Showing 5 of 23 recruits
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="training" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-indigo-400">Training Modules</CardTitle>
                  <CardDescription>Guardian training curriculum and modules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-indigo-950/20 p-4 rounded-lg border border-indigo-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-indigo-400 flex items-center">
                        <Book className="w-4 h-4 mr-2" />
                        Basic Guardian Training
                      </h3>
                      <Badge className="bg-green-700/50 text-green-300">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Fundamental skills and knowledge required for all guardians
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>
                        <span className="text-gray-400">Completion Rate:</span>
                        <span className="text-green-400 ml-1">92%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Modules:</span>
                        <span className="text-indigo-400 ml-1">5</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-indigo-400 ml-1">2 weeks</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Current Trainees:</span>
                        <span className="text-indigo-400 ml-1">8</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-950/20 p-4 rounded-lg border border-indigo-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-indigo-400 flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        TERA Guardian Certification
                      </h3>
                      <Badge className="bg-green-700/50 text-green-300">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Advanced training for Tera ecosystem guardians
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>
                        <span className="text-gray-400">Completion Rate:</span>
                        <span className="text-amber-400 ml-1">67%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Modules:</span>
                        <span className="text-indigo-400 ml-1">8</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-indigo-400 ml-1">4 weeks</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Current Trainees:</span>
                        <span className="text-indigo-400 ml-1">5</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-950/20 p-4 rounded-lg border border-indigo-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-amber-400 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        ZIG Guardian Certification
                      </h3>
                      <Badge className="bg-amber-700/50 text-amber-300">
                        Limited
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Elite training for ZIG protocol guardians
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>
                        <span className="text-gray-400">Completion Rate:</span>
                        <span className="text-amber-400 ml-1">58%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Modules:</span>
                        <span className="text-indigo-400 ml-1">12</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-indigo-400 ml-1">6 weeks</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Current Trainees:</span>
                        <span className="text-amber-400 ml-1">3</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-950/20 p-4 rounded-lg border border-indigo-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-red-400 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Oracle Integration
                      </h3>
                      <Badge className="bg-red-800/50 text-red-300">
                        Restricted
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Advanced oracle access and network defense
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>
                        <span className="text-gray-400">Completion Rate:</span>
                        <span className="text-red-400 ml-1">32%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Modules:</span>
                        <span className="text-indigo-400 ml-1">15</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-indigo-400 ml-1">8 weeks</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Current Trainees:</span>
                        <span className="text-red-400 ml-1">2</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-indigo-800/20 bg-indigo-950/10 flex justify-end">
                  <Button variant="outline" className="border-indigo-500/30 hover:bg-indigo-900/30 hover:text-indigo-300">
                    Create New Module
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-indigo-400">Module Content</CardTitle>
                  <CardDescription>Training materials and curriculum content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-indigo-950/20 p-4 rounded-lg border border-indigo-800/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-indigo-400">Basic Guardian Module 1: Introduction</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                        <div className="flex items-center">
                          <Book className="w-4 h-4 text-indigo-400 mr-2" />
                          <span className="text-sm text-gray-300">Guardian Code of Conduct</span>
                        </div>
                        <Badge className="bg-green-700/50 text-green-300">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                        <div className="flex items-center">
                          <Brain className="w-4 h-4 text-indigo-400 mr-2" />
                          <span className="text-sm text-gray-300">Foundational Blockchain Knowledge</span>
                        </div>
                        <Badge className="bg-green-700/50 text-green-300">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                        <div className="flex items-center">
                          <School className="w-4 h-4 text-indigo-400 mr-2" />
                          <span className="text-sm text-gray-300">KLOUD BUGS Ecosystem</span>
                        </div>
                        <Badge className="bg-green-700/50 text-green-300">
                          Active
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40">
                        Edit Module
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-950/20 p-4 rounded-lg border border-indigo-800/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-indigo-400">TERA Guardian Module 3: Protocol</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 text-indigo-400 mr-2" />
                          <span className="text-sm text-gray-300">TERA Transaction Validation</span>
                        </div>
                        <Badge className="bg-green-700/50 text-green-300">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                        <div className="flex items-center">
                          <BrainCircuit className="w-4 h-4 text-indigo-400 mr-2" />
                          <span className="text-sm text-gray-300">Network Monitoring Tools</span>
                        </div>
                        <Badge className="bg-amber-700/50 text-amber-300">
                          Under Review
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 text-indigo-400 mr-2" />
                          <span className="text-sm text-gray-300">Guardian Response Protocol</span>
                        </div>
                        <Badge className="bg-green-700/50 text-green-300">
                          Active
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40">
                        Edit Module
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-950/20 p-4 rounded-lg border border-indigo-800/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-amber-400">ZIG Guardian Module 2: Oracle</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 text-amber-400 mr-2" />
                          <span className="text-sm text-gray-300">Oracle Access Control</span>
                        </div>
                        <Badge className="bg-green-700/50 text-green-300">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 text-amber-400 mr-2" />
                          <span className="text-sm text-gray-300">Transaction Verification</span>
                        </div>
                        <Badge className="bg-red-800/50 text-red-300">
                          Restricted
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                        <div className="flex items-center">
                          <BrainCircuit className="w-4 h-4 text-amber-400 mr-2" />
                          <span className="text-sm text-gray-300">Consensus Participation</span>
                        </div>
                        <Badge className="bg-red-800/50 text-red-300">
                          Restricted
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40">
                        Edit Module
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-indigo-800/20 bg-indigo-950/10 flex justify-between">
                  <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40">
                    View All Modules
                  </Button>
                  <Button variant="outline" className="border-indigo-500/30 hover:bg-indigo-900/30 hover:text-indigo-300">
                    Create Content
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="certification" className="mt-6 space-y-6">
            <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-400">Certification Management</CardTitle>
                <CardDescription>Manage guardian certifications and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-indigo-800/20">
                  <Table>
                    <TableHeader className="bg-indigo-950/30">
                      <TableRow className="hover:bg-indigo-950/40 border-indigo-800/20">
                        <TableHead className="text-indigo-400">Guardian</TableHead>
                        <TableHead className="text-indigo-400">Basic</TableHead>
                        <TableHead className="text-indigo-400">TERA</TableHead>
                        <TableHead className="text-indigo-400">ZIG</TableHead>
                        <TableHead className="text-indigo-400">Oracle</TableHead>
                        <TableHead className="text-indigo-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { 
                          id: 1, 
                          name: "Guardian_Alpha", 
                          basic: true, 
                          tera: true, 
                          zig: true,
                          oracle: true
                        },
                        { 
                          id: 2, 
                          name: "Guardian_Beta", 
                          basic: true, 
                          tera: true, 
                          zig: true,
                          oracle: false
                        },
                        { 
                          id: 3, 
                          name: "Guardian_Gamma", 
                          basic: true, 
                          tera: true, 
                          zig: false,
                          oracle: false
                        },
                        { 
                          id: 4, 
                          name: "Guardian_Delta", 
                          basic: true, 
                          tera: false, 
                          zig: false,
                          oracle: false
                        },
                        { 
                          id: 5, 
                          name: "Guardian_Epsilon", 
                          basic: true, 
                          tera: true, 
                          zig: true,
                          oracle: true
                        },
                      ].map((guardian) => (
                        <TableRow key={guardian.id} className="hover:bg-indigo-950/20 border-indigo-800/20">
                          <TableCell>
                            <div className="font-medium text-gray-300">{guardian.name}</div>
                          </TableCell>
                          <TableCell>
                            {guardian.basic ? 
                              <CheckCircle className="h-5 w-5 text-green-500" /> : 
                              <div className="h-5 w-5 rounded-full border border-gray-500" />
                            }
                          </TableCell>
                          <TableCell>
                            {guardian.tera ? 
                              <CheckCircle className="h-5 w-5 text-green-500" /> : 
                              <div className="h-5 w-5 rounded-full border border-gray-500" />
                            }
                          </TableCell>
                          <TableCell>
                            {guardian.zig ? 
                              <CheckCircle className="h-5 w-5 text-amber-500" /> : 
                              <div className="h-5 w-5 rounded-full border border-gray-500" />
                            }
                          </TableCell>
                          <TableCell>
                            {guardian.oracle ? 
                              <CheckCircle className="h-5 w-5 text-red-500" /> : 
                              <div className="h-5 w-5 rounded-full border border-gray-500" />
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="h-8 border-indigo-500/30 hover:bg-indigo-900/30 hover:text-indigo-300">
                                View Details
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40">
                                Manage
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="border-t border-indigo-800/20 bg-indigo-950/10 flex justify-between">
                <div className="text-sm text-gray-400">
                  Showing 5 of 12 guardians
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-indigo-500/30 hover:bg-indigo-900/30 hover:text-indigo-300">
                    Issue Certification
                  </Button>
                  <Button variant="outline" className="border-indigo-500/30 hover:bg-indigo-900/30 hover:text-indigo-300">
                    Revoke Access
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-400">Certification Requirements</CardTitle>
                <CardDescription>Requirements for different guardian certifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-indigo-950/40 border border-indigo-800/30 flex items-center justify-center mr-4">
                      <Shield className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-indigo-400">Basic Guardian Certification</h3>
                      <p className="text-sm text-gray-400">Foundational requirements for all guardians</p>
                    </div>
                  </div>
                  
                  <div className="ml-16 space-y-2">
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm text-gray-300">Complete Basic Training Module</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm text-gray-300">Pass Basic Guardian Assessment</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm text-gray-300">Complete Security Protocol Training</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4 bg-indigo-800/20" />
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-indigo-950/40 border border-indigo-800/30 flex items-center justify-center mr-4">
                      <Award className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-indigo-400">TERA Guardian Certification</h3>
                      <p className="text-sm text-gray-400">Requirements for TERA ecosystem guardians</p>
                    </div>
                  </div>
                  
                  <div className="ml-16 space-y-2">
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm text-gray-300">Basic Guardian Certification</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm text-gray-300">Complete TERA Protocol Training</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm text-gray-300">Pass TERA Certification Exam</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-indigo-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm text-gray-300">Minimum 2 Months Active Service</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4 bg-indigo-800/20" />
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-amber-950/40 border border-amber-800/30 flex items-center justify-center mr-4">
                      <Zap className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-amber-400">ZIG Guardian Certification</h3>
                      <p className="text-sm text-gray-400">Requirements for ZIG protocol guardians</p>
                    </div>
                  </div>
                  
                  <div className="ml-16 space-y-2">
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-amber-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-amber-400 mr-2" />
                        <span className="text-sm text-gray-300">TERA Guardian Certification</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-amber-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-amber-400 mr-2" />
                        <span className="text-sm text-gray-300">Complete ZIG Protocol Training</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-amber-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-amber-400 mr-2" />
                        <span className="text-sm text-gray-300">Pass Advanced Security Assessment</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-amber-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-amber-400 mr-2" />
                        <span className="text-sm text-gray-300">Minimum 6 Months Active Service</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded border border-amber-800/20">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-amber-400 mr-2" />
                        <span className="text-sm text-gray-300">Admin Approval Required</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-indigo-800/20 bg-indigo-950/10 flex justify-end">
                <Button variant="outline" className="border-indigo-500/30 hover:bg-indigo-900/30 hover:text-indigo-300">
                  Edit Requirements
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-keys" className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-indigo-400">API Keys Management</h2>
                <p className="text-gray-400">Manage API keys for guardian access to the network</p>
              </div>
              
              <Dialog open={isCreateKeyDialogOpen} onOpenChange={setIsCreateKeyDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white flex gap-2 items-center"
                    onClick={() => setIsCreateKeyDialogOpen(true)}
                  >
                    <Key className="h-4 w-4" />
                    Create New API Key
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-black/80 backdrop-blur-lg border-indigo-500/30">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-indigo-400">Create New Guardian API Key</DialogTitle>
                    <DialogDescription>
                      Generate a new API key for guardian access to the network. This key will enable access to specific resources based on the permissions you select.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="key-name" className="text-indigo-400">Key Name</Label>
                      <Input 
                        id="key-name" 
                        placeholder="e.g., TERA Guardian Access" 
                        className="bg-black/50 border-indigo-500/30" 
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="guardian-name" className="text-indigo-400">Guardian Name</Label>
                      <Input 
                        id="guardian-name" 
                        placeholder="e.g., Guardian_Alpha" 
                        className="bg-black/50 border-indigo-500/30" 
                        value={newKeyGuardian}
                        onChange={(e) => setNewKeyGuardian(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="key-type" className="text-indigo-400">Key Type</Label>
                      <Select 
                        value={newKeyType} 
                        onValueChange={(value) => setNewKeyType(value as 'tera' | 'zig' | 'oracle')}
                      >
                        <SelectTrigger className="bg-black/50 border-indigo-500/30 focus:ring-indigo-500/50">
                          <SelectValue placeholder="Select key type" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-indigo-500/30">
                          <SelectItem value="tera" className="text-green-400 hover:bg-indigo-950/40">TERA Guardian</SelectItem>
                          <SelectItem value="zig" className="text-amber-400 hover:bg-indigo-950/40">ZIG Protocol</SelectItem>
                          <SelectItem value="oracle" className="text-red-400 hover:bg-indigo-950/40">Oracle Integration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label className="text-indigo-400 mb-2">Permissions</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="permission-read" 
                            checked={newKeyPermissions.includes('read')}
                            onCheckedChange={() => handleTogglePermission('read')}
                            className="data-[state=checked]:bg-indigo-600"
                          />
                          <Label htmlFor="permission-read" className="text-gray-300">Read Access</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="permission-validate" 
                            checked={newKeyPermissions.includes('validate')}
                            onCheckedChange={() => handleTogglePermission('validate')}
                            className="data-[state=checked]:bg-indigo-600"
                          />
                          <Label htmlFor="permission-validate" className="text-gray-300">Validation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="permission-monitor" 
                            checked={newKeyPermissions.includes('monitor')}
                            onCheckedChange={() => handleTogglePermission('monitor')}
                            className="data-[state=checked]:bg-indigo-600"
                          />
                          <Label htmlFor="permission-monitor" className="text-gray-300">Network Monitoring</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="permission-oracle-read" 
                            checked={newKeyPermissions.includes('oracle:read')}
                            onCheckedChange={() => handleTogglePermission('oracle:read')}
                            className="data-[state=checked]:bg-indigo-600"
                            disabled={newKeyType !== 'oracle' && newKeyType !== 'zig'}
                          />
                          <Label 
                            htmlFor="permission-oracle-read" 
                            className={`${newKeyType !== 'oracle' && newKeyType !== 'zig' ? 'text-gray-600' : 'text-gray-300'}`}
                          >
                            Oracle Read
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="permission-oracle-write" 
                            checked={newKeyPermissions.includes('oracle:write')}
                            onCheckedChange={() => handleTogglePermission('oracle:write')}
                            className="data-[state=checked]:bg-red-600"
                            disabled={newKeyType !== 'oracle'}
                          />
                          <Label 
                            htmlFor="permission-oracle-write" 
                            className={`${newKeyType !== 'oracle' ? 'text-gray-600' : 'text-gray-300'}`}
                          >
                            Oracle Write
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="key-expiry" className="text-indigo-400">Expiry</Label>
                      <Select 
                        value={newKeyExpiry}
                        onValueChange={setNewKeyExpiry}
                      >
                        <SelectTrigger className="bg-black/50 border-indigo-500/30 focus:ring-indigo-500/50">
                          <SelectValue placeholder="Select expiry" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-indigo-500/30">
                          <SelectItem value="1-month" className="hover:bg-indigo-950/40">1 Month</SelectItem>
                          <SelectItem value="3-months" className="hover:bg-indigo-950/40">3 Months</SelectItem>
                          <SelectItem value="6-months" className="hover:bg-indigo-950/40">6 Months</SelectItem>
                          <SelectItem value="1-year" className="hover:bg-indigo-950/40">1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter className="flex space-x-2 justify-end">
                    <Button variant="outline" className="border-indigo-500/30 text-gray-300" onClick={() => setIsCreateKeyDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreateNewKey}>
                      Generate API Key
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-400">Active API Keys</CardTitle>
                <CardDescription>
                  Guardian API keys with active access to the network. Keys automatically expire based on their set duration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-indigo-800/20">
                  <Table>
                    <TableHeader className="bg-indigo-950/30">
                      <TableRow className="hover:bg-indigo-950/40 border-indigo-800/20">
                        <TableHead className="text-indigo-400">Key Name</TableHead>
                        <TableHead className="text-indigo-400">Guardian</TableHead>
                        <TableHead className="text-indigo-400">Type</TableHead>
                        <TableHead className="text-indigo-400">API Key</TableHead>
                        <TableHead className="text-indigo-400 hidden md:table-cell">Permissions</TableHead>
                        <TableHead className="text-indigo-400 hidden md:table-cell">Created</TableHead>
                        <TableHead className="text-indigo-400 hidden sm:table-cell">Expires</TableHead>
                        <TableHead className="text-indigo-400">Status</TableHead>
                        <TableHead className="text-indigo-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys
                        .filter(key => key.status !== 'revoked')
                        .map((key) => (
                        <TableRow key={key.id} className="hover:bg-indigo-950/20 border-indigo-800/20">
                          <TableCell className="font-medium text-gray-300">
                            {key.name}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {key.guardianName}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={`
                                ${key.type === 'tera' ? 'bg-green-700/50 text-green-300 border-green-700/30' : 
                                  key.type === 'zig' ? 'bg-amber-700/50 text-amber-300 border-amber-700/30' : 
                                  'bg-red-800/50 text-red-300 border-red-800/30'}
                              `}
                            >
                              {key.type === 'tera' ? 'TERA' : key.type === 'zig' ? 'ZIG' : 'Oracle'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-400 font-mono">
                                {keyBeingRevealedId === key.id ? 
                                  'sk_live_XX1GHT34...BAQZYX' : key.key}
                              </span>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40"
                                onClick={() => keyBeingRevealedId === key.id ? toggleKeyVisibility(null) : toggleKeyVisibility(key.id)}
                              >
                                {keyBeingRevealedId === key.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40"
                                onClick={() => handleCopyKey(key.key)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {key.permissions.map((perm) => (
                                <Badge key={perm} variant="outline" className="bg-indigo-950/40 text-indigo-300 border-indigo-500/30 text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-gray-400 text-sm">
                            {new Date(key.created).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-gray-400 text-sm">
                            {new Date(key.expires).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={`
                                ${key.status === 'active' ? 'bg-green-700/50 text-green-300' : 
                                  key.status === 'expired' ? 'bg-yellow-700/50 text-yellow-300' : 
                                  'bg-red-700/50 text-red-300'}
                              `}
                            >
                              {key.status === 'active' ? 'Active' : 
                               key.status === 'expired' ? 'Expired' : 'Revoked'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-indigo-400 hover:text-red-400 hover:bg-red-950/20"
                                onClick={() => handleRevokeKey(key.id)}
                                title="Revoke Key"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-indigo-400 hover:text-amber-400 hover:bg-amber-950/20"
                                onClick={() => regenerateKey(key.id)}
                                title="Regenerate Key"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-400">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-red-400" />
                    <span>Revoked API Keys</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  Previously active keys that have been manually revoked for security reasons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-indigo-800/20">
                  <Table>
                    <TableHeader className="bg-indigo-950/30">
                      <TableRow className="hover:bg-indigo-950/40 border-indigo-800/20">
                        <TableHead className="text-indigo-400">Key Name</TableHead>
                        <TableHead className="text-indigo-400">Guardian</TableHead>
                        <TableHead className="text-indigo-400">Type</TableHead>
                        <TableHead className="text-indigo-400 hidden md:table-cell">Revoked On</TableHead>
                        <TableHead className="text-indigo-400 hidden md:table-cell">Last Used</TableHead>
                        <TableHead className="text-indigo-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys
                        .filter(key => key.status === 'revoked')
                        .map((key) => (
                        <TableRow key={key.id} className="hover:bg-indigo-950/20 border-indigo-800/20">
                          <TableCell className="font-medium text-gray-400">
                            {key.name}
                          </TableCell>
                          <TableCell className="text-gray-500">
                            {key.guardianName}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={`
                                ${key.type === 'tera' ? 'border-green-900/30 text-green-600' : 
                                  key.type === 'zig' ? 'border-amber-900/30 text-amber-600' : 
                                  'border-red-900/30 text-red-600'}
                              `}
                            >
                              {key.type === 'tera' ? 'TERA' : key.type === 'zig' ? 'ZIG' : 'Oracle'}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-gray-500 text-sm">
                            {new Date().toLocaleDateString()} {/* In a real app this would be the actual revocation date */}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-gray-500 text-sm">
                            {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 border-indigo-500/30 hover:bg-indigo-900/30 hover:text-indigo-300"
                                  >
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-black/80 backdrop-blur-lg border-indigo-500/30">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl text-indigo-400">Revoked Key Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-xs text-gray-500">Key Name</p>
                                        <p className="text-sm text-gray-300">{key.name}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-xs text-gray-500">Guardian</p>
                                        <p className="text-sm text-gray-300">{key.guardianName}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-xs text-gray-500">Type</p>
                                        <p className="text-sm text-gray-300">{key.type.toUpperCase()}</p>
                                      </div>
                                    </div>
                                    <Separator className="bg-indigo-800/20" />
                                    <div className="space-y-2">
                                      <p className="text-xs text-gray-500">Permissions</p>
                                      <div className="flex flex-wrap gap-2">
                                        {key.permissions.map((perm) => (
                                          <Badge key={perm} variant="outline" className="bg-indigo-950/40 text-indigo-300 border-indigo-500/30">
                                            {perm}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <Separator className="bg-indigo-800/20" />
                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-xs text-gray-500">Created On</p>
                                        <p className="text-sm text-gray-300">{new Date(key.created).toLocaleDateString()}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-xs text-gray-500">Last Used</p>
                                        <p className="text-sm text-gray-300">{key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</p>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-xs text-gray-500">Status</p>
                                        <Badge className="bg-red-700/50 text-red-300">Revoked</Badge>
                                      </div>
                                    </div>
                                    <div className="px-3 py-2 rounded-md bg-red-950/20 border border-red-800/30 mt-4">
                                      <div className="flex items-start gap-2">
                                        <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium text-red-400">Key Revoked</p>
                                          <p className="text-xs text-gray-400">This API key has been permanently revoked and cannot be reinstated. Generate a new key if needed.</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {apiKeys.filter(key => key.status === 'revoked').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No revoked API keys to display
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border border-indigo-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-400">Security Recommendations</CardTitle>
                <CardDescription>Best practices for managing guardian API keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-indigo-950/10 rounded-lg border border-indigo-800/20 p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-900/30 rounded-full p-2 mt-1">
                      <Key className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-indigo-400">Regular Key Rotation</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Periodically regenerate API keys, even for trusted guardians. We recommend rotating keys every 3-6 months.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-900/30 rounded-full p-2 mt-1">
                      <Lock className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-indigo-400">Principle of Least Privilege</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Assign only the permissions necessary for the guardian's role. Avoid granting oracle:write access unless absolutely required.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-900/30 rounded-full p-2 mt-1">
                      <AlertCircle className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-indigo-400">Immediate Revocation</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Immediately revoke keys for guardians who leave the program or if suspicious activity is detected. Always create new keys rather than sharing existing ones.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-900/30 rounded-full p-2 mt-1">
                      <Eye className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-indigo-400">Usage Monitoring</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Regularly review the usage patterns of API keys. Investigate any unusual activity or access patterns from guardian keys.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-indigo-800/20 bg-indigo-950/10">
                <p className="text-xs text-gray-500">
                  All API key activities are logged and monitored for security purposes. Key usage is subject to the Guardian Code of Conduct.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}