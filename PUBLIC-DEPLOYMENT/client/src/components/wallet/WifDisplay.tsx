import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WifKeyDisplayProps {
  wif?: string;
  label?: string;
}

// WIF Key Display Component - Always displays the full key for visibility
const WifKeyDisplay = ({ wif, label = "WIF Key" }: WifKeyDisplayProps) => {
  const { toast } = useToast();
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "WIF key copied",
      description: "The private key has been copied to clipboard.",
      duration: 3000,
    });
  };
  
  if (!wif) {
    return (
      <div className="text-center">
        <span className="text-gray-500 text-xs">Not<br/>available</span>
      </div>
    );
  }
  
  // Always display the full key for visibility
  return (
    <div className="flex flex-col items-start">
      {label && <span className="text-sm font-medium text-purple-600 mb-1">{label}</span>}
      
      <code className="text-xs font-mono text-black break-all mb-1 bg-yellow-50 p-1 rounded border border-yellow-200">{wif}</code>
      
      <div className="flex space-x-1 mt-1">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-7 px-2 flex items-center border-gray-300"
          onClick={() => copyToClipboard(wif)}
        >
          <Copy className="h-3 w-3 mr-1" /> Copy
        </Button>
      </div>
    </div>
  );
};

export default WifKeyDisplay;