import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BeanSequenceLoader from '@/components/ui/BeanSequenceLoader';
import WebsiteLayout from '@/components/website/WebsiteLayout';

export const LoadingExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<'bean' | 'lady-bean' | 'baby-bean' | 'coffee-bean'>('bean');
  const [withMeteors, setWithMeteors] = useState(true);
  const [withCosmic, setWithCosmic] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [meteorCount, setMeteorCount] = useState(6);
  
  const startLoading = () => {
    setIsLoading(true);
    
    // Automatically stop loading after 5 seconds for demo purposes
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };
  
  return (
    <WebsiteLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-white">Cosmic Bean Loading Animation</h1>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-4 text-white">Animation Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bean Character</label>
              <div className="flex gap-2">
                <Button 
                  variant={selectedCharacter === 'bean' ? 'default' : 'outline'} 
                  onClick={() => setSelectedCharacter('bean')}
                  className="flex-1"
                >
                  <img src="/bean.png" alt="Bean" className="h-5 w-5 mr-2" />
                  Bean
                </Button>
                <Button 
                  variant={selectedCharacter === 'lady-bean' ? 'default' : 'outline'} 
                  onClick={() => setSelectedCharacter('lady-bean')}
                  className="flex-1"
                >
                  <img src="/lady-bean.png" alt="Lady Bean" className="h-5 w-5 mr-2" />
                  Lady Bean
                </Button>
                <Button 
                  variant={selectedCharacter === 'baby-bean' ? 'default' : 'outline'} 
                  onClick={() => setSelectedCharacter('baby-bean')}
                  className="flex-1"
                >
                  <img src="/baby-bean.png" alt="Baby Bean" className="h-5 w-5 mr-2" />
                  Baby Bean
                </Button>
                <Button 
                  variant={selectedCharacter === 'coffee-bean' ? 'default' : 'outline'} 
                  onClick={() => setSelectedCharacter('coffee-bean')}
                  className="flex-1"
                >
                  <img src="/coffee-bean.png" alt="Coffee Bean" className="h-5 w-5 mr-2" />
                  Coffee Bean
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Loading Text</label>
              <input
                type="text"
                value={loadingText}
                onChange={(e) => setLoadingText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                placeholder="Enter loading text"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visual Effects</label>
              <div className="flex gap-2">
                <Button 
                  variant={withMeteors ? 'default' : 'outline'} 
                  onClick={() => setWithMeteors(!withMeteors)}
                  className="flex-1"
                >
                  {withMeteors ? '✓ ' : ''} Meteors
                </Button>
                <Button 
                  variant={withCosmic ? 'default' : 'outline'} 
                  onClick={() => setWithCosmic(!withCosmic)}
                  className="flex-1"
                >
                  {withCosmic ? '✓ ' : ''} Cosmic Effects
                </Button>
                <div className="flex-1 flex items-center gap-2">
                  <label className="text-gray-300 whitespace-nowrap">Meteor Count:</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    value={meteorCount} 
                    onChange={(e) => setMeteorCount(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-white">{meteorCount}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
            onClick={startLoading}
            disabled={isLoading}
          >
            Start Cosmic Bean Animation
          </Button>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4 text-white">Animation Preview</h2>
          
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            {!isLoading && (
              <div className="text-center text-gray-400">
                <p className="mb-2">Click "Start Cosmic Bean Animation" to see the loading screen</p>
                <img src={`/${selectedCharacter}.png`} alt="Bean" className="h-24 w-24 mx-auto opacity-50" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* The actual loader component */}
      <BeanSequenceLoader
        isLoading={isLoading}
        character={selectedCharacter}
        text={loadingText}
        withMeteors={withMeteors}
        meteorCount={meteorCount}
        withCosmic={withCosmic}
        size="lg"
        onComplete={() => console.log("Loading complete!")}
      />
    </WebsiteLayout>
  );
};

export default LoadingExample;