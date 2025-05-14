import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PriceChart } from '@/components/ui/chart';
import { Tag, Coins, Flame, RotateCcw, Network } from 'lucide-react';
import { FaExchangeAlt } from 'react-icons/fa';

interface TokenMetrics {
  currentPrice: string;
  priceChange: string;
  marketCap: string;
  marketCapChange: string;
  volume: string;
  volumeChange: string;
  supply: string;
  totalSupply: string;
  priceHistory: Array<{ date: string; price: number }>;
  exchanges: Array<{ name: string; volume: string; color: string }>;
}

export function Tokenomics() {
  const { data: metrics, isLoading, error } = useQuery<TokenMetrics>({
    queryKey: ['/api/token-metrics'],
  });

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-lightbg to-white" id="tokenomics">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-dark">
            KLOUD BUGS <span className="text-primary">Tokenomics</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lightgray max-w-2xl mx-auto">
            Brewing profits with a transparent, fair model designed for explosive growth
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-heading font-semibold text-xl mb-4 text-dark">
              Token Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Community & Public Sale</span>
                  <span className="font-bold text-primary">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Liquidity Pool</span>
                  <span className="font-bold text-secondary">15%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Team & Development</span>
                  <span className="font-bold text-accent">10%</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Marketing</span>
                  <span className="font-bold text-lightgray">10%</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Ecosystem Fund</span>
                  <span className="font-bold text-success">5%</span>
                </div>
                <Progress value={5} className="h-2" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-2xl mb-4 text-dark">
              Token Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary mt-1 mr-4">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-dark">Token Name & Symbol</h4>
                  <p className="text-lightgray">KLOUD BUGS (KBUG)</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary mt-1 mr-4">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-dark">Total Supply</h4>
                  <p className="text-lightgray">100,000,000,000 KBUG</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary mt-1 mr-4">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-dark">Token Burn</h4>
                  <p className="text-lightgray">2% of all transactions are automatically burned</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary mt-1 mr-4">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-dark">Transaction Fee</h4>
                  <p className="text-lightgray">5% total (2% burn, 2% redistribution, 1% development)</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary mt-1 mr-4">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-dark">Blockchain</h4>
                  <p className="text-lightgray">Ethereum (ERC-20), Binance Smart Chain (BEP-20), Solana (SPL)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard */}
        <Card className="p-6 md:p-8 shadow-lg">
          <h3 className="font-heading font-semibold text-2xl mb-6 text-dark text-center">
            Token Metrics Dashboard
          </h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <p>Loading token metrics...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-60">
              <p className="text-error">Failed to load token metrics</p>
            </div>
          ) : metrics ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-lightbg p-4 rounded-lg text-center">
                  <p className="text-lightgray text-sm">Current Price</p>
                  <p className="font-heading font-bold text-xl text-primary">{metrics.currentPrice}</p>
                  <p className={`text-xs ${metrics.priceChange.startsWith('+') ? 'text-success' : 'text-error'}`}>
                    {metrics.priceChange} <i className={`fas fa-arrow-${metrics.priceChange.startsWith('+') ? 'up' : 'down'}`}></i>
                  </p>
                </div>
                <div className="bg-lightbg p-4 rounded-lg text-center">
                  <p className="text-lightgray text-sm">Market Cap</p>
                  <p className="font-heading font-bold text-xl text-primary">{metrics.marketCap}</p>
                  <p className={`text-xs ${metrics.marketCapChange.startsWith('+') ? 'text-success' : 'text-error'}`}>
                    {metrics.marketCapChange} <i className={`fas fa-arrow-${metrics.marketCapChange.startsWith('+') ? 'up' : 'down'}`}></i>
                  </p>
                </div>
                <div className="bg-lightbg p-4 rounded-lg text-center">
                  <p className="text-lightgray text-sm">24h Volume</p>
                  <p className="font-heading font-bold text-xl text-primary">{metrics.volume}</p>
                  <p className={`text-xs ${metrics.volumeChange.startsWith('+') ? 'text-success' : 'text-error'}`}>
                    {metrics.volumeChange} <i className={`fas fa-arrow-${metrics.volumeChange.startsWith('+') ? 'up' : 'down'}`}></i>
                  </p>
                </div>
                <div className="bg-lightbg p-4 rounded-lg text-center">
                  <p className="text-lightgray text-sm">Circulating Supply</p>
                  <p className="font-heading font-bold text-xl text-primary">{metrics.supply}</p>
                  <p className="text-xs text-lightgray">out of {metrics.totalSupply}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="col-span-2 bg-lightbg rounded-lg p-4 h-60">
                  <PriceChart data={metrics.priceHistory} />
                </div>
                <div className="bg-lightbg rounded-lg p-4">
                  <h4 className="font-heading font-semibold mb-3 text-dark">Top Exchanges</h4>
                  <ul className="space-y-3">
                    {metrics.exchanges.map((exchange, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center mr-2" 
                            style={{ backgroundColor: exchange.color }}
                          >
                            <FaExchangeAlt className="text-white text-xs" />
                          </div>
                          <span>{exchange.name}</span>
                        </div>
                        <span className="text-success">{exchange.volume}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : null}
        </Card>
      </div>
    </section>
  );
}
