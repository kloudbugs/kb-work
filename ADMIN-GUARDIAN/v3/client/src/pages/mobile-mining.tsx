import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Tablet, Laptop, Server, Info, ArrowRight } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function MobileMiningPage() {
  const [deviceType, setDeviceType] = useState("smartphone");
  const [deviceName, setDeviceName] = useState("");
  const [miningApp, setMiningApp] = useState("unmineable");
  const [showInstructions, setShowInstructions] = useState(false);
  
  const walletAddress = 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6';
  const referralCode = '1784277766';
  
  const deviceConfigs = {
    smartphone: {
      unmineable: {
        appName: "Unmineable App",
        downloadLink: "https://www.unmineable.com/miner",
        configSteps: [
          "1. Download the Unmineable app from the Play Store/App Store",
          "2. Create a new mining configuration",
          "3. Select BTC as your coin",
          `4. Enter your wallet address: ${walletAddress}`,
          `5. Enter referral code: ${referralCode} for 0.25% fee reduction`,
          "6. Start mining! The app will automatically select the best algorithm for your device"
        ],
        expectedHashrate: "300-1200 H/s (depends on device)",
        powerUsage: "High (keep device plugged in and cool)",
        dailyEstimate: "0.00000150-0.00000600 BTC"
      },
      cryptotab: {
        appName: "CryptoTab Browser",
        downloadLink: "https://cryptotabbrowser.com/mobile/",
        configSteps: [
          "1. Download CryptoTab Browser from the Play Store/App Store",
          "2. Create/login to your account",
          "3. Go to settings and connect your Bitcoin wallet",
          `4. Enter wallet address: ${walletAddress}`,
          "5. Start mining directly from the browser",
          "6. Adjust mining speed from the interface"
        ],
        expectedHashrate: "200-800 H/s (depends on device)",
        powerUsage: "Medium (browser-based mining)",
        dailyEstimate: "0.00000100-0.00000400 BTC"
      }
    },
    tablet: {
      unmineable: {
        appName: "Unmineable App",
        downloadLink: "https://www.unmineable.com/miner",
        configSteps: [
          "1. Download the Unmineable app from the Play Store/App Store",
          "2. Create a new mining configuration",
          "3. Select BTC as your coin",
          `4. Enter your wallet address: ${walletAddress}`,
          `5. Enter referral code: ${referralCode} for 0.25% fee reduction`,
          "6. Start mining! The app will automatically select the best algorithm for your tablet"
        ],
        expectedHashrate: "600-1800 H/s (depends on device)",
        powerUsage: "High (keep device plugged in and cool)",
        dailyEstimate: "0.00000300-0.00000900 BTC"
      },
      minergate: {
        appName: "MinerGate Mobile Miner",
        downloadLink: "https://minergate.com/downloads/mobile",
        configSteps: [
          "1. Download MinerGate Mobile Miner from the app store",
          "2. Create/login to your MinerGate account",
          "3. In settings, setup automatic payout",
          `4. Enter BTC wallet address: ${walletAddress}`,
          "5. Select CPU mining option",
          "6. Tap Start Mining button"
        ],
        expectedHashrate: "400-1500 H/s (depends on tablet model)",
        powerUsage: "High (optimize power settings)",
        dailyEstimate: "0.00000200-0.00000750 BTC"
      }
    },
    laptop: {
      unmineable: {
        appName: "Unmineable App (PC/Mac)",
        downloadLink: "https://www.unmineable.com/miner",
        configSteps: [
          "1. Download the Unmineable app for your laptop",
          "2. Create a new mining configuration",
          "3. Select BTC as your coin",
          `4. Enter your wallet address: ${walletAddress}`,
          `5. Enter referral code: ${referralCode} for 0.25% fee reduction`,
          "6. Select CPU mining mode",
          "7. Optional: Adjust threads based on your CPU (recommend leaving 1-2 cores free)"
        ],
        expectedHashrate: "1500-5000 H/s (depends on CPU)",
        powerUsage: "High (monitor temperatures)",
        dailyEstimate: "0.00000750-0.00002500 BTC"
      },
      xmrig: {
        appName: "XMRig (Advanced)",
        downloadLink: "https://xmrig.com/download",
        configSteps: [
          "1. Download XMRig for your laptop OS",
          "2. Create a config file with the following settings:",
          `"pool": "rx.unmineable.com:3333",`,
          `"user": "BTC:${walletAddress}.AORUS15#${referralCode}",`,
          `"pass": "x",`,
          `"algorithm": "rx/0",`,
          "3. Save config.json in the same folder as XMRig",
          "4. Open terminal/command prompt in the folder",
          "5. Run: ./xmrig (Linux/Mac) or xmrig.exe (Windows)"
        ],
        expectedHashrate: "2000-8000 H/s (depends on CPU model)",
        powerUsage: "Configurable (use --threads option)",
        dailyEstimate: "0.00001000-0.00004000 BTC"
      }
    }
  };
  
  const currentDeviceConfig = deviceConfigs[deviceType as keyof typeof deviceConfigs];
  const currentMiningConfig = currentDeviceConfig[miningApp as keyof typeof currentDeviceConfig];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mobile & Portable Device Mining</h1>
          <p className="text-muted-foreground">Mine Bitcoin from any device, anywhere</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Device Configuration</CardTitle>
            <CardDescription>Select your device type and preferred mining app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="device-type">Device Type</Label>
                <Select 
                  value={deviceType} 
                  onValueChange={setDeviceType}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Device Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smartphone">
                      <div className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4" />
                        Smartphone
                      </div>
                    </SelectItem>
                    <SelectItem value="tablet">
                      <div className="flex items-center">
                        <Tablet className="mr-2 h-4 w-4" />
                        Tablet
                      </div>
                    </SelectItem>
                    <SelectItem value="laptop">
                      <div className="flex items-center">
                        <Laptop className="mr-2 h-4 w-4" />
                        Laptop
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="device-name">Device Name (Optional)</Label>
                <Input 
                  id="device-name" 
                  placeholder="My iPhone 13" 
                  className="mt-2"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="mining-app">Mining App</Label>
                <Select 
                  value={miningApp} 
                  onValueChange={setMiningApp}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Mining App" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(currentDeviceConfig).map((app) => (
                      <SelectItem key={app} value={app}>
                        {currentDeviceConfig[app as keyof typeof currentDeviceConfig].appName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => setShowInstructions(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                Generate Configuration <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {showInstructions && (
          <Card className="border-t-4 border-t-indigo-500">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{currentMiningConfig.appName} Configuration</CardTitle>
                  <CardDescription>
                    For {deviceType === "smartphone" ? "Smartphone" : deviceType === "tablet" ? "Tablet" : "Laptop"}
                    {deviceName ? `: ${deviceName}` : ""}
                  </CardDescription>
                </div>
                <a 
                  href={currentMiningConfig.downloadLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 inline-flex items-center"
                >
                  Download App
                </a>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md bg-black/5 p-4">
                <h3 className="text-lg font-medium mb-2">Setup Instructions</h3>
                <ul className="space-y-2 text-sm">
                  {currentMiningConfig.configSteps.map((step, index) => (
                    <li key={index} className="flex">
                      <span className="text-green-500 mr-2">{step.startsWith(String(index + 1)) ? "" : "•"}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Performance Expectations</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Expected Hashrate</TableCell>
                      <TableCell>{currentMiningConfig.expectedHashrate}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Power Usage</TableCell>
                      <TableCell>{currentMiningConfig.powerUsage}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Daily Estimate (approx)</TableCell>
                      <TableCell>{currentMiningConfig.dailyEstimate}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="rounded-md bg-yellow-50 p-4 flex items-start">
                <Info className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Notes</h4>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• Mobile mining is less efficient than dedicated hardware</li>
                    <li>• Keep your device plugged in and well-ventilated</li>
                    <li>• Monitor your device temperature to prevent overheating</li>
                    <li>• Mining may increase battery wear over time</li>
                    <li>• Earnings will vary based on network difficulty</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Aorus 15 Laptop Optimized Configuration</CardTitle>
            <CardDescription>Specially configured for your Gigabyte Aorus 15 gaming laptop</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="xmrig">
              <TabsList className="mb-4">
                <TabsTrigger value="xmrig">XMRig (Advanced)</TabsTrigger>
                <TabsTrigger value="unmineable">Unmineable (Simple)</TabsTrigger>
                <TabsTrigger value="nicehash">NiceHash QuickMiner</TabsTrigger>
              </TabsList>
              
              <TabsContent value="xmrig" className="space-y-4">
                <div className="rounded bg-zinc-950 p-4 font-mono text-xs text-green-400 whitespace-pre-wrap">
{`// Save as config.json in XMRig folder
{
    "autosave": true,
    "cpu": {
        "enabled": true,
        "huge-pages": true,
        "hw-aes": true,
        "priority": 3,
        "memory-pool": true,
        "asm": true,
        "argon2-impl": null,
        "cn/0": false,
        "cn-lite/0": false,
        "rx/arq": "rx/0",
        "rx/keva": "rx/0",
        "rx/wow": "rx/0",
        "rx/0": true,
        "rx/fast": "rx/0",
        "rx/graft": null,
        "rx/sfx": "rx/0",
        "rx/twt": "rx/0",
        "cn-heavy/xhv": null,
        "argon2/chukwav2": null,
        "max-threads-hint": 75
    },
    "opencl": {
        "enabled": false
    },
    "cuda": {
        "enabled": false
    },
    "donate-level": 1,
    "donate-over-proxy": 1,
    "pools": [
        {
            "algo": "rx/0",
            "url": "rx.unmineable.com:3333",
            "user": "BTC:${walletAddress}.AORUS15#${referralCode}",
            "pass": "x",
            "tls": false,
            "keepalive": true,
            "nicehash": true
        }
    ],
    "api": {
        "id": null,
        "worker-id": "AORUS15"
    },
    "http": {
        "enabled": false
    },
    "randomx": {
        "1gb-pages": true,
        "init": -1,
        "init-avx2": -1,
        "mode": "auto",
        "numa": true,
        "scratchpad_prefetch_mode": 1
    }
}`}
                </div>
                
                <div className="bg-black/5 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Launch Command (Windows)</h3>
                  <div className="bg-black/80 text-green-400 p-2 rounded font-mono text-sm">
                    xmrig.exe
                  </div>
                  
                  <h3 className="font-medium mt-4 mb-2">Expected Performance (Aorus 15)</h3>
                  <ul className="space-y-1">
                    <li>• CPU: Approximately 4,000-7,000 H/s</li>
                    <li>• Daily earnings: ~0.00002000-0.00003500 BTC</li>
                    <li>• CPU Utilization: Configured to use 75% of your cores</li>
                    <li>• Power usage: Medium-high (keep plugged in)</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="unmineable" className="space-y-4">
                <div className="bg-black/5 p-4 rounded-md">
                  <h3 className="font-medium mb-3">Unmineable App Configuration (Simple)</h3>
                  
                  <ol className="space-y-2">
                    <li>1. Download Unmineable App from <a href="https://www.unmineable.com/miner" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">unmineable.com</a></li>
                    <li>2. Install and open the application</li>
                    <li>3. Select Bitcoin (BTC) as your mining coin</li>
                    <li>4. Enter your wallet address: <span className="font-mono bg-black/10 px-1 py-0.5 rounded">{walletAddress}</span></li>
                    <li>5. Enter referral code: <span className="font-mono bg-black/10 px-1 py-0.5 rounded">{referralCode}</span></li>
                    <li>6. Select CPU mining</li>
                    <li>7. Move the slider to 75% (recommended)</li>
                    <li>8. Click "Start Mining"</li>
                  </ol>
                  
                  <h3 className="font-medium mt-4 mb-2">Expected Performance</h3>
                  <ul className="space-y-1">
                    <li>• CPU: Approximately 3,500-6,500 H/s</li>
                    <li>• Daily earnings: ~0.00001750-0.00003250 BTC</li>
                    <li>• Ease of use: Very simple setup</li>
                    <li>• Automatically adjusts for optimal performance</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="nicehash" className="space-y-4">
                <div className="bg-black/5 p-4 rounded-md">
                  <h3 className="font-medium mb-3">NiceHash QuickMiner (Auto-switching)</h3>
                  
                  <ol className="space-y-2">
                    <li>1. Download NiceHash QuickMiner from <a href="https://www.nicehash.com/quickminer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">nicehash.com</a></li>
                    <li>2. Install and open the application</li>
                    <li>3. Enter your Bitcoin wallet address: <span className="font-mono bg-black/10 px-1 py-0.5 rounded">{walletAddress}</span></li>
                    <li>4. Select "Optimize for gaming" profile</li>
                    <li>5. Click "Start Mining"</li>
                  </ol>
                  
                  <h3 className="font-medium mt-4 mb-2">Expected Performance</h3>
                  <ul className="space-y-1">
                    <li>• CPU: Varies based on algorithm selection</li>
                    <li>• NiceHash automatically switches to the most profitable algorithm</li>
                    <li>• Daily earnings: ~0.00002000-0.00003750 BTC</li>
                    <li>• Advantage: Balances mining and system responsiveness</li>
                    <li>• Includes power management features</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}