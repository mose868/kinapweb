import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useQuery } from 'react-query';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '../../config/firebase';
import type { Gig } from '../../api/marketplace';

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar = ({ initialQuery = '', onSearch, className = '' }: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch search suggestions
  const { data: suggestions, isLoading } = useQuery(
    ['search-suggestions', searchQuery],
    async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) return [];

      const gigsRef = collection(db, COLLECTIONS.GIGS);
      const constraints = [
        where('title', '>=', searchQuery.toLowerCase()),
        where('title', '<=', searchQuery.toLowerCase() + '\uf8ff'),
        orderBy('title'),
        limit(5)
      ];

      const q = query(gigsRef, ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gig));
    },
    {
      enabled: searchQuery.length >= 2
    }
  );

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submission
  const handleSubmit = (query: string = searchQuery) => {
    setIsOpen(false);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/marketplace/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for services..."
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {isOpen && searchQuery.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ) : suggestions?.length === 0 ? (
            <div className="p-4 text-center text-gray-600">
              No results found
            </div>
          ) : (
            <div>
              {suggestions?.map((gig) => (
                <button
                  key={gig.id}
                  onClick={() => {
                    setSearchQuery(gig.title);
                    handleSubmit(gig.title);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {gig.images?.[0] && (
                      <img
                        src={gig.images[0]}
                        alt={gig.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {gig.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        by {gig.sellerName}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => handleSubmit()}
                className="w-full text-left px-4 py-2 text-ajira-primary hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-t"
              >
                <Search className="inline-block w-4 h-4 mr-2" />
                Search for "{searchQuery}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 