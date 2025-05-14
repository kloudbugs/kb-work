import { Link } from 'wouter';
import { FaTwitter, FaDiscord, FaTelegramPlane, FaRedditAlien, FaGithub } from 'react-icons/fa';
import logoPath from '@assets/logo1.png';

export function Footer() {
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
    <footer className="bg-dark py-12 text-white/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <div className="flex items-center mb-4 cursor-pointer">
                <img src={logoPath} alt="KLOUD BUGS Logo" className="h-10 mr-2" />
                <span className="font-heading font-bold text-xl text-white">KLOUD <span className="text-primary">BUGS</span></span>
              </div>
            </Link>
            <p className="mb-4">
              The next generation of meme cryptocurrency with real utility and community governance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-primary transition">
                <FaTwitter />
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition">
                <FaDiscord />
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition">
                <FaTelegramPlane />
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition">
                <FaRedditAlien />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-primary transition">About</button></li>
              <li><button onClick={() => scrollToSection('tokenomics')} className="hover:text-primary transition">Tokenomics</button></li>
              <li><button onClick={() => scrollToSection('roadmap')} className="hover:text-primary transition">Roadmap</button></li>
              <li><button onClick={() => scrollToSection('team')} className="hover:text-primary transition">Team</button></li>
              <li><button onClick={() => scrollToSection('faq')} className="hover:text-primary transition">FAQ</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary transition">Whitepaper</a></li>
              <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition">Audit Reports</a></li>
              <li><a href="#" className="hover:text-primary transition">Pitch Deck</a></li>
              <li><a href="#" className="hover:text-primary transition">Media Kit</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition">Disclaimer</a></li>
              <li><a href="#" className="hover:text-primary transition">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-10 pt-8 text-center">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} KLOUD BUGS. All rights reserved.
          </p>
          <p className="text-white/40 text-xs mt-2">
            Cryptocurrency investments are volatile and high risk. Always do your own research.
          </p>
        </div>
      </div>
    </footer>
  );
}
