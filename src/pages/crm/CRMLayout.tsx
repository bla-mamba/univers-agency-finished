import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Package, Calendar, Users, MapPin, Tag, LogOut, Plane, Star, Mail, BookOpen, Percent, CalendarDays, Film } from 'lucide-react';
import { useEffect } from 'react';

export default function CRMLayout() {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { path: '/crm', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/crm/packages', icon: Package, label: 'Packages' },
    { path: '/crm/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/crm/customers', icon: Users, label: 'Customers' },
    { path: '/crm/destinations', icon: MapPin, label: 'Destinations' },
    { path: '/crm/categories', icon: Tag, label: 'Categories' },
    { path: '/crm/reviews', icon: Star, label: 'Reviews' },
    { path: '/crm/newsletter', icon: Mail, label: 'Newsletter' },
    { path: '/crm/blog', icon: BookOpen, label: 'Blog' },
    { path: '/crm/offers', icon: Percent, label: 'Offers' },
    { path: '/crm/availability', icon: CalendarDays, label: 'Availability' },
    { path: '/crm/testimonials', icon: Star, label: 'Testimonials' },
    { path: '/crm/hero-media', icon: Film, label: 'Hero Media' },
  ];

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-full flex-shrink-0">
        <div className="p-6 border-b border-gray-800 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-red-500" />
            <div>
              <div className="text-xl font-bold">Univers Travel Agency</div>
              <div className="text-xs text-gray-400">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3  transition ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3  text-gray-300 hover:bg-gray-800 transition mb-2"
          >
            <Plane className="h-5 w-5" />
            <span>Back to Website</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3  text-gray-300 hover:bg-red-600 transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
