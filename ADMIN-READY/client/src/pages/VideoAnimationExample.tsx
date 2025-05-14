import { useState } from 'react';
import WebsiteLayout from '@/components/website/WebsiteLayout';
import VideoMiningAnimation from '@/components/ui/VideoMiningAnimation';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  Rocket,
  Settings,
  Image as ImageIcon,
  Zap
} from 'lucide-react';

export const VideoAnimationExample = () => {
  const [active, setActive] = useState(true);
  const [showText, setShowText] = useState(true);
  const [logoImage, setLogoImage] = useState('/logo1.png');
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [textColor, setTextColor] = useState('text-blue-400');
  const [variant, setVariant] = useState<'cosmic' | 'orbit' | 'warp' | 'blast'>('cosmic');
  
  // Image options
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
    { name: 'Orange', value: 'text-orange-400' },
    { name: 'Yellow', value: 'text-yellow-400' },
    { name: 'White', value: 'text-white' }
  ];
  
  return (
    <WebsiteLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-white">Video-Style Mining Animation</h1>
        
        {/* Main display and controls layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview area */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Animation Preview</CardTitle>
                <CardDescription>Canvas-based dynamic mining animation</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-700">
                  <VideoMiningAnimation
                    active={active}
                    logoImage={logoImage}
                    showText={showText}
                    speed={speed}
                    textColor={textColor}
                    variant={variant}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 py-4">
                <Button 
                  onClick={() => setActive(!active)}
                  variant={active ? "outline" : "default"}
                  className="flex-1"
                >
                  {active ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {active ? "Pause Animation" : "Start Animation"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Controls area */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Animation Controls</CardTitle>
                <CardDescription>Customize the animation style</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 mb-6">
                    <TabsTrigger value="basic">
                      <Rocket className="h-4 w-4 mr-2" /> Basic
                    </TabsTrigger>
                    <TabsTrigger value="style">
                      <Settings className="h-4 w-4 mr-2" /> Style
                    </TabsTrigger>
                    <TabsTrigger value="variants">
                      <Zap className="h-4 w-4 mr-2" /> Themes
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Basic Settings */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Animation Speed</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {(['slow', 'normal', 'fast'] as const).map((s) => (
                          <Button
                            key={s}
                            variant={speed === s ? "default" : "outline"}
                            onClick={() => setSpeed(s)}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Show Text</Label>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={showText} 
                            onCheckedChange={setShowText} 
                          />
                          <span className="text-sm text-gray-400">{showText ? 'On' : 'Off'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
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
                  
                  {/* Style Settings */}
                  <TabsContent value="style" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Center Logo</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {imageOptions.map((img) => (
                          <Button
                            key={img.path}
                            variant={logoImage === img.path ? "default" : "outline"}
                            className="p-1 h-auto flex flex-col items-center"
                            onClick={() => setLogoImage(img.path)}
                          >
                            <img 
                              src={img.path} 
                              alt={img.name} 
                              className="w-10 h-10 object-contain mb-1" 
                            />
                            <span className="text-xs text-center">{img.name.split(' ')[0]}</span>
                          </Button>
                        ))}
                        <Button
                          variant={logoImage === '' ? "default" : "outline"}
                          className="p-1 h-auto flex flex-col items-center"
                          onClick={() => setLogoImage('')}
                        >
                          <div className="w-10 h-10 flex items-center justify-center border border-dashed border-gray-500 rounded-full mb-1">
                            <ImageIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <span className="text-xs text-center">None</span>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Variants */}
                  <TabsContent value="variants" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Animation Theme</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          variant={variant === 'cosmic' ? "default" : "outline"}
                          className="p-2 h-auto flex flex-col items-center"
                          onClick={() => setVariant('cosmic')}
                        >
                          <div className="w-full h-20 rounded-md bg-gradient-to-b from-blue-900 to-indigo-900 mb-2 flex items-center justify-center overflow-hidden">
                            <div className="relative w-4 h-4 bg-white rounded-full">
                              <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-70"></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium">Cosmic</span>
                        </Button>
                        
                        <Button
                          variant={variant === 'orbit' ? "default" : "outline"}
                          className="p-2 h-auto flex flex-col items-center"
                          onClick={() => setVariant('orbit')}
                        >
                          <div className="w-full h-20 rounded-md bg-gradient-to-b from-cyan-900 to-blue-900 mb-2 flex items-center justify-center overflow-hidden">
                            <div className="relative w-10 h-10 rounded-full border border-dashed border-cyan-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium">Orbit</span>
                        </Button>
                        
                        <Button
                          variant={variant === 'warp' ? "default" : "outline"}
                          className="p-2 h-auto flex flex-col items-center"
                          onClick={() => setVariant('warp')}
                        >
                          <div className="w-full h-20 rounded-md bg-gradient-to-b from-purple-900 to-indigo-900 mb-2 flex items-center justify-center overflow-hidden">
                            <div className="relative w-full h-full flex items-center justify-center">
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-800 opacity-50"></div>
                              <div className="w-2 h-8 bg-white rounded-full blur-sm transform rotate-45"></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium">Warp Speed</span>
                        </Button>
                        
                        <Button
                          variant={variant === 'blast' ? "default" : "outline"}
                          className="p-2 h-auto flex flex-col items-center"
                          onClick={() => setVariant('blast')}
                        >
                          <div className="w-full h-20 rounded-md bg-gradient-to-b from-orange-900 to-red-900 mb-2 flex items-center justify-center overflow-hidden">
                            <div className="relative w-10 h-10 rounded-full bg-gradient-to-b from-yellow-500 to-orange-600 blur-sm"></div>
                          </div>
                          <span className="text-sm font-medium">Blast Off</span>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Examples section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-white">Animation Presets</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Cosmic Mining */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Cosmic Mining</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full aspect-square">
                  <VideoMiningAnimation
                    active={true}
                    logoImage="/logo1.png"
                    variant="cosmic"
                    speed="normal"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-800 py-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setVariant('cosmic');
                    setSpeed('normal');
                    setLogoImage('/logo1.png');
                    setShowText(true);
                    setTextColor('text-blue-400');
                    setActive(true);
                  }}
                >
                  Apply
                </Button>
              </CardFooter>
            </Card>
            
            {/* Orbital Beans */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Orbital Beans</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full aspect-square">
                  <VideoMiningAnimation
                    active={true}
                    logoImage="/bean.png"
                    variant="orbit"
                    textColor="text-cyan-400"
                    speed="slow"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-800 py-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setVariant('orbit');
                    setSpeed('slow');
                    setLogoImage('/bean.png');
                    setShowText(true);
                    setTextColor('text-cyan-400');
                    setActive(true);
                  }}
                >
                  Apply
                </Button>
              </CardFooter>
            </Card>
            
            {/* Warp Speed */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Warp Speed</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full aspect-square">
                  <VideoMiningAnimation
                    active={true}
                    logoImage=""
                    variant="warp"
                    textColor="text-purple-400"
                    speed="fast"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-800 py-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setVariant('warp');
                    setSpeed('fast');
                    setLogoImage('');
                    setShowText(true);
                    setTextColor('text-purple-400');
                    setActive(true);
                  }}
                >
                  Apply
                </Button>
              </CardFooter>
            </Card>
            
            {/* Blast Off */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Blast Off</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full aspect-square">
                  <VideoMiningAnimation
                    active={true}
                    logoImage="/coffee-bean.png"
                    variant="blast"
                    textColor="text-orange-400"
                    speed="normal"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-800 py-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setVariant('blast');
                    setSpeed('normal');
                    setLogoImage('/coffee-bean.png');
                    setShowText(true);
                    setTextColor('text-orange-400');
                    setActive(true);
                  }}
                >
                  Apply
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default VideoAnimationExample;