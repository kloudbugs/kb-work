import { useState } from 'react';
import WebsiteLayout from '@/components/website/WebsiteLayout';
import MiningMeteorite from '@/components/ui/MiningMeteorite';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Rocket, 
  Play, 
  Pause, 
  Image as ImageIcon,
  Star,
  Text,
  Fuel,
  Timer,
  Layers,
  Zap
} from 'lucide-react';

export const MeteorExample = () => {
  // State for the meteorite configuration
  const [miningActive, setMiningActive] = useState(true);
  const [miningRate, setMiningRate] = useState(0.7);
  const [customImage, setCustomImage] = useState('/logo1.png');
  const [showMiner, setShowMiner] = useState(true);
  const [meteorCount, setMeteorCount] = useState(6);
  const [meteorSize, setMeteorSize] = useState(3);
  const [meteorSpeed, setMeteorSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [withText, setWithText] = useState(true);
  const [textColor, setTextColor] = useState('text-blue-400');
  const [pulseLight, setPulseLight] = useState(true);
  const [minerSize, setMinerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [backgroundColor, setBackgroundColor] = useState('rgba(0, 0, 0, 0.8)');
  
  // Advanced animation options
  const [orbitCount, setOrbitCount] = useState(3);
  const [particleCount, setParticleCount] = useState(15);
  const [enableWarpEffect, setEnableWarpEffect] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [enableCosmicDust, setEnableCosmicDust] = useState(true);
  const [satoshiParticles, setSatoshiParticles] = useState(false);
  
  // Custom status messages
  const [statusMessages, setStatusMessages] = useState([
    'Scanning blockchain...',
    'Connecting to mining pool...',
    'Initializing mining hardware...',
    'Starting hash computations...',
    'Mining active!',
    'Harvesting digital beans...',
    'Converting energy to satoshis...',
    'Securing the network...'
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // Custom image options
  const imageOptions = [
    { name: 'KLOUD-BUGS Logo', path: '/logo1.png' },
    { name: 'Bean', path: '/bean.png' },
    { name: 'Lady Bean', path: '/lady-bean.png' },
    { name: 'Baby Bean', path: '/baby-bean.png' },
    { name: 'Coffee Bean', path: '/coffee-bean.png' }
  ];
  
  // Color options
  const colorOptions = [
    { name: 'Blue', value: 'text-blue-400' },
    { name: 'Green', value: 'text-green-400' },
    { name: 'Purple', value: 'text-purple-400' },
    { name: 'Cyan', value: 'text-cyan-400' },
    { name: 'Amber', value: 'text-amber-400' },
    { name: 'Red', value: 'text-red-400' },
    { name: 'White', value: 'text-white' }
  ];
  
  // Background options
  const backgroundOptions = [
    { name: 'Dark', value: 'rgba(0, 0, 0, 0.8)' },
    { name: 'Blue Dark', value: 'rgba(10, 20, 50, 0.8)' },
    { name: 'Purple Dark', value: 'rgba(30, 10, 60, 0.8)' },
    { name: 'Green Dark', value: 'rgba(10, 30, 20, 0.8)' },
    { name: 'Transparent', value: 'rgba(0, 0, 0, 0.4)' }
  ];
  
  // Add a new status message
  const addStatusMessage = () => {
    if (newMessage.trim()) {
      setStatusMessages([...statusMessages, newMessage.trim()]);
      setNewMessage('');
    }
  };
  
  // Remove a status message
  const removeStatusMessage = (index: number) => {
    setStatusMessages(statusMessages.filter((_, i) => i !== index));
  };
  
  return (
    <WebsiteLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-white">Mining Meteorite Display</h1>
        
        {/* Main display and controls layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview area */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Meteorite Preview</CardTitle>
                <CardDescription>Live preview of your configuration</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-700">
                  <MiningMeteorite
                    active={miningActive}
                    miningRate={miningRate}
                    customImage={customImage}
                    showMiner={showMiner}
                    meteorCount={meteorCount}
                    meteorSize={meteorSize}
                    meteorSpeed={meteorSpeed}
                    withText={withText}
                    textColor={textColor}
                    backgroundColor={backgroundColor}
                    pulseLight={pulseLight}
                    minerSize={minerSize}
                    orbitCount={orbitCount}
                    particleCount={particleCount}
                    enableWarpEffect={enableWarpEffect}
                    glowIntensity={glowIntensity}
                    enableCosmicDust={enableCosmicDust}
                    satoshiParticles={satoshiParticles}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 py-4">
                <Button 
                  onClick={() => setMiningActive(!miningActive)}
                  variant={miningActive ? "outline" : "default"}
                  className="flex-1"
                >
                  {miningActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {miningActive ? "Pause Animation" : "Start Animation"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Controls area */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Animation Controls</CardTitle>
                <CardDescription>Customize the meteorite display</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="w-full grid grid-cols-5 mb-6">
                    <TabsTrigger value="basic">
                      <Rocket className="h-4 w-4 mr-2" /> Basic
                    </TabsTrigger>
                    <TabsTrigger value="meteors">
                      <Star className="h-4 w-4 mr-2" /> Meteors
                    </TabsTrigger>
                    <TabsTrigger value="display">
                      <ImageIcon className="h-4 w-4 mr-2" /> Display
                    </TabsTrigger>
                    <TabsTrigger value="text">
                      <Text className="h-4 w-4 mr-2" /> Text
                    </TabsTrigger>
                    <TabsTrigger value="advanced">
                      <Zap className="h-4 w-4 mr-2" /> Effects
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Basic Settings */}
                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="mining-rate">Mining Rate</Label>
                        <span className="text-sm text-gray-400">{(miningRate * 100).toFixed(0)}%</span>
                      </div>
                      <Slider 
                        id="mining-rate"
                        value={[miningRate * 100]} 
                        max={100}
                        step={5}
                        onValueChange={(value) => setMiningRate(value[0] / 100)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Show Miner</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={showMiner} 
                            onCheckedChange={setShowMiner} 
                          />
                          <span className="text-sm text-gray-400">{showMiner ? 'On' : 'Off'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Pulse Light Effect</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={pulseLight} 
                            onCheckedChange={setPulseLight} 
                          />
                          <span className="text-sm text-gray-400">{pulseLight ? 'On' : 'Off'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Miner Image</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {imageOptions.map((img) => (
                          <Button
                            key={img.path}
                            variant={customImage === img.path ? "default" : "outline"}
                            className="p-1 h-auto flex flex-col items-center"
                            onClick={() => setCustomImage(img.path)}
                          >
                            <img 
                              src={img.path} 
                              alt={img.name} 
                              className="w-10 h-10 object-contain mb-1" 
                            />
                            <span className="text-xs text-center">{img.name.split(' ')[0]}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Miner Size</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                          <Button
                            key={size}
                            variant={minerSize === size ? "default" : "outline"}
                            onClick={() => setMinerSize(size)}
                          >
                            {size.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Meteor Settings */}
                  <TabsContent value="meteors" className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="meteor-count">Meteor Count</Label>
                        <span className="text-sm text-gray-400">{meteorCount}</span>
                      </div>
                      <Slider 
                        id="meteor-count"
                        value={[meteorCount]} 
                        min={1}
                        max={15}
                        step={1}
                        onValueChange={(value) => setMeteorCount(value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="meteor-size">Meteor Size</Label>
                        <span className="text-sm text-gray-400">{meteorSize}</span>
                      </div>
                      <Slider 
                        id="meteor-size"
                        value={[meteorSize]} 
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => setMeteorSize(value[0])}
                      />
                    </div>
                    
                    <div>
                      <Label>Meteor Speed</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {(['slow', 'medium', 'fast'] as const).map((speed) => (
                          <Button
                            key={speed}
                            variant={meteorSpeed === speed ? "default" : "outline"}
                            onClick={() => setMeteorSpeed(speed)}
                          >
                            {speed.charAt(0).toUpperCase() + speed.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Display Settings */}
                  <TabsContent value="display" className="space-y-4">
                    <div>
                      <Label>Background Color</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {backgroundOptions.map((bg) => (
                          <Button
                            key={bg.value}
                            variant={backgroundColor === bg.value ? "default" : "outline"}
                            onClick={() => setBackgroundColor(bg.value)}
                            className="relative overflow-hidden"
                          >
                            <div 
                              className="absolute inset-0 opacity-50" 
                              style={{ backgroundColor: bg.value }}
                            />
                            <span className="relative z-10">{bg.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Show Text Status</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={withText} 
                            onCheckedChange={setWithText} 
                          />
                          <span className="text-sm text-gray-400">{withText ? 'On' : 'Off'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Text Color</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {colorOptions.map((color) => (
                          <Button
                            key={color.value}
                            variant={textColor === color.value ? "default" : "outline"}
                            onClick={() => setTextColor(color.value)}
                            className={`${color.value.replace('text-', 'border-')}`}
                          >
                            <span className={color.value}>{color.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Text Settings */}
                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Status Messages</Label>
                      <p className="text-sm text-gray-400">
                        These messages will rotate while the mining animation is active.
                      </p>
                      <div className="mt-2 max-h-48 overflow-y-auto bg-gray-800/50 rounded-md p-2">
                        {statusMessages.map((msg, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-700 last:border-0">
                            <span className="text-sm text-gray-300">{msg}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                              onClick={() => removeStatusMessage(idx)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Add new status message..."
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      />
                      <Button 
                        onClick={addStatusMessage}
                        disabled={!newMessage.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {/* Advanced Effects Settings */}
                  <TabsContent value="advanced" className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="orbit-count">Orbital Rings</Label>
                        <span className="text-sm text-gray-400">{orbitCount}</span>
                      </div>
                      <Slider 
                        id="orbit-count"
                        value={[orbitCount]} 
                        min={0}
                        max={5}
                        step={1}
                        onValueChange={(value) => setOrbitCount(value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="particle-count">Cosmic Dust Particles</Label>
                        <span className="text-sm text-gray-400">{particleCount}</span>
                      </div>
                      <Slider 
                        id="particle-count"
                        value={[particleCount]} 
                        min={5}
                        max={30}
                        step={1}
                        onValueChange={(value) => setParticleCount(value[0])}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Warp Speed Effect</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={enableWarpEffect} 
                            onCheckedChange={setEnableWarpEffect} 
                          />
                          <span className="text-sm text-gray-400">{enableWarpEffect ? 'On' : 'Off'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Cosmic Dust</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={enableCosmicDust} 
                            onCheckedChange={setEnableCosmicDust} 
                          />
                          <span className="text-sm text-gray-400">{enableCosmicDust ? 'On' : 'Off'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Bitcoin Symbols</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={satoshiParticles} 
                            onCheckedChange={setSatoshiParticles} 
                          />
                          <span className="text-sm text-gray-400">{satoshiParticles ? 'On' : 'Off'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Glow Intensity</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {(['low', 'medium', 'high'] as const).map((intensity) => (
                          <Button
                            key={intensity}
                            variant={glowIntensity === intensity ? "default" : "outline"}
                            onClick={() => setGlowIntensity(intensity)}
                          >
                            {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg mt-4">
                      <h3 className="text-white font-semibold mb-2">Effect Combinations</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="border-blue-500"
                          onClick={() => {
                            setOrbitCount(3);
                            setParticleCount(20);
                            setEnableWarpEffect(false);
                            setGlowIntensity('medium');
                            setEnableCosmicDust(true);
                            setSatoshiParticles(false);
                          }}
                        >
                          Cosmic Orbits
                        </Button>
                        <Button
                          variant="outline"
                          className="border-purple-500"
                          onClick={() => {
                            setOrbitCount(0);
                            setParticleCount(25);
                            setEnableWarpEffect(true);
                            setGlowIntensity('high');
                            setEnableCosmicDust(true);
                            setSatoshiParticles(false);
                          }}
                        >
                          Warp Speed
                        </Button>
                        <Button
                          variant="outline"
                          className="border-green-500"
                          onClick={() => {
                            setOrbitCount(1);
                            setParticleCount(15);
                            setEnableWarpEffect(false);
                            setGlowIntensity('medium');
                            setEnableCosmicDust(true);
                            setSatoshiParticles(true);
                          }}
                        >
                          Satoshi Space
                        </Button>
                        <Button
                          variant="outline"
                          className="border-amber-500"
                          onClick={() => {
                            setOrbitCount(5);
                            setParticleCount(30);
                            setEnableWarpEffect(true);
                            setGlowIntensity('high');
                            setEnableCosmicDust(true);
                            setSatoshiParticles(true);
                          }}
                        >
                          Maximum Effects
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Example usage section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-white">Example Configurations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fast Mining */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Fast Mining</CardTitle>
                <CardDescription>High-intensity mining display</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full aspect-square">
                  <MiningMeteorite
                    active={true}
                    miningRate={1.0}
                    customImage={"/logo1.png"}
                    meteorCount={12}
                    meteorSize={5}
                    meteorSpeed={"fast"}
                    textColor={"text-green-400"}
                    backgroundColor={"rgba(10, 30, 20, 0.8)"}
                    orbitCount={2}
                    particleCount={20}
                    enableWarpEffect={true}
                    glowIntensity={"high"}
                    enableCosmicDust={true}
                    satoshiParticles={false}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-800 py-4">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMiningRate(1.0);
                    setCustomImage("/logo1.png");
                    setMeteorCount(12);
                    setMeteorSize(5);
                    setMeteorSpeed("fast");
                    setTextColor("text-green-400");
                    setBackgroundColor("rgba(10, 30, 20, 0.8)");
                    setOrbitCount(2);
                    setParticleCount(20);
                    setEnableWarpEffect(true);
                    setGlowIntensity("high");
                    setEnableCosmicDust(true);
                    setSatoshiParticles(false);
                  }}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Apply Configuration
                </Button>
              </CardFooter>
            </Card>
            
            {/* Cosmic Bean */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Cosmic Bean</CardTitle>
                <CardDescription>Bean-centered mining animation</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full aspect-square">
                  <MiningMeteorite
                    active={true}
                    miningRate={0.7}
                    customImage={"/bean.png"}
                    meteorCount={6}
                    meteorSize={3}
                    meteorSpeed={"medium"}
                    textColor={"text-blue-400"}
                    backgroundColor={"rgba(10, 20, 50, 0.8)"}
                    orbitCount={3}
                    particleCount={15}
                    enableWarpEffect={false}
                    glowIntensity={"medium"}
                    enableCosmicDust={true}
                    satoshiParticles={false}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-800 py-4">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMiningRate(0.7);
                    setCustomImage("/bean.png");
                    setMeteorCount(6);
                    setMeteorSize(3);
                    setMeteorSpeed("medium");
                    setTextColor("text-blue-400");
                    setBackgroundColor("rgba(10, 20, 50, 0.8)");
                    setOrbitCount(3);
                    setParticleCount(15);
                    setEnableWarpEffect(false);
                    setGlowIntensity("medium");
                    setEnableCosmicDust(true);
                    setSatoshiParticles(false);
                  }}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Apply Configuration
                </Button>
              </CardFooter>
            </Card>
            
            {/* Slow Burn */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Slow Burn</CardTitle>
                <CardDescription>Relaxed mining visualization</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full aspect-square">
                  <MiningMeteorite
                    active={true}
                    miningRate={0.3}
                    customImage={"/coffee-bean.png"}
                    meteorCount={3}
                    meteorSize={2}
                    meteorSpeed={"slow"}
                    textColor={"text-amber-400"}
                    backgroundColor={"rgba(30, 10, 60, 0.8)"}
                    orbitCount={1}
                    particleCount={10}
                    enableWarpEffect={false}
                    glowIntensity={"low"}
                    enableCosmicDust={true}
                    satoshiParticles={true}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-800 py-4">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMiningRate(0.3);
                    setCustomImage("/coffee-bean.png");
                    setMeteorCount(3);
                    setMeteorSize(2);
                    setMeteorSpeed("slow");
                    setTextColor("text-amber-400");
                    setBackgroundColor("rgba(30, 10, 60, 0.8)");
                    setOrbitCount(1);
                    setParticleCount(10);
                    setEnableWarpEffect(false);
                    setGlowIntensity("low");
                    setEnableCosmicDust(true);
                    setSatoshiParticles(true);
                  }}
                >
                  <Timer className="mr-2 h-4 w-4" />
                  Apply Configuration
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default MeteorExample;