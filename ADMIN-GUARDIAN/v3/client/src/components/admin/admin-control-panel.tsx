import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Admin permission levels
const PERMISSION_LEVELS = {
  VIEWER: 'viewer',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// System modules that can be controlled
const SYSTEM_MODULES = [
  { id: 'mining', name: 'Mining System', status: 'operational', toggleable: true },
  { id: 'guardian', name: 'TERA Guardian', status: 'operational', toggleable: true },
  { id: 'broadcast', name: 'Broadcast Station', status: 'operational', toggleable: true },
  { id: 'chat', name: 'Chat Room', status: 'operational', toggleable: true },
  { id: 'cafe', name: 'Cosmic Café', status: 'operational', toggleable: true },
  { id: 'puzzle', name: 'Crypto Puzzles', status: 'operational', toggleable: true },
  { id: 'lottery', name: 'Bitcoin Lottery', status: 'operational', toggleable: true },
  { id: 'database', name: 'Bitcoin Database', status: 'operational', toggleable: true },
  { id: 'brew', name: 'Brew Station', status: 'operational', toggleable: true },
  { id: 'admin', name: 'Admin Controls', status: 'operational', toggleable: false }
];

// User management mock data
const USERS = [
  { id: 1, username: 'admin', email: 'admin@kloudbugs.com', role: PERMISSION_LEVELS.SUPER_ADMIN, lastLogin: '2025-05-20 08:30:22' },
  { id: 2, username: 'moderator', email: 'mod@kloudbugs.com', role: PERMISSION_LEVELS.MODERATOR, lastLogin: '2025-05-19 15:45:18' },
  { id: 3, username: 'user', email: 'user@kloudbugs.com', role: PERMISSION_LEVELS.VIEWER, lastLogin: '2025-05-20 10:15:05' },
  { id: 4, username: 'miner1', email: 'miner1@kloudbugs.com', role: PERMISSION_LEVELS.VIEWER, lastLogin: '2025-05-18 22:10:33' },
  { id: 5, username: 'cafeowner', email: 'cafe@kloudbugs.com', role: PERMISSION_LEVELS.ADMIN, lastLogin: '2025-05-20 09:05:47' }
];

// Broadcast messages
const BROADCASTS = [
  { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance on May 25. The system will be down for 2 hours.', priority: 'high', sent: '2025-05-20 07:30:00', expires: '2025-05-25 23:59:59' },
  { id: 2, title: 'New Brew Available', message: 'Try our new Nebula Cold Brew at the Cosmic Café!', priority: 'medium', sent: '2025-05-19 14:15:00', expires: '2025-05-26 23:59:59' },
  { id: 3, title: 'Mining Pool Update', message: 'We\'ve added support for 3 new mining pools. Check the settings!', priority: 'medium', sent: '2025-05-18 09:20:00', expires: '2025-05-28 23:59:59' }
];

export default function AdminControlPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [moduleStatuses, setModuleStatuses] = useState(
    SYSTEM_MODULES.reduce((acc, module) => ({
      ...acc,
      [module.id]: module.status === 'operational'
    }), {})
  );
  
  // New broadcast state
  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    message: '',
    priority: 'medium',
    expires: ''
  });
  
  // New user state
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: PERMISSION_LEVELS.VIEWER
  });
  
  // Handle module toggle
  const toggleModule = (moduleId: string) => {
    // Find the module to check if it's toggleable
    const module = SYSTEM_MODULES.find(m => m.id === moduleId);
    if (!module || !module.toggleable) return;
    
    setModuleStatuses(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
    
    toast({
      title: `Module ${moduleId} ${moduleStatuses[moduleId] ? 'disabled' : 'enabled'}`,
      description: `The ${moduleId} module has been ${moduleStatuses[moduleId] ? 'disabled' : 'enabled'} successfully.`
    });
  };
  
  // Handle broadcast submission
  const submitBroadcast = () => {
    if (!newBroadcast.title || !newBroadcast.message) {
      toast({
        title: 'Broadcast Error',
        description: 'Title and message are required for broadcasts.',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Broadcast Sent',
      description: `Your broadcast "${newBroadcast.title}" has been sent to all users.`
    });
    
    // Reset the form
    setNewBroadcast({
      title: '',
      message: '',
      priority: 'medium',
      expires: ''
    });
  };
  
  // Handle user creation
  const createUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast({
        title: 'User Creation Error',
        description: 'Username, email, and password are required.',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'User Created',
      description: `The user "${newUser.username}" has been created successfully.`
    });
    
    // Reset the form
    setNewUser({
      username: '',
      email: '',
      password: '',
      role: PERMISSION_LEVELS.VIEWER
    });
  };
  
  return (
    <div className="admin-panel">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          <TabsTrigger value="system">System Control</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">Operational</div>
                <div className="text-sm text-muted-foreground mt-1">All systems functioning normally</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">42</div>
                <div className="text-sm text-muted-foreground mt-1">Currently online users</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Mining Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">12 Active</div>
                <div className="text-sm text-muted-foreground mt-1">Mining operations in progress</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">2</div>
                <div className="text-sm text-muted-foreground mt-1">Pending alerts require attention</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 border-b">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span>Mining operation started by user 'miner1'</span>
                    </div>
                    <div className="text-sm text-muted-foreground">2 min ago</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border-b">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      <span>Guardian alert detected: unusual network activity</span>
                    </div>
                    <div className="text-sm text-muted-foreground">15 min ago</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border-b">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span>New user 'cafeowner' registered</span>
                    </div>
                    <div className="text-sm text-muted-foreground">1 hour ago</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 border-b">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      <span>Broadcast "System Maintenance" sent</span>
                    </div>
                    <div className="text-sm text-muted-foreground">3 hours ago</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      <span>System module 'chat' restarted</span>
                    </div>
                    <div className="text-sm text-muted-foreground">5 hours ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">🔄</span> Restart Mining Service
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">🔔</span> Send System Alert
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">🛡️</span> View Guardian Logs
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">👥</span> Manage User Access
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">💬</span> Moderate Chat Room
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">🔒</span> Security Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Username</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Last Login</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {USERS.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-3 px-4">{user.id}</td>
                        <td className="py-3 px-4">{user.username}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === PERMISSION_LEVELS.SUPER_ADMIN ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            user.role === PERMISSION_LEVELS.ADMIN ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                            user.role === PERMISSION_LEVELS.MODERATOR ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">{user.lastLogin}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="Enter username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Enter email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PERMISSION_LEVELS.VIEWER}>Viewer</SelectItem>
                      <SelectItem value={PERMISSION_LEVELS.MODERATOR}>Moderator</SelectItem>
                      <SelectItem value={PERMISSION_LEVELS.ADMIN}>Admin</SelectItem>
                      <SelectItem value={PERMISSION_LEVELS.SUPER_ADMIN}>Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button className="mt-4" onClick={createUser}>Create User</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Broadcast Tab */}
        <TabsContent value="broadcast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Broadcast Title</Label>
                  <Input 
                    id="title" 
                    value={newBroadcast.title}
                    onChange={(e) => setNewBroadcast({...newBroadcast, title: e.target.value})}
                    placeholder="Enter broadcast title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Broadcast Message</Label>
                  <Textarea 
                    id="message" 
                    value={newBroadcast.message}
                    onChange={(e) => setNewBroadcast({...newBroadcast, message: e.target.value})}
                    placeholder="Enter your broadcast message"
                    rows={5}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newBroadcast.priority}
                      onValueChange={(value) => setNewBroadcast({...newBroadcast, priority: value})}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expires">Expires</Label>
                    <Input 
                      id="expires" 
                      type="datetime-local"
                      value={newBroadcast.expires}
                      onChange={(e) => setNewBroadcast({...newBroadcast, expires: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button onClick={submitBroadcast}>Send Broadcast</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Broadcasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {BROADCASTS.map((broadcast) => (
                  <div key={broadcast.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{broadcast.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{broadcast.message}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        broadcast.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        broadcast.priority === 'high' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                        broadcast.priority === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {broadcast.priority}
                      </span>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                      <div>Sent: {broadcast.sent}</div>
                      <div>Expires: {broadcast.expires}</div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Control Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SYSTEM_MODULES.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">{module.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Status: <span className={moduleStatuses[module.id] ? 'text-green-500' : 'text-red-500'}>
                          {moduleStatuses[module.id] ? 'Operational' : 'Disabled'}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline" size="sm">Logs</Button>
                      <Switch
                        checked={moduleStatuses[module.id]}
                        onCheckedChange={() => toggleModule(module.id)}
                        disabled={!module.toggleable}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">🧹</span> Clear System Cache
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">💾</span> Backup Database
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">📊</span> Generate System Report
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-amber-500">
                    <span className="mr-2">🔄</span> Restart All Services
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-red-500">
                    <span className="mr-2">⚠️</span> Emergency Shutdown
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <Switch id="maintenance-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <Switch id="debug-mode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="user-registration">User Registration</Label>
                    <Switch id="user-registration" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ai-learning">AI Learning</Label>
                    <Switch id="ai-learning" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">Automatic Backups</Label>
                    <Switch id="auto-backup" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}