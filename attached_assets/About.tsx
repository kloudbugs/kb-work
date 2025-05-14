import { Shield, Users, Lock, RotateCcw, DollarSign, Globe, Heart } from 'lucide-react';

export function About() {
  return (
    <section className="py-16 md:py-24 bg-white" id="about">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 text-dark">
            About <span className="text-primary">MPT Token</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lightgray max-w-2xl mx-auto">
            A mission-driven token that combines innovative blockchain technology with global humanitarian impact.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-heading font-semibold text-2xl mb-4 text-dark">
              The Story Behind MPT
            </h3>
            <p className="text-lightgray mb-4">
              Inspired by the global coffee culture and the morning buzz that fuels productivity, MPT (formerly KLOUD BUGS)
              emerged from a group of crypto enthusiasts who spent countless hours in coffee shops
              developing blockchain projects to build a fund to help civil rights movements and humanitarian projects worldwide.
            </p>
            <p className="text-lightgray mb-4">
              What started as a coffee-fueled brainstorming session evolved into a mission to create a token that captures 
              the energetic spirit of coffee culture while supporting a worldwide project of humanitarianism that is fueled 
              digitally and applied globally.
            </p>
            <p className="text-lightgray mb-4">
              Today, MPT is brewing a revolution in the crypto space with its unique tokenomics and
              community-driven approach. Our token is mined by users themselves, creating a dual benefit: 
              generating personal revenue while simultaneously supporting civil rights projects worldwide.
            </p>
            <p className="text-lightgray mb-6">
              Through our innovative mining subscription service, we've created a sustainable model where 
              a portion of mining rewards automatically contributes to a global fund dedicated to advancing 
              civil rights initiatives. This way, each MPT miner becomes part of a larger movement for positive change.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary/20 text-secondary">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-dark">Fully Audited</h4>
                <p className="text-sm text-lightgray">Security is our priority</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-lightbg p-5 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-semibold text-lg mb-2 text-dark">Community Driven</h4>
              <p className="text-sm text-lightgray">Governed by holders through active voting</p>
            </div>
            <div className="bg-lightbg p-5 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-semibold text-lg mb-2 text-dark">Liquidity Locked</h4>
              <p className="text-sm text-lightgray">5-year locked liquidity for maximum security</p>
            </div>
            <div className="bg-lightbg p-5 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-4">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-semibold text-lg mb-2 text-dark">Multi-Chain</h4>
              <p className="text-sm text-lightgray">Available on Ethereum, BSC and Solana</p>
            </div>
            <div className="bg-lightbg p-5 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-semibold text-lg mb-2 text-dark">Mining Rewards</h4>
              <p className="text-sm text-lightgray">Earn revenue through our mining subscription</p>
            </div>
            <div className="bg-lightbg p-5 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md col-span-2 mt-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-semibold text-lg mb-2 text-dark">Civil Rights Impact</h4>
              <p className="text-sm text-lightgray">A portion of all mining rewards funds civil rights movements worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
