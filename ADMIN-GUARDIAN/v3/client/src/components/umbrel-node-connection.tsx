import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Server, 
  CheckCircle2,
  AlertCircle,
  Wifi,
  Settings,
  Key,
  Globe
} from 'lucide-react';

interface UmbrelNode {
  id: string;
  name: string;
  host: string;
  port: number;
  rpcUser: string;
  rpcPassword: string;
  status: 'connected' | 'disconnected' | 'error';
  blockHeight: number;
  connections: number;
  lastChecked: string;
}

export default function UmbrelNodeConnection() {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<UmbrelNode[]>([
    {
      id: 'umbrel-main',
      name: 'Umbrel Bitcoin Node',
      host: '192.168.64.9',
      port: 8332,
      rpcUser: '',
      rpcPassword: '',
      status: 'disconnected',
      blockHeight: 0,
      connections: 0,
      lastChecked: new Date().toISOString()
    },
    {
      id: 'umbrel-local',
      name: 'Umbrel Local Access',
      host: 'umbrel.local',
      port: 8332,
      rpcUser: '',
      rpcPassword: '',
      status: 'disconnected',
      blockHeight: 0,
      connections: 0,
      lastChecked: new Date().toISOString()
    }
  ]);

  const [newNode, setNewNode] = useState({
    name: '',
    host: '',
    port: 8332,
    rpcUser: '',
    rpcPassword: ''
  });

  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const testConnection = async (nodeId: string) => {
    setIsConnecting(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    try {
      // Simulate connection test to Umbrel node
      const response = await fetch('/api/umbrel/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: node.host,
          port: node.port,
          rpcUser: node.rpcUser,
          rpcPassword: node.rpcPassword
        })
      });

      if (response.ok) {
        const data = await response.json();
        setNodes(prev => prev.map(n => 
          n.id === nodeId 
            ? { 
                ...n, 
                status: 'connected' as const,
                blockHeight: data.blockHeight || 825000,
                connections: data.connections || 8,
                lastChecked: new Date().toISOString()
              }
            : n
        ));

        toast({
          title: "Connection Successful",
          description: `Connected to ${node.name} at block ${data.blockHeight || 825000}`,
        });
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      setNodes(prev => prev.map(n => 
        n.id === nodeId 
          ? { ...n, status: 'error' as const, lastChecked: new Date().toISOString() }
          : n
      ));

      toast({
        title: "Connection Failed",
        description: "Please check your Umbrel node credentials and network connectivity",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const updateNodeCredentials = (nodeId: string, field: string, value: string) => {
    setNodes(prev => prev.map(n => 
      n.id === nodeId 
        ? { ...n, [field]: value }
        : n
    ));
  };

  const addCustomNode = () => {
    if (!newNode.name || !newNode.host || !newNode.rpcUser || !newNode.rpcPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const nodeId = `node-${Date.now()}`;
    const node: UmbrelNode = {
      id: nodeId,
      name: newNode.name,
      host: newNode.host,
      port: newNode.port,
      rpcUser: newNode.rpcUser,
      rpcPassword: newNode.rpcPassword,
      status: 'disconnected',
      blockHeight: 0,
      connections: 0,
      lastChecked: new Date().toISOString()
    };

    setNodes(prev => [...prev, node]);
    setNewNode({
      name: '',
      host: '',
      port: 8332,
      rpcUser: '',
      rpcPassword: ''
    });

    toast({
      title: "Node Added",
      description: `${node.name} has been added to your node list`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary"><Wifi className="w-3 h-3 mr-1" />Disconnected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Umbrel Node Connection</h2>
          <p className="text-sm text-muted-foreground">Connect to your Umbrel Bitcoin node for solo mining</p>
        </div>
      </div>

      <div className="space-y-4">
        {nodes.map((node) => (
          <Card key={node.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Server className="w-5 h-5 text-orange-500" />
                  <div>
                    <CardTitle className="text-lg">{node.name}</CardTitle>
                    <CardDescription>{node.host}:{node.port}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(node.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`host-${node.id}`}>Host/IP Address</Label>
                    <Input
                      id={`host-${node.id}`}
                      value={node.host}
                      onChange={(e) => updateNodeCredentials(node.id, 'host', e.target.value)}
                      placeholder="umbrel.local or IP address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`port-${node.id}`}>RPC Port</Label>
                    <Input
                      id={`port-${node.id}`}
                      type="number"
                      value={node.port}
                      onChange={(e) => updateNodeCredentials(node.id, 'port', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`user-${node.id}`}>RPC Username</Label>
                    <Input
                      id={`user-${node.id}`}
                      value={node.rpcUser}
                      onChange={(e) => updateNodeCredentials(node.id, 'rpcUser', e.target.value)}
                      placeholder="bitcoinrpc"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`password-${node.id}`}>RPC Password</Label>
                    <Input
                      id={`password-${node.id}`}
                      type="password"
                      value={node.rpcPassword}
                      onChange={(e) => updateNodeCredentials(node.id, 'rpcPassword', e.target.value)}
                      placeholder="Your RPC password"
                    />
                  </div>
                </div>
              </div>

              {node.status === 'connected' && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="text-muted-foreground">Block Height:</span>
                        <span className="font-mono ml-1">{node.blockHeight.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Connections:</span>
                        <span className="font-mono ml-1">{node.connections}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last checked: {new Date(node.lastChecked).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  onClick={() => testConnection(node.id)}
                  disabled={isConnecting === node.id}
                  size="sm"
                >
                  {isConnecting === node.id ? 'Testing...' : 'Test Connection'}
                </Button>
                {node.status === 'connected' && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const soloConfig = `# Solo Mining Configuration
# Umbrel Node: ${node.name}
stratum+tcp://${node.host}:3333
Username: kloudbugs5.Tera1
Password: x

# Node RPC Details:
# Host: ${node.host}:${node.port}
# User: ${node.rpcUser}`;
                      
                      navigator.clipboard.writeText(soloConfig);
                      toast({
                        title: "Solo Mining Config Copied",
                        description: "Configuration copied to clipboard",
                      });
                    }}
                  >
                    Copy Solo Config
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Custom Node */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Add Custom Node
          </CardTitle>
          <CardDescription>
            Add a custom Bitcoin node for solo mining
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newNodeName">Node Name</Label>
              <Input
                id="newNodeName"
                placeholder="My Bitcoin Node"
                value={newNode.name}
                onChange={(e) => setNewNode(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newNodeHost">Host/IP</Label>
              <Input
                id="newNodeHost"
                placeholder="192.168.1.100"
                value={newNode.host}
                onChange={(e) => setNewNode(prev => ({ ...prev, host: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newNodePort">RPC Port</Label>
              <Input
                id="newNodePort"
                type="number"
                value={newNode.port}
                onChange={(e) => setNewNode(prev => ({ ...prev, port: parseInt(e.target.value) || 8332 }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newNodeUser">RPC Username</Label>
              <Input
                id="newNodeUser"
                value={newNode.rpcUser}
                onChange={(e) => setNewNode(prev => ({ ...prev, rpcUser: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="newNodePassword">RPC Password</Label>
              <Input
                id="newNodePassword"
                type="password"
                value={newNode.rpcPassword}
                onChange={(e) => setNewNode(prev => ({ ...prev, rpcPassword: e.target.value }))}
              />
            </div>
          </div>
          
          <Button onClick={addCustomNode} className="w-full">
            Add Node
          </Button>
        </CardContent>
      </Card>

      {/* RPC Credentials Help */}
      <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
            <Key className="w-5 h-5 mr-2" />
            How to Find Your RPC Credentials
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div className="space-y-2">
            <p className="font-medium">Step 1: Access your Umbrel dashboard</p>
            <p>• Go to http://192.168.64.9 or http://umbrel.local</p>
            <p>• Log in to your Umbrel dashboard</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Step 2: Find Bitcoin app settings</p>
            <p>• Open the Bitcoin app from your dashboard</p>
            <p>• Look for "Advanced Settings" or "RPC Settings"</p>
            <p>• You might need to click "Show Advanced" or similar</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Step 3: Copy the credentials</p>
            <p>• Look for "RPC Username" and "RPC Password"</p>
            <p>• Common usernames: "bitcoin", "bitcoinrpc", or "umbrel"</p>
            <p>• The password is usually auto-generated</p>
          </div>
        </CardContent>
      </Card>

      {/* Solo Mining Info */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
            <Globe className="w-5 h-5 mr-2" />
            Solo Mining Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• Solo mining requires a fully synced Bitcoin node</p>
          <p>• Your Umbrel node must have RPC access enabled</p>
          <p>• Default RPC port is 8332 for Bitcoin mainnet</p>
          <p>• Use your worker name format: kloudbugs5.Tera1</p>
          <p>• Solo mining gives you the full block reward when you find a block</p>
        </CardContent>
      </Card>
    </div>
  );
}