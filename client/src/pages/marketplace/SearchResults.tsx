import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
// import { SearchBar } from '../../components/search';
import GigCard from '../../components/marketplace/GigCard';
import { SlidersHorizontal } from 'lucide-react';
import type { Gig } from '../../api/marketplace';

const GIGS_PER_PAGE = 12;

type SortOption =
  | 'relevance'
  | 'rating'
  | 'price_low'
  | 'price_high'
  | 'newest';

interface FilterState {
  priceRange: [number, number];
  rating: number | null;
  deliveryTime: number | null;
  category: string | null;
  subcategory: string | null;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    rating: null,
    deliveryTime: null,
    category: null,
    subcategory: null,
  });

  // Reset pagination when search query or filters change
  useEffect(() => {
    // setLastDoc(null);
  }, [searchQuery, sortBy, filters]);

  // Fetch search results
  const { data, isLoading } = useQuery(
    ['search-results', searchQuery, sortBy, filters],
    async () => {
      // Placeholder for the removed firebase logic
      const gigs = [];
      // Filter by price range and delivery time after fetching
      return gigs.filter((gig) => {
        const lowestPrice = Math.min(...gig.packages.map((p) => p.price));
        const lowestDeliveryTime = Math.min(
          ...gig.packages.map((p) => p.deliveryTime)
        );
        return (
          lowestPrice >= filters.priceRange[0] &&
          lowestPrice <= filters.priceRange[1] &&
          (!filters.deliveryTime || lowestDeliveryTime <= filters.deliveryTime)
        );
      });
    }
  );

  const allGigs = data || [];
  const totalResults = allGigs.length;

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Search Header */}
      <div className='mb-8'>
        {/* <SearchBar
          initialQuery={searchQuery}
          className="max-w-2xl mx-auto mb-6"
        /> */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <h1 className='text-xl font-semibold text-gray-900'>
            {totalResults} results for "{searchQuery}"
          </h1>
          <div className='flex items-center gap-4'>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className='rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary'
            >
              <option value='relevance'>Most Relevant</option>
              <option value='rating'>Highest Rated</option>
              <option value='price_low'>Lowest Price</option>
              <option value='price_high'>Highest Price</option>
              <option value='newest'>Newest First</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50'
            >
              <SlidersHorizontal size={20} />
              <span className='hidden sm:inline'>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-8'>
        {/* Filters Sidebar */}
        {showFilters && (
          <div className='w-full md:w-64 space-y-6'>
            {/* Price Range Filter */}
            <div>
              <h3 className='font-medium text-gray-900 mb-3'>Price Range</h3>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceRange: [
                          Number(e.target.value),
                          filters.priceRange[1],
                        ],
                      })
                    }
                    className='w-24 rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary'
                  />
                  <span>to</span>
                  <input
                    type='number'
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceRange: [
                          filters.priceRange[0],
                          Number(e.target.value),
                        ],
                      })
                    }
                    className='w-24 rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary'
                  />
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className='font-medium text-gray-900 mb-3'>Rating</h3>
              <select
                value={filters.rating || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    rating: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className='w-full rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary'
              >
                <option value=''>Any Rating</option>
                <option value='4'>4+ Stars</option>
                <option value='3'>3+ Stars</option>
                <option value='2'>2+ Stars</option>
              </select>
            </div>

            {/* Delivery Time Filter */}
            <div>
              <h3 className='font-medium text-gray-900 mb-3'>Delivery Time</h3>
              <select
                value={filters.deliveryTime || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    deliveryTime: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className='w-full rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary'
              >
                <option value=''>Any Time</option>
                <option value='1'>Up to 24 hours</option>
                <option value='3'>Up to 3 days</option>
                <option value='7'>Up to 7 days</option>
                <option value='14'>Up to 14 days</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className='font-medium text-gray-900 mb-3'>Category</h3>
              <select
                value={filters.category || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category: e.target.value || null,
                    subcategory: null,
                  })
                }
                className='w-full rounded-lg border-gray-300 focus:border-ajira-primary focus:ring-ajira-primary'
              >
                <option value=''>All Categories</option>
                {/* Add your categories here */}
              </select>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() =>
                setFilters({
                  priceRange: [0, 100000],
                  rating: null,
                  deliveryTime: null,
                  category: null,
                  subcategory: null,
                })
              }
              className='w-full px-4 py-2 text-sm text-ajira-primary hover:bg-ajira-primary/5 rounded-lg'
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Search Results */}
        <div className='flex-1'>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white rounded-lg shadow-sm p-4 animate-pulse'
                >
                  <div className='w-full h-48 bg-gray-200 rounded-lg mb-4' />
                  <div className='space-y-2'>
                    <div className='h-4 bg-gray-200 rounded w-3/4' />
                    <div className='h-4 bg-gray-200 rounded w-1/2' />
                  </div>
                </div>
              ))}
            </div>
          ) : allGigs.length === 0 ? (
            <div className='text-center py-12'>
              <h2 className='text-xl font-medium text-gray-900 mb-2'>
                No results found
              </h2>
              <p className='text-gray-600'>
                Try adjusting your search or filters to find what you're looking
                for
              </p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {allGigs.map((gig: Gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
