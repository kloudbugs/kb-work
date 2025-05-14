import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DeviceTable } from '@/components/ui/DeviceTable';
import { AddDeviceDialog } from '@/components/dialogs/AddDeviceDialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getDevices } from '@/lib/miningClient';
import { PlusCircle } from 'lucide-react';

export default function Devices() {
  const [showAddDeviceDialog, setShowAddDeviceDialog] = useState(false);
  
  // Query for devices
  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['/api/devices'],
  });
  
  return (
    <MainLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Devices</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and monitor all connected mining devices
          </p>
        </div>
        
        <Button 
          onClick={() => setShowAddDeviceDialog(true)}
          className="flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Device
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Connected Devices
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {isLoading 
              ? "Loading devices..." 
              : devices.length === 0 
                ? "No devices connected to your mining network yet" 
                : `${devices.length} device${devices.length === 1 ? '' : 's'} in your mining network`
            }
          </p>
        </div>
        
        <DeviceTable devices={devices} />
      </div>
      
      <AddDeviceDialog 
        open={showAddDeviceDialog} 
        onOpenChange={setShowAddDeviceDialog} 
      />
    </MainLayout>
  );
}
