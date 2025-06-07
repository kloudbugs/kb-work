import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
// Mining pool display component removed - simplified version
import {
  DownloadCloud,
  Code,
  Copy,
  CheckCircle2,
  Terminal,
  Server,
  Cpu,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus
} from 'lucide-react';

interface MinerSoftware {
  id: string;
  name: string;
  type: 'CPU' | 'GPU' | 'ASIC' | 'Universal';
  description: string;
  supportedAlgorithms: string[];
  defaultConfig: string;
  configOptions: {
    name: string;
    description: string;
    type: 'text' | 'number' | 'select' | 'checkbox';
    default: any;
    options?: string[];
  }[];
}

// Available mining software options
const MINER_SOFTWARE: MinerSoftware[] = [
  {
    id: 'xmrig',
    name: 'XMRig',
    type: 'CPU',
    description: 'High performance RandomX CPU miner with CUDA/OpenCL support',
    supportedAlgorithms: ['randomx', 'kryptonight', 'argon2', 'astrobwt'],
    defaultConfig: `{
  "autosave": true,
  "cpu": {
    "enabled": true,
    "huge-pages": true,
    "hw-aes": null,
    "priority": null,
    "memory-pool": false,
    "yield": true,
    "asm": true,
    "argon2-impl": null,
    "astrobwt-max-size": 550,
    "astrobwt-avx2": false,
    "max-threads-hint": 100,
    "max-cpu-usage": 100,
    "rx": [0],
    "rx-numa": false,
    "threads": null
  },
  "opencl": {
    "enabled": false,
    "cache": true,
    "loader": null,
    "platform": "AMD",
    "adl": true,
    "cn/0": false,
    "cn-lite/0": false
  },
  "cuda": {
    "enabled": false,
    "loader": null,
    "nvml": true,
    "cn/0": false,
    "cn-lite/0": false
  },
  "donate-level": 1,
  "pools": [
    {
      "algo": "randomx",
      "coin": "XMR",
      "url": "rx.unmineable.com:3333",
      "user": "BTC:YOUR_WALLET_ADDRESS.WORKER#REFERRAL_CODE",
      "pass": "x",
      "rig-id": null,
      "keepalive": true,
      "tls": false
    }
  ]
}`,
    configOptions: [
      {
        name: 'algorithm',
        description: 'Mining algorithm',
        type: 'select',
        default: 'randomx',
        options: ['randomx', 'kryptonight', 'argon2', 'astrobwt']
      },
      {
        name: 'threads',
        description: 'Number of CPU threads to use (0 = auto)',
        type: 'number',
        default: 0
      },
      {
        name: 'cpu_priority',
        description: 'CPU process priority (0-5)',
        type: 'number',
        default: 3
      },
      {
        name: 'donate_level',
        description: 'Developer donation level (min: 1%)',
        type: 'number',
        default: 1
      }
    ]
  },
  {
    id: 'trex',
    name: 'T-Rex Miner',
    type: 'GPU',
    description: 'NVIDIA GPU miner with support for KAWPOW, ETHASH, AUTOLYKOS2, and many other algorithms',
    supportedAlgorithms: ['ethash', 'kawpow', 'autolykos2', 'firopow', 'progpow'],
    defaultConfig: `{
  "algo": "ethash",
  "api-bind-http": "0.0.0.0:4067",
  "api-bind-telnet": "0.0.0.0:4068",
  "autoupdate": false,
  "donate-level": 1,
  "log-path": "t-rex.log",
  "no-watchdog": true,
  "gpu-report-interval": 5,
  "hashrate-avr": 30,
  "intensity": 20,
  "cpu-priority": 2,
  "temperature-limit": 85,
  "temperature-start": 40,
  "url": "ethash.unmineable.com:3333",
  "user": "BTC:YOUR_WALLET_ADDRESS.WORKER#REFERRAL_CODE",
  "pass": "x",
  "worker": "worker"
}`,
    configOptions: [
      {
        name: 'algorithm',
        description: 'Mining algorithm',
        type: 'select',
        default: 'ethash',
        options: ['ethash', 'kawpow', 'autolykos2', 'firopow', 'progpow']
      },
      {
        name: 'intensity',
        description: 'Mining intensity (1-25)',
        type: 'number',
        default: 20
      },
      {
        name: 'temp_limit',
        description: 'GPU temperature limit (°C)',
        type: 'number',
        default: 85
      },
      {
        name: 'donate_level',
        description: 'Developer donation level (%)',
        type: 'number',
        default: 1
      }
    ]
  },
  {
    id: 'cgminer',
    name: 'CGMiner',
    type: 'ASIC',
    description: 'Multi-threaded multi-pool ASIC, FPGA and GPU miner',
    supportedAlgorithms: ['sha256', 'scrypt'],
    defaultConfig: `{
  "pools": [
    {
      "url": "stratum+tcp://sha256.usa.nicehash.com:3334",
      "user": "YOUR_WALLET_ADDRESS.WORKER",
      "pass": "x"
    },
    {
      "url": "stratum+tcp://stratum.slushpool.com:3333",
      "user": "username.worker",
      "pass": "password"
    }
  ],
  "api-listen": true,
  "api-port": "4028",
  "api-allow": "W:0/0",
  "expiry": "120",
  "failover-only": true,
  "no-pool-disable": true,
  "no-submit-stale": true,
  "queue": "2",
  "scan-time": "60",
  "temp-cutoff": "95",
  "temp-target": "80",
  "temp-hysteresis": "3"
}`,
    configOptions: [
      {
        name: 'algorithm',
        description: 'Mining algorithm',
        type: 'select',
        default: 'sha256',
        options: ['sha256', 'scrypt']
      },
      {
        name: 'target_temp',
        description: 'Target temperature (°C)',
        type: 'number',
        default: 80
      },
      {
        name: 'cutoff_temp',
        description: 'Cutoff temperature (°C)',
        type: 'number',
        default: 95
      }
    ]
  },
  {
    id: 'custom',
    name: 'Custom Configuration',
    type: 'Universal',
    description: 'Create your own custom mining configuration from scratch',
    supportedAlgorithms: ['sha256', 'ethash', 'randomx', 'scrypt', 'other'],
    defaultConfig: `// Custom mining configuration
// You can write any configuration here
{
  "miner": "custom",
  "algorithm": "YOUR_ALGORITHM",
  "pool": {
    "url": "YOUR_POOL_URL:PORT",
    "user": "YOUR_WALLET_ADDRESS.WORKER",
    "pass": "x"
  },
  "hardware": {
    "type": "cpu/gpu/asic",
    "threads": 4,
    "intensity": 20,
    "temperature_limit": 85
  }
}`,
    configOptions: [
      {
        name: 'algorithm',
        description: 'Mining algorithm',
        type: 'select',
        default: 'sha256',
        options: ['sha256', 'ethash', 'randomx', 'scrypt', 'other']
      }
    ]
  }
];

// Mining pool templates
const POOL_TEMPLATES = {
  nicehash: {
    sha256: {
      url: 'stratum+tcp://sha256.usa.nicehash.com:3334',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'NiceHash - SHA256 (Bitcoin) - US Server'
    },
    ethash: {
      url: 'stratum+tcp://ethash.usa.nicehash.com:3353',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'NiceHash - Ethash (Ethereum) - US Server'
    },
    randomx: {
      url: 'stratum+tcp://randomx.usa.nicehash.com:3354',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'NiceHash - RandomX (Monero) - US Server'
    },
    eu_sha256: {
      url: 'stratum+tcp://sha256.eu-north.nicehash.com:3334',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'NiceHash - SHA256 (Bitcoin) - EU Server'
    },
    asia_sha256: {
      url: 'stratum+tcp://sha256.jp.nicehash.com:3334',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'NiceHash - SHA256 (Bitcoin) - Asia Server'
    }
  },
  unmineable: {
    sha256: {
      url: 'stratum+tcp://sha256.unmineable.com:3333',
      format: 'BTC:{wallet}.{worker}#{referral}',
      pass: 'x',
      description: 'Unmineable - SHA256 (BTC)'
    },
    ethash: {
      url: 'stratum+tcp://ethash.unmineable.com:3333',
      format: 'BTC:{wallet}.{worker}#{referral}',
      pass: 'x',
      description: 'Unmineable - Ethash (ETH→BTC)'
    },
    randomx: {
      url: 'rx.unmineable.com:3333',
      format: 'BTC:{wallet}.{worker}#{referral}',
      pass: 'x',
      description: 'Unmineable - RandomX (XMR→BTC)'
    },
    kawpow: {
      url: 'stratum+tcp://kawpow.unmineable.com:3333',
      format: 'BTC:{wallet}.{worker}#{referral}',
      pass: 'x',
      description: 'Unmineable - KawPow (RVN→BTC)'
    }
  },
  slushpool: {
    sha256: {
      url: 'stratum+tcp://stratum.slushpool.com:3333',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'Slush Pool / Braiins Pool - SHA256 (Bitcoin)'
    },
    eu_sha256: {
      url: 'stratum+tcp://eu.stratum.slushpool.com:3333',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'Slush Pool / Braiins Pool - SHA256 (Bitcoin) - EU Server'
    }
  },
  f2pool: {
    sha256: {
      url: 'stratum+tcp://btc.f2pool.com:3333',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'F2Pool - SHA256 (Bitcoin)'
    },
    ethash: {
      url: 'stratum+tcp://eth.f2pool.com:6688',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'F2Pool - Ethash (Ethereum)'
    },
    eth_solo: {
      url: 'stratum+tcp://eth-solo.f2pool.com:8888',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'F2Pool - Ethash SOLO Mining (Ethereum)'
    }
  },
  solo: {
    bitcoin: {
      url: 'http://127.0.0.1:8332',
      format: '{rpcuser}',
      pass: '{rpcpassword}',
      description: 'Solo Mining - Bitcoin (Requires local node)'
    }
  },
  dual: {
    eth_zil: {
      url: 'stratum+tcp://eth.f2pool.com:6688',
      format: '{wallet}.{worker}',
      pass: 'x',
      description: 'Dual Mining - ETH + ZIL',
      secondary_url: 'stratum+tcp://eu.ezil.me:5555',
      secondary_format: '{wallet}.{worker}',
      secondary_pass: 'x'
    }
  }
};

export function CustomMinerConfigGenerator() {
  const [selectedMiner, setSelectedMiner] = useState<string>('xmrig');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('randomx');
  const [selectedPool, setSelectedPool] = useState<string>('unmineable');
  const [configType, setConfigType] = useState<'json' | 'bat' | 'sh'>('json');
  const [walletAddress, setWalletAddress] = useState<string>('bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6');
  const [workerName, setWorkerName] = useState<string>('AORUS15');
  const [referralCode, setReferralCode] = useState<string>('1784277766');
  const [cpuThreads, setCpuThreads] = useState<number>(4);
  const [intensity, setIntensity] = useState<number>(20);
  const [donateLevel, setDonateLevel] = useState<number>(1);
  const [maxTemp, setMaxTemp] = useState<number>(85);
  
  // Advanced settings
  const [advancedSettings, setAdvancedSettings] = useState<boolean>(false);
  const [customPoolUrl, setCustomPoolUrl] = useState<string>('');
  const [customUserFormat, setCustomUserFormat] = useState<string>('');
  const [customPass, setCustomPass] = useState<string>('x');
  const [useCustomPool, setUseCustomPool] = useState<boolean>(false);
  
  // Custom JSON config
  const [customJsonConfig, setCustomJsonConfig] = useState<string>('');
  
  // Generated config
  const [generatedConfig, setGeneratedConfig] = useState<string>('');
  
  const { toast } = useToast();
  
  // Get the current miner details
  const getCurrentMiner = (): MinerSoftware => {
    return MINER_SOFTWARE.find(m => m.id === selectedMiner) || MINER_SOFTWARE[0];
  };
  
  // Handle miner change
  const handleMinerChange = (minerId: string) => {
    const miner = MINER_SOFTWARE.find(m => m.id === minerId);
    if (miner) {
      setSelectedMiner(minerId);
      // Set default algorithm
      if (miner.supportedAlgorithms.length > 0 && !miner.supportedAlgorithms.includes(selectedAlgorithm)) {
        setSelectedAlgorithm(miner.supportedAlgorithms[0]);
      }
      
      // Set default config
      if (minerId === 'custom') {
        setCustomJsonConfig(miner.defaultConfig);
      }
    }
  };
  
  // Handle algorithm change
  const handleAlgorithmChange = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    
    // Check if the selected pool supports this algorithm
    const poolSupportsAlgo = POOL_TEMPLATES[selectedPool as keyof typeof POOL_TEMPLATES] && 
                           POOL_TEMPLATES[selectedPool as keyof typeof POOL_TEMPLATES][algorithm as keyof typeof POOL_TEMPLATES[keyof typeof POOL_TEMPLATES]];
                           
    if (!poolSupportsAlgo) {
      // Find first pool that supports this algorithm
      for (const pool in POOL_TEMPLATES) {
        if (POOL_TEMPLATES[pool as keyof typeof POOL_TEMPLATES][algorithm as keyof typeof POOL_TEMPLATES[keyof typeof POOL_TEMPLATES]]) {
          setSelectedPool(pool);
          break;
        }
      }
    }
  };
  
  // Generate mining configuration
  const generateConfig = () => {
    const currentMiner = getCurrentMiner();
    
    if (currentMiner.id === 'custom') {
      setGeneratedConfig(customJsonConfig);
      toast({
        title: "Configuration Generated",
        description: "Your custom mining configuration has been generated.",
        variant: "default"
      });
      return;
    }
    
    try {
      let config: any = {};
      
      // Get pool details
      let poolUrl = '';
      let poolUser = '';
      let poolPass = 'x';
      
      if (useCustomPool) {
        poolUrl = customPoolUrl;
        poolUser = customUserFormat
          .replace('{wallet}', walletAddress)
          .replace('{username}', walletAddress)
          .replace('{worker}', workerName)
          .replace('{referral}', referralCode);
        poolPass = customPass;
      } else {
        const poolTemplate = POOL_TEMPLATES[selectedPool as keyof typeof POOL_TEMPLATES][selectedAlgorithm as keyof typeof POOL_TEMPLATES[keyof typeof POOL_TEMPLATES]];
        
        if (!poolTemplate) {
          throw new Error(`Selected pool (${selectedPool}) does not support the ${selectedAlgorithm} algorithm.`);
        }
        
        poolUrl = poolTemplate.url;
        poolUser = poolTemplate.format
          .replace('{wallet}', walletAddress)
          .replace('{username}', walletAddress)
          .replace('{worker}', workerName)
          .replace('{referral}', referralCode);
        poolPass = poolTemplate.pass;
      }
      
      // Generate config based on miner type
      if (configType === 'json') {
        switch (currentMiner.id) {
          case 'xmrig':
            config = JSON.parse(currentMiner.defaultConfig);
            config.cpu.threads = cpuThreads === 0 ? null : cpuThreads;
            config["donate-level"] = donateLevel;
            config.pools[0].algo = selectedAlgorithm;
            config.pools[0].url = poolUrl;
            config.pools[0].user = poolUser;
            config.pools[0].pass = poolPass;
            break;
            
          case 'trex':
            config = JSON.parse(currentMiner.defaultConfig);
            config.algo = selectedAlgorithm;
            config.intensity = intensity;
            config["temperature-limit"] = maxTemp;
            config["donate-level"] = donateLevel;
            config.url = poolUrl;
            config.user = poolUser;
            config.pass = poolPass;
            config.worker = workerName;
            break;
            
          case 'cgminer':
            config = JSON.parse(currentMiner.defaultConfig);
            config.pools[0].url = poolUrl;
            config.pools[0].user = poolUser;
            config.pools[0].pass = poolPass;
            config["temp-target"] = maxTemp - 5;
            config["temp-cutoff"] = maxTemp;
            break;
        }
        
        setGeneratedConfig(JSON.stringify(config, null, 2));
      } else if (configType === 'bat') {
        // Generate batch file
        let batContent = '';
        
        switch (currentMiner.id) {
          case 'xmrig':
            batContent = `@echo off
setlocal EnableDelayedExpansion

REM XMRig configuration for ${selectedAlgorithm} algorithm
REM Mining to: ${walletAddress} with worker: ${workerName}

xmrig.exe --url=${poolUrl} --user=${poolUser} --pass=${poolPass} --algo=${selectedAlgorithm} --cpu-priority=${Math.min(5, Math.max(0, Math.floor(cpuThreads / 2)))} --donate-level=${donateLevel} --threads=${cpuThreads === 0 ? 'auto' : cpuThreads}

pause`;
            break;
            
          case 'trex':
            batContent = `@echo off
setlocal EnableDelayedExpansion

REM T-Rex configuration for ${selectedAlgorithm} algorithm
REM Mining to: ${walletAddress} with worker: ${workerName}

t-rex.exe -a ${selectedAlgorithm} -o ${poolUrl} -u ${poolUser} -p ${poolPass} --intensity ${intensity} --temperature-limit ${maxTemp} -d 0,1,2,3,4

pause`;
            break;
            
          case 'cgminer':
            batContent = `@echo off
setlocal EnableDelayedExpansion

REM CGMiner configuration for ${selectedAlgorithm} algorithm
REM Mining to: ${walletAddress} with worker: ${workerName}

cgminer.exe --algorithm=${selectedAlgorithm} --url=${poolUrl} --userpass=${poolUser}:${poolPass} --temp-target=${maxTemp - 5} --temp-cutoff=${maxTemp} --api-listen

pause`;
            break;
        }
        
        setGeneratedConfig(batContent);
      } else if (configType === 'sh') {
        // Generate shell script
        let shContent = '';
        
        switch (currentMiner.id) {
          case 'xmrig':
            shContent = `#!/bin/bash

# XMRig configuration for ${selectedAlgorithm} algorithm
# Mining to: ${walletAddress} with worker: ${workerName}

./xmrig --url=${poolUrl} --user=${poolUser} --pass=${poolPass} --algo=${selectedAlgorithm} --cpu-priority=${Math.min(5, Math.max(0, Math.floor(cpuThreads / 2)))} --donate-level=${donateLevel} --threads=${cpuThreads === 0 ? 'auto' : cpuThreads}`;
            break;
            
          case 'trex':
            shContent = `#!/bin/bash

# T-Rex configuration for ${selectedAlgorithm} algorithm
# Mining to: ${walletAddress} with worker: ${workerName}

./t-rex -a ${selectedAlgorithm} -o ${poolUrl} -u ${poolUser} -p ${poolPass} --intensity ${intensity} --temperature-limit ${maxTemp} -d 0,1,2,3,4`;
            break;
            
          case 'cgminer':
            shContent = `#!/bin/bash

# CGMiner configuration for ${selectedAlgorithm} algorithm
# Mining to: ${walletAddress} with worker: ${workerName}

./cgminer --algorithm=${selectedAlgorithm} --url=${poolUrl} --userpass=${poolUser}:${poolPass} --temp-target=${maxTemp - 5} --temp-cutoff=${maxTemp} --api-listen`;
            break;
        }
        
        setGeneratedConfig(shContent);
      }
      
      toast({
        title: "Configuration Generated",
        description: `Your ${currentMiner.name} configuration has been generated successfully.`,
        variant: "default"
      });
    } catch (error: any) {
      console.error('Failed to generate config:', error);
      toast({
        title: "Generation Failed",
        description: `Failed to generate configuration: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  // Copy config to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedConfig);
    toast({
      title: "Copied to Clipboard",
      description: "Your mining configuration has been copied to the clipboard.",
      variant: "default"
    });
  };
  
  // Download config
  const downloadConfig = () => {
    try {
      const element = document.createElement("a");
      let extension = '.json';
      
      if (configType === 'bat') {
        extension = '.bat';
      } else if (configType === 'sh') {
        extension = '.sh';
      }
      
      const file = new Blob([generatedConfig], {type: configType === 'json' ? 'application/json' : 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${selectedMiner}_${selectedAlgorithm}_config${extension}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Config Downloaded",
        description: `Your mining configuration has been downloaded as ${element.download}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to download config:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download configuration file. Please try copying it instead.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Custom Miner Configuration Generator</h2>
          <p className="text-sm text-muted-foreground">Create custom configurations for your mining software</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Select Mining Pool</CardTitle>
          <CardDescription>
            Choose from our supported mining pools to generate your configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedPool} onValueChange={setSelectedPool}>
            <SelectTrigger>
              <SelectValue placeholder="Select a mining pool" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nicehash">NiceHash</SelectItem>
              <SelectItem value="unmineable">Unmineable</SelectItem>
              <SelectItem value="f2pool">F2Pool</SelectItem>
              <SelectItem value="slushpool">SlushPool</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration options */}
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Miner Software</CardTitle>
              <CardDescription>Select your mining software</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="miner">Mining Software</Label>
                <Select
                  value={selectedMiner}
                  onValueChange={handleMinerChange}
                >
                  <SelectTrigger id="miner">
                    <SelectValue placeholder="Select mining software" />
                  </SelectTrigger>
                  <SelectContent>
                    {MINER_SOFTWARE.map(miner => (
                      <SelectItem key={miner.id} value={miner.id}>
                        {miner.name} ({miner.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{getCurrentMiner().description}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="algorithm">Mining Algorithm</Label>
                <Select
                  value={selectedAlgorithm}
                  onValueChange={handleAlgorithmChange}
                >
                  <SelectTrigger id="algorithm">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentMiner().supportedAlgorithms.map(algo => (
                      <SelectItem key={algo} value={algo}>{algo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="configType">Configuration Format</Label>
                <Select
                  value={configType}
                  onValueChange={(value) => setConfigType(value as 'json' | 'bat' | 'sh')}
                >
                  <SelectTrigger id="configType">
                    <SelectValue placeholder="Select config format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON Configuration</SelectItem>
                    <SelectItem value="bat">Windows Batch File (.bat)</SelectItem>
                    <SelectItem value="sh">Linux Shell Script (.sh)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pool Settings</CardTitle>
              <CardDescription>Configure your mining pool</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pool">Mining Pool</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => setUseCustomPool(!useCustomPool)}
                  >
                    {useCustomPool ? 'Use Presets' : 'Custom Pool'}
                  </Button>
                </div>
                
                {!useCustomPool ? (
                  <Select
                    value={selectedPool}
                    onValueChange={setSelectedPool}
                    disabled={useCustomPool}
                  >
                    <SelectTrigger id="pool">
                      <SelectValue placeholder="Select mining pool" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(POOL_TEMPLATES).map(pool => (
                        <SelectItem 
                          key={pool} 
                          value={pool}
                          disabled={!POOL_TEMPLATES[pool as keyof typeof POOL_TEMPLATES][selectedAlgorithm as keyof typeof POOL_TEMPLATES[keyof typeof POOL_TEMPLATES]]}
                        >
                          {pool.charAt(0).toUpperCase() + pool.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="customPoolUrl" className="text-xs">Pool URL</Label>
                      <Input 
                        id="customPoolUrl" 
                        value={customPoolUrl} 
                        onChange={(e) => setCustomPoolUrl(e.target.value)}
                        placeholder="stratum+tcp://pool.example.com:3333" 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="customUserFormat" className="text-xs">User Format</Label>
                      <Input 
                        id="customUserFormat" 
                        value={customUserFormat} 
                        onChange={(e) => setCustomUserFormat(e.target.value)}
                        placeholder="{wallet}.{worker}" 
                      />
                      <p className="text-xs text-muted-foreground">Use {'{wallet}'}, {'{worker}'}, {'{referral}'} as placeholders</p>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="customPass" className="text-xs">Password</Label>
                      <Input 
                        id="customPass" 
                        value={customPass} 
                        onChange={(e) => setCustomPass(e.target.value)}
                        placeholder="x" 
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input 
                  id="walletAddress" 
                  value={walletAddress} 
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Your Bitcoin wallet address" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workerName">Worker Name</Label>
                  <Input 
                    id="workerName" 
                    value={workerName} 
                    onChange={(e) => setWorkerName(e.target.value)}
                    placeholder="AORUS15" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referralCode">Referral Code</Label>
                  <Input 
                    id="referralCode" 
                    value={referralCode} 
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="1784277766" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {selectedMiner !== 'custom' && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Hardware Settings</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setAdvancedSettings(!advancedSettings)}
                  >
                    {advancedSettings ? (
                      <ChevronUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    )}
                    {advancedSettings ? 'Less' : 'More'}
                  </Button>
                </div>
                <CardDescription>
                  Configure miner performance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* CPU specific settings */}
                {(getCurrentMiner().id === 'xmrig' || getCurrentMiner().type === 'CPU') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cpuThreads">CPU Threads: {cpuThreads === 0 ? 'Auto' : cpuThreads}</Label>
                      {cpuThreads > 0 && (
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setCpuThreads(Math.max(0, cpuThreads - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setCpuThreads(cpuThreads + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <Slider
                      id="cpuThreads"
                      min={0}
                      max={32}
                      step={1}
                      value={[cpuThreads]}
                      onValueChange={(value) => setCpuThreads(value[0])}
                    />
                    <p className="text-xs text-muted-foreground">Set to 0 for auto-detection</p>
                  </div>
                )}
                
                {/* GPU specific settings */}
                {(getCurrentMiner().id === 'trex' || getCurrentMiner().type === 'GPU') && (
                  <div className="space-y-2">
                    <Label htmlFor="intensity">GPU Intensity: {intensity}</Label>
                    <Slider
                      id="intensity"
                      min={1}
                      max={25}
                      step={1}
                      value={[intensity]}
                      onValueChange={(value) => setIntensity(value[0])}
                    />
                    <p className="text-xs text-muted-foreground">Higher values = more performance, more heat</p>
                  </div>
                )}
                
                {/* Temperature limit */}
                {getCurrentMiner().id !== 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="maxTemp">Temperature Limit: {maxTemp}°C</Label>
                    <Slider
                      id="maxTemp"
                      min={50}
                      max={95}
                      step={1}
                      value={[maxTemp]}
                      onValueChange={(value) => setMaxTemp(value[0])}
                    />
                  </div>
                )}
                
                {/* Donation level */}
                {(getCurrentMiner().id === 'xmrig' || getCurrentMiner().id === 'trex') && (
                  <div className="space-y-2">
                    <Label htmlFor="donateLevel">Dev Fee: {donateLevel}%</Label>
                    <Slider
                      id="donateLevel"
                      min={1}
                      max={5}
                      step={1}
                      value={[donateLevel]}
                      onValueChange={(value) => setDonateLevel(value[0])}
                    />
                    <p className="text-xs text-muted-foreground">Support miner developers (minimum 1%)</p>
                  </div>
                )}
                
                {/* Advanced settings section */}
                {advancedSettings && (
                  <div className="pt-2 border-t space-y-4">
                    <h4 className="text-sm font-medium">Advanced Settings</h4>
                    
                    {getCurrentMiner().id === 'xmrig' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="hugePages" className="rounded" defaultChecked />
                          <Label htmlFor="hugePages" className="text-xs">Enable huge pages</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="hwAes" className="rounded" defaultChecked />
                          <Label htmlFor="hwAes" className="text-xs">Hardware AES</Label>
                        </div>
                      </>
                    )}
                    
                    {getCurrentMiner().id === 'trex' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="lowPower" className="rounded" />
                          <Label htmlFor="lowPower" className="text-xs">Low power mode</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="noWatchdog" className="rounded" defaultChecked />
                          <Label htmlFor="noWatchdog" className="text-xs">Disable watchdog</Label>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  onClick={generateConfig}
                  className="w-full bg-cyan-700 hover:bg-cyan-600 text-white"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Generate Configuration
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Custom JSON editor for 'custom' miner */}
          {selectedMiner === 'custom' && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Configuration</CardTitle>
                <CardDescription>
                  Edit your custom configuration directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={customJsonConfig} 
                  onChange={(e) => setCustomJsonConfig(e.target.value)}
                  className="font-mono text-xs h-64"
                />
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  onClick={generateConfig}
                  className="w-full bg-cyan-700 hover:bg-cyan-600 text-white"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Generate Configuration
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        {/* Generated configuration */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Configuration</CardTitle>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!generatedConfig}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={downloadConfig}
                    disabled={!generatedConfig}
                  >
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <CardDescription>
                {generatedConfig 
                  ? `Ready to use with ${getCurrentMiner().name} for ${selectedAlgorithm} mining` 
                  : 'Click "Generate Configuration" to create your miner configuration'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <div className="relative h-full">
                <div className="absolute inset-0 overflow-auto bg-zinc-950 rounded-md p-4">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                    {generatedConfig || '# Your generated configuration will appear here'}
                  </pre>
                </div>
              </div>
            </CardContent>
            {generatedConfig && (
              <CardFooter className="border-t pt-4">
                <div className="text-sm space-y-2 w-full">
                  <h4 className="font-medium">How to use this configuration:</h4>
                  {configType === 'json' && (
                    <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Copy or download the configuration above</li>
                      <li>Save it to a file named <code className="text-xs bg-zinc-800 px-1 rounded">{`${getCurrentMiner().id}.json`}</code> in the same directory as your mining software</li>
                      <li>Run the miner with <code className="text-xs bg-zinc-800 px-1 rounded">{`${getCurrentMiner().id} -c ${getCurrentMiner().id}.json`}</code></li>
                    </ol>
                  )}
                  {configType === 'bat' && (
                    <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Copy or download the configuration above</li>
                      <li>Save it to a file named <code className="text-xs bg-zinc-800 px-1 rounded">{`start_${getCurrentMiner().id}.bat`}</code> in the same directory as your mining software</li>
                      <li>Double-click the .bat file to start mining</li>
                    </ol>
                  )}
                  {configType === 'sh' && (
                    <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Copy or download the configuration above</li>
                      <li>Save it to a file named <code className="text-xs bg-zinc-800 px-1 rounded">{`start_${getCurrentMiner().id}.sh`}</code> in the same directory as your mining software</li>
                      <li>Make it executable with <code className="text-xs bg-zinc-800 px-1 rounded">chmod +x start_${getCurrentMiner().id}.sh</code></li>
                      <li>Run it with <code className="text-xs bg-zinc-800 px-1 rounded">./start_${getCurrentMiner().id}.sh</code></li>
                    </ol>
                  )}
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}