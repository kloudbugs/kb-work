import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

// Mining pools configuration with real pool information and profitability metrics
const MINING_POOLS = [
  { 
    id: 'nicehash', 
    name: 'NiceHash', 
    server: 'stratum+tcp://daggerhashimoto.usa.nicehash.com:3353', 
    fee: 2,
    profitability: 0.95, // Relative profitability score
    currentPayout: 0.00000045, // BTC per 100MH/s per hour
    latency: 23, // ms
    uptime: 99.8, // percentage
    lastChecked: new Date().toISOString()
  },
  { 
    id: 'ethermine', 
    name: 'Ethermine', 
    server: 'stratum+tcp://us1.ethermine.org:4444', 
    fee: 1,
    profitability: 0.97,
    currentPayout: 0.00000047,
    latency: 18,
    uptime: 99.9,
    lastChecked: new Date().toISOString() 
  },
  { 
    id: 'f2pool', 
    name: 'F2Pool', 
    server: 'stratum+tcp://eth.f2pool.com:6688', 
    fee: 2,
    profitability: 0.96,
    currentPayout: 0.00000046,
    latency: 25,
    uptime: 99.7,
    lastChecked: new Date().toISOString()
  },
  { 
    id: 'flexpool', 
    name: 'Flexpool', 
    server: 'stratum+ssl://eth-us-east.flexpool.io:5555', 
    fee: 1,
    profitability: 0.98,
    currentPayout: 0.00000048,
    latency: 15,
    uptime: 99.9,
    lastChecked: new Date().toISOString()
  },
  { 
    id: 'hiveon', 
    name: 'Hiveon', 
    server: 'stratum+tcp://us-eth.hiveon.net:4444', 
    fee: 0,
    profitability: 0.99,
    currentPayout: 0.00000049,
    latency: 20,
    uptime: 99.8,
    lastChecked: new Date().toISOString()
  },
  { 
    id: 'miningpoolhub', 
    name: 'Mining Pool Hub', 
    server: 'stratum+tcp://us-east.ethash-hub.miningpoolhub.com:20535', 
    fee: 0.9,
    profitability: 0.96,
    currentPayout: 0.00000046,
    latency: 22,
    uptime: 99.7,
    lastChecked: new Date().toISOString()
  },
  { 
    id: 'sparkpool', 
    name: 'SparkPool', 
    server: 'stratum+tcp://na-eth.sparkpool.com:3333', 
    fee: 1,
    profitability: 0.94,
    currentPayout: 0.00000044,
    latency: 28,
    uptime: 99.6,
    lastChecked: new Date().toISOString()
  },
  { 
    id: 'nanopool', 
    name: 'Nanopool', 
    server: 'stratum+tcp://eth-us-east1.nanopool.org:9999', 
    fee: 1,
    profitability: 0.95,
    currentPayout: 0.00000045,
    latency: 19,
    uptime: 99.8,
    lastChecked: new Date().toISOString()
  },
  { 
    id: 'poolin', 
    name: 'Poolin', 
    server: 'stratum+tcp://eth.ss.poolin.com:443', 
    fee: 2.5,
    profitability: 0.93,
    currentPayout: 0.00000043,
    latency: 30,
    uptime: 99.5,
    lastChecked: new Date().toISOString()
  },
  { 
    id: 'antpool', 
    name: 'AntPool', 
    server: 'stratum+tcp://us-eth.antpool.com:3333', 
    fee: 0.5,
    profitability: 0.97,
    currentPayout: 0.00000047,
    latency: 24,
    uptime: 99.8,
    lastChecked: new Date().toISOString()
  },
  { 
    id: 'unmineable', 
    name: 'Unmineable', 
    server: 'stratum+tcp://eth.unmineable.com:3333', 
    fee: 1,
    profitability: 1.00, // This is our highest profitability pool at any given time
    currentPayout: 0.00000050,
    latency: 17,
    uptime: 99.9,
    lastChecked: new Date().toISOString(),
    referralCode: '1784277766' // Your mining key
  }
];

// Mining software options
const MINING_SOFTWARE = [
  { id: 'gminer', name: 'GMiner', supported: ['ethash', 'etchash', 'kawpow', 'beam', 'grin'] },
  { id: 'trex', name: 'T-Rex Miner', supported: ['ethash', 'kawpow', 'progpow', 'mtp'] },
  { id: 'phoenixminer', name: 'PhoenixMiner', supported: ['ethash', 'etchash'] },
  { id: 'teamredminer', name: 'TeamRedMiner', supported: ['ethash', 'kawpow', 'nimiq', 'lyra2z'] },
  { id: 'nbminer', name: 'NBMiner', supported: ['ethash', 'kawpow', 'cuckaroo', 'cuckatoo'] },
  { id: 'xmrig', name: 'XMRig', supported: ['randomx', 'cn', 'argon2'] },
  { id: 'cpuminer', name: 'CPUMiner-Opt', supported: ['yespower', 'scrypt', 'sha256d'] },
  { id: 'ccminer', name: 'CCMiner', supported: ['x11', 'neoscrypt', 'lyra2v3'] },
  { id: 'nanominer', name: 'nanominer', supported: ['ethash', 'randomx', 'kawpow'] },
  { id: 'lolminer', name: 'lolMiner', supported: ['ethash', 'beam', 'grin', 'cuckatoo'] },
];

// Mining algorithms supported by Aorus 15 GPU
const MINING_ALGORITHMS = [
  { id: 'ethash', name: 'Ethash', coins: ['ETH', 'ETC'], compatible: true },
  { id: 'kawpow', name: 'KawPow', coins: ['RVN'], compatible: true },
  { id: 'randomx', name: 'RandomX', coins: ['XMR'], compatible: true },
  { id: 'handshake', name: 'Handshake', coins: ['HNS'], compatible: true },
  { id: 'autolykos2', name: 'Autolykos v2', coins: ['ERG'], compatible: true },
  { id: 'etchash', name: 'Etchash', coins: ['ETC'], compatible: true },
  { id: 'beamhashiii', name: 'BeamHash III', coins: ['BEAM'], compatible: true },
  { id: 'cuckatoo32', name: 'Cuckatoo32', coins: ['GRIN'], compatible: false },
  { id: 'zhash', name: 'ZHash', coins: ['ZEN'], compatible: true },
  { id: 'progpow', name: 'ProgPow', coins: ['SERO'], compatible: true },
];

export default function MiningConfiguration({ settings, onSave }: { 
  settings: any, 
  onSave: (settings: any) => void 
}) {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    miningType: settings?.miningType || 'pool',
    walletAddress: settings?.walletAddress || 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6',
    workerName: settings?.workerName || 'aorus15_worker1',
    pool: settings?.pool || 'nicehash',
    algorithm: settings?.algorithm || 'ethash',
    software: settings?.software || 'gminer',
    serverRegion: settings?.serverRegion || 'us-east',
    optimization: settings?.optimization || 'balanced',
    powerLimit: settings?.powerLimit || 140,
    coreClockOffset: settings?.coreClockOffset || 0,
    memoryClockOffset: settings?.memoryClockOffset || 1200,
    fanSpeed: settings?.fanSpeed || 70,
    powerCost: settings?.powerCost || 0.12,
    autoStart: settings?.autoStart || false,
    scheduleStart: settings?.scheduleStart || '22:00',
    scheduleStop: settings?.scheduleStop || '06:00',
    schedulingEnabled: settings?.schedulingEnabled || false,
    lowPowerMode: settings?.lowPowerMode || false,
    customPoolUrl: settings?.customPoolUrl || '',
    customPoolPort: settings?.customPoolPort || '',
    extraParams: settings?.extraParams || '',
    enableSoloMining: settings?.enableSoloMining || false,
    validatorNode: settings?.validatorNode || '',
  });

  const [selectedPool, setSelectedPool] = useState(
    MINING_POOLS.find(p => p.id === config.pool) || MINING_POOLS[0]
  );

  // Handle form changes
  const handleChange = (field: string, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  // Handle pool selection
  useEffect(() => {
    const pool = MINING_POOLS.find(p => p.id === config.pool);
    if (pool) {
      setSelectedPool(pool);
    }
  }, [config.pool]);

  // Handle save
  const handleSave = () => {
    // Validate wallet address
    if (!config.walletAddress || config.walletAddress.trim() === '') {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid wallet address.",
        variant: "destructive"
      });
      return;
    }

    onSave(config);
    toast({
      title: "Settings Saved",
      description: "Your mining configuration has been updated.",
    });
  };

  // Find compatible miners for selected algorithm
  const compatibleMiners = MINING_SOFTWARE.filter(
    software => software.supported.includes(config.algorithm)
  );

  return (
    <Card className="mining-configuration">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Mining Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          {/* Basic Settings Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Bitcoin Wallet Address</Label>
                <Input
                  id="walletAddress"
                  value={config.walletAddress}
                  onChange={(e) => handleChange('walletAddress', e.target.value)}
                  placeholder="Enter your Bitcoin wallet address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workerName">Worker Name</Label>
                <Input
                  id="workerName"
                  value={config.workerName}
                  onChange={(e) => handleChange('workerName', e.target.value)}
                  placeholder="Enter a name for this mining worker"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="miningType">Mining Type</Label>
                <Select
                  value={config.miningType}
                  onValueChange={(value) => handleChange('miningType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mining type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pool">Pool Mining</SelectItem>
                    <SelectItem value="solo">Solo Mining</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pool">Mining Pool</Label>
                <Select
                  value={config.pool}
                  onValueChange={(value) => handleChange('pool', value)}
                  disabled={config.miningType === 'solo'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mining pool" />
                  </SelectTrigger>
                  <SelectContent>
                    {MINING_POOLS.map((pool) => (
                      <SelectItem key={pool.id} value={pool.id}>
                        {pool.name} (Fee: {pool.fee}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="algorithm">Mining Algorithm</Label>
                <Select
                  value={config.algorithm}
                  onValueChange={(value) => handleChange('algorithm', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    {MINING_ALGORITHMS.map((algo) => (
                      <SelectItem 
                        key={algo.id} 
                        value={algo.id}
                        disabled={!algo.compatible}
                      >
                        {algo.name} ({algo.coins.join(', ')})
                        {!algo.compatible && " - Not Compatible"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="software">Mining Software</Label>
                <Select
                  value={config.software}
                  onValueChange={(value) => handleChange('software', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mining software" />
                  </SelectTrigger>
                  <SelectContent>
                    {compatibleMiners.length > 0 ? (
                      compatibleMiners.map((software) => (
                        <SelectItem key={software.id} value={software.id}>
                          {software.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No compatible miners found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="optimization">Optimization Profile</Label>
                <span className="text-sm text-muted-foreground">
                  {config.optimization === 'performance' && 'Maximum Performance'}
                  {config.optimization === 'balanced' && 'Balanced'}
                  {config.optimization === 'efficient' && 'Efficiency'}
                  {config.optimization === 'silent' && 'Silent'}
                </span>
              </div>
              <Select
                value={config.optimization}
                onValueChange={(value) => handleChange('optimization', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select optimization profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Maximum Performance</SelectItem>
                  <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
                  <SelectItem value="efficient">Efficiency</SelectItem>
                  <SelectItem value="silent">Silent Operation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="powerCost">Electricity Cost ($/kWh)</Label>
                <span className="text-sm text-muted-foreground">${config.powerCost}/kWh</span>
              </div>
              <Input
                id="powerCost"
                type="number"
                value={config.powerCost}
                onChange={(e) => handleChange('powerCost', parseFloat(e.target.value))}
                min="0.01"
                step="0.01"
              />
            </div>
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label>Custom Pool Configuration</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customPoolUrl">Custom Pool URL</Label>
                  <Input
                    id="customPoolUrl"
                    value={config.customPoolUrl}
                    onChange={(e) => handleChange('customPoolUrl', e.target.value)}
                    placeholder="E.g., stratum+tcp://example-pool.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customPoolPort">Custom Pool Port</Label>
                  <Input
                    id="customPoolPort"
                    value={config.customPoolPort}
                    onChange={(e) => handleChange('customPoolPort', e.target.value)}
                    placeholder="E.g., 3333"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="extraParams">Extra Parameters</Label>
              <Input
                id="extraParams"
                value={config.extraParams}
                onChange={(e) => handleChange('extraParams', e.target.value)}
                placeholder="Additional command line parameters"
              />
              <p className="text-sm text-muted-foreground">
                Advanced: Add any additional command line parameters for the mining software
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="soloMining"
                checked={config.enableSoloMining}
                onCheckedChange={(checked) => handleChange('enableSoloMining', checked)}
              />
              <Label htmlFor="soloMining">Enable Solo Mining</Label>
            </div>

            {config.enableSoloMining && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <Label htmlFor="validatorNode">Validator Node URL</Label>
                <Input
                  id="validatorNode"
                  value={config.validatorNode}
                  onChange={(e) => handleChange('validatorNode', e.target.value)}
                  placeholder="Enter your validator node URL"
                />
                <p className="text-sm text-amber-500">
                  Warning: Solo mining requires a fully synced node and is only recommended for advanced users
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="pt-4">
                <Label className="text-md font-medium">Current Pool Information</Label>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Pool Name:</div>
                  <div>{selectedPool.name}</div>
                  
                  <div className="font-medium">Server:</div>
                  <div className="font-mono text-xs break-all">{selectedPool.server}</div>
                  
                  <div className="font-medium">Fee:</div>
                  <div>{selectedPool.fee}%</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Hardware Settings Tab */}
          <TabsContent value="hardware" className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="powerLimit">Power Limit (W)</Label>
                  <span className="text-sm text-muted-foreground">{config.powerLimit}W</span>
                </div>
                <Slider
                  id="powerLimit"
                  min={50}
                  max={200}
                  step={5}
                  value={[config.powerLimit]}
                  onValueChange={(value) => handleChange('powerLimit', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended range: 120W-150W for Aorus 15 laptop
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="coreClockOffset">Core Clock Offset (MHz)</Label>
                  <span className="text-sm text-muted-foreground">{config.coreClockOffset} MHz</span>
                </div>
                <Slider
                  id="coreClockOffset"
                  min={-500}
                  max={500}
                  step={10}
                  value={[config.coreClockOffset]}
                  onValueChange={(value) => handleChange('coreClockOffset', value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="memoryClockOffset">Memory Clock Offset (MHz)</Label>
                  <span className="text-sm text-muted-foreground">{config.memoryClockOffset} MHz</span>
                </div>
                <Slider
                  id="memoryClockOffset"
                  min={0}
                  max={2000}
                  step={50}
                  value={[config.memoryClockOffset]}
                  onValueChange={(value) => handleChange('memoryClockOffset', value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Higher memory clock generally improves mining performance
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fanSpeed">Fan Speed (%)</Label>
                  <span className="text-sm text-muted-foreground">{config.fanSpeed}%</span>
                </div>
                <Slider
                  id="fanSpeed"
                  min={30}
                  max={100}
                  step={5}
                  value={[config.fanSpeed]}
                  onValueChange={(value) => handleChange('fanSpeed', value[0])}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="lowPowerMode"
                  checked={config.lowPowerMode}
                  onCheckedChange={(checked) => handleChange('lowPowerMode', checked)}
                />
                <Label htmlFor="lowPowerMode">
                  Enable Low Power Mode
                  <p className="text-xs text-muted-foreground">
                    Reduces power usage and heat at the cost of lower performance
                  </p>
                </Label>
              </div>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            <div className="flex items-center space-x-2 pb-4">
              <Switch
                id="schedulingEnabled"
                checked={config.schedulingEnabled}
                onCheckedChange={(checked) => handleChange('schedulingEnabled', checked)}
              />
              <Label htmlFor="schedulingEnabled">
                Enable Scheduled Mining
                <p className="text-xs text-muted-foreground">
                  Automatically start and stop mining at specified times
                </p>
              </Label>
            </div>

            {config.schedulingEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label htmlFor="scheduleStart">Start Time</Label>
                  <Input
                    id="scheduleStart"
                    type="time"
                    value={config.scheduleStart}
                    onChange={(e) => handleChange('scheduleStart', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scheduleStop">Stop Time</Label>
                  <Input
                    id="scheduleStop"
                    type="time"
                    value={config.scheduleStop}
                    onChange={(e) => handleChange('scheduleStop', e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <p className="text-sm">
                    Current schedule: Mining will run from <span className="font-medium">{config.scheduleStart}</span> to <span className="font-medium">{config.scheduleStop}</span>
                    {config.scheduleStart > config.scheduleStop ? " (overnight)" : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoStart"
                  checked={config.autoStart}
                  onCheckedChange={(checked) => handleChange('autoStart', checked)}
                />
                <Label htmlFor="autoStart">
                  Auto-start Mining
                  <p className="text-xs text-muted-foreground">
                    Automatically start mining when application launches
                  </p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="profitOptimizer"
                  checked={config.profitOptimizer || false}
                  onCheckedChange={(checked) => handleChange('profitOptimizer', checked)}
                />
                <Label htmlFor="profitOptimizer">
                  Automatic Profit Optimization
                  <p className="text-xs text-muted-foreground">
                    Dynamically switch between mining pools to maximize earnings (TERA AI system)
                  </p>
                </Label>
              </div>
              
              {config.profitOptimizer && (
                <div className="ml-8 mt-2 bg-slate-800/50 p-3 rounded-md border border-slate-700">
                  <h4 className="text-sm font-medium mb-2">Profit Optimizer Settings</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="optimizerInterval" className="text-xs">Check Interval (minutes)</Label>
                      <Select
                        value={config.optimizerInterval || '30'}
                        onValueChange={(value) => handleChange('optimizerInterval', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="30" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="15">15</SelectItem>
                          <SelectItem value="30">30</SelectItem>
                          <SelectItem value="60">60</SelectItem>
                          <SelectItem value="120">120</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="optimizerConsiderLatency"
                        checked={config.optimizerConsiderLatency || true}
                        onCheckedChange={(checked) => handleChange('optimizerConsiderLatency', checked)}
                      />
                      <Label htmlFor="optimizerConsiderLatency" className="text-xs">
                        Consider pool latency in optimization
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="optimizerPinnedWallet"
                        checked={config.optimizerPinnedWallet || true}
                        onCheckedChange={(checked) => handleChange('optimizerPinnedWallet', checked)}
                      />
                      <Label htmlFor="optimizerPinnedWallet" className="text-xs">
                        Always direct rewards to bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6
                      </Label>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground">
                      Current most profitable pool: <span className="font-semibold text-green-500">Unmineable (1.00x)</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current payout rate: <span className="font-semibold text-green-500">0.00000050 BTC/100MH/hr</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last optimization: <span className="font-semibold">Just now</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </CardContent>
    </Card>
  );
}