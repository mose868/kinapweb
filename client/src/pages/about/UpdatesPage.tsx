import { useState } from 'react';
import { useEffect } from 'react';
import { Calendar, Tag, ChevronRight, Search, Newspaper, TrendingUp, Bell, Users } from 'lucide-react';
import axios from 'axios';
import LoadingState from '../../components/common/LoadingState';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Update {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishDate: string;
  images: string[];
  tags: string[];
  featured: boolean;
  priority: string;
  engagement: {
    views: number;
    likes: number;
    shares: number;
  };
  author: string;
}

const UpdatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Updates', color: 'bg-gray-600' },
  ]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get(`${BASEURL}/updates?limit=50`);
        setUpdates(response.data.updates || []);

        // Extract unique categories from updates
        const uniqueCategories = [
          ...new Set(
            response.data.updates?.map((update: Update) => update.category) ||
              []
          ),
        ];
        const categoryColors = {
          Event: 'bg-blue-600',
          Announcement: 'bg-green-600',
          Achievement: 'bg-purple-600',
          Training: 'bg-orange-600',
          Partnership: 'bg-pink-600',
          General: 'bg-gray-600',
        };

        const formattedCategories = [
          { id: 'all', name: 'All Updates', color: 'bg-gray-600' },
          ...uniqueCategories.map((cat) => ({
            id: cat.toLowerCase(),
            name: cat,
            color:
              categoryColors[cat as keyof typeof categoryColors] ||
              'bg-gray-600',
          })),
        ];

        setCategories(formattedCategories);
      } catch (err) {
        console.error('Error fetching updates:', err);
        setError('Failed to load updates');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  const filteredUpdates = updates.filter((update) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      update.category.toLowerCase() === selectedCategory;
    const matchesSearch =
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category.toLowerCase());
    return cat?.color || 'bg-gray-600';
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <div className='text-center py-12 text-red-500'>{error}</div>;
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 sm:py-12 w-full overflow-x-hidden'>
      <div className='container-custom px-2 sm:px-4 w-full'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-3xl sm:text-4xl font-bold text-ajira-primary mb-4'>
            Club Updates
          </h1>
          <p className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto'>
            Stay informed about the latest news, events, and opportunities at
            Ajira Digital KiNaP Club.
          </p>
        </div>

        {/* Search and Filter */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between w-full'>
            {/* Category Filter */}
            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === category.id
                      ? `${category.color} text-white`
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className='relative w-full sm:w-64'>
              <input
                type='text'
                placeholder='Search updates...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ajira-primary/20 text-base sm:text-lg'
              />
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            </div>
          </div>
        </div>

        {/* Updates Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full'>
          {filteredUpdates.map((update) => (
            <div
              key={update._id}
              className='bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden w-full'
            >
              {update.images && update.images.length > 0 && (
                <img
                  src={update.images[0]}
                  alt={update.title}
                  className='w-full h-40 sm:h-48 object-cover'
                />
              )}
              <div className='p-4 sm:p-6'>
                <div className='flex items-center gap-2 mb-4 flex-wrap'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(update.category)}`}
                  >
                    {update.category.charAt(0).toUpperCase() +
                      update.category.slice(1)}
                  </span>
                  <div className='flex items-center text-gray-500 text-sm'>
                    <Calendar className='w-4 h-4 mr-1' />
                    {formatDate(update.publishDate)}
                  </div>
                </div>

                <h3 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2'>
                  {update.title}
                </h3>

                <p className='text-gray-600 mb-4 text-sm sm:text-base'>
                  {update.excerpt}
                </p>

                <div className='flex flex-wrap gap-2'>
                  {update.tags.map((tag, index) => (
                    <div
                      key={index}
                      className='flex items-center text-sm text-gray-500'
                    >
                      <Tag className='w-3 h-3 mr-1' />
                      {tag}
                    </div>
                  ))}
                </div>

                <button className='mt-4 text-ajira-primary font-medium flex items-center hover:text-ajira-primary/80 transition-colors'>
                  Read More
                  <ChevronRight className='w-4 h-4 ml-1' />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUpdates.length === 0 && (
          <div className='text-center py-16'>
            {/* Welcome Message */}
            <div className='max-w-4xl mx-auto'>
              <div className='mb-12'>
                <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ajira-primary to-ajira-secondary rounded-full mb-6 shadow-lg'>
                  <Newspaper className='w-10 h-10 text-white' />
                </div>
                
                <h2 className='text-3xl sm:text-4xl font-bold text-ajira-primary mb-4'>
                  Welcome to Our Updates Hub! 📰
                </h2>
                
                <p className='text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed'>
                  Stay connected with the latest news, achievements, and exciting developments from the Ajira Digital KiNaP Club community!
                </p>
              </div>

              {/* Development Status */}
              <div className='bg-gradient-to-r from-ajira-primary/10 to-ajira-secondary/10 rounded-2xl p-8 mb-8 border border-ajira-primary/20'>
                <div className='flex items-center justify-center mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-ajira-primary to-ajira-secondary rounded-full flex items-center justify-center mr-4'>
                    <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  </div>
                  <h3 className='text-2xl font-bold text-ajira-primary'>
                    Content Hub Under Development
                  </h3>
                </div>
                
                <p className='text-gray-700 text-lg mb-6 max-w-3xl mx-auto leading-relaxed'>
                  We're curating an amazing collection of updates, news, and stories to keep you informed and inspired. Our content team is working hard to bring you the most relevant and engaging updates from our community.
                </p>
                
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto'>
                  <div className='text-center'>
                    <div className='w-12 h-12 bg-ajira-primary/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <Newspaper className='w-6 h-6 text-ajira-primary' />
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-1'>News & Updates</h4>
                    <p className='text-sm text-gray-600'>Latest club announcements and news</p>
                  </div>
                  
                  <div className='text-center'>
                    <div className='w-12 h-12 bg-ajira-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <TrendingUp className='w-6 h-6 text-ajira-secondary' />
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-1'>Achievements</h4>
                    <p className='text-sm text-gray-600'>Member successes and milestones</p>
                  </div>
                  
                  <div className='text-center'>
                    <div className='w-12 h-12 bg-ajira-accent/20 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <Bell className='w-6 h-6 text-ajira-accent' />
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-1'>Events</h4>
                    <p className='text-sm text-gray-600'>Upcoming events and workshops</p>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8'>
                <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                  What You'll Find Here
                </h3>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-left'>
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-ajira-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <span className='text-ajira-primary font-bold text-sm'>1</span>
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1'>Club Announcements</h4>
                        <p className='text-gray-600 text-sm'>Important updates about club activities, policies, and opportunities</p>
                      </div>
                    </div>
                    
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-ajira-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <span className='text-ajira-secondary font-bold text-sm'>2</span>
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1'>Member Achievements</h4>
                        <p className='text-gray-600 text-sm'>Celebrating successes, certifications, and career milestones</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-ajira-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <span className='text-ajira-accent font-bold text-sm'>3</span>
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1'>Event Highlights</h4>
                        <p className='text-gray-600 text-sm'>Recaps of workshops, training sessions, and community events</p>
                      </div>
                    </div>
                    
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <span className='text-gray-600 font-bold text-sm'>4</span>
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1'>Industry Insights</h4>
                        <p className='text-gray-600 text-sm'>Latest trends in digital skills and career opportunities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Content Preview */}
              <div className='bg-gradient-to-br from-ajira-primary/5 to-ajira-secondary/5 rounded-2xl p-8 border border-ajira-primary/10'>
                <h3 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
                  Coming Soon: Sample Updates
                </h3>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                    <div className='flex items-center mb-3'>
                      <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3'>
                        <TrendingUp className='w-4 h-4 text-green-600' />
                      </div>
                      <span className='text-sm font-medium text-green-600'>Achievement</span>
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-2'>Member Spotlight: Sarah's Success Story</h4>
                    <p className='text-sm text-gray-600 mb-3'>How Sarah landed her dream job in web development after completing our training program.</p>
                    <div className='text-xs text-gray-500'>Coming soon...</div>
                  </div>
                  
                  <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                    <div className='flex items-center mb-3'>
                      <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                        <Calendar className='w-4 h-4 text-blue-600' />
                      </div>
                      <span className='text-sm font-medium text-blue-600'>Event</span>
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-2'>Upcoming: Digital Skills Workshop</h4>
                    <p className='text-sm text-gray-600 mb-3'>Join us for an intensive workshop on modern web development technologies.</p>
                    <div className='text-xs text-gray-500'>Coming soon...</div>
                  </div>
                  
                  <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                    <div className='flex items-center mb-3'>
                      <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3'>
                        <Bell className='w-4 h-4 text-purple-600' />
                      </div>
                      <span className='text-sm font-medium text-purple-600'>Announcement</span>
                    </div>
                    <h4 className='font-semibold text-gray-900 mb-2'>New Partnership Announced</h4>
                    <p className='text-sm text-gray-600 mb-3'>Exciting collaboration with leading tech companies for internship opportunities.</p>
                    <div className='text-xs text-gray-500'>Coming soon...</div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className='mt-12'>
                <p className='text-gray-600 mb-6 text-lg'>
                  Want to stay updated? Subscribe to our newsletter and never miss an important update!
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <button className='px-8 py-3 bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105'>
                    Subscribe to Updates
                  </button>
                  <button className='px-8 py-3 border-2 border-ajira-primary text-ajira-primary font-semibold rounded-lg hover:bg-ajira-primary hover:text-white transition-all duration-200'>
                    Follow Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatesPage;
