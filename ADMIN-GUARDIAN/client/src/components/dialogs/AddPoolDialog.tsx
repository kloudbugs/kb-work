import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPool } from '@/lib/miningClient';
import { useToast } from '@/hooks/use-toast';
import { Server } from 'lucide-react';

interface AddPoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPoolDialog({ open, onOpenChange }: AddPoolDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('x');
  const [fee, setFee] = useState('2.0');
  
  const resetForm = () => {
    setName('');
    setUrl('');
    setUsername('');
    setPassword('x');
    setFee('2.0');
  };
  
  const addPoolMutation = useMutation({
    mutationFn: () => addPool({
      name,
      url,
      username,
      password,
      fee: parseFloat(fee),
      algorithm: 'sha256',
      status: 'standby',
      priority: 2
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pools'] });
      toast({
        title: "Pool Added",
        description: `${name} has been added to your mining pool configuration`,
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Pool",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPoolMutation.mutate();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center mb-2">
            <div className="mr-2 h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle>Add Mining Pool</DialogTitle>
          </div>
          <DialogDescription>
            Add a new mining pool to your configuration. You can switch between pools anytime.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Pool Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Slush Pool" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">Stratum URL</Label>
              <Input 
                id="url" 
                placeholder="e.g., stratum+tcp://stratum.slushpool.com:3333" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                The pool's stratum connection URL including port
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username / Worker</Label>
              <Input 
                id="username" 
                placeholder="e.g., yourUsername.worker1" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Usually your username or wallet address, sometimes with worker name
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                placeholder="e.g., x" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Many pools use "x" as the default password
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fee">Pool Fee (%)</Label>
              <Input 
                id="fee" 
                type="number" 
                min="0" 
                max="10" 
                step="0.1" 
                placeholder="e.g., 2.0" 
                value={fee} 
                onChange={(e) => setFee(e.target.value)}
                required
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addPoolMutation.isPending || !name || !url || !username}
            >
              {addPoolMutation.isPending ? "Adding..." : "Add Pool"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
