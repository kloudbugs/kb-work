import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import logoPath from '@assets/logo1.png';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    closeMobileMenu();
  };

  return (
    <header className={`fixed w-full bg-white/90 backdrop-blur-sm shadow-md z-50 transition-all ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img src={logoPath} alt="MPT Token Logo" className="h-10 md:h-12 mr-2" />
              <span className="font-heading font-bold text-xl md:text-2xl text-dark hidden sm:inline-block">MPT <span className="text-primary">Token</span></span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('about')} className="font-medium hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollToSection('tokenomics')} className="font-medium hover:text-primary transition-colors">Tokenomics</button>
            <button onClick={() => scrollToSection('roadmap')} className="font-medium hover:text-primary transition-colors">Roadmap</button>
            <button onClick={() => scrollToSection('team')} className="font-medium hover:text-primary transition-colors">Team</button>
            <button onClick={() => scrollToSection('faq')} className="font-medium hover:text-primary transition-colors">FAQ</button>
            <Link href="/mining">
              <Button variant="outline" className="font-heading font-semibold rounded-full mr-2">Mining</Button>
            </Link>
            <Link href="/tera-info">
              <Button variant="outline" className="font-heading font-semibold rounded-full text-primary border-primary mr-2">TERA TOKEN</Button>
            </Link>
            <Button onClick={() => scrollToSection('buy')} className="bg-primary text-white font-heading font-semibold rounded-full hover:bg-opacity-90">Buy Now</Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-dark text-2xl" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <nav className="flex flex-col space-y-4 mt-4 pb-4">
            <button onClick={() => scrollToSection('about')} className="font-medium hover:text-primary transition-colors">About</button>
            <button onClick={() => scrollToSection('tokenomics')} className="font-medium hover:text-primary transition-colors">Tokenomics</button>
            <button onClick={() => scrollToSection('roadmap')} className="font-medium hover:text-primary transition-colors">Roadmap</button>
            <button onClick={() => scrollToSection('team')} className="font-medium hover:text-primary transition-colors">Team</button>
            <button onClick={() => scrollToSection('faq')} className="font-medium hover:text-primary transition-colors">FAQ</button>
            <Link href="/mining" className="w-full">
              <Button className="my-1 w-full" variant="outline">Mining Subscription</Button>
            </Link>
            <Link href="/tera-info" className="w-full">
              <Button className="my-1 w-full" variant="outline">TERA TOKEN</Button>
            </Link>
            <Button onClick={() => scrollToSection('buy')} className="bg-primary text-white font-heading font-semibold rounded-full hover:bg-opacity-90 w-full mt-2">Buy Now</Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
