import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'

export default function Header({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm border-b border-yellow-500/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="MemeMillionaire Logo" 
              className="h-10 w-auto" 
            />
            <div className="ml-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                MemeMillionaire
              </h1>
              <p className="text-xs text-yellow-500">To the Moon!</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? "text-yellow-400 font-medium" 
                  : "text-gray-300 hover:text-yellow-400 transition-colors"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                isActive 
                  ? "text-yellow-400 font-medium" 
                  : "text-gray-300 hover:text-yellow-400 transition-colors"
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/tokenomics" 
              className={({ isActive }) => 
                isActive 
                  ? "text-yellow-400 font-medium" 
                  : "text-gray-300 hover:text-yellow-400 transition-colors"
              }
            >
              Tokenomics
            </NavLink>
            <NavLink 
              to="/roadmap" 
              className={({ isActive }) => 
                isActive 
                  ? "text-yellow-400 font-medium" 
                  : "text-gray-300 hover:text-yellow-400 transition-colors"
              }
            >
              Roadmap
            </NavLink>
            <NavLink 
              to="/mining" 
              className={({ isActive }) => 
                isActive 
                  ? "text-yellow-400 font-medium" 
                  : "text-gray-300 hover:text-yellow-400 transition-colors"
              }
            >
              <span className="relative inline-block">
                Mining
                <span className="absolute -top-1 -right-8 px-2 py-0.5 text-xs rounded-full bg-yellow-500 text-black font-bold">
                  PRO
                </span>
              </span>
            </NavLink>
          </nav>

          {/* Login/User Button */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-2">
                <FaUserCircle className="text-yellow-500 text-xl" />
                <span className="text-white">{user.username}</span>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-full transition-colors"
              >
                Connect Wallet
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-yellow-400 font-medium" 
                    : "text-gray-300 hover:text-yellow-400 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-yellow-400 font-medium" 
                    : "text-gray-300 hover:text-yellow-400 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink 
                to="/tokenomics" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-yellow-400 font-medium" 
                    : "text-gray-300 hover:text-yellow-400 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Tokenomics
              </NavLink>
              <NavLink 
                to="/roadmap" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-yellow-400 font-medium" 
                    : "text-gray-300 hover:text-yellow-400 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Roadmap
              </NavLink>
              <NavLink 
                to="/mining" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-yellow-400 font-medium" 
                    : "text-gray-300 hover:text-yellow-400 transition-colors"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative inline-block">
                  Mining
                  <span className="absolute -top-1 -right-8 px-2 py-0.5 text-xs rounded-full bg-yellow-500 text-black font-bold">
                    PRO
                  </span>
                </span>
              </NavLink>
              
              {/* Mobile Login/User Button */}
              <div className="pt-2">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-yellow-500 text-xl" />
                    <span className="text-white">{user.username}</span>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="inline-block px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-full transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connect Wallet
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}