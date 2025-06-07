import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Key,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Lock,
  Copy,
  Save,
  RefreshCw,
  Shield
} from 'lucide-react';

interface ApiKey {
  id: string;
  service: string;
  name: string;
  apiKey: string;
  apiSecret?: string;
  organizationId?: string; // For NiceHash
  description?: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

interface ApiKeyFormData {
  service: string;
  name: string;
  apiKey: string;
  apiSecret?: string;
  organizationId?: string;
  description?: string;
}

export default function ApiKeyManagementPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      service: 'mining-rig-rentals',
      name: 'MRR Primary',
      apiKey: '••••••••••••••••',
      apiSecret: '••••••••••••••••',
      description: 'Primary account for hardware rentals',
      isActive: true,
      createdAt: '2025-05-01T10:00:00Z',
      lastUsed: '2025-05-20T15:30:00Z'
    },
    {
      id: '2',
      service: 'nicehash',
      name: 'NiceHash Production',
      apiKey: '••••••••••••••••',
      apiSecret: '••••••••••••••••',
      organizationId: '••••••••••••••••',
      description: 'Cloud mining service',
      isActive: true,
      createdAt: '2025-04-15T08:00:00Z',
      lastUsed: '2025-05-20T14:45:00Z'
    },
    {
      id: '3',
      service: 'unmineable',
      name: 'Unmineable Key',
      apiKey: '••••••••••••••••',
      description: 'CPU/GPU mining service',
      isActive: false,
      createdAt: '2025-03-22T12:00:00Z',
      lastUsed: '2025-04-10T09:15:00Z'
    }
  ]);
  
  const [formData, setFormData] = useState<ApiKeyFormData>({
    service: 'mining-rig-rentals',
    name: '',
    apiKey: '',
    apiSecret: '',
    organizationId: '',
    description: ''
  });
  
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ [key: string]: { success: boolean, message: string } }>({});
  
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const toggleApiKeyStatus = async (id: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      // This would be an API call in a real implementation
      // await apiRequest.patch(`/api/mining/api-keys/${id}`, { isActive });
      
      // For demonstration purposes, update the local state
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, isActive } : key
      ));
      
      toast({
        title: `API Key ${isActive ? 'Enabled' : 'Disabled'}`,
        description: `The API key has been ${isActive ? 'enabled' : 'disabled'} successfully.`,
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to update API key status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update API key status. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteApiKey = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // This would be an API call in a real implementation
      // await apiRequest.delete(`/api/mining/api-keys/${id}`);
      
      // For demonstration purposes, update the local state
      setApiKeys(apiKeys.filter(key => key.id !== id));
      
      toast({
        title: 'API Key Deleted',
        description: 'The API key has been deleted successfully.',
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete API key. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const testApiKey = async (id: string) => {
    setIsLoading(true);
    try {
      // This would be an API call in a real implementation
      // const response = await apiRequest.post(`/api/mining/api-keys/${id}/test`);
      
      // For demonstration purposes, simulate a test result
      const key = apiKeys.find(k => k.id === id);
      const success = Math.random() > 0.2; // 80% chance of success
      
      setTestResults({
        ...testResults,
        [id]: {
          success,
          message: success 
            ? `Successfully connected to ${key?.service}. API key is valid.` 
            : `Failed to connect to ${key?.service}. Please check your API key and try again.`
        }
      });
      
      toast({
        title: success ? 'API Key Valid' : 'API Key Invalid',
        description: success 
          ? `Successfully connected to ${key?.service}.` 
          : `Failed to connect to ${key?.service}. Please check your API key and try again.`,
        variant: success ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Failed to test API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to test API key. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveApiKey = async () => {
    if (!formData.name || !formData.apiKey || !formData.service) {
      toast({
        title: 'Missing Information',
        description: 'Please provide all required fields.',
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (isEditing && editingId) {
        // This would be an API call in a real implementation
        // await apiRequest.patch(`/api/mining/api-keys/${editingId}`, formData);
        
        // For demonstration purposes, update the local state
        setApiKeys(apiKeys.map(key => 
          key.id === editingId ? {
            ...key,
            service: formData.service,
            name: formData.name,
            apiKey: formData.apiKey,
            apiSecret: formData.apiSecret,
            organizationId: formData.organizationId,
            description: formData.description
          } : key
        ));
        
        toast({
          title: 'API Key Updated',
          description: 'The API key has been updated successfully.',
          variant: "default"
        });
      } else {
        // This would be an API call in a real implementation
        // const response = await apiRequest.post('/api/mining/api-keys', formData);
        
        // For demonstration purposes, create a new key in the local state
        const newKey: ApiKey = {
          id: `${Date.now()}`,
          service: formData.service,
          name: formData.name,
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret,
          organizationId: formData.organizationId,
          description: formData.description,
          isActive: true,
          createdAt: new Date().toISOString()
        };
        
        setApiKeys([...apiKeys, newKey]);
        
        toast({
          title: 'API Key Added',
          description: 'The API key has been added successfully.',
          variant: "default"
        });
      }
      
      // Reset form and state
      setFormData({
        service: 'mining-rig-rentals',
        name: '',
        apiKey: '',
        apiSecret: '',
        organizationId: '',
        description: ''
      });
      setIsAdding(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to save API key. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const editApiKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    if (!key) return;
    
    setFormData({
      service: key.service,
      name: key.name,
      apiKey: key.apiKey.includes('•') ? '' : key.apiKey,
      apiSecret: key.apiSecret && !key.apiSecret.includes('•') ? key.apiSecret : '',
      organizationId: key.organizationId && !key.organizationId.includes('•') ? key.organizationId : '',
      description: key.description || ''
    });
    
    setIsEditing(true);
    setEditingId(id);
    setIsAdding(true);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: 'The text has been copied to your clipboard.',
      variant: "default"
    });
  };
  
  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'mining-rig-rentals':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
      case 'nicehash':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>;
      case 'unmineable':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"></path><path d="M6 18h12"></path><path d="M6 14h12"></path></svg>;
      default:
        return <Key className="h-6 w-6 text-gray-500" />;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">API Key Management</h1>
          <p className="text-sm text-muted-foreground">Manage your mining service API keys</p>
        </div>
        <Button 
          onClick={() => {
            setIsAdding(true);
            setIsEditing(false);
            setEditingId(null);
            setFormData({
              service: 'mining-rig-rentals',
              name: '',
              apiKey: '',
              apiSecret: '',
              organizationId: '',
              description: ''
            });
          }}
          disabled={isLoading}
          className="bg-cyan-700 hover:bg-cyan-600 text-white"
        >
          <Key className="h-4 w-4 mr-2" />
          Add New API Key
        </Button>
      </div>

      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit API Key' : 'Add New API Key'}</CardTitle>
            <CardDescription>
              {isEditing 
                ? 'Update your existing API key details' 
                : 'Add a new API key to connect with mining services'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <div className="relative">
                <select 
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="mining-rig-rentals">Mining Rig Rentals</option>
                  <option value="nicehash">NiceHash</option>
                  <option value="unmineable">Unmineable</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My API Key"
              />
              <p className="text-xs text-muted-foreground">A friendly name to identify this API key</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input 
                id="apiKey"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleInputChange}
                placeholder="Enter your API key"
                type="password"
              />
            </div>
            
            {formData.service !== 'unmineable' && (
              <div className="space-y-2">
                <Label htmlFor="apiSecret">API Secret</Label>
                <Input 
                  id="apiSecret"
                  name="apiSecret"
                  value={formData.apiSecret || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your API secret"
                  type="password"
                />
              </div>
            )}
            
            {formData.service === 'nicehash' && (
              <div className="space-y-2">
                <Label htmlFor="organizationId">Organization ID</Label>
                <Input 
                  id="organizationId"
                  name="organizationId"
                  value={formData.organizationId || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your NiceHash organization ID"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input 
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="What this API key is used for"
              />
            </div>
            
            <div className="pt-2 space-y-2">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div className="text-sm">
                  <p>API keys are sensitive credentials. They will be securely stored and never displayed in full.</p>
                </div>
              </div>
              
              {formData.service === 'mining-rig-rentals' && (
                <div className="border rounded-md p-3 text-sm">
                  <p className="mb-1 font-semibold">How to get Mining Rig Rentals API Keys:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Log into your <a href="https://www.miningrigrentals.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mining Rig Rentals account</a></li>
                    <li>Go to Account -&gt; API Keys</li>
                    <li>Create a new API key and note your key and secret</li>
                  </ol>
                </div>
              )}
              
              {formData.service === 'nicehash' && (
                <div className="border rounded-md p-3 text-sm">
                  <p className="mb-1 font-semibold">How to get NiceHash API Keys:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Log into your <a href="https://www.nicehash.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">NiceHash account</a></li>
                    <li>Go to Settings -&gt; API Keys</li>
                    <li>Create a new API key with appropriate permissions</li>
                    <li>Note your key, secret, and organization ID</li>
                  </ol>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAdding(false);
                setIsEditing(false);
                setEditingId(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveApiKey}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update API Key' : 'Save API Key'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All Keys</TabsTrigger>
              <TabsTrigger value="mining-rig-rentals">Mining Rig Rentals</TabsTrigger>
              <TabsTrigger value="nicehash">NiceHash</TabsTrigger>
              <TabsTrigger value="unmineable">Unmineable</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {apiKeys.length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">No API Keys Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You haven't added any API keys yet. Add your first API key to get started with mining services.
                    </p>
                    <Button 
                      onClick={() => setIsAdding(true)}
                      disabled={isLoading}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Add API Key
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                apiKeys.map(key => (
                  <Card key={key.id} className={!key.isActive ? 'opacity-60' : undefined}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getServiceIcon(key.service)}
                          <div className="ml-2">
                            <CardTitle className="text-lg">{key.name}</CardTitle>
                            <CardDescription>
                              {key.service === 'mining-rig-rentals' 
                                ? 'Mining Rig Rentals' 
                                : key.service === 'nicehash' 
                                  ? 'NiceHash' 
                                  : 'Unmineable'}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {testResults[key.id] && (
                            <div className={`mr-3 text-sm ${testResults[key.id].success ? 'text-green-500' : 'text-red-500'}`}>
                              {testResults[key.id].success ? (
                                <Check className="h-4 w-4 inline mr-1" />
                              ) : (
                                <X className="h-4 w-4 inline mr-1" />
                              )}
                              {testResults[key.id].success ? 'Valid' : 'Invalid'}
                            </div>
                          )}
                          <Switch 
                            checked={key.isActive} 
                            onCheckedChange={(checked) => toggleApiKeyStatus(key.id, checked)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">API Key</div>
                          <div className="flex items-center">
                            <div className="text-sm font-mono mr-2">{key.apiKey}</div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(key.apiKey)}
                              disabled={key.apiKey.includes('•')}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span className="sr-only">Copy</span>
                            </Button>
                          </div>
                        </div>
                        
                        {key.apiSecret && (
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">API Secret</div>
                            <div className="flex items-center">
                              <div className="text-sm font-mono mr-2">{key.apiSecret}</div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => key.apiSecret ? copyToClipboard(key.apiSecret) : null}
                                disabled={!key.apiSecret || key.apiSecret.includes('•')}
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span className="sr-only">Copy</span>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {key.organizationId && (
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Organization ID</div>
                          <div className="flex items-center">
                            <div className="text-sm font-mono mr-2">{key.organizationId}</div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(key.organizationId)}
                              disabled={key.organizationId.includes('•')}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span className="sr-only">Copy</span>
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {key.description && (
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Description</div>
                          <div className="text-sm">{key.description}</div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div>
                          Created: {new Date(key.createdAt).toLocaleDateString()}
                        </div>
                        {key.lastUsed && (
                          <div>
                            Last used: {new Date(key.lastUsed).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mr-2"
                          onClick={() => testApiKey(key.id)}
                          disabled={isLoading || !key.isActive}
                        >
                          <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                          Test Connection
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteApiKey(key.id)}
                          disabled={isLoading}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => editApiKey(key.id)}
                        disabled={isLoading}
                      >
                        <Shield className="h-3.5 w-3.5 mr-1" />
                        Edit Key
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="mining-rig-rentals" className="space-y-4">
              {apiKeys.filter(key => key.service === 'mining-rig-rentals').length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Mining Rig Rentals API Keys</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add a Mining Rig Rentals API key to connect to the service.
                    </p>
                    <Button 
                      onClick={() => {
                        setIsAdding(true);
                        setFormData({...formData, service: 'mining-rig-rentals'});
                      }}
                      disabled={isLoading}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Add Mining Rig Rentals API Key
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                apiKeys
                  .filter(key => key.service === 'mining-rig-rentals')
                  .map(key => (
                    <Card key={key.id} className={!key.isActive ? 'opacity-60' : undefined}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getServiceIcon(key.service)}
                            <div className="ml-2">
                              <CardTitle className="text-lg">{key.name}</CardTitle>
                              <CardDescription>Mining Rig Rentals</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {testResults[key.id] && (
                              <div className={`mr-3 text-sm ${testResults[key.id].success ? 'text-green-500' : 'text-red-500'}`}>
                                {testResults[key.id].success ? (
                                  <Check className="h-4 w-4 inline mr-1" />
                                ) : (
                                  <X className="h-4 w-4 inline mr-1" />
                                )}
                                {testResults[key.id].success ? 'Valid' : 'Invalid'}
                              </div>
                            )}
                            <Switch 
                              checked={key.isActive} 
                              onCheckedChange={(checked) => toggleApiKeyStatus(key.id, checked)}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pb-2">
                        {/* Same content as in the 'all' tab */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">API Key</div>
                            <div className="flex items-center">
                              <div className="text-sm font-mono mr-2">{key.apiKey}</div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(key.apiKey)}
                                disabled={key.apiKey.includes('•')}
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span className="sr-only">Copy</span>
                              </Button>
                            </div>
                          </div>
                          
                          {key.apiSecret && (
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">API Secret</div>
                              <div className="flex items-center">
                                <div className="text-sm font-mono mr-2">{key.apiSecret}</div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(key.apiSecret)}
                                  disabled={key.apiSecret.includes('•')}
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                  <span className="sr-only">Copy</span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {key.description && (
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Description</div>
                            <div className="text-sm">{key.description}</div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <div>
                            Created: {new Date(key.createdAt).toLocaleDateString()}
                          </div>
                          {key.lastUsed && (
                            <div>
                              Last used: {new Date(key.lastUsed).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mr-2"
                            onClick={() => testApiKey(key.id)}
                            disabled={isLoading || !key.isActive}
                          >
                            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                            Test Connection
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteApiKey(key.id)}
                            disabled={isLoading}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => editApiKey(key.id)}
                          disabled={isLoading}
                        >
                          <Shield className="h-3.5 w-3.5 mr-1" />
                          Edit Key
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              )}
            </TabsContent>
            
            {/* Similar content for other tabs (nicehash, unmineable) */}
            <TabsContent value="nicehash" className="space-y-4">
              {apiKeys.filter(key => key.service === 'nicehash').length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">No NiceHash API Keys</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add a NiceHash API key to connect to the service.
                    </p>
                    <Button 
                      onClick={() => {
                        setIsAdding(true);
                        setFormData({...formData, service: 'nicehash'});
                      }}
                      disabled={isLoading}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Add NiceHash API Key
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                apiKeys
                  .filter(key => key.service === 'nicehash')
                  .map(key => (
                    // Similar card component as for mining-rig-rentals
                    <Card key={key.id} className={!key.isActive ? 'opacity-60' : undefined}>
                      {/* Card content similar to mining-rig-rentals */}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getServiceIcon(key.service)}
                            <div className="ml-2">
                              <CardTitle className="text-lg">{key.name}</CardTitle>
                              <CardDescription>NiceHash</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {testResults[key.id] && (
                              <div className={`mr-3 text-sm ${testResults[key.id].success ? 'text-green-500' : 'text-red-500'}`}>
                                {testResults[key.id].success ? (
                                  <Check className="h-4 w-4 inline mr-1" />
                                ) : (
                                  <X className="h-4 w-4 inline mr-1" />
                                )}
                                {testResults[key.id].success ? 'Valid' : 'Invalid'}
                              </div>
                            )}
                            <Switch 
                              checked={key.isActive} 
                              onCheckedChange={(checked) => toggleApiKeyStatus(key.id, checked)}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pb-2">
                        {/* Same as before */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">API Key</div>
                            <div className="flex items-center">
                              <div className="text-sm font-mono mr-2">{key.apiKey}</div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(key.apiKey)}
                                disabled={key.apiKey.includes('•')}
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span className="sr-only">Copy</span>
                              </Button>
                            </div>
                          </div>
                          
                          {key.apiSecret && (
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">API Secret</div>
                              <div className="flex items-center">
                                <div className="text-sm font-mono mr-2">{key.apiSecret}</div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyToClipboard(key.apiSecret)}
                                  disabled={key.apiSecret.includes('•')}
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                  <span className="sr-only">Copy</span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {key.organizationId && (
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Organization ID</div>
                            <div className="flex items-center">
                              <div className="text-sm font-mono mr-2">{key.organizationId}</div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => key.organizationId ? copyToClipboard(key.organizationId) : null}
                                disabled={!key.organizationId || key.organizationId.includes('•')}
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span className="sr-only">Copy</span>
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {key.description && (
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Description</div>
                            <div className="text-sm">{key.description}</div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <div>
                            Created: {new Date(key.createdAt).toLocaleDateString()}
                          </div>
                          {key.lastUsed && (
                            <div>
                              Last used: {new Date(key.lastUsed).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        {/* Same buttons */}
                        <div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mr-2"
                            onClick={() => testApiKey(key.id)}
                            disabled={isLoading || !key.isActive}
                          >
                            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                            Test Connection
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteApiKey(key.id)}
                            disabled={isLoading}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => editApiKey(key.id)}
                          disabled={isLoading}
                        >
                          <Shield className="h-3.5 w-3.5 mr-1" />
                          Edit Key
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="unmineable" className="space-y-4">
              {apiKeys.filter(key => key.service === 'unmineable').length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center">
                    <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Unmineable API Keys</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add an Unmineable API key to connect to the service.
                    </p>
                    <Button 
                      onClick={() => {
                        setIsAdding(true);
                        setFormData({...formData, service: 'unmineable'});
                      }}
                      disabled={isLoading}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Add Unmineable API Key
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                apiKeys
                  .filter(key => key.service === 'unmineable')
                  .map(key => (
                    // Similar card component as for mining-rig-rentals
                    <Card key={key.id} className={!key.isActive ? 'opacity-60' : undefined}>
                      {/* Card content similar to mining-rig-rentals */}
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getServiceIcon(key.service)}
                            <div className="ml-2">
                              <CardTitle className="text-lg">{key.name}</CardTitle>
                              <CardDescription>Unmineable</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {testResults[key.id] && (
                              <div className={`mr-3 text-sm ${testResults[key.id].success ? 'text-green-500' : 'text-red-500'}`}>
                                {testResults[key.id].success ? (
                                  <Check className="h-4 w-4 inline mr-1" />
                                ) : (
                                  <X className="h-4 w-4 inline mr-1" />
                                )}
                                {testResults[key.id].success ? 'Valid' : 'Invalid'}
                              </div>
                            )}
                            <Switch 
                              checked={key.isActive} 
                              onCheckedChange={(checked) => toggleApiKeyStatus(key.id, checked)}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pb-2">
                        {/* Same as before */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">API Key</div>
                            <div className="flex items-center">
                              <div className="text-sm font-mono mr-2">{key.apiKey}</div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(key.apiKey)}
                                disabled={key.apiKey.includes('•')}
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span className="sr-only">Copy</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {key.description && (
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Description</div>
                            <div className="text-sm">{key.description}</div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <div>
                            Created: {new Date(key.createdAt).toLocaleDateString()}
                          </div>
                          {key.lastUsed && (
                            <div>
                              Last used: {new Date(key.lastUsed).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        {/* Same buttons */}
                        <div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mr-2"
                            onClick={() => testApiKey(key.id)}
                            disabled={isLoading || !key.isActive}
                          >
                            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                            Test Connection
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteApiKey(key.id)}
                            disabled={isLoading}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => editApiKey(key.id)}
                          disabled={isLoading}
                        >
                          <Shield className="h-3.5 w-3.5 mr-1" />
                          Edit Key
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              )}
            </TabsContent>
          </Tabs>
          
          <div className="border rounded-md p-4">
            <div className="flex items-start">
              <ExternalLink className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium mb-1">Mining Rig Rentals Wrapper</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  For advanced users, you can use the <a href="https://github.com/G-Kumaran/miningrig-rentals-wrapper" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mining Rig Rentals Wrapper</a> to create your own configurations and API integrations.
                </p>
                <div className="text-xs text-muted-foreground">
                  This allows for custom rental profiles, automated bidding strategies, and more.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}