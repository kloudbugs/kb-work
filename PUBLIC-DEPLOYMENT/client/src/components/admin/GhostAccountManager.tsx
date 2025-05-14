import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { User, UserPlus, UserMinus, RefreshCw, Key, LogOut } from 'lucide-react';

// Types
interface GhostAdmin {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  created: string;
  lastLogin?: string;
}

interface GhostUser {
  id: string;
  username: string;
  displayName?: string;
  email: string;
  walletAddress?: string;
  balance?: string;
  created: string;
  lastLogin?: string;
  settings?: {
    location?: string;
    deviceType?: string;
    plan?: string;
  };
}

export default function GhostAccountManager() {
  const [activeTab, setActiveTab] = useState('admin');
  const [isCreateAdminDialogOpen, setIsCreateAdminDialogOpen] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [newGhostAdmin, setNewGhostAdmin] = useState({
    ghostName: '',
    ghostUsername: '',
    ghostEmail: '',
  });
  const [newGhostUser, setNewGhostUser] = useState({
    username: '',
    email: '',
    walletAddress: '',
    location: 'us',
    deviceType: 'desktop',
    plan: 'standard'
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Queries
  const {
    data: ghostAdmins,
    isLoading: isLoadingAdmins,
    error: adminError
  } = useQuery({
    queryKey: ['/api/admin/ghost/list'],
    refetchInterval: 30000
  });
  
  const {
    data: ghostUsers,
    isLoading: isLoadingUsers,
    error: userError
  } = useQuery({
    queryKey: ['/api/ghost-users'],
    refetchInterval: 30000
  });
  
  // Mutations
  const createGhostAdminMutation = useMutation({
    mutationFn: (data: any) => 
      fetch('/api/admin/ghost/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error('Failed to create ghost admin');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ghost/list'] });
      setIsCreateAdminDialogOpen(false);
      setNewGhostAdmin({
        ghostName: '',
        ghostUsername: '',
        ghostEmail: '',
      });
      toast({
        title: 'Ghost Admin Created',
        description: 'The ghost admin account has been created successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create ghost admin',
        variant: 'destructive'
      });
    }
  });
  
  const createGhostUserMutation = useMutation({
    mutationFn: (data: any) => 
      fetch('/api/ghost-users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error('Failed to create ghost user');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ghost-users'] });
      setIsCreateUserDialogOpen(false);
      setNewGhostUser({
        username: '',
        email: '',
        walletAddress: '',
        location: 'us',
        deviceType: 'desktop',
        plan: 'standard'
      });
      toast({
        title: 'Ghost User Created',
        description: 'The ghost user account has been created successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create ghost user',
        variant: 'destructive'
      });
    }
  });
  
  const deleteGhostUserMutation = useMutation({
    mutationFn: (userId: string) => 
      fetch(`/api/ghost-users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error('Failed to delete ghost user');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ghost-users'] });
      toast({
        title: 'Ghost User Deleted',
        description: 'The ghost user has been deleted successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete ghost user',
        variant: 'destructive'
      });
    }
  });
  
  const loginAsGhostAdminMutation = useMutation({
    mutationFn: (data: { ghostUsername: string, password: string }) => 
      fetch('/api/admin/ghost/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error('Failed to login as ghost admin');
        return res.json();
      }),
    onSuccess: (response) => {
      toast({
        title: 'Switched to Ghost Admin',
        description: `You are now logged in as ${response.user.username}`
      });
      // Refresh the entire application state after login
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to login as ghost admin',
        variant: 'destructive'
      });
    }
  });
  
  const generateOneTimeGhostAdminMutation = useMutation({
    mutationFn: () => 
      fetch('/api/admin/ghost/generate-one-time', {
        method: 'POST',
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error('Failed to create one-time ghost admin');
        return res.json();
      }),
    onSuccess: (response) => {
      toast({
        title: 'One-Time Ghost Admin Created',
        description: `You're now logged in as ${response.ghost?.username || 'a ghost admin'}`
      });
      // Refresh the entire application state after login
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create one-time ghost admin',
        variant: 'destructive'
      });
    }
  });
  
  const switchBackToRealAdminMutation = useMutation({
    mutationFn: () => 
      fetch('/api/admin/ghost/switch-back', {
        method: 'POST',
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error('Failed to switch back to real admin');
        return res.json();
      }),
    onSuccess: () => {
      toast({
        title: 'Switched Back',
        description: 'You are now logged in as your real admin account'
      });
      // Refresh the entire application state after switching back
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to switch back to real admin',
        variant: 'destructive'
      });
    }
  });
  
  const toggleGhostUserMiningMutation = useMutation({
    mutationFn: ({ userId, action }: { userId: string, action: 'start' | 'stop' }) => 
      fetch(`/api/ghost-users/${userId}/${action}-mining`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poolId: 1,
          hashrate: Math.floor(Math.random() * 20000) + 5000
        }),
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error(`Failed to ${action} mining`);
        return res.json();
      }),
    onSuccess: (_, variables) => {
      const action = variables.action === 'start' ? 'started' : 'stopped';
      toast({
        title: `Mining ${action.charAt(0).toUpperCase() + action.slice(1)}`,
        description: `Mining has been ${action} for this ghost user`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ghost-users'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to toggle mining status',
        variant: 'destructive'
      });
    }
  });
  
  // Handlers
  const handleCreateGhostAdmin = () => {
    if (!newGhostAdmin.ghostName || !newGhostAdmin.ghostUsername) {
      toast({
        title: 'Missing Information',
        description: 'Name and username are required',
        variant: 'destructive'
      });
      return;
    }
    createGhostAdminMutation.mutate(newGhostAdmin);
  };
  
  const handleCreateGhostUser = () => {
    if (!newGhostUser.username) {
      toast({
        title: 'Missing Information',
        description: 'Username is required',
        variant: 'destructive'
      });
      return;
    }
    createGhostUserMutation.mutate(newGhostUser);
  };
  
  const handleLoginAsGhostAdmin = (ghostUsername: string, password: string) => {
    loginAsGhostAdminMutation.mutate({ ghostUsername, password });
  };
  
  const handleGenerateOneTimeGhostAdmin = () => {
    generateOneTimeGhostAdminMutation.mutate();
  };
  
  const handleSwitchBackToRealAdmin = () => {
    switchBackToRealAdminMutation.mutate();
  };
  
  const handleToggleGhostUserMining = (userId: string, currentStatus: boolean) => {
    toggleGhostUserMiningMutation.mutate({
      userId,
      action: currentStatus ? 'stop' : 'start'
    });
  };
  
  const handleDeleteGhostUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this ghost user?')) {
      deleteGhostUserMutation.mutate(userId);
    }
  };
  
  return (
    <Card className="w-full shadow-md mb-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Ghost Account Manager</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['/api/admin/ghost/list'] });
              queryClient.invalidateQueries({ queryKey: ['/api/ghost-users'] });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Create and manage ghost accounts for admin and user simulation
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between mb-4 gap-2">
          <Button
            onClick={handleSwitchBackToRealAdmin}
            variant="secondary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Switch Back to Real Admin
          </Button>
          
          <Button
            onClick={handleGenerateOneTimeGhostAdmin}
            variant="outline"
          >
            <Key className="h-4 w-4 mr-2" />
            Quick Ghost Admin
          </Button>
        </div>
        
        <Tabs defaultValue="admin" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="admin">Ghost Admins</TabsTrigger>
            <TabsTrigger value="user">Ghost Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={isCreateAdminDialogOpen} onOpenChange={setIsCreateAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Ghost Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Ghost Admin</DialogTitle>
                    <DialogDescription>
                      Create a new ghost admin account that you can use as an alternate identity.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newGhostAdmin.ghostName}
                        onChange={(e) => setNewGhostAdmin({...newGhostAdmin, ghostName: e.target.value})}
                        className="col-span-3"
                        placeholder="Ghost Admin Name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={newGhostAdmin.ghostUsername}
                        onChange={(e) => setNewGhostAdmin({...newGhostAdmin, ghostUsername: e.target.value})}
                        className="col-span-3"
                        placeholder="ghost_username"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={newGhostAdmin.ghostEmail}
                        onChange={(e) => setNewGhostAdmin({...newGhostAdmin, ghostEmail: e.target.value})}
                        className="col-span-3"
                        placeholder="ghost@example.com (optional)"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateAdminDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateGhostAdmin}>
                      Create Ghost Admin
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoadingAdmins ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : adminError ? (
              <div className="p-8 text-center text-red-500">
                Error loading ghost admins
              </div>
            ) : !ghostAdmins?.ghostAccounts || ghostAdmins.ghostAccounts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No ghost admin accounts found. Create your first one.
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {ghostAdmins.ghostAccounts.map((admin: GhostAdmin) => (
                  <Card key={admin.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>{admin.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <CardTitle className="text-base truncate">{admin.displayName || admin.username}</CardTitle>
                          <CardDescription className="text-xs truncate">{admin.email}</CardDescription>
                        </div>
                        <Badge variant="outline">Admin</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0">
                      <div className="text-sm mb-2">
                        <span className="font-semibold">Username:</span> {admin.username}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Created: {new Date(admin.created).toLocaleDateString()}
                      </div>
                      {admin.lastLogin && (
                        <div className="text-sm text-gray-500 mb-2">
                          Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end pt-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary" size="sm">
                            <User className="h-4 w-4 mr-2" />
                            Login as Ghost
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Login as Ghost Admin</DialogTitle>
                            <DialogDescription>
                              Enter the password for this ghost admin account. If you don't know the password, 
                              you may need to create a new ghost admin.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="p-4">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="ghost-password">Password</Label>
                                <Input
                                  id="ghost-password"
                                  type="password"
                                  placeholder="Enter password"
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => {
                                const passwordInput = document.getElementById('ghost-password') as HTMLInputElement;
                                handleLoginAsGhostAdmin(admin.username, passwordInput.value);
                              }}
                            >
                              Login
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="user" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Ghost User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Ghost User</DialogTitle>
                    <DialogDescription>
                      Create a new ghost user account that you can use for simulating user activity.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={newGhostUser.username}
                        onChange={(e) => setNewGhostUser({...newGhostUser, username: e.target.value})}
                        className="col-span-3"
                        placeholder="ghost_user"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={newGhostUser.email}
                        onChange={(e) => setNewGhostUser({...newGhostUser, email: e.target.value})}
                        className="col-span-3"
                        placeholder="ghost_user@example.com (optional)"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="wallet" className="text-right">
                        Wallet
                      </Label>
                      <Input
                        id="wallet"
                        value={newGhostUser.walletAddress}
                        onChange={(e) => setNewGhostUser({...newGhostUser, walletAddress: e.target.value})}
                        className="col-span-3"
                        placeholder="Wallet Address (optional)"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <select
                        id="location"
                        value={newGhostUser.location}
                        onChange={(e) => setNewGhostUser({...newGhostUser, location: e.target.value})}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="us">United States</option>
                        <option value="eu">Europe</option>
                        <option value="asia">Asia</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="deviceType" className="text-right">
                        Device
                      </Label>
                      <select
                        id="deviceType"
                        value={newGhostUser.deviceType}
                        onChange={(e) => setNewGhostUser({...newGhostUser, deviceType: e.target.value})}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="desktop">Desktop</option>
                        <option value="mobile">Mobile</option>
                        <option value="tablet">Tablet</option>
                        <option value="asic">ASIC Miner</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="plan" className="text-right">
                        Plan
                      </Label>
                      <select
                        id="plan"
                        value={newGhostUser.plan}
                        onChange={(e) => setNewGhostUser({...newGhostUser, plan: e.target.value})}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateGhostUser}>
                      Create Ghost User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoadingUsers ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : userError ? (
              <div className="p-8 text-center text-red-500">
                Error loading ghost users
              </div>
            ) : !ghostUsers?.ghostUsers || ghostUsers.ghostUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No ghost user accounts found. Create your first one.
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {ghostUsers.ghostUsers.map((user: GhostUser) => (
                  <Card key={user.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <CardTitle className="text-base truncate">{user.displayName || user.username}</CardTitle>
                          <CardDescription className="text-xs truncate">{user.email}</CardDescription>
                        </div>
                        <Badge variant="secondary">User</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0">
                      <div className="text-sm mb-2">
                        <span className="font-semibold">Username:</span> {user.username}
                      </div>
                      {user.walletAddress && (
                        <div className="text-sm truncate mb-2">
                          <span className="font-semibold">Wallet:</span>{' '}
                          <span className="text-gray-500">{user.walletAddress}</span>
                        </div>
                      )}
                      {user.balance && (
                        <div className="text-sm mb-2">
                          <span className="font-semibold">Balance:</span>{' '}
                          <span className="text-gray-500">
                            {parseFloat(user.balance) / 100000000} BTC
                          </span>
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mb-2">
                        Created: {new Date(user.created).toLocaleDateString()}
                      </div>
                      {user.settings && (
                        <div className="text-xs space-x-2 mt-3 flex flex-wrap gap-1">
                          {user.settings.plan && (
                            <Badge variant="outline">{user.settings.plan}</Badge>
                          )}
                          {user.settings.deviceType && (
                            <Badge variant="outline">{user.settings.deviceType}</Badge>
                          )}
                          {user.settings.location && (
                            <Badge variant="outline">{user.settings.location}</Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id={`mining-${user.id}`}
                          // This is a mock check since we don't have real mining status in the API response
                          // In a real implementation, you would get this from the user object or mining stats
                          checked={false}
                          onCheckedChange={(checked) => handleToggleGhostUserMining(user.id, !checked)}
                        />
                        <Label htmlFor={`mining-${user.id}`}>Mining</Label>
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteGhostUser(user.id)}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}