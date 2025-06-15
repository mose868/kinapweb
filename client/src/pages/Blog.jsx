import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Clock, User, Tag, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Sample blog posts - in real app, this would come from API
  const posts = [
    {
      id: 1,
      title: "From Campus to Digital Freelancer: A 2025 Success Story",
      excerpt: "Learn how John transformed his programming hobby into a successful freelancing career through Ajira Digital's training program.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
      author: "John Kamau",
      date: "January 15, 2025",
      category: "Success Stories",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Top 10 In-Demand Digital Skills for 2025",
      excerpt: "Discover the most sought-after digital skills that employers and clients are looking for in the current job market.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
      author: "Mary Wanjiku",
      date: "January 12, 2025",
      category: "Career Tips",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Building Your Personal Brand Online in 2025",
      excerpt: "Essential tips and strategies for creating a strong personal brand that attracts clients and opportunities.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      author: "Sarah Njeri",
      date: "January 10, 2025",
      category: "Personal Development",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Navigating the Digital Marketplace in 2025",
      excerpt: "A comprehensive guide to finding and securing online work opportunities through various platforms.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
      author: "David Mwangi",
      date: "January 8, 2025",
      category: "Career Tips",
      readTime: "7 min read"
    },
    {
      id: 5,
      title: "AI and Automation: Opportunities for 2025",
      excerpt: "How artificial intelligence is creating new opportunities for digital workers and freelancers.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
      author: "Grace Wanjiru",
      date: "January 5, 2025",
      category: "Technology",
      readTime: "9 min read"
    },
    {
      id: 6,
      title: "Remote Work Best Practices for 2025",
      excerpt: "Master the art of remote work with these proven strategies and tools for maximum productivity.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
      author: "Peter Kiprotich",
      date: "January 3, 2025",
      category: "Personal Development",
      readTime: "6 min read"
    }
  ]

  const categories = [
    'All',
    'Success Stories',
    'Career Tips',
    'Personal Development',
    'Industry News',
    'Technology'
  ]

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // If no posts, show demo posts
  if (filteredPosts.length === 0) {
    const demoPosts = [
      {
        id: 101,
        title: "Demo: How Ajira Changed My Life in 2025",
        excerpt: "A quick look at how Ajira Digital helped me become a successful freelancer in the new year.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop",
        author: "Demo User",
        date: "January 1, 2025",
        category: "Success Stories",
        readTime: "3 min read"
      },
      {
        id: 102,
        title: "Demo: 2025 Digital Trends to Watch",
        excerpt: "Explore the latest digital trends and opportunities for the year ahead.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        author: "Tech Insights",
        date: "January 2, 2025",
        category: "Technology",
        readTime: "4 min read"
      },
      {
        id: 103,
        title: "Demo: Building Your Portfolio in 2025",
        excerpt: "Essential tips for creating a standout portfolio that gets you hired.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        author: "Career Coach",
        date: "January 3, 2025",
        category: "Career Tips",
        readTime: "5 min read"
      }
    ];
    return (
      <div className="min-h-screen bg-ajira-lightGray">
        <section className="py-16">
          <div className="container-custom">
            <h1 className="text-3xl font-bold mb-6">Stories & Insights (Demo)</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {demoPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-ajira hover:shadow-ajira-lg transition-shadow">
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-ajira-blue mb-3">{post.title}</h2>
                    <p className="text-ajira-gray mb-6">{post.excerpt}</p>
                    <div className="flex items-center space-x-2 text-sm text-ajira-gray mb-4">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-ajira-gray">{post.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-500">Sign up or log in to read and write your own stories!</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ajira-lightGray">
      {/* Hero Section */}
      <section className="bg-gradient-ajira py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Stories & Insights
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Discover success stories, career tips, and industry insights from our community
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ajira-gray" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-ajira-blue/20"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-custom">
          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-ajira-blue text-white'
                    : 'bg-white text-ajira-gray hover:bg-ajira-blue/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-ajira hover:shadow-ajira-lg transition-shadow"
              >
                <div className="relative h-48 md:h-64">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-ajira-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-ajira-gray mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-ajira-blue mb-3">
                    {post.title}
                  </h2>
                  <p className="text-ajira-gray mb-6">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-ajira-blue/10 rounded-full flex items-center justify-center">
                        <User size={16} className="text-ajira-blue" />
                      </div>
                      <span className="text-sm font-medium text-ajira-gray">
                        {post.author}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="flex items-center text-ajira-blue hover:text-ajira-lightBlue font-medium text-sm"
                    >
                      Read More
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-ajira-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-ajira-blue" />
              </div>
              <h3 className="text-xl font-bold text-ajira-blue mb-2">
                No Results Found
              </h3>
              <p className="text-ajira-gray">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Blog 