import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import GigCard from '../../components/marketplace/GigCard';
import LoadingState from '../../components/common/LoadingState'
import type { Gig } from '../../types/marketplace';
import type { Timestamp } from 'firebase/firestore';

const categories = [
  { name: 'All', value: 'all', img: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/1234567890/sample-graphic.jpg' },
  { name: 'Graphics & Design', value: 'graphic-design', img: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/1234567890/sample-graphic.jpg' },
  { name: 'Digital Marketing', value: 'digital-marketing', img: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/1234567890/sample-marketing.jpg' },
  { name: 'Writing & Translation', value: 'content-writing', img: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/1234567890/sample-writing.jpg' },
  { name: 'Video & Animation', value: 'video-animation', img: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/1234567890/sample-video.jpg' },
  { name: 'Music & Audio', value: 'music-audio', img: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/1234567890/sample-music.jpg' },
  { name: 'Programming & Tech', value: 'programming-tech', img: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/1234567890/sample-tech.jpg' },
];

const howItWorks = [
  {
    title: '1. Find a Service',
    desc: 'Browse categories or use the search bar to find the perfect gig.',
    img: 'https://cdn-icons-png.flaticon.com/512/482/482631.png',
  },
  {
    title: '2. Place Your Order',
    desc: 'Contact the seller, discuss your needs, and place your order securely.',
    img: 'https://cdn-icons-png.flaticon.com/512/1256/1256650.png',
  },
  {
    title: '3. Get Your Delivery',
    desc: 'Receive your work, request revisions, and approve the final delivery.',
    img: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
  },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'priceLow', label: 'Price: Low to High (KES)' },
  { value: 'priceHigh', label: 'Price: High to Low (KES)' },
  { value: 'topRated', label: 'Top Rated' },
];

const GIGS_PER_PAGE = 6;


const MarketplacePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  // Fetch all gigs (for filtering/searching client-side)
  const { data: gigs, isLoading } = useQuery(
    ['allGigs'],
    async () => {
      const q = query(collection(db, 'gigs'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gig));
    }
  );

  // Filter gigs by category and search
  let filteredGigs = (gigs || []).filter((gig: Gig) => {
    const matchesCategory = selectedCategory === 'all' || gig.category === selectedCategory;
    const matchesSearch =
      gig.title.toLowerCase().includes(search.toLowerCase()) ||
      gig.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort gigs
  filteredGigs = filteredGigs.sort((a, b) => {
    const getTimestamp = (val: any) => {
      if (val instanceof Date) return val.getTime();
      // Firestore Timestamp has toDate, FieldValue does not
      if (val && typeof val.toDate === 'function') return (val as Timestamp).toDate().getTime();
      return 0;
    };
    if (sortBy === 'newest') {
      return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
    } else if (sortBy === 'priceLow') {
      return Number(a.packages[0]?.price) - Number(b.packages[0]?.price);
    } else if (sortBy === 'priceHigh') {
      return Number(b.packages[0]?.price) - Number(a.packages[0]?.price);
    } else if (sortBy === 'topRated') {
      return (Number(b.stats?.rating) || 0) - (Number(a.stats?.rating) || 0);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredGigs.length / GIGS_PER_PAGE);
  const paginatedGigs = filteredGigs.slice((page - 1) * GIGS_PER_PAGE, page * GIGS_PER_PAGE);

  // Reset to page 1 when filters/search/sort change
  React.useEffect(() => {
    setPage(1);
  }, [selectedCategory, search, sortBy]);

  // If loading, show loading state
  if (isLoading) {
    return <LoadingState message="Loading marketplace" description="Please wait while we fetch the latest gigs" />
  }

  // If no gigs, show demo gigs
  if (!gigs || gigs.length === 0) {
    const demoGigs = [
      {
        id: 'demo1',
        title: 'Logo Design for Startups',
        description: 'Get a professional logo for your business. Delivered in 48 hours!',
        category: 'Graphics & Design',
        packages: [{ price: 1500 }],
        stats: { rating: 4.9 },
        image: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/1234567890/sample-graphic.jpg',
        seller: { name: 'Jane Doe', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      },
      {
        id: 'demo2',
        title: 'SEO Content Writing',
        description: 'SEO-optimized articles and blog posts for your website.',
        category: 'Writing & Translation',
        packages: [{ price: 1000 }],
        stats: { rating: 4.8 },
        image: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/1234567890/sample-writing.jpg',
        seller: { name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      }
    ];
    return (
      <div className="bg-gray-50 min-h-screen">
        <section className="bg-ajira-primary text-white py-16 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the perfect freelance services for your business</h1>
          <p className="text-lg mb-8">Get things done with top talent on Ajira Marketplace, inspired by Kinaps</p>
        </section>
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Gigs (Demo)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoGigs.map(gig => (
              <div key={gig.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                <img src={gig.image} alt={gig.title} className="w-32 h-32 object-cover rounded mb-4" />
                <h3 className="text-xl font-semibold mb-2">{gig.title}</h3>
                <p className="text-gray-600 mb-2">{gig.description}</p>
                <div className="mb-2"><span className="font-semibold">Category:</span> {gig.category}</div>
                <div className="mb-2"><span className="font-semibold">Price:</span> KES {gig.packages[0].price}</div>
                <div className="mb-2"><span className="font-semibold">Rating:</span> {gig.stats.rating}</div>
                <div className="flex items-center mt-2">
                  <img src={gig.seller.avatar} alt={gig.seller.name} className="w-8 h-8 rounded-full mr-2" />
                  <span className="text-sm">{gig.seller.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-500">Sign up or log in to post your own gig and hire freelancers!</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-ajira-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the perfect freelance services for your business</h1>
        <p className="text-lg mb-8">Get things done with top talent on Ajira Marketplace, inspired by Kinaps</p>
        <div className="max-w-xl mx-auto flex items-center bg-white rounded-full shadow px-4 py-2">
          <input
            type="text"
            placeholder="Try 'logo design'"
            className="flex-1 px-4 py-2 rounded-full text-black outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="bg-ajira-accent text-white px-6 py-2 rounded-full ml-2 font-semibold hover:bg-ajira-accent/90 transition">Search</button>
        </div>
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/hero-illustration-v2.svg"
          alt="Marketplace Hero"
          className="mx-auto mt-8 w-full max-w-2xl"
        />
      </section>

      {/* Popular Categories (with filter) */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Categories</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`flex flex-col items-center px-4 py-2 rounded-lg border transition shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 ${selectedCategory === cat.value ? 'bg-ajira-accent text-white border-ajira-accent' : 'bg-white text-gray-800 border-gray-200'}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              <img src={cat.img} alt={cat.name} className="w-10 h-10 object-cover rounded-full mb-1" />
              <span className="font-semibold text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">How it Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {howItWorks.map((step) => (
            <div key={step.title} className="flex flex-col items-center max-w-xs text-center">
              <img src={step.img} alt={step.title} className="w-20 h-20 mb-4" />
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Gigs (filtered, sorted, paginated) */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-center md:text-left">Featured Gigs</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        {paginatedGigs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {paginatedGigs.map((gig: Gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded ${page === i + 1 ? 'bg-ajira-accent text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No gigs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search criteria.
            </p>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-6">Join Ajira Marketplace and start your freelancing journey today!</p>
        <button className="bg-ajira-accent text-white px-8 py-3 rounded-full font-semibold hover:bg-ajira-accent/90 transition">Join Now</button>
      </section>
    </div>
  );
};

export default MarketplacePage; 