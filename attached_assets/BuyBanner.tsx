import { Button } from '@/components/ui/button';

export function BuyBanner() {
  return (
    <section className="py-12 bg-primary" id="buy">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">
              Ready to join the KLOUD BUGS revolution?
            </h2>
            <p className="text-white/80">Get your tokens now and brew your crypto profits</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-white text-primary px-8 py-3 rounded-full font-heading font-semibold text-lg hover:bg-opacity-90 shadow-lg">
              Buy on Uniswap
            </Button>
            <Button variant="outline" className="bg-white/20 text-white border-2 border-white px-8 py-3 rounded-full font-heading font-semibold text-lg hover:bg-white/30">
              How to Buy
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
