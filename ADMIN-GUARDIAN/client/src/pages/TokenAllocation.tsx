import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { Bitcoin, DollarSign, RefreshCw } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from '@/components/ui/separator';
import kloudbugsLogo from '@/assets/kloudbugs_logo.png';
import teraLogo from '@/assets/tera-logo.png';
import replitLogo from '@/assets/replit-logo.png';

interface TokenPool {
  satoshis: number;
  btc: number;
  usd: number;
}

interface TokenPoolsData {
  mpt: TokenPool;
  tah: TokenPool;
  replitDonations: TokenPool;
}

export default function TokenAllocation() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('btc');
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/token-pools'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error fetching token pools',
        description: String(error),
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const tokenPools: TokenPoolsData = data?.tokenPools || {
    mpt: { satoshis: 0, btc: 0, usd: 0 },
    tah: { satoshis: 0, btc: 0, usd: 0 },
    replitDonations: { satoshis: 0, btc: 0, usd: 0 }
  };

  const totalAmount = {
    satoshis: tokenPools.mpt.satoshis + tokenPools.tah.satoshis + tokenPools.replitDonations.satoshis,
    btc: tokenPools.mpt.btc + tokenPools.tah.btc + tokenPools.replitDonations.btc,
    usd: tokenPools.mpt.usd + tokenPools.tah.usd + tokenPools.replitDonations.usd
  };

  // Calculate percentages for progress bars
  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Token Allocation</h1>
          <button 
            onClick={() => refetch()} 
            className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-md"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <p className="text-muted-foreground">
          1% of all mining rewards are allocated to each of these pools to support global civil rights initiatives and Replit.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="btc">BTC</TabsTrigger>
            <TabsTrigger value="usd">USD</TabsTrigger>
            <TabsTrigger value="satoshi">Satoshi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="btc" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <TokenPoolCard 
                title="MPT Token Pool" 
                description="Mining Power Token - Supporting mining infrastructure"
                value={tokenPools.mpt.btc}
                total={totalAmount.btc}
                format={(val) => `${val.toFixed(8)} BTC`}
                icon={<img src={kloudbugsLogo} alt="KloudBugs Logo" className="h-10 w-10 object-cover rounded" />}
                color="bg-indigo-500"
              />
              
              <TokenPoolCard 
                title="TAH Token Pool" 
                description="Token for Algorithmic Humanity - Support for civil rights"
                value={tokenPools.tah.btc}
                total={totalAmount.btc}
                format={(val) => `${val.toFixed(8)} BTC`}
                icon={<img src={teraLogo} alt="TERA Logo" className="h-10 w-10 object-cover rounded-full" />}
                color="bg-emerald-500"
              />
              
              <TokenPoolCard 
                title="Replit Donations" 
                description="Supporting the Replit platform"
                value={tokenPools.replitDonations.btc}
                total={totalAmount.btc}
                format={(val) => `${val.toFixed(8)} BTC`}
                icon={<img src={replitLogo} alt="Replit Logo" className="h-10 w-10 object-contain" />}
                color="bg-gray-800 dark:bg-gray-200"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="usd" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <TokenPoolCard 
                title="MPT Token Pool" 
                description="Mining Power Token - Supporting mining infrastructure"
                value={tokenPools.mpt.usd}
                total={totalAmount.usd}
                format={(val) => `$${val.toFixed(2)}`}
                icon={<img src={kloudbugsLogo} alt="KloudBugs Logo" className="h-10 w-10 object-cover rounded" />}
                color="bg-indigo-500"
              />
              
              <TokenPoolCard 
                title="TAH Token Pool" 
                description="Token for Algorithmic Humanity - Support for civil rights"
                value={tokenPools.tah.usd}
                total={totalAmount.usd}
                format={(val) => `$${val.toFixed(2)}`}
                icon={<img src={teraLogo} alt="TERA Logo" className="h-10 w-10 object-cover rounded-full" />}
                color="bg-emerald-500"
              />
              
              <TokenPoolCard 
                title="Replit Donations" 
                description="Supporting the Replit platform"
                value={tokenPools.replitDonations.usd}
                total={totalAmount.usd}
                format={(val) => `$${val.toFixed(2)}`}
                icon={<img src={replitLogo} alt="Replit Logo" className="h-10 w-10 object-contain" />}
                color="bg-gray-800 dark:bg-gray-200"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="satoshi" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <TokenPoolCard 
                title="MPT Token Pool" 
                description="Mining Power Token - Supporting mining infrastructure"
                value={tokenPools.mpt.satoshis}
                total={totalAmount.satoshis}
                format={(val) => `${val.toLocaleString()} sats`}
                icon={<img src={kloudbugsLogo} alt="KloudBugs Logo" className="h-10 w-10 object-cover rounded" />}
                color="bg-indigo-500"
              />
              
              <TokenPoolCard 
                title="TAH Token Pool" 
                description="Token for Algorithmic Humanity - Support for civil rights"
                value={tokenPools.tah.satoshis}
                total={totalAmount.satoshis}
                format={(val) => `${val.toLocaleString()} sats`}
                icon={<img src={teraLogo} alt="TERA Logo" className="h-10 w-10 object-cover rounded-full" />}
                color="bg-emerald-500"
              />
              
              <TokenPoolCard 
                title="Replit Donations" 
                description="Supporting the Replit platform"
                value={tokenPools.replitDonations.satoshis}
                total={totalAmount.satoshis}
                format={(val) => `${val.toLocaleString()} sats`}
                icon={<img src={replitLogo} alt="Replit Logo" className="h-10 w-10 object-contain" />}
                color="bg-gray-800 dark:bg-gray-200"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About Token Allocation</h2>
          <p className="mb-4">
            With every mining reward, KLOUDBUGSZIGMINER automatically allocates 1% to each of the following pools:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Mining Power Token (MPT)</strong> - Funds infrastructure upgrades and 
              ongoing development of the KLOUDBUGSZIGMINER platform.
            </li>
            <li>
              <strong>Token for Algorithmic Humanity (TAH)</strong> - Supports global civil rights 
              initiatives, ensuring ethical technology development.
            </li>
            <li>
              <strong>Replit Donations</strong> - Contributions to Replit to support their 
              platform and educational initiatives.
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}

interface TokenPoolCardProps {
  title: string;
  description: string;
  value: number;
  total: number;
  format: (value: number) => string;
  icon: React.ReactNode;
  color: string;
}

function TokenPoolCard({ title, description, value, total, format, icon, color }: TokenPoolCardProps) {
  const percentage = total === 0 ? 0 : (value / total) * 100;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{format(value)}</div>
        <div className="space-y-2">
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full ${color}`} 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {percentage.toFixed(1)}% of total allocation
          </div>
        </div>
      </CardContent>
    </Card>
  );
}