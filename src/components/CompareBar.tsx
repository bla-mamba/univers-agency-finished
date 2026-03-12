import { Link } from 'react-router-dom';
import { X, BarChart2 } from 'lucide-react';
import { useCompare } from '../contexts/CompareContext';

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">

        {/* Top row: label + actions */}
        <div className="flex items-center justify-between mb-2 sm:mb-0">
          <div className="flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4 text-red-600" />
            <span className="font-semibold text-gray-800 text-xs sm:text-sm">Compare ({compareList.length}/3)</span>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={clearCompare}
              className="text-xs text-gray-500 hover:text-red-600 transition font-medium"
            >
              Clear
            </button>
            {compareList.length >= 2 && (
              <Link
                to="/compare"
                className="bg-red-600 text-white px-3 py-1.5  text-xs font-semibold hover:bg-red-700 transition"
              >
                Compare
              </Link>
            )}
          </div>
        </div>

        {/* Packages row + desktop actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-0.5">
            {compareList.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 flex-shrink-0 min-w-0"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8  overflow-hidden flex-shrink-0">
                  <img
                    src={pkg.images?.[0] || 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-800 max-w-[80px] sm:max-w-[120px] truncate">{pkg.title}</span>
                <button
                  onClick={() => removeFromCompare(pkg.id)}
                  className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                >
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>
              </div>
            ))}

            {compareList.length < 3 && (
              <div className="hidden sm:flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl px-4 py-2 text-gray-400 text-sm flex-shrink-0">
                + Add package
              </div>
            )}
          </div>

          {/* Desktop-only actions */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clearCompare}
              className="text-sm text-gray-500 hover:text-red-600 transition font-medium"
            >
              Clear
            </button>
            {compareList.length >= 2 && (
              <Link
                to="/compare"
                className="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
              >
                Compare Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
