import { Card } from '@/components/ui/card';
import { Check, Loader, Circle } from 'lucide-react';

interface RoadmapItem {
  title: string;
  items: string[];
  status: 'completed' | 'inProgress' | 'upcoming';
}

export function Roadmap() {
  const roadmap: RoadmapItem[] = [
    {
      title: "Q1 2023: Launch Phase",
      items: [
        "Token contract development and security audit",
        "Website launch and social media presence establishment",
        "Initial DEX offering and liquidity provision",
        "Community building initiatives and early adopter rewards"
      ],
      status: "completed"
    },
    {
      title: "Q2 2023: Growth Phase",
      items: [
        "CEX listings on tier-2 exchanges",
        "Staking platform development and launch",
        "Cross-chain integration (BSC and Solana)",
        "Community governance mechanism implementation"
      ],
      status: "completed"
    },
    {
      title: "Q3-Q4 2023: Expansion Phase",
      items: [
        "Tier-1 exchange listings",
        "NFT collection launch with utility for holders",
        "Mobile wallet app development",
        "Strategic partnerships with major crypto projects"
      ],
      status: "inProgress"
    },
    {
      title: "2024: Ecosystem Phase",
      items: [
        "Decentralized application (dApp) platform",
        "MoonMeme marketplace for NFTs and digital goods",
        "Metaverse integration and virtual experiences",
        "Cross-platform gaming integration"
      ],
      status: "upcoming"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white" id="roadmap">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-dark">
            Our <span className="text-primary">Roadmap</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lightgray max-w-2xl mx-auto">
            The journey of MoonMeme from launch to ecosystem expansion
          </p>
        </div>
        
        <div className="relative pl-10 md:pl-12 max-w-3xl mx-auto">
          <div className="absolute w-0.5 bg-accent top-0 bottom-0 left-0"></div>
          
          {roadmap.map((phase, index) => (
            <div key={index} className="relative mb-12 pl-8 last:mb-0" style={{
              '::before': {
                content: '""',
                position: 'absolute',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'hsl(var(--accent))',
                left: '-10px',
                top: '24px',
                zIndex: 1,
              }
            }}>
              <h3 className="font-heading font-semibold text-xl text-primary mb-2">{phase.title}</h3>
              <Card className="bg-white p-5 rounded-lg shadow-md border border-accent/20">
                <ul className="space-y-2">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      {phase.status === 'completed' ? (
                        <Check className="text-success mt-1 mr-2 h-5 w-5" />
                      ) : phase.status === 'inProgress' ? (
                        <Loader className="text-secondary/70 animate-spin mt-1 mr-2 h-5 w-5" />
                      ) : (
                        <Circle className="text-lightgray/50 mt-1 mr-2 h-5 w-5" />
                      )}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
