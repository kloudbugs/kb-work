import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bitcoin, Server, Cpu, Zap, Shield, Database } from 'lucide-react';

export default function MiningConfigurationsPage() {
  const wallet = 'bc1qj93mnxgm0xuwyh3jvvqurjxjyq8uktg4y0sad6';
  const referralCode = '1784277766';
  
  // Configuration templates for different mining pools
  const configurations = [
    {
      name: 'NiceHash (No API Key)',
      description: 'Mine with NiceHash without needing an API key',
      icon: <Bitcoin className="h-10 w-10 text-yellow-500" />,
      command: `# For SHA-256 (Bitcoin):
stratum+tcp://sha256.usa.nicehash.com:3334
User: ${wallet}.AORUS15
Password: x`,
      benefits: [
        'No API key required',
        'Multiple server locations worldwide',
        'Automatic algorithm switching'
      ]
    },
    {
      name: 'Unmineable (With Referral)',
      description: 'Use your referral code for extra earnings',
      icon: <Cpu className="h-10 w-10 text-blue-500" />,
      command: `# For RandomX (CPU):
rx.unmineable.com:3333
User: BTC:${wallet}.AORUS15#${referralCode}
Password: x`,
      benefits: [
        'Built-in referral system (yours: ${referralCode})',
        'Mine with CPU, GPU or ASIC',
        'Low minimum payout threshold'
      ]
    },
    {
      name: 'Slush Pool / Braiins Pool',
      description: 'Oldest Bitcoin mining pool with PPLNS rewards',
      icon: <Zap className="h-10 w-10 text-purple-500" />,
      command: `# For SHA-256 (Bitcoin):
stratum+tcp://stratum.slushpool.com:3333
User: ${wallet}.AORUS15
Password: x`,
      benefits: [
        'Established since 2010',
        'Stable payouts with PPLNS',
        'Enterprise-grade security'
      ]
    },
    {
      name: 'F2Pool',
      description: 'One of the largest Bitcoin mining pools',
      icon: <Server className="h-10 w-10 text-green-500" />,
      command: `# For SHA-256 (Bitcoin):
stratum+tcp://btc.f2pool.com:3333
User: ${wallet}.AORUS15
Password: x`,
      benefits: [
        'Low fees (2.5% for BTC)',
        'Frequent payouts',
        'Multiple coin support'
      ]
    },
    {
      name: 'Solo Mining',
      description: 'Mine directly to the Bitcoin blockchain',
      icon: <Shield className="h-10 w-10 text-red-500" />,
      command: `# Requires running a Bitcoin node
http://127.0.0.1:8332
User: bitcoinrpc
Password: your_rpc_password`,
      benefits: [
        'Full block rewards',
        'No pool fees',
        'Total mining control'
      ]
    },
    {
      name: 'Dual Mining (ETH + ZIL)',
      description: 'Mine two cryptocurrencies simultaneously',
      icon: <Database className="h-10 w-10 text-amber-500" />,
      command: `# Using T-Rex miner:
t-rex.exe -a ethash -o stratum+tcp://eth.f2pool.com:6688 -u ${wallet}.AORUS15 -p x --dual-algo etchash --dual-coin zil --dual-algo-hashrate auto`,
      benefits: [
        'Increased total profitability',
        'Efficient hardware utilization',
        'Diversified mining rewards'
      ]
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Mining Configurations</h1>
          <p className="text-muted-foreground">All configurations are preset with your wallet address and referral code</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configurations.map((config, index) => (
            <Card key={index} className="overflow-hidden border-t-4" style={{ borderTopColor: config.icon.props.className.includes('yellow') ? '#EAB308' : 
                                                                     config.icon.props.className.includes('blue') ? '#3B82F6' :
                                                                     config.icon.props.className.includes('purple') ? '#8B5CF6' :
                                                                     config.icon.props.className.includes('green') ? '#22C55E' :
                                                                     config.icon.props.className.includes('red') ? '#EF4444' : '#F59E0B' }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{config.name}</CardTitle>
                  <div className="rounded-full p-2 bg-black/5">
                    {config.icon}
                  </div>
                </div>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded bg-zinc-950 p-3 font-mono text-xs text-green-400 whitespace-pre-wrap">
                  {config.command}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Benefits:</h4>
                  <ul className="text-sm space-y-1">
                    {config.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="text-xs">
                    Copy Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ghost Feather Feature</CardTitle>
            <CardDescription>
              Instantly add 100 virtual mining rigs to test your setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Create 100 virtual mining rigs with a total hashrate of 45 TH/s for testing purposes.</p>
                <p className="text-sm text-muted-foreground mt-1">This feature helps you test the TERA Guardian system without actual hardware.</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                Activate Ghost Feather
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}