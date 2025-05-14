import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WebsiteLayout from "./WebsiteLayout";

export default function TokenInfo() {
  const tokenDistribution = [
    { category: "Mining Rewards", percentage: 40, color: "bg-blue-500" },
    { category: "Ecosystem Development", percentage: 25, color: "bg-purple-500" },
    { category: "Team & Advisors", percentage: 15, color: "bg-teal-500" },
    { category: "Community Incentives", percentage: 10, color: "bg-amber-500" },
    { category: "Initial Liquidity", percentage: 10, color: "bg-red-500" }
  ];

  const roadmap = [
    {
      quarter: "Q2 2025",
      title: "Token Launch",
      description: "Initial token launch on decentralized exchanges with liquidity provision.",
      completed: true
    },
    {
      quarter: "Q3 2025",
      title: "Mining Integration",
      description: "Integration of token rewards with our mining platform for additional incentives.",
      completed: false
    },
    {
      quarter: "Q4 2025",
      title: "Governance Launch",
      description: "Introduction of governance features allowing token holders to vote on platform developments.",
      completed: false
    },
    {
      quarter: "Q1 2026",
      title: "Ecosystem Expansion",
      description: "Partnership with other blockchain projects to expand the utility of our token.",
      completed: false
    }
  ];

  return (
    <WebsiteLayout>
      <div>
        {/* Hero section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                KloudBugToken (KBT)
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                The utility token powering the KloudBugZigMiner ecosystem, designed to 
                reward miners and enable governance of our platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Buy KBT Token
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  View on Etherscan
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Token details */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">Token Overview</h2>
              <p className="text-lg text-gray-300">
                KBT is designed to align incentives between miners, platform developers, and token holders.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-center">Token Supply</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-white">100,000,000</p>
                  <p className="text-gray-400 mt-2">Fixed maximum supply</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-center">Token Standard</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-white">ERC-20</p>
                  <p className="text-gray-400 mt-2">Ethereum blockchain</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-center">Use Cases</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-white">4+</p>
                  <p className="text-gray-400 mt-2">Platform utilities</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Token distribution */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">Token Distribution</h2>
              <p className="text-lg text-gray-300">
                Our token allocation is designed to ensure long-term sustainability and growth of the KloudBugZigMiner ecosystem.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="h-8 w-full flex rounded-lg overflow-hidden mb-8">
                {tokenDistribution.map((item, index) => (
                  <div
                    key={index}
                    className={`${item.color} h-full`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.category}: ${item.percentage}%`}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {tokenDistribution.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${item.color} mr-3`} />
                    <div>
                      <p className="text-white font-medium">{item.category}</p>
                      <p className="text-gray-400">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Token utilities */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">Token Utilities</h2>
              <p className="text-lg text-gray-300">
                KBT token provides multiple utilities within our ecosystem, creating real value for token holders.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Mining Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Earn additional KBT tokens as a bonus on top of your regular Bitcoin mining rewards when using our platform.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Fee Discounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Hold KBT tokens to receive discounts on platform fees, including subscription fees and withdrawal fees.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Governance Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Participate in platform governance by voting on key decisions using your KBT tokens. Shape the future of our mining ecosystem.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle>Premium Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Unlock premium platform features by staking KBT tokens, including advanced analytics, priority support, and early access to new features.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Roadmap */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">Token Roadmap</h2>
              <p className="text-lg text-gray-300">
                Our strategic plan for token development and integration with the KloudBugZigMiner platform.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 h-full w-0.5 bg-blue-500/30 transform -translate-x-1/2" />
                
                {/* Roadmap items */}
                <div className="space-y-12">
                  {roadmap.map((item, index) => (
                    <div key={index} className={`relative ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      <div className={`flex items-center md:flex-row ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <div className={`md:hidden absolute left-4 w-5 h-5 rounded-full border-4 ${item.completed ? 'bg-blue-500 border-blue-300' : 'bg-gray-800 border-gray-600'} transform -translate-x-1/2`} />
                        
                        <div className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-auto md:pl-8'}`}>
                          <span className="inline-block px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-sm font-medium mb-2">
                            {item.quarter}
                          </span>
                          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-gray-400">{item.description}</p>
                        </div>
                        
                        <div className={`hidden md:block absolute left-1/2 w-5 h-5 rounded-full border-4 ${item.completed ? 'bg-blue-500 border-blue-300' : 'bg-gray-800 border-gray-600'} transform -translate-x-1/2`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Join the KBT Ecosystem</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of our growing community and unlock the full potential of the KloudBugZigMiner platform with KBT tokens.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Buy KBT Token
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Read Whitepaper
              </Button>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
}