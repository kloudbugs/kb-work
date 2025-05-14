import { Button } from '@/components/ui/button';
import { Cloud, Coffee, Cannabis, Shield } from 'lucide-react';
import { Link } from 'wouter';
import logoPath from '@/assets/logo1.png';
import teraLogoPath from '@/assets/tera-logo.png';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-24 relative overflow-hidden" id="hero">
      <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-secondary/10 to-accent/5 -z-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-[10%] text-6xl text-primary/30 animate-bounce" style={{animationDuration: '3s'}}>
        <Cloud />
      </div>
      <div className="absolute top-1/3 right-[15%] text-5xl text-primary/20 animate-bounce" style={{animationDuration: '3.5s'}}>
        <Coffee />
      </div>
      <div className="absolute bottom-1/4 left-[20%] text-4xl text-primary/20 animate-bounce" style={{animationDuration: '4s'}}>
        <Cannabis />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-6xl mb-4 text-dark">
            Rise and Grind with <span className="text-primary">MPT</span> Token
          </h1>
          <p className="text-lg md:text-xl text-lightgray mb-8">
            Join the dual-token ecosystem! MPT powers our profit-driven coffee-themed mining operations,
            while TAH funds civil rights initiatives worldwide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => scrollToSection('tokenomics')}
              variant="outline"
              size="lg"
              className="bg-white text-primary border-2 border-primary px-8 py-6 rounded-full font-heading font-semibold text-lg hover:bg-primary/5"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto">
          {/* MPT Token */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-spin" style={{animationDuration: '8s'}}></div>
              <div className="absolute inset-2 flex items-center justify-center bg-white rounded-full shadow-xl overflow-hidden">
                <img 
                  src={logoPath} 
                  alt="MPT Token Logo" 
                  className="w-full h-full object-contain animate-pulse" 
                  style={{animationDuration: '3s'}}
                />
              </div>
            </div>
            <h3 className="font-heading font-bold text-2xl md:text-3xl mb-2">MPT Token</h3>
            <p className="text-lightgray mb-4 text-center">Profit from coffee culture & crypto mining</p>
            <Button 
              onClick={() => scrollToSection('buy')}
              size="lg"
              className="bg-primary text-white px-8 py-3 rounded-full font-heading font-semibold text-lg hover:bg-opacity-90 shadow-lg"
            >
              Buy MPT
            </Button>
          </div>
          
          {/* TAH Token */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 animate-spin" style={{animationDuration: '8s'}}></div>
              <div className="absolute inset-2 flex items-center justify-center bg-white rounded-full shadow-xl overflow-hidden">
                <img 
                  src={teraLogoPath} 
                  alt="TAH Token Logo" 
                  className="w-full h-full object-contain" 
                  style={{
                    padding: '10px'
                  }}
                />
              </div>
            </div>
            <h3 className="font-heading font-bold text-2xl md:text-3xl mb-2">TAH Token</h3>
            <p className="text-lightgray mb-4 text-center">Support civil rights & justice initiatives</p>
            <Link href="/tera-info">
              <Button 
                size="lg"
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-heading font-semibold text-lg hover:bg-opacity-90 shadow-lg"
              >
                Buy TAH
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="font-heading font-bold text-2xl md:text-3xl text-primary">$42M+</p>
            <p className="text-sm md:text-base text-lightgray">Market Cap</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="font-heading font-bold text-2xl md:text-3xl text-primary">125K+</p>
            <p className="text-sm md:text-base text-lightgray">Holders</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="font-heading font-bold text-2xl md:text-3xl text-primary">2.3M+</p>
            <p className="text-sm md:text-base text-lightgray">Transactions</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="font-heading font-bold text-2xl md:text-3xl text-primary">95K+</p>
            <p className="text-sm md:text-base text-lightgray">Community</p>
          </div>
        </div>
      </div>
    </section>
  );
}
