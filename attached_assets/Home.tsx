import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Tokenomics } from '@/components/Tokenomics';
import { BuyToken } from '@/components/BuyToken';
import { Roadmap } from '@/components/Roadmap';
import { Team } from '@/components/Team';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { Community } from '@/components/Community';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="font-body text-darkgray bg-lightbg">
      <Header />
      <main>
        <Hero />
        <About />
        <Tokenomics />
        <BuyToken />
        <Roadmap />
        <Team />
        <FAQ />
        <Newsletter />
        <Community />
      </main>
      <Footer />
    </div>
  );
}
