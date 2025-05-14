import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDevice } from '@/lib/miningClient';
import { useToast } from '@/hooks/use-toast';
import { Cpu } from 'lucide-react';

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDeviceDialog({ open, onOpenChange }: AddDeviceDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [type, setType] = useState('Computer');
  const [cpuAllocation, setCpuAllocation] = useState(70);
  const [ramAllocation, setRamAllocation] = useState(60);
  
  const resetForm = () => {
    setName('');
    setIpAddress('');
    setType('Computer');
    setCpuAllocation(70);
    setRamAllocation(60);
  };
  
  const addDeviceMutation = useMutation({
    mutationFn: () => addDevice({
      name,
      ipAddress,
      type,
      cpuAllocation,
      ramAllocation,
      status: 'active'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: "Device Added",
        description: "New device has been added to your mining network",
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Device",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDeviceMutation.mutate();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center mb-2">
            <div className="mr-2 h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle>Add New Device</DialogTitle>
          </div>
          <DialogDescription>
            Connect a new device to your distributed mining network. Once added, the device will automatically join the mining pool.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Office PC" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input 
                id="ip" 
                placeholder="e.g., 192.168.1.105" 
                value={ipAddress} 
                onChange={(e) => setIpAddress(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Device Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer">Computer</SelectItem>
                  <SelectItem value="ZIG Modem">ZIG Modem</SelectItem>
                  <SelectItem value="Single-Board Computer">Single-Board Computer</SelectItem>
                  <SelectItem value="Server">Server</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Resource Allocation</Label>
              
              <div className="mt-3">
                <div className="flex items-center mb-2">
                  <span className="text-sm w-16">CPU:</span>
                  <Slider 
                    value={[cpuAllocation]} 
                    onValueChange={(value) => setCpuAllocation(value[0])} 
                    max={100} 
                    step={5}
                    className="w-full mx-2"
                  />
                  <span className="text-sm w-12 text-right">{cpuAllocation}%</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm w-16">RAM:</span>
                  <Slider 
                    value={[ramAllocation]} 
                    onValueChange={(value) => setRamAllocation(value[0])} 
                    max={100} 
                    step={5}
                    className="w-full mx-2"
                  />
                  <span className="text-sm w-12 text-right">{ramAllocation}%</span>
                </div>
              </div>
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
              disabled={addDeviceMutation.isPending || !name || !ipAddress}
            >
              {addDeviceMutation.isPending ? "Adding..." : "Add Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddDeviceDialog;
