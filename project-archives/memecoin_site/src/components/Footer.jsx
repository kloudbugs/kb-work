import { Link } from 'react-router-dom'
import { FaTwitter, FaTelegram, FaDiscord, FaGithub } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 border-t border-yellow-500/20 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="MemeMillionaire Logo" 
                className="h-10 w-auto" 
              />
              <div className="ml-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  MemeMillionaire
                </h2>
              </div>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              The future of meme coins, redefined. MemeMillionaire brings innovative technology and real utility to the meme coin space.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/tokenomics" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link to="/mining" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                  Mining
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a 
                href="https://t.me/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <FaTelegram className="w-6 h-6" />
              </a>
              <a 
                href="https://discord.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <FaDiscord className="w-6 h-6" />
              </a>
              <a 
                href="https://github.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <FaGithub className="w-6 h-6" />
              </a>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Join our growing community and be part of the MemeMillionaire revolution.
            </p>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-3">
              Subscribe to our newsletter for the latest updates and announcements.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-3 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-r-md transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm">
            &copy; {currentYear} MemeMillionaire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}