import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { optimizeDevice, pauseDevice, resumeDevice, deleteDevice } from '@/lib/miningClient';
import { useToast } from '@/hooks/use-toast';
import { formatHashRate } from '@/lib/utils';
import { 
  BadgeCheck, 
  Cpu, 
  Monitor, 
  Router, 
  Server, 
  Smartphone, 
  Sparkles,
  Zap,
  Shield,
  RefreshCw,
  PowerOff,
  Play,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Device {
  id: number;
  name: string;
  ipAddress: string;
  type: string;
  hashRate: number;
  status: string;
  cpuAllocation: number;
  ramAllocation: number;
}

interface DeviceTableProps {
  devices: Device[];
  className?: string;
}

export function DeviceTable({ devices, className }: DeviceTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [particles, setParticles] = useState<{x: number, y: number, size: number, duration: number}[]>([]);
  
  useEffect(() => {
    // Generate cosmic particles
    const newParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 8 + 4
    }));
    setParticles(newParticles);
  }, []);
  
  const getDeviceIcon = (type: string, status: string) => {
    const IconComponent = (() => {
      switch (type.toLowerCase()) {
        case 'computer':
          return Monitor;
        case 'zig modem':
          return Router;
        case 'single-board computer':
          return Cpu;
        case 'server':
          return Server;
        default:
          return Smartphone;
      }
    })();
    
    return (
      <motion.div
        className="relative"
        animate={status === 'active' ? {
          scale: [1, 1.1, 1],
          filter: [
            'drop-shadow(0 0 3px rgba(168, 85, 247, 0.4))',
            'drop-shadow(0 0 6px rgba(168, 85, 247, 0.7))',
            'drop-shadow(0 0 3px rgba(168, 85, 247, 0.4))'
          ]
        } : undefined}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <IconComponent className="h-6 w-6" />
        {status === 'active' && (
          <motion.div
            className="absolute -inset-1 bg-purple-500 rounded-full opacity-0"
            animate={{ 
              opacity: [0, 0.4, 0],
              scale: [0.6, 1.2, 0.6]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2, 
              ease: "easeInOut" 
            }}
          />
        )}
      </motion.div>
    );
  };
  
  const optimizeMutation = useMutation({
    mutationFn: optimizeDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: "Device Optimized",
        description: "Device resources have been optimized for mining",
      });
    },
    onError: (error) => {
      toast({
        title: "Optimization Failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const pauseMutation = useMutation({
    mutationFn: pauseDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: "Device Paused",
        description: "Mining has been paused on this device",
      });
    },
    onError: (error) => {
      toast({
        title: "Pause Failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const resumeMutation = useMutation({
    mutationFn: resumeDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: "Device Resumed",
        description: "Mining has been resumed on this device",
      });
    },
    onError: (error) => {
      toast({
        title: "Resume Failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: "Device Removed",
        description: "Device has been removed from the mining network",
      });
    },
    onError: (error) => {
      toast({
        title: "Remove Failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const getStatusComponent = (status: string) => {
    if (status === 'active') {
      return (
        <motion.span 
          className="px-2 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full 
                    bg-green-900/40 text-green-400 border border-green-500/40 shadow-inner shadow-green-500/10 backdrop-blur-sm"
          animate={{
            boxShadow: [
              'inset 0 0 3px rgba(74, 222, 128, 0.2), 0 0 3px rgba(74, 222, 128, 0.2)',
              'inset 0 0 6px rgba(74, 222, 128, 0.4), 0 0 6px rgba(74, 222, 128, 0.4)',
              'inset 0 0 3px rgba(74, 222, 128, 0.2), 0 0 3px rgba(74, 222, 128, 0.2)'
            ]
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          >
            <Sparkles className="h-3 w-3 text-green-400" />
          </motion.div>
          <span>Active</span>
        </motion.span>
      );
    } else if (status === 'paused') {
      return (
        <motion.span 
          className="px-2 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full 
                    bg-amber-900/40 text-amber-400 border border-amber-500/40 shadow-inner shadow-amber-500/10 backdrop-blur-sm"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <PowerOff className="h-3 w-3 text-amber-400" />
          <span>Paused</span>
        </motion.span>
      );
    } else {
      return (
        <span className="px-2 py-1 inline-flex items-center space-x-1 text-xs leading-5 font-semibold rounded-full 
                      bg-gray-800/40 text-gray-400 border border-gray-700/40 shadow-inner shadow-gray-700/10 backdrop-blur-sm">
          <Shield className="h-3 w-3 text-gray-400" />
          <span>Inactive</span>
        </span>
      );
    }
  };

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-lg">
        {/* Cosmic background with particles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-950/20 to-indigo-950/30"
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          
          {/* Grid lines */}
          <motion.div 
            className="absolute inset-0 opacity-10" 
            animate={{ opacity: [0.05, 0.1, 0.05] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(168, 85, 247, 0.5) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(168, 85, 247, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Cosmic particles */}
          {particles.map((particle, i) => (
            <motion.div
              key={`device-table-particle-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                filter: 'blur(0.5px)'
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: particle.duration,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Energy beams */}
          {[1, 2, 3].map((idx) => (
            <motion.div
              key={`device-table-beam-${idx}`}
              className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
              style={{
                top: `${25 * idx}%`,
                opacity: 0.6,
                left: 0
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                width: ['0%', '100%', '0%']
              }}
              transition={{
                repeat: Infinity,
                duration: 7 + idx,
                ease: "easeInOut",
                delay: idx * 1.5
              }}
            />
          ))}
        </div>
        
        {/* Table with cosmic styling */}
        <div className="overflow-x-auto relative z-10 p-1 backdrop-blur-sm">
          <Table className="relative">
            <TableHeader>
              <TableRow className="border-purple-500/30 hover:bg-purple-900/20">
                <TableHead className="text-purple-300 font-medium">
                  <motion.div 
                    className="flex items-center space-x-1"
                    animate={{ 
                      textShadow: [
                        '0 0 3px rgba(168, 85, 247, 0.3)',
                        '0 0 5px rgba(168, 85, 247, 0.5)',
                        '0 0 3px rgba(168, 85, 247, 0.3)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Server className="inline h-4 w-4 mr-1" />
                    DEVICE
                  </motion.div>
                </TableHead>
                <TableHead className="text-purple-300 font-medium">
                  <motion.div 
                    className="flex items-center space-x-1"
                    animate={{ 
                      textShadow: [
                        '0 0 3px rgba(168, 85, 247, 0.3)',
                        '0 0 5px rgba(168, 85, 247, 0.5)',
                        '0 0 3px rgba(168, 85, 247, 0.3)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Zap className="inline h-4 w-4 mr-1" />
                    HASH RATE
                  </motion.div>
                </TableHead>
                <TableHead className="text-purple-300 font-medium">
                  <motion.div 
                    className="flex items-center space-x-1"
                    animate={{ 
                      textShadow: [
                        '0 0 3px rgba(168, 85, 247, 0.3)',
                        '0 0 5px rgba(168, 85, 247, 0.5)',
                        '0 0 3px rgba(168, 85, 247, 0.3)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Shield className="inline h-4 w-4 mr-1" />
                    STATUS
                  </motion.div>
                </TableHead>
                <TableHead className="text-purple-300 font-medium">
                  <motion.div 
                    className="flex items-center space-x-1"
                    animate={{ 
                      textShadow: [
                        '0 0 3px rgba(168, 85, 247, 0.3)',
                        '0 0 5px rgba(168, 85, 247, 0.5)',
                        '0 0 3px rgba(168, 85, 247, 0.3)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Cpu className="inline h-4 w-4 mr-1" />
                    RESOURCES
                  </motion.div>
                </TableHead>
                <TableHead className="text-purple-300 font-medium">
                  <motion.div 
                    className="flex items-center space-x-1"
                    animate={{ 
                      textShadow: [
                        '0 0 3px rgba(168, 85, 247, 0.3)',
                        '0 0 5px rgba(168, 85, 247, 0.5)',
                        '0 0 3px rgba(168, 85, 247, 0.3)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <RefreshCw className="inline h-4 w-4 mr-1" />
                    ACTIONS
                  </motion.div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.length === 0 ? (
                <TableRow className="border-purple-500/30 hover:bg-purple-900/20">
                  <TableCell colSpan={5} className="text-center py-6 text-purple-300/70">
                    <motion.div
                      className="flex flex-col items-center"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          filter: [
                            'drop-shadow(0 0 3px rgba(168, 85, 247, 0.3))',
                            'drop-shadow(0 0 8px rgba(168, 85, 247, 0.7))',
                            'drop-shadow(0 0 3px rgba(168, 85, 247, 0.3))'
                          ]
                        }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      >
                        <Sparkles className="h-8 w-8 mb-2 text-purple-400" />
                      </motion.div>
                      <motion.span 
                        className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                        animate={{ 
                          textShadow: [
                            '0 0 3px rgba(168, 85, 247, 0.3)',
                            '0 0 6px rgba(168, 85, 247, 0.6)',
                            '0 0 3px rgba(168, 85, 247, 0.3)'
                          ] 
                        }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      >
                        No devices connected to KLOUD BUGS MINING COMMAND CENTER
                      </motion.span>
                      <motion.div 
                        className="mt-2 h-px w-40 bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0"
                        animate={{ 
                          opacity: [0.3, 0.7, 0.3],
                          width: ['60%', '80%', '60%']
                        }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </TableCell>
                </TableRow>
              ) : (
                devices.map((device) => (
                  <TableRow 
                    key={device.id} 
                    className="border-purple-500/30 relative"
                    onMouseEnter={() => setHoveredRow(device.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Hover effect */}
                    <AnimatePresence>
                      {hoveredRow === device.id && (
                        <motion.div 
                          className="absolute inset-0 bg-purple-500/10 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    <TableCell>
                      <div className="flex items-center">
                        <motion.div 
                          className="flex-shrink-0 h-10 w-10 rounded-lg bg-black/40 border border-purple-500/50 
                                   flex items-center justify-center text-purple-400 overflow-hidden relative"
                          whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}
                        >
                          {/* Inner glow effect */}
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/10"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                          />
                          
                          {/* Small stars in background */}
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                              key={`device-icon-star-${device.id}-${i}`}
                              className="absolute rounded-full bg-white"
                              style={{
                                width: `${Math.random() * 1.5 + 0.5}px`,
                                height: `${Math.random() * 1.5 + 0.5}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                filter: 'blur(0.5px)'
                              }}
                              animate={{
                                opacity: [0.3, 0.7, 0.3],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 1 + Math.random() * 2,
                                ease: "easeInOut",
                                delay: Math.random()
                              }}
                            />
                          ))}
                          
                          {getDeviceIcon(device.type, device.status)}
                        </motion.div>
                        <div className="ml-4">
                          <motion.div 
                            className="text-sm font-medium text-white relative inline-block"
                            animate={device.status === 'active' ? { 
                              textShadow: [
                                '0 0 2px rgba(139, 92, 246, 0.3)', 
                                '0 0 4px rgba(139, 92, 246, 0.5)', 
                                '0 0 2px rgba(139, 92, 246, 0.3)'
                              ] 
                            } : undefined}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          >
                            {device.name}
                            
                            {/* Animated underline for active devices */}
                            {device.status === 'active' && (
                              <motion.div 
                                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0"
                                animate={{ 
                                  opacity: [0.3, 0.7, 0.3],
                                  width: ['70%', '100%', '70%']
                                }}
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 2.5,
                                  ease: "easeInOut"
                                }}
                                style={{ left: "50%", transform: "translateX(-50%)" }}
                              />
                            )}
                          </motion.div>
                          
                          <div className="text-sm text-purple-300/70 font-mono">
                            {device.ipAddress}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <motion.div 
                        className="text-sm font-mono relative pl-1"
                        style={{ color: device.status === 'active' ? '#a855f7' : '#9ca3af' }}
                        animate={device.status === 'active' ? { 
                          textShadow: [
                            '0 0 2px rgba(139, 92, 246, 0.3)', 
                            '0 0 4px rgba(139, 92, 246, 0.5)', 
                            '0 0 2px rgba(139, 92, 246, 0.3)'
                          ] 
                        } : undefined}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      >
                        {formatHashRate(device.hashRate)}
                        
                        {/* Animated pulse dots for active devices */}
                        {device.status === 'active' && (
                          <motion.div 
                            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.6, 1, 0.6],
                              boxShadow: [
                                '0 0 2px rgba(139, 92, 246, 0.5)',
                                '0 0 5px rgba(139, 92, 246, 0.8)',
                                '0 0 2px rgba(139, 92, 246, 0.5)'
                              ]
                            }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          />
                        )}
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      {getStatusComponent(device.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center mb-1">
                          <span className="mr-2 text-xs text-purple-300/70">CPU:</span>
                          <div className="w-24 bg-black/60 backdrop-blur-sm rounded-full h-2 border border-purple-500/30 overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 rounded-full" 
                              style={{ width: `${device.cpuAllocation}%` }}
                              animate={device.status === 'active' ? { 
                                boxShadow: [
                                  'inset 0 0 3px rgba(139, 92, 246, 0.5)',
                                  'inset 0 0 6px rgba(139, 92, 246, 0.8)',
                                  'inset 0 0 3px rgba(139, 92, 246, 0.5)'
                                ]
                              } : undefined}
                              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-purple-300/70">{device.cpuAllocation}%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2 text-xs text-purple-300/70">RAM:</span>
                          <div className="w-24 bg-black/60 backdrop-blur-sm rounded-full h-2 border border-purple-500/30 overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-indigo-600/80 to-blue-600/80 rounded-full" 
                              style={{ width: `${device.ramAllocation}%` }}
                              animate={device.status === 'active' ? { 
                                boxShadow: [
                                  'inset 0 0 3px rgba(79, 70, 229, 0.5)',
                                  'inset 0 0 6px rgba(79, 70, 229, 0.8)',
                                  'inset 0 0 3px rgba(79, 70, 229, 0.5)'
                                ]
                              } : undefined}
                              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-purple-300/70">{device.ramAllocation}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-purple-400 border border-purple-500/50 bg-black/40
                                      hover:bg-purple-900/30 hover:text-purple-300"
                            onClick={() => optimizeMutation.mutate(device.id)}
                            disabled={optimizeMutation.isPending}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                              className="mr-1"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </motion.div>
                            Optimize
                          </Button>
                        </motion.div>
                        
                        {device.status === 'active' ? (
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-400 border border-red-500/50 bg-black/40
                                        hover:bg-red-900/30 hover:text-red-300"
                              onClick={() => pauseMutation.mutate(device.id)}
                              disabled={pauseMutation.isPending}
                            >
                              <PowerOff className="h-3.5 w-3.5 mr-1" />
                              Pause
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-400 border border-green-500/50 bg-black/40
                                        hover:bg-green-900/30 hover:text-green-300"
                              onClick={() => resumeMutation.mutate(device.id)}
                              disabled={resumeMutation.isPending}
                            >
                              <Play className="h-3.5 w-3.5 mr-1" />
                              Resume
                            </Button>
                          </motion.div>
                        )}
                        
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-gray-400 border border-gray-500/50 bg-black/40
                                      hover:bg-gray-900/30 hover:text-gray-300"
                            onClick={() => {
                              if (confirm('Are you sure you want to remove this device?')) {
                                deleteMutation.mutate(device.id);
                              }
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Remove
                          </Button>
                        </motion.div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DeviceTable;
