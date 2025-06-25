import React from 'react';
import { 
  Award, 
  Shield, 
  Clock, 
  Zap, 
  Target, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Heart,
  Play,
  ArrowRight,
  Quote,
  Globe,
  Briefcase,
  Palette,
  Code,
  Megaphone,
  Camera,
  Music,
  PenTool,
  Sparkles
} from 'lucide-react';

// Enhanced seller badge system
export const SellerBadges = () => (
  <div className="flex flex-wrap gap-2">
    <div className="flex items-center bg-ajira-secondary/10 text-ajira-secondary px-3 py-1 rounded-full text-sm font-medium">
      <Shield className="w-4 h-4 mr-2" />
      Verified Seller
    </div>
    <div className="flex items-center bg-ajira-accent/10 text-ajira-accent px-3 py-1 rounded-full text-sm font-medium">
      <Award className="w-4 h-4 mr-2" />
      Pro Level
    </div>
    <div className="flex items-center bg-ajira-warning/10 text-ajira-warning px-3 py-1 rounded-full text-sm font-medium">
      <Star className="w-4 h-4 mr-2" />
      Top Rated
    </div>
  </div>
);

// Enhanced gig statistics
export const GigStats = ({ stats }: { stats: any }) => (
  <div className="grid grid-cols-3 gap-4 py-4 border-t border-ajira-gray-200">
    <div className="text-center">
      <div className="text-2xl font-bold text-ajira-primary">{stats.orders || 0}</div>
      <div className="text-sm text-ajira-text-muted">Orders</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-ajira-secondary">{stats.rating || 0}</div>
      <div className="text-sm text-ajira-text-muted">Rating</div>
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-ajira-accent">{stats.reviews || 0}</div>
      <div className="text-sm text-ajira-text-muted">Reviews</div>
    </div>
  </div>
);

// Enhanced category showcase
export const CategoryShowcase = () => {
  const categories = [
    { 
      name: 'Graphics & Design', 
      icon: Palette, 
      count: '125 services',
      color: 'from-ajira-primary to-ajira-blue-600',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop'
    },
    { 
      name: 'Digital Marketing', 
      icon: Megaphone, 
      count: '125 services',
      color: 'from-ajira-secondary to-ajira-green-600',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    { 
      name: 'Programming & Tech', 
      icon: Code, 
      count: '125 services',
      color: 'from-ajira-dark to-ajira-primary',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop'
    },
    { 
      name: 'Video & Animation', 
      icon: Camera, 
      count: '125 services',
      color: 'from-ajira-info to-ajira-blue-500',
      image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=300&fit=crop'
    },
    { 
      name: 'Music & Audio', 
      icon: Music, 
      count: '125 services',
      color: 'from-purple-500 to-ajira-primary',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
    },
    { 
      name: 'Writing & Translation', 
      icon: PenTool, 
      count: '125 services',
      color: 'from-ajira-accent to-ajira-orange-600',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop'
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-ajira-light to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-ajira-primary/10 text-ajira-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Explore Categories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ajira-text-primary mb-4">
            Discover Amazing Services
          </h2>
          <p className="text-xl text-ajira-text-muted max-w-3xl mx-auto">
            From creative design to technical development, find the perfect freelancer for any project
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl shadow-ajira-lg hover:shadow-ajira-xl transition-all duration-300 overflow-hidden border border-ajira-gray-200 hover:border-ajira-primary/30 hover:-translate-y-2"
              >
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`}></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Category Icon */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Service Count */}
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {category.count}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-ajira-text-primary mb-2 group-hover:text-ajira-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-ajira-text-muted mb-4">
                    Professional services delivered by top-rated freelancers
                  </p>
                  <button className="flex items-center gap-2 text-ajira-primary font-semibold group-hover:gap-3 transition-all duration-200">
                    Explore Services
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Enhanced trusted by section
export const TrustedBySection = () => {
  const trustedLogos = [
    'Safaricom', 'KCB Bank', 'Equity Bank', 'NCBA', 'Stanbic Bank', 
    'Co-op Bank', 'I&M Bank', 'Standard Chartered'
  ];

  return (
    <section className="py-16 bg-white border-y border-ajira-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-ajira-text-primary mb-4">
            Trusted by Leading Kenyan Companies
          </h3>
          <p className="text-ajira-text-muted">
            Join thousands of businesses that trust KiNaP Digital Marketplace
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {trustedLogos.map((company, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-4 bg-ajira-light rounded-xl hover:bg-white hover:shadow-ajira transition-all duration-200 border border-ajira-gray-200"
            >
              <div className="text-ajira-text-secondary font-bold text-lg">
                {company}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-ajira-secondary/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-ajira-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-ajira-secondary">100%</div>
                <div className="text-sm text-ajira-text-muted">Secure Payments</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-ajira-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-ajira-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-ajira-primary">24/7</div>
                <div className="text-sm text-ajira-text-muted">Support</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-ajira-accent/10 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-ajira-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-ajira-accent">98%</div>
                <div className="text-sm text-ajira-text-muted">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced testimonials section
export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Wanjiku',
      role: 'Marketing Director, TechStart Kenya',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'KiNaP Digital Marketplace connected us with amazing Kenyan talent. Our brand redesign project was completed ahead of schedule with exceptional quality.',
      verified: true
    },
    {
      name: 'James Mwangi',
      role: 'CEO, GreenTech Solutions',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'The web development team we found here delivered a world-class e-commerce platform. Highly professional and cost-effective.',
      verified: true
    },
    {
      name: 'Grace Njeri',
      role: 'Founder, Fashion Forward',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'From logo design to social media content, KiNaP freelancers helped launch our fashion brand with stunning creative work.',
      verified: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-ajira-primary/5 to-ajira-secondary/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-ajira-accent/10 text-ajira-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Heart className="w-4 h-4" />
            Client Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ajira-text-primary mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-ajira-text-muted max-w-3xl mx-auto">
            Real success stories from businesses that have grown with KiNaP Digital Marketplace
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-ajira-lg hover:shadow-ajira-xl transition-all duration-300 border border-ajira-gray-200 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-ajira-accent rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-white" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-ajira-warning fill-current" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-ajira-text-primary mb-6 text-lg leading-relaxed">
                "{testimonial.text}"
              </p>
              
              {/* Client Info */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-ajira-text-primary">{testimonial.name}</h4>
                    {testimonial.verified && (
                      <CheckCircle className="w-4 h-4 text-ajira-secondary" />
                    )}
                  </div>
                  <p className="text-sm text-ajira-text-muted">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced how it works section
export const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Browse & Discover',
      description: 'Explore thousands of services from verified Kenyan freelancers across 8+ categories',
      icon: Globe,
      color: 'from-ajira-primary to-ajira-blue-600'
    },
    {
      step: '02',
      title: 'Compare & Select',
      description: 'Compare portfolios, reviews, and prices to find the perfect match for your project',
      icon: Target,
      color: 'from-ajira-secondary to-ajira-green-600'
    },
    {
      step: '03',
      title: 'Collaborate & Create',
      description: 'Work directly with your chosen freelancer using our secure platform and communication tools',
      icon: Users,
      color: 'from-ajira-accent to-ajira-orange-600'
    },
    {
      step: '04',
      title: 'Review & Pay',
      description: 'Review the completed work, provide feedback, and pay securely when you\'re 100% satisfied',
      icon: CheckCircle,
      color: 'from-ajira-success to-ajira-green-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-ajira-primary/10 text-ajira-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Play className="w-4 h-4" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ajira-text-primary mb-4">
            Get Things Done in 4 Simple Steps
          </h2>
          <p className="text-xl text-ajira-text-muted max-w-3xl mx-auto">
            From idea to completion, our platform makes it easy to connect with top talent and get professional results
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-4 w-8 h-0.5 bg-gradient-to-r from-ajira-gray-300 to-transparent"></div>
                )}
                
                <div className="bg-white rounded-2xl p-8 shadow-ajira-lg hover:shadow-ajira-xl transition-all duration-300 border border-ajira-gray-200 hover:border-ajira-primary/30 text-center group-hover:-translate-y-2">
                  {/* Step Number */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white font-bold text-xl mb-6 shadow-ajira-lg`}>
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 bg-ajira-light rounded-xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-6 h-6 text-ajira-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-ajira-text-primary mb-4 group-hover:text-ajira-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-ajira-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-ajira-xl transition-all duration-200 hover:scale-105">
            Start Your Project Today
          </button>
        </div>
      </div>
    </section>
  );
};

// Enhanced popular services section
export const PopularServicesSection = () => {
  const popularServices = [
    { name: 'Logo Design', orders: '2,500+', price: 'From KES 2,000', trend: '+25%' },
    { name: 'Website Development', orders: '1,800+', price: 'From KES 15,000', trend: '+40%' },
    { name: 'Social Media Management', orders: '3,200+', price: 'From KES 5,000', trend: '+60%' },
    { name: 'Content Writing', orders: '2,100+', price: 'From KES 1,500', trend: '+35%' },
    { name: 'Video Editing', orders: '1,400+', price: 'From KES 3,000', trend: '+50%' },
    { name: 'SEO Services', orders: '900+', price: 'From KES 8,000', trend: '+45%' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-ajira-light to-ajira-primary/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-ajira-secondary/10 text-ajira-secondary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="w-4 h-4" />
            Popular This Month
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ajira-text-primary mb-4">
            Most Requested Services
          </h2>
          <p className="text-xl text-ajira-text-muted max-w-3xl mx-auto">
            Discover the top services that businesses are ordering right now
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularServices.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-ajira-lg hover:shadow-ajira-xl transition-all duration-300 border border-ajira-gray-200 hover:border-ajira-secondary/30 group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-ajira-text-primary group-hover:text-ajira-secondary transition-colors">
                  {service.name}
                </h3>
                <div className="flex items-center gap-1 bg-ajira-secondary/10 text-ajira-secondary px-2 py-1 rounded-full text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  {service.trend}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-ajira-text-muted">Orders completed</div>
                  <div className="text-xl font-bold text-ajira-primary">{service.orders}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-ajira-text-muted">Starting at</div>
                  <div className="text-lg font-bold text-ajira-accent">{service.price}</div>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-ajira-light hover:bg-ajira-secondary hover:text-white text-ajira-text-primary py-3 rounded-xl font-semibold transition-all duration-200">
                Browse Services
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default {
  SellerBadges,
  GigStats,
  CategoryShowcase,
  TrustedBySection,
  TestimonialsSection,
  HowItWorksSection,
  PopularServicesSection
}; 