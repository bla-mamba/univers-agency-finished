import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ChevronDown, User, Calendar, Heart, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/packages', label: 'Packages' },
    { to: '/offers', label: 'Offers' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition ${
                  isActive(link.to) ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/crm"
                    className="bg-red-600 text-white px-4 py-2  text-sm font-semibold hover:bg-red-700 transition"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {profile?.full_name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link to="/my-bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <Calendar className="h-4 w-4 text-gray-400" /> My Bookings
                      </Link>
                      <Link to="/my-wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <Heart className="h-4 w-4 text-gray-400" /> My Wishlist
                      </Link>
                      <Link to="/my-profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <Settings className="h-4 w-4 text-gray-400" /> My Profile
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-red-600 transition">Login</Link>
                <Link to="/signup" className="bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 transition">Sign Up</Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2  text-gray-600 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600"></div>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2.5  text-sm font-medium transition ${
                isActive(link.to) ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/crm" className="block px-3 py-2.5  text-sm font-semibold bg-red-600 text-white mb-2 text-center">
                    Admin Panel
                  </Link>
                )}
                <Link to="/my-bookings" className="flex items-center gap-2 px-3 py-2.5  text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Calendar className="h-4 w-4" /> My Bookings
                </Link>
                <Link to="/my-wishlist" className="flex items-center gap-2 px-3 py-2.5  text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Heart className="h-4 w-4" /> My Wishlist
                </Link>
                <Link to="/my-profile" className="flex items-center gap-2 px-3 py-2.5  text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <User className="h-4 w-4" /> My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2.5  text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left mt-1"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="flex-1 text-center px-3 py-2.5 border border-gray-300  text-sm font-medium text-gray-700">Login</Link>
                <Link to="/signup" className="flex-1 text-center px-3 py-2.5 bg-red-600 text-sm font-semibold text-white">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
