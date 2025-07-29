# Home Page Backend System

A comprehensive backend system for managing dynamic home page content with MongoDB persistence, featuring sections for hero content, statistics, features, testimonials, news, programs, and partners.

## 🚀 Features

### Core Functionality
- **Dynamic Content Management**: All home page sections are database-driven
- **Comprehensive Sections**: Hero, stats, features, testimonials, news, programs, partners
- **Admin Controls**: Full CRUD operations for all content sections
- **Analytics Tracking**: View counts and engagement metrics
- **SEO Optimization**: Meta tags and structured content
- **Responsive Design Support**: Content optimized for all devices

### Content Sections
- **Hero Section**: Title, subtitle, image, video, background
- **Statistics**: Comprehensive metrics with formatting
- **Features**: Icon-based feature cards with descriptions
- **Testimonials**: User testimonials with ratings and images
- **News & Updates**: Blog-style content with categories and tags
- **Programs**: Training programs with enrollment data
- **Partners**: Partner organizations with logos and descriptions
- **About/Community**: Informational sections

## 📋 API Endpoints

### Public Endpoints
- `GET /api/homepage` - Get complete home page content
- `GET /api/homepage/featured` - Get featured content only
- `GET /api/homepage/stats` - Get statistics and view count

### Admin Endpoints (Requires Admin Auth)
- `GET /api/homepage/analytics` - Get analytics and metrics
- `PUT /api/homepage` - Update entire home page
- `PUT /api/homepage/section/:section` - Update specific section
- `POST /api/homepage/testimonials` - Add new testimonial
- `PUT /api/homepage/testimonials/:id` - Update testimonial
- `DELETE /api/homepage/testimonials/:id` - Delete testimonial
- `POST /api/homepage/news` - Add news item

## 🗄️ Data Models

### HomePage Schema
```javascript
{
  // Hero Section
  heroTitle: String,
  heroSubtitle: String,
  heroImage: String,
  heroVideo: String,
  heroBackground: String,
  
  // Statistics
  stats: {
    studentsTrained: Number,
    successStories: Number,
    skillsPrograms: Number,
    digitalExcellence: Number,
    activeMembers: Number,
    completedProjects: Number,
    partnerOrganizations: Number,
    averageEarnings: Number
  },
  
  // Call to Action Buttons
  ctaButtons: [{
    label: String,
    url: String,
    type: 'primary' | 'secondary' | 'external'
  }],
  
  // Features Section
  features: [{
    icon: String,
    title: String,
    description: String,
    color: String,
    bgColor: String,
    order: Number
  }],
  
  // Testimonials
  testimonials: [{
    name: String,
    role: String,
    company: String,
    content: String,
    rating: Number,
    image: String,
    featured: Boolean,
    order: Number
  }],
  
  // News Items
  newsItems: [{
    title: String,
    excerpt: String,
    content: String,
    image: String,
    category: String,
    author: String,
    publishedAt: Date,
    featured: Boolean,
    tags: [String],
    readTime: Number,
    order: Number
  }],
  
  // Programs
  programs: [{
    title: String,
    description: String,
    icon: String,
    duration: String,
    level: 'beginner' | 'intermediate' | 'advanced',
    category: String,
    enrollmentCount: Number,
    rating: Number,
    featured: Boolean,
    order: Number
  }],
  
  // Partners
  partners: [{
    name: String,
    logo: String,
    website: String,
    description: String,
    category: String,
    featured: Boolean,
    order: Number
  }],
  
  // Content Sections
  aboutSection: {
    title: String,
    content: String,
    image: String,
    showStats: Boolean
  },
  
  servicesSection: {
    title: String,
    subtitle: String,
    description: String,
    showCTA: Boolean
  },
  
  communitySection: {
    title: String,
    subtitle: String,
    description: String,
    memberCount: Number,
    showJoinCTA: Boolean
  },
  
  // Configuration
  isActive: Boolean,
  showHero: Boolean,
  showStats: Boolean,
  showFeatures: Boolean,
  showTestimonials: Boolean,
  showNews: Boolean,
  showPrograms: Boolean,
  showPartners: Boolean,
  
  // Analytics
  viewCount: Number,
  lastViewed: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Setup Instructions

### 1. Environment Variables
Ensure your `.env` file includes:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Populate Sample Data
```bash
npm run populate-homepage
```

### 4. Test the API
```bash
node test-homepage.js
```

## 📊 Usage Examples

### Get Home Page Content
```javascript
const response = await fetch('/api/homepage');
const homeData = await response.json();

console.log('Hero Title:', homeData.heroTitle);
console.log('Stats:', homeData.stats);
console.log('Features:', homeData.features.length);
```

### Get Featured Content
```javascript
const response = await fetch('/api/homepage/featured');
const featuredData = await response.json();

console.log('Featured Testimonials:', featuredData.testimonials);
console.log('Featured News:', featuredData.news);
```

### Update Hero Section (Admin)
```javascript
const updateData = {
  heroTitle: 'New Hero Title',
  heroSubtitle: 'Updated subtitle',
  heroImage: '/new-image.jpg'
};

const response = await fetch('/api/homepage/section/hero', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify(updateData)
});
```

### Add Testimonial (Admin)
```javascript
const testimonialData = {
  name: 'John Doe',
  role: 'Web Developer',
  company: 'Tech Solutions',
  content: 'Great platform for learning digital skills!',
  rating: 5,
  image: '/testimonials/john.jpg',
  featured: true
};

const response = await fetch('/api/homepage/testimonials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify(testimonialData)
});
```

## 🎯 Sample Data Included

### Default Content
- **Hero Section**: "Empowering Kenya's Digital Generation"
- **Statistics**: 1500+ students trained, 250+ success stories
- **Features**: 6 feature cards (Community, Training, Growth, etc.)
- **Testimonials**: 5 testimonials from community members
- **News**: 4 news items with categories and tags
- **Programs**: 6 training programs with different levels
- **Partners**: 5 partner organizations

### Statistics
- Students Trained: 1,500+
- Success Stories: 250+
- Skills Programs: 75+
- Digital Excellence: 95%
- Active Members: 800+
- Completed Projects: 350+
- Partner Organizations: 30+
- Average Earnings: KES 75,000

## 🔍 API Response Examples

### Home Page Response
```json
{
  "heroTitle": "Empowering Kenya's Digital Generation",
  "heroSubtitle": "KiNaP Ajira Digital Club – Innovation & Excellence",
  "heroImage": "/logo.jpeg",
  "stats": {
    "studentsTrained": 1500,
    "successStories": 250,
    "skillsPrograms": 75,
    "digitalExcellence": 95
  },
  "features": [
    {
      "icon": "Users",
      "title": "Community Driven",
      "description": "Join a thriving community...",
      "color": "from-ajira-primary to-ajira-blue-600",
      "bgColor": "bg-ajira-primary/10",
      "order": 1
    }
  ],
  "testimonials": [...],
  "newsItems": [...],
  "programs": [...],
  "partners": [...],
  "viewCount": 1250,
  "lastViewed": "2024-01-15T10:30:00.000Z"
}
```

### Featured Content Response
```json
{
  "testimonials": [
    {
      "name": "Sarah Mwangi",
      "role": "Digital Marketing Specialist",
      "content": "KiNaP transformed my career...",
      "rating": 5,
      "featured": true
    }
  ],
  "news": [
    {
      "title": "New Digital Skills Program Launch",
      "excerpt": "We are excited to announce...",
      "category": "Announcements",
      "featured": true
    }
  ],
  "programs": [...],
  "partners": [...]
}
```

## 🛡️ Security Features

- **Authentication Required**: Admin endpoints require valid JWT tokens
- **Admin Authorization**: Content modification requires admin privileges
- **Input Validation**: All user inputs are validated
- **Rate Limiting**: Built-in protection against abuse
- **Data Sanitization**: All content is sanitized before storage

## 📈 Analytics & Monitoring

### View Tracking
- Automatic view count increment on each page load
- Last viewed timestamp tracking
- Analytics endpoint for admin monitoring

### Content Metrics
- Content counts by section
- Featured content filtering
- Order-based content sorting

## 🔄 Content Management

### Section Updates
- Individual section updates via `/section/:section` endpoint
- Bulk updates via main PUT endpoint
- Automatic timestamp updates

### Content Ordering
- Order-based sorting for all content arrays
- Featured content filtering
- Category-based organization

## 🚀 Performance Features

### Database Optimization
- Indexed fields for efficient querying
- Virtual fields for formatted data
- Pre-save middleware for automatic updates

### Caching Support
- Ready for Redis integration
- Efficient data retrieval patterns
- Minimal database queries

## 🔧 Development Tools

### Scripts Available
- `npm run populate-homepage` - Populate with sample data
- `node test-homepage.js` - Test API endpoints
- `npm run dev` - Development server with hot reload

### Testing
- Comprehensive API endpoint testing
- Sample data validation
- Error handling verification

## 📞 Support

For technical support or questions about the home page system:
- Check the API documentation for endpoint details
- Review the sample data structure for content examples
- Monitor analytics for usage insights
- Contact the development team for advanced issues

---

**Note**: This system is designed to work seamlessly with the existing frontend and provides a complete content management solution for the home page. 