import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Switch 
} from '@/components/ui/switch';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  LayoutGrid, 
  Maximize2, 
  Minimize2, 
  Edit, 
  Plus, 
  X, 
  Move, 
  LayoutPanelTop, 
  Save, 
  RotateCcw, 
  Layout, 
  Wallet, 
  Bitcoin, 
  BarChart3, 
  Users, 
  Settings, 
  Laptop,
  MonitorSmartphone,
  BoxSelect,
  Layers,
  CopyPlus,
  Trash2,
  EyeOff,
  Eye,
  Bookmark,
  ListChecks,
  Database,
  CircleDollarSign,
  Cpu,
  ChevronUp,
  ChevronDown,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface MultiViewDashboardProps {
  className?: string;
}

// Available panel types
const PANEL_TYPES = [
  { id: 'miners', name: 'Mining Hardware', icon: <Cpu className="h-4 w-4" /> },
  { id: 'balance', name: 'Wallet Balance', icon: <CircleDollarSign className="h-4 w-4" /> },
  { id: 'accounts', name: 'User Accounts', icon: <Users className="h-4 w-4" /> },
  { id: 'wallets', name: 'Wallet Management', icon: <Wallet className="h-4 w-4" /> },
  { id: 'transactions', name: 'Transactions', icon: <Database className="h-4 w-4" /> },
  { id: 'statistics', name: 'Mining Statistics', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'activity', name: 'Activity Log', icon: <ListChecks className="h-4 w-4" /> },
  { id: 'btc-price', name: 'Bitcoin Price', icon: <Bitcoin className="h-4 w-4" /> },
  { id: 'settings', name: 'System Settings', icon: <Settings className="h-4 w-4" /> },
  { id: 'custom', name: 'Custom Panel', icon: <Layout className="h-4 w-4" /> },
];

// Available layout configurations
const LAYOUT_CONFIGS = [
  { id: '1', name: 'Single View', cols: 1, rows: 1 },
  { id: '2-h', name: '2 Panels (Horizontal)', cols: 2, rows: 1 },
  { id: '2-v', name: '2 Panels (Vertical)', cols: 1, rows: 2 },
  { id: '3-h', name: '3 Panels (Horizontal)', cols: 3, rows: 1 },
  { id: '3-v', name: '3 Panels (Vertical)', cols: 1, rows: 3 },
  { id: '4', name: '4 Panels (Grid)', cols: 2, rows: 2 },
  { id: '6', name: '6 Panels (Grid)', cols: 3, rows: 2 },
  { id: '9', name: '9 Panels (Grid)', cols: 3, rows: 3 },
  { id: 'custom', name: 'Custom Layout', cols: 0, rows: 0 },
];

// Target audience for broadcast
const TARGET_AUDIENCES = [
  { id: 'all', name: 'All Users' },
  { id: 'admin', name: 'Administrators Only' },
  { id: 'premium', name: 'Premium Users' },
  { id: 'standard', name: 'Standard Users' },
  { id: 'selected', name: 'Selected Users' },
];

// Dashboard panel interface
interface DashboardPanel {
  id: string;
  type: string;
  title: string;
  colspan?: number;
  rowspan?: number;
  position?: number;
  customUrl?: string;
  refreshInterval?: number;
  isVisible: boolean;
}

// Dashboard layout interface
interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  panels: DashboardPanel[];
  cols: number;
  rows: number;
  isActive: boolean;
  lastModified: Date;
  audience?: string;
}

// Get default panel title based on type
const getDefaultPanelTitle = (type: string): string => {
  const panel = PANEL_TYPES.find(p => p.id === type);
  return panel ? panel.name : 'New Panel';
};

// Get panel icon component based on type
const getPanelIcon = (type: string): React.ReactNode => {
  const panel = PANEL_TYPES.find(p => p.id === type);
  return panel ? panel.icon : <Layout className="h-4 w-4" />;
};

export function MultiViewDashboard({ className = '' }: MultiViewDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<DashboardLayout | null>(null);
  const [editingLayout, setEditingLayout] = useState<DashboardLayout | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [targetAudience, setTargetAudience] = useState('all');
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [newLayoutConfig, setNewLayoutConfig] = useState(LAYOUT_CONFIGS[3]); // Default to 4-panel grid
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newLayoutDescription, setNewLayoutDescription] = useState('');
  const [selectedPanelForEdit, setSelectedPanelForEdit] = useState<DashboardPanel | null>(null);
  
  // Generate a default 4-panel layout
  const generateDefaultLayout = (): DashboardLayout => {
    return {
      id: Date.now().toString(),
      name: 'Default Dashboard',
      description: 'System default multi-view dashboard',
      cols: 2,
      rows: 2,
      panels: [
        { 
          id: '1', 
          type: 'miners', 
          title: 'Mining Hardware Status', 
          position: 0, 
          colspan: 1, 
          rowspan: 1,
          refreshInterval: 30,
          isVisible: true
        },
        { 
          id: '2', 
          type: 'balance', 
          title: 'Wallet Balances', 
          position: 1, 
          colspan: 1, 
          rowspan: 1,
          refreshInterval: 60,
          isVisible: true
        },
        { 
          id: '3', 
          type: 'transactions', 
          title: 'Recent Transactions', 
          position: 2, 
          colspan: 1, 
          rowspan: 1,
          refreshInterval: 60,
          isVisible: true
        },
        { 
          id: '4', 
          type: 'btc-price', 
          title: 'Bitcoin Price Chart', 
          position: 3, 
          colspan: 1, 
          rowspan: 1,
          refreshInterval: 30,
          isVisible: true
        }
      ],
      isActive: true,
      lastModified: new Date(),
      audience: 'all'
    };
  };
  
  // Generate a 6-panel layout
  const generateSixPanelLayout = (): DashboardLayout => {
    return {
      id: Date.now().toString() + '1',
      name: 'Complete Overview',
      description: 'Comprehensive system overview with 6 panels',
      cols: 3,
      rows: 2,
      panels: [
        { id: '1', type: 'miners', title: 'Mining Hardware', position: 0, colspan: 1, rowspan: 1, refreshInterval: 30, isVisible: true },
        { id: '2', type: 'balance', title: 'Wallet Balance', position: 1, colspan: 1, rowspan: 1, refreshInterval: 60, isVisible: true },
        { id: '3', type: 'accounts', title: 'User Accounts', position: 2, colspan: 1, rowspan: 1, refreshInterval: 120, isVisible: true },
        { id: '4', type: 'transactions', title: 'Transactions', position: 3, colspan: 1, rowspan: 1, refreshInterval: 60, isVisible: true },
        { id: '5', type: 'statistics', title: 'Mining Stats', position: 4, colspan: 1, rowspan: 1, refreshInterval: 30, isVisible: true },
        { id: '6', type: 'btc-price', title: 'BTC Price', position: 5, colspan: 1, rowspan: 1, refreshInterval: 30, isVisible: true }
      ],
      isActive: false,
      lastModified: new Date(),
      audience: 'all'
    };
  };
  
  // Load layouts from localStorage on mount
  useEffect(() => {
    const storedLayouts = localStorage.getItem('multiViewDashboardLayouts');
    if (storedLayouts) {
      try {
        const parsedLayouts = JSON.parse(storedLayouts);
        // Convert string dates back to Date objects
        const layoutsWithDates = parsedLayouts.map((layout: any) => ({
          ...layout,
          lastModified: new Date(layout.lastModified)
        }));
        setLayouts(layoutsWithDates);
        
        // Set active layout
        const activeLayout = layoutsWithDates.find((layout: DashboardLayout) => layout.isActive);
        if (activeLayout) {
          setActiveLayout(activeLayout);
        } else if (layoutsWithDates.length > 0) {
          setActiveLayout(layoutsWithDates[0]);
        }
      } catch (e) {
        console.error('Error parsing stored layouts:', e);
        // Fall back to default layouts
        initializeDefaultLayouts();
      }
    } else {
      // Initialize default layouts
      initializeDefaultLayouts();
    }
  }, []);
  
  // Initialize default layouts
  const initializeDefaultLayouts = () => {
    const defaultLayouts = [
      generateDefaultLayout(),
      generateSixPanelLayout()
    ];
    
    setLayouts(defaultLayouts);
    setActiveLayout(defaultLayouts[0]);
    
    // Save to localStorage
    localStorage.setItem('multiViewDashboardLayouts', JSON.stringify(defaultLayouts));
  };
  
  // Save layouts to localStorage
  const saveLayouts = (updatedLayouts: DashboardLayout[]) => {
    localStorage.setItem('multiViewDashboardLayouts', JSON.stringify(updatedLayouts));
    setLayouts(updatedLayouts);
  };
  
  // Handle layout selection
  const selectLayout = (layoutId: string) => {
    const updatedLayouts = layouts.map(layout => ({
      ...layout,
      isActive: layout.id === layoutId
    }));
    
    saveLayouts(updatedLayouts);
    
    const newActiveLayout = updatedLayouts.find(layout => layout.id === layoutId);
    setActiveLayout(newActiveLayout || null);
    
    toast({
      title: "Dashboard Layout Changed",
      description: `Now displaying: ${newActiveLayout?.name || 'Unknown layout'}`,
      duration: 3000,
    });
  };
  
  // Start editing a layout
  const startEditingLayout = () => {
    if (!activeLayout) return;
    
    setEditingLayout({...activeLayout});
    setIsEditMode(true);
  };
  
  // Save edited layout
  const saveEditedLayout = () => {
    if (!editingLayout) return;
    
    const updatedLayouts = layouts.map(layout => 
      layout.id === editingLayout.id 
        ? {...editingLayout, lastModified: new Date()} 
        : layout
    );
    
    saveLayouts(updatedLayouts);
    
    const updatedActiveLayout = updatedLayouts.find(layout => layout.id === editingLayout.id);
    setActiveLayout(updatedActiveLayout || null);
    setEditingLayout(null);
    setIsEditMode(false);
    
    toast({
      title: "Dashboard Layout Saved",
      description: "Your changes have been saved successfully.",
      duration: 3000,
    });
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingLayout(null);
    setIsEditMode(false);
  };
  
  // Create a new layout
  const createNewLayout = () => {
    if (!newLayoutName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for your new dashboard layout.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Generate panels based on layout configuration
    const totalPanels = newLayoutConfig.cols * newLayoutConfig.rows;
    const newPanels: DashboardPanel[] = [];
    
    for (let i = 0; i < totalPanels; i++) {
      // Distribute default panel types across the dashboard
      const panelType = PANEL_TYPES[i % PANEL_TYPES.length].id;
      
      newPanels.push({
        id: Date.now().toString() + i,
        type: panelType,
        title: getDefaultPanelTitle(panelType),
        position: i,
        colspan: 1,
        rowspan: 1,
        refreshInterval: 60,
        isVisible: true
      });
    }
    
    const newLayout: DashboardLayout = {
      id: Date.now().toString(),
      name: newLayoutName,
      description: newLayoutDescription,
      cols: newLayoutConfig.cols,
      rows: newLayoutConfig.rows,
      panels: newPanels,
      isActive: false, // Not active by default
      lastModified: new Date(),
      audience: 'all'
    };
    
    const updatedLayouts = [...layouts, newLayout];
    saveLayouts(updatedLayouts);
    
    // Reset form fields
    setNewLayoutName('');
    setNewLayoutDescription('');
    setShowLayoutSelector(false);
    
    toast({
      title: "New Layout Created",
      description: `${newLayoutName} has been created successfully.`,
      duration: 3000,
    });
  };
  
  // Delete a layout
  const deleteLayout = (layoutId: string) => {
    if (layouts.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must keep at least one dashboard layout.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const updatedLayouts = layouts.filter(layout => layout.id !== layoutId);
    
    // If deleting the active layout, make another one active
    if (activeLayout && activeLayout.id === layoutId) {
      updatedLayouts[0].isActive = true;
      setActiveLayout(updatedLayouts[0]);
    }
    
    saveLayouts(updatedLayouts);
    
    toast({
      title: "Layout Deleted",
      description: "The dashboard layout has been deleted.",
      duration: 3000,
    });
  };
  
  // Start editing a panel
  const editPanel = (panel: DashboardPanel) => {
    setSelectedPanelForEdit({...panel});
  };
  
  // Save edited panel
  const saveEditedPanel = () => {
    if (!selectedPanelForEdit || !editingLayout) return;
    
    const updatedPanels = editingLayout.panels.map(panel => 
      panel.id === selectedPanelForEdit.id ? selectedPanelForEdit : panel
    );
    
    setEditingLayout({
      ...editingLayout,
      panels: updatedPanels
    });
    
    setSelectedPanelForEdit(null);
    
    toast({
      title: "Panel Updated",
      description: "Panel settings have been updated. Remember to save the layout.",
      duration: 3000,
    });
  };
  
  // Toggle panel visibility
  const togglePanelVisibility = (panelId: string) => {
    if (!editingLayout) return;
    
    const updatedPanels = editingLayout.panels.map(panel => 
      panel.id === panelId ? {...panel, isVisible: !panel.isVisible} : panel
    );
    
    setEditingLayout({
      ...editingLayout,
      panels: updatedPanels
    });
  };
  
  // Broadcast layout to users
  const broadcastLayout = () => {
    if (!activeLayout) return;
    
    setIsBroadcasting(true);
    
    // Update audience field in the active layout
    const updatedLayouts = layouts.map(layout => 
      layout.id === activeLayout.id 
        ? {...layout, audience: targetAudience} 
        : layout
    );
    
    // In a real application, this would involve a server call
    // For now, we'll just simulate with a timeout
    setTimeout(() => {
      saveLayouts(updatedLayouts);
      
      toast({
        title: "Dashboard Broadcasted",
        description: `Layout has been broadcast to ${TARGET_AUDIENCES.find(a => a.id === targetAudience)?.name.toLowerCase()}.`,
        duration: 3000,
      });
      
      setIsBroadcasting(false);
      
      // Update UI
      queryClient.invalidateQueries({ queryKey: ['/api/network/dashboard'] });
    }, 1500);
  };
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Renders a panel based on its type
  const renderPanel = (panel: DashboardPanel) => {
    if (!panel.isVisible) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-800/50 border border-gray-700 rounded-md">
          <EyeOff className="h-5 w-5 text-gray-500" />
          <span className="ml-2 text-gray-500">Panel Hidden</span>
        </div>
      );
    }
    
    switch (panel.type) {
      case 'miners':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">{panel.title}</h3>
              <Badge className="bg-green-600">4 Active</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-grow">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-800/70 p-2 rounded-md border border-gray-700 flex items-center">
                  <div className={`h-2 w-2 rounded-full ${i <= 3 ? 'bg-green-500' : 'bg-yellow-500'} mr-2`} />
                  <div className="flex-grow">
                    <div className="text-xs">Miner #{i}</div>
                    <div className="text-xs text-gray-400">{Math.round(Math.random() * 80 + 20)} TH/s</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'balance':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">{panel.title}</h3>
              <Badge className="bg-blue-600">Updated</Badge>
            </div>
            <div className="bg-gray-800/70 rounded-md border border-gray-700 p-3 mb-2 flex items-center">
              <div className="bg-orange-500/20 rounded-full p-2 mr-3">
                <Bitcoin className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="font-mono text-lg">7.10004370 BTC</div>
                <div className="text-xs text-gray-400">≈ $483,211.67 USD</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-auto text-right">
              Last updated: 2 minutes ago
            </div>
          </div>
        );
        
      case 'transactions':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">{panel.title}</h3>
              <Badge className="bg-purple-600">5 Recent</Badge>
            </div>
            <div className="space-y-2 flex-grow overflow-y-auto">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-gray-800/70 p-2 rounded-md border border-gray-700 flex items-center">
                  <div className="bg-blue-500/20 rounded-full p-1 mr-2">
                    <Share2 className="h-3 w-3 text-blue-500" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs truncate">tx_{Math.random().toString(36).substring(2, 10)}</div>
                    <div className="text-xs text-gray-400">{(Math.random() * 0.1).toFixed(8)} BTC</div>
                  </div>
                  <div className="text-xs text-gray-500">{Math.floor(Math.random() * 60)}m ago</div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'btc-price':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">{panel.title}</h3>
              <Badge className="bg-green-600">+2.4%</Badge>
            </div>
            <div className="bg-gray-800/70 rounded-md border border-gray-700 p-3 flex items-center justify-center flex-grow">
              <div className="text-center">
                <div className="font-mono text-2xl font-bold">$68,211.42</div>
                <div className="text-green-500 text-sm flex items-center justify-center">
                  <ChevronUp className="h-4 w-4 mr-1" />
                  +$1,628.67 (2.4%)
                </div>
              </div>
            </div>
            <div className="h-[60px] w-full mt-2 relative">
              {/* Simple mock chart */}
              <svg className="w-full h-full" viewBox="0 0 100 20">
                <path
                  d="M0,15 L5,14 L10,16 L15,13 L20,14 L25,12 L30,13 L35,10 L40,11 L45,9 L50,11 L55,7 L60,8 L65,6 L70,7 L75,5 L80,6 L85,4 L90,5 L95,3 L100,4"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>
        );
        
      case 'accounts':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">{panel.title}</h3>
              <Badge className="bg-indigo-600">24 Active</Badge>
            </div>
            <div className="space-y-2 flex-grow overflow-y-auto">
              {['Alice', 'Bob', 'Charlie', 'Dave'].map((name, i) => (
                <div key={i} className="bg-gray-800/70 p-2 rounded-md border border-gray-700 flex items-center">
                  <div className="bg-indigo-500/20 rounded-full p-1 mr-2">
                    <Users className="h-3 w-3 text-indigo-500" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs">{name}</div>
                    <div className="text-xs text-gray-400">
                      Last active: {Math.floor(Math.random() * 60)}m ago
                    </div>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${Math.random() > 0.3 ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'statistics':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">{panel.title}</h3>
              <Badge className="bg-cyan-600">Live</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-grow">
              <div className="bg-gray-800/70 p-2 rounded-md border border-gray-700">
                <div className="text-xs text-gray-400">Total Hashrate</div>
                <div className="text-lg font-mono">327 TH/s</div>
              </div>
              <div className="bg-gray-800/70 p-2 rounded-md border border-gray-700">
                <div className="text-xs text-gray-400">Efficiency</div>
                <div className="text-lg font-mono">92.7%</div>
              </div>
              <div className="bg-gray-800/70 p-2 rounded-md border border-gray-700">
                <div className="text-xs text-gray-400">Daily Rewards</div>
                <div className="text-lg font-mono">0.00931 BTC</div>
              </div>
              <div className="bg-gray-800/70 p-2 rounded-md border border-gray-700">
                <div className="text-xs text-gray-400">Uptime</div>
                <div className="text-lg font-mono">99.8%</div>
              </div>
            </div>
          </div>
        );
        
      case 'custom':
        if (panel.customUrl) {
          return (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">{panel.title}</h3>
                <Badge className="bg-cyan-600">Custom</Badge>
              </div>
              <div className="flex-grow bg-gray-800/70 rounded-md border border-gray-700 overflow-hidden">
                <iframe 
                  src={panel.customUrl} 
                  className="w-full h-full border-0"
                  title={panel.title}
                />
              </div>
            </div>
          );
        }
        
        // Fallback for custom panel
        return (
          <div className="h-full flex items-center justify-center bg-gray-800/70 border border-gray-700 rounded-md">
            <div className="text-center">
              <Layout className="h-12 w-12 mx-auto mb-2 text-gray-500" />
              <div className="text-sm text-gray-400">Custom Panel</div>
              <div className="text-xs text-gray-500 mt-1">No URL configured</div>
            </div>
          </div>
        );
        
      default:
        // Generic fallback for other panel types
        return (
          <div className="h-full flex items-center justify-center bg-gray-800/70 border border-gray-700 rounded-md">
            <div className="text-center">
              {getPanelIcon(panel.type)}
              <div className="text-sm text-gray-400 mt-2">{panel.title}</div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900/80 to-blue-900/20 backdrop-blur-sm border border-blue-800/50 ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-6 w-6 text-blue-400" />
              Multi-View Dashboard
              {isEditMode && (
                <Badge className="ml-2 bg-amber-600">Editing</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Configure and broadcast customizable multi-panel dashboards to all KLOUD-BUGS-VR users
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditMode ? (
              <>
                <Dialog open={showLayoutSelector} onOpenChange={setShowLayoutSelector}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-xs h-8 border-blue-800">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      New Layout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800">
                    <DialogHeader>
                      <DialogTitle>Create New Dashboard Layout</DialogTitle>
                      <DialogDescription>
                        Configure a new multi-view dashboard layout to broadcast to users.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="layout-name">Layout Name</Label>
                        <Input
                          id="layout-name"
                          placeholder="Enter a name for this layout..."
                          value={newLayoutName}
                          onChange={(e) => setNewLayoutName(e.target.value)}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="layout-description">Description (Optional)</Label>
                        <Input
                          id="layout-description"
                          placeholder="Enter a description..."
                          value={newLayoutDescription}
                          onChange={(e) => setNewLayoutDescription(e.target.value)}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Layout Configuration</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {LAYOUT_CONFIGS.slice(0, 8).map(config => (
                            <div
                              key={config.id}
                              className={`border rounded-md p-3 cursor-pointer transition-all ${
                                newLayoutConfig.id === config.id 
                                  ? 'border-blue-500 bg-blue-900/20' 
                                  : 'border-gray-700 bg-gray-800/70 hover:border-gray-600'
                              }`}
                              onClick={() => setNewLayoutConfig(config)}
                            >
                              <div className="flex justify-center mb-2">
                                {/* Visualization of the layout */}
                                <div className={`grid gap-1 border border-gray-600 p-1 rounded bg-gray-900/50 w-20 h-16`} 
                                  style={{ 
                                    gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                                    gridTemplateRows: `repeat(${config.rows}, 1fr)`
                                  }}>
                                  {Array.from({ length: config.cols * config.rows }).map((_, i) => (
                                    <div key={i} className="bg-blue-500/50 rounded-sm" />
                                  ))}
                                </div>
                              </div>
                              <div className="text-center text-xs">{config.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowLayoutSelector(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={createNewLayout}
                        disabled={!newLayoutName.trim()}
                      >
                        Create Layout
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Select value={activeLayout?.id || ''} onValueChange={selectLayout}>
                  <SelectTrigger className="w-[180px] h-8 text-xs bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select layout..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {layouts.map(layout => (
                      <SelectItem key={layout.id} value={layout.id}>
                        <div className="flex items-center">
                          <span>{layout.name}</span>
                          {layout.isActive && (
                            <div className="ml-2 h-1.5 w-1.5 rounded-full bg-green-500" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={startEditingLayout}
                  disabled={!activeLayout}
                  className="h-8"
                >
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="h-8 text-xs" 
                  onClick={cancelEditing}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Cancel
                </Button>
                
                <Button 
                  className="h-8" 
                  onClick={saveEditedLayout}
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activeLayout ? (
            <>
              {/* Dashboard grid */}
              <div 
                className={`grid gap-4 bg-gray-900/50 rounded-lg p-4 border border-gray-800 min-h-[500px]`}
                style={{ 
                  gridTemplateColumns: `repeat(${isEditMode ? editingLayout?.cols : activeLayout.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${isEditMode ? editingLayout?.rows : activeLayout.rows}, minmax(200px, 1fr))`
                }}
              >
                {(isEditMode ? editingLayout?.panels : activeLayout.panels)?.map((panel) => (
                  <motion.div
                    key={panel.id}
                    className={`rounded-md overflow-hidden bg-gray-800/50 border border-gray-700 p-3 relative transition-all ${
                      isEditMode ? 'hover:border-blue-600 hover:shadow-md cursor-pointer' : ''
                    } ${!panel.isVisible && isEditMode ? 'opacity-50' : ''}`}
                    style={{ 
                      gridColumn: `span ${panel.colspan || 1}`,
                      gridRow: `span ${panel.rowspan || 1}`
                    }}
                    onClick={() => isEditMode && editPanel(panel)}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isEditMode && (
                      <div className="absolute top-2 right-2 z-10 flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 bg-gray-800/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePanelVisibility(panel.id);
                          }}
                        >
                          {panel.isVisible ? (
                            <EyeOff className="h-3 w-3 text-gray-400" />
                          ) : (
                            <Eye className="h-3 w-3 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    )}
                    
                    {/* Panel content */}
                    {renderPanel(panel)}
                  </motion.div>
                ))}
              </div>
              
              {/* Edit panel dialog */}
              <Dialog 
                open={selectedPanelForEdit !== null} 
                onOpenChange={(open) => !open && setSelectedPanelForEdit(null)}
              >
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle>Edit Panel</DialogTitle>
                    <DialogDescription>
                      Configure the settings for this dashboard panel.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {selectedPanelForEdit && (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="panel-title">Panel Title</Label>
                        <Input
                          id="panel-title"
                          value={selectedPanelForEdit.title}
                          onChange={(e) => setSelectedPanelForEdit({
                            ...selectedPanelForEdit,
                            title: e.target.value
                          })}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="panel-type">Panel Type</Label>
                        <Select 
                          value={selectedPanelForEdit.type} 
                          onValueChange={(value) => setSelectedPanelForEdit({
                            ...selectedPanelForEdit,
                            type: value
                          })}
                        >
                          <SelectTrigger id="panel-type" className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select panel type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {PANEL_TYPES.map(type => (
                              <SelectItem key={type.id} value={type.id}>
                                <div className="flex items-center">
                                  {type.icon}
                                  <span className="ml-2">{type.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedPanelForEdit.type === 'custom' && (
                        <div className="space-y-2">
                          <Label htmlFor="custom-url">Custom URL</Label>
                          <Input
                            id="custom-url"
                            placeholder="https://..."
                            value={selectedPanelForEdit.customUrl || ''}
                            onChange={(e) => setSelectedPanelForEdit({
                              ...selectedPanelForEdit,
                              customUrl: e.target.value
                            })}
                            className="bg-gray-800 border-gray-700"
                          />
                          <p className="text-xs text-gray-400">
                            Enter a URL to display in this panel (charts, websites, etc.)
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                        <Select 
                          value={String(selectedPanelForEdit.refreshInterval || 60)} 
                          onValueChange={(value) => setSelectedPanelForEdit({
                            ...selectedPanelForEdit,
                            refreshInterval: parseInt(value)
                          })}
                        >
                          <SelectTrigger id="refresh-interval" className="bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Select refresh interval" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="15">15 seconds</SelectItem>
                            <SelectItem value="30">30 seconds</SelectItem>
                            <SelectItem value="60">1 minute</SelectItem>
                            <SelectItem value="300">5 minutes</SelectItem>
                            <SelectItem value="600">10 minutes</SelectItem>
                            <SelectItem value="0">Manual refresh only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="panel-colspan">Column Span</Label>
                          <Select 
                            value={String(selectedPanelForEdit.colspan || 1)} 
                            onValueChange={(value) => setSelectedPanelForEdit({
                              ...selectedPanelForEdit,
                              colspan: parseInt(value)
                            })}
                          >
                            <SelectTrigger id="panel-colspan" className="bg-gray-800 border-gray-700">
                              <SelectValue placeholder="Column span" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="1">1 column</SelectItem>
                              <SelectItem value="2">2 columns</SelectItem>
                              <SelectItem value="3">3 columns</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="panel-rowspan">Row Span</Label>
                          <Select 
                            value={String(selectedPanelForEdit.rowspan || 1)} 
                            onValueChange={(value) => setSelectedPanelForEdit({
                              ...selectedPanelForEdit,
                              rowspan: parseInt(value)
                            })}
                          >
                            <SelectTrigger id="panel-rowspan" className="bg-gray-800 border-gray-700">
                              <SelectValue placeholder="Row span" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="1">1 row</SelectItem>
                              <SelectItem value="2">2 rows</SelectItem>
                              <SelectItem value="3">3 rows</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="panel-visible" className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Panel Visible
                        </Label>
                        <Switch
                          id="panel-visible"
                          checked={selectedPanelForEdit.isVisible}
                          onCheckedChange={(checked) => setSelectedPanelForEdit({
                            ...selectedPanelForEdit,
                            isVisible: checked
                          })}
                        />
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedPanelForEdit(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={saveEditedPanel}>
                      Save Panel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Layout info and broadcast controls */}
              <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium">{activeLayout.name}</h3>
                    {activeLayout.description && (
                      <p className="text-sm text-gray-400 mt-1">{activeLayout.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-400">
                      <span className="flex items-center">
                        <LayoutGrid className="h-3 w-3 mr-1" />
                        {activeLayout.cols}×{activeLayout.rows} Grid
                      </span>
                      <span className="flex items-center">
                        <BoxSelect className="h-3 w-3 mr-1" />
                        {activeLayout.panels.length} Panels
                      </span>
                      <span className="flex items-center">
                        <Layers className="h-3 w-3 mr-1" />
                        {activeLayout.panels.filter(p => p.isVisible).length} Visible
                      </span>
                      <span className="flex items-center">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Modified: {formatDate(activeLayout.lastModified)}
                      </span>
                    </div>
                  </div>
                  
                  {!isEditMode && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Select value={targetAudience} onValueChange={setTargetAudience}>
                        <SelectTrigger className="w-[180px] h-8 text-xs bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {TARGET_AUDIENCES.map(audience => (
                            <SelectItem key={audience.id} value={audience.id}>
                              {audience.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        onClick={broadcastLayout}
                        disabled={isBroadcasting}
                      >
                        {isBroadcasting ? (
                          <>
                            <MonitorSmartphone className="h-4 w-4 animate-pulse mr-2" />
                            Broadcasting...
                          </>
                        ) : (
                          <>
                            <MonitorSmartphone className="h-4 w-4 mr-2" />
                            Broadcast Dashboard
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* All available layouts */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300 flex items-center">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Available Dashboard Layouts
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {layouts.map(layout => (
                    <div 
                      key={layout.id}
                      className={`p-3 rounded-md border ${
                        layout.isActive ? 'border-blue-600 bg-blue-900/10' : 'border-gray-700 bg-gray-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{layout.name}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {layout.description || 'No description provided'}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          {!layout.isActive && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => selectLayout(layout.id)}
                            >
                              <Eye className="h-3.5 w-3.5 text-blue-400" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => {
                              // If active, start editing
                              // If not active, select it first then edit
                              if (layout.isActive) {
                                startEditingLayout();
                              } else {
                                selectLayout(layout.id);
                                setTimeout(() => startEditingLayout(), 100);
                              }
                            }}
                          >
                            <Edit className="h-3.5 w-3.5 text-gray-400" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => deleteLayout(layout.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{layout.cols}×{layout.rows} grid</span>
                        <span>•</span>
                        <span>{layout.panels.length} panels</span>
                        {layout.isActive && (
                          <>
                            <span>•</span>
                            <Badge className="bg-green-600 text-[10px] h-4">Active</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LayoutGrid className="h-16 w-16 mb-4 text-gray-600" />
              <h3 className="text-xl font-medium text-gray-300">No Dashboard Layout Available</h3>
              <p className="text-sm text-gray-500 max-w-md mt-2">
                Create your first multi-view dashboard layout to start displaying multiple data screens to users.
              </p>
              <Button 
                className="mt-4"
                onClick={() => setShowLayoutSelector(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Layout
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default MultiViewDashboard;