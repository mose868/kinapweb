# Training Programs Management System

This document outlines the Training Programs backend system for managing comprehensive course offerings, enrollments, and educational content.

## Features

### Core Functionality
- ✅ **CRUD Operations**: Create, read, update, delete training programs
- ✅ **Category Management**: 10 predefined categories (Web Development, Digital Marketing, etc.)
- ✅ **Level System**: Beginner, Intermediate, Advanced, All Levels
- ✅ **Enrollment Tracking**: Capacity management and availability status
- ✅ **Instructor Profiles**: Complete instructor information and expertise
- ✅ **Pricing System**: Free courses, regular pricing, discount pricing
- ✅ **Rating & Reviews**: Student feedback and course ratings
- ✅ **Schedule Management**: Format (Online, In-Person, Hybrid), dates, time slots
- ✅ **Certification System**: Digital certificates with validity periods
- ✅ **Content Management**: Learning outcomes, prerequisites, tools, curriculum
- ✅ **Search & Filter**: Full-text search, category/level filtering
- ✅ **Analytics**: Views, enrollments, completion rates, job placement rates
- ✅ **SEO Optimization**: Auto-generated slugs, meta tags, keywords

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Get Published Training Programs
```http
GET /api/training
```

**Query Parameters:**
- `category` - Filter by category (Web Development, Digital Marketing, etc.)
- `level` - Filter by level (Beginner, Intermediate, Advanced, All Levels)
- `isFree` - Show only free courses (true/false)
- `search` - Full-text search in title, description, instructor, tags
- `featured` - Show only featured programs (true/false)
- `limit` - Number of programs to return (default: 20)
- `skip` - Number of programs to skip (pagination)

**Example:**
```http
GET /api/training?category=Web Development&level=Beginner&featured=true&limit=10
```

#### Get Single Training by Slug
```http
GET /api/training/slug/:slug
```

**Response:** Single training object with view count incremented

#### Search Training Programs
```http
GET /api/training/search?q=javascript&category=Web Development
```

**Query Parameters:**
- `q` - Search query (required)
- `category` - Filter by category
- `level` - Filter by level
- `limit` - Number of results (default: 20)

#### Get Featured Training Programs
```http
GET /api/training/featured?limit=6
```

#### Add Review to Training
```http
POST /api/training/:id/reviews
```

**Request Body:**
```json
{
  "studentName": "John Doe",
  "rating": 5,
  "comment": "Excellent course! Highly recommended."
}
```

#### Get Categories and Metadata
```http
GET /api/training/meta/categories
```

**Response:** Available categories, levels, and counts

### Admin Endpoints (Authentication Required)

#### Get All Training Programs (Including Unpublished)
```http
GET /api/training/admin
```

**Query Parameters:**
- `category` - Filter by category
- `level` - Filter by level
- `status` - Filter by status (Draft, Published, Coming Soon, etc.)
- `limit` - Number of programs to return (default: 100)
- `skip` - Number of programs to skip

#### Get Single Training for Admin
```http
GET /api/training/admin/:id
```

#### Create New Training Program
```http
POST /api/training
```

**Request Body:**
```json
{
  "title": "Advanced React Development",
  "description": "Master advanced React concepts including hooks, context, and performance optimization...",
  "shortDescription": "Advanced React training for experienced developers",
  "category": "Web Development",
  "level": "Advanced",
  "duration": {
    "weeks": 8,
    "hours": 3,
    "totalHours": 64
  },
  "instructor": {
    "name": "Jane Smith",
    "bio": "Senior React Developer with 6+ years experience",
    "email": "jane@ajirakinap.com",
    "experience": "6+ years",
    "specialization": ["React", "JavaScript", "TypeScript"]
  },
  "pricing": {
    "isFree": false,
    "regularPrice": 30000,
    "discountPrice": 25000,
    "currency": "KES"
  },
  "enrollment": {
    "capacity": 25,
    "isOpen": true
  },
  "learningOutcomes": [
    "Master React hooks",
    "Implement advanced patterns",
    "Optimize performance"
  ],
  "prerequisites": [
    "JavaScript ES6+",
    "Basic React knowledge"
  ],
  "tools": ["React", "TypeScript", "VS Code"],
  "status": "Published",
  "isFeatured": true
}
```

#### Update Existing Training Program
```http
PUT /api/training/:id
```

#### Delete Training Program
```http
DELETE /api/training/:id
```

#### Toggle Publish Status
```http
PATCH /api/training/:id/publish
```

#### Toggle Featured Status
```http
PATCH /api/training/:id/feature
```

#### Update Enrollment Count
```http
PATCH /api/training/:id/enrollment
```

**Request Body:**
```json
{
  "change": 1
}
```

#### Get Training Statistics
```http
GET /api/training/stats/overview
```

**Response:**
```json
{
  "totalTrainings": 25,
  "publishedTrainings": 20,
  "draftTrainings": 3,
  "featuredTrainings": 8,
  "categoriesStats": [
    { "_id": "Web Development", "count": 5 },
    { "_id": "Digital Marketing", "count": 4 }
  ],
  "levelsStats": [
    { "_id": "Beginner", "count": 8 },
    { "_id": "Intermediate", "count": 7 }
  ],
  "totalViews": 15000,
  "totalEnrollments": 450,
  "averageRating": 4.6,
  "topRatedTrainings": [...],
  "mostPopularTrainings": [...]
}
```

#### Bulk Operations
```http
POST /api/training/bulk
```

**Request Body:**
```json
{
  "action": "publish",
  "ids": ["training_id_1", "training_id_2"]
}
```

**Available Actions:** publish, unpublish, feature, unfeature, activate, deactivate, delete

## Data Model

### Training Schema
```javascript
{
  title: String (required),
  slug: String (unique, auto-generated),
  description: String (required),
  shortDescription: String,
  category: String (enum: Web Development, Digital Marketing, Graphic Design, Data Science, Mobile Development, UI/UX Design, Cybersecurity, Content Writing, Project Management, Other),
  level: String (enum: Beginner, Intermediate, Advanced, All Levels),
  duration: {
    weeks: Number,
    hours: Number,
    totalHours: Number (required)
  },
  schedule: {
    format: String (enum: In-Person, Online, Hybrid),
    days: [String],
    timeSlot: String,
    startDate: Date,
    endDate: Date
  },
  instructor: {
    name: String (required),
    bio: String,
    email: String,
    image: String,
    linkedinProfile: String,
    experience: String,
    specialization: [String]
  },
  curriculum: [{
    week: Number,
    title: String,
    topics: [String],
    learningObjectives: [String],
    assignments: [String]
  }],
  learningOutcomes: [String],
  prerequisites: [String],
  tools: [String],
  certification: {
    provided: Boolean (default: true),
    title: String,
    accreditation: String,
    validityPeriod: String
  },
  pricing: {
    isFree: Boolean (default: false),
    regularPrice: Number (default: 0),
    discountPrice: Number,
    currency: String (default: 'KES'),
    paymentPlans: [{
      name: String,
      amount: Number,
      description: String
    }]
  },
  enrollment: {
    capacity: Number (default: 50),
    enrolled: Number (default: 0),
    waitlist: Number (default: 0),
    isOpen: Boolean (default: true),
    registrationDeadline: Date
  },
  media: {
    thumbnailImage: String,
    heroImage: String,
    videoIntro: String,
    gallery: [String]
  },
  features: [String],
  materials: [{
    name: String,
    type: String,
    description: String,
    isRequired: Boolean
  }],
  status: String (enum: Draft, Published, Coming Soon, In Progress, Completed, Cancelled),
  tags: [String],
  seoMeta: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  ratings: {
    average: Number (default: 0),
    totalRatings: Number (default: 0),
    breakdown: {
      five: Number (default: 0),
      four: Number (default: 0),
      three: Number (default: 0),
      two: Number (default: 0),
      one: Number (default: 0)
    }
  },
  reviews: [{
    studentName: String,
    rating: Number (min: 1, max: 5),
    comment: String,
    date: Date (default: Date.now),
    isVerified: Boolean (default: false)
  }],
  statistics: {
    views: Number (default: 0),
    inquiries: Number (default: 0),
    completionRate: Number (default: 0),
    jobPlacementRate: Number (default: 0)
  },
  isActive: Boolean (default: true),
  isFeatured: Boolean (default: false),
  displayOrder: Number (default: 0),
  lastUpdatedBy: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Virtual Fields
- `url`: Course URL slug (`/training/${slug}`)
- `enrollmentPercentage`: Percentage of capacity filled
- `availabilityStatus`: Available, Almost Full, Full, Closed
- `displayPrice`: Formatted price display

### Static Methods
- `getPublished(options)`: Get published courses with filtering
- `getFeatured(limit)`: Get featured courses

### Instance Methods
- `incrementViews()`: Increment view count
- `addReview(reviewData)`: Add student review and update ratings
- `updateEnrollment(change)`: Update enrollment count

## Frontend Integration

### Admin Interface
- **Path:** `/admin/training`
- **Component:** `TrainingAdmin.jsx`
- **Features:** Full CRUD, statistics dashboard, search/filter, bulk operations

### Public Training Page
- **Path:** `/training`
- **Component:** `TrainingPage.jsx`
- **Features:** Browse, search, filter, enrollment, detailed course information

## Setup Instructions

### 1. Dependencies
```bash
# Backend dependencies are already installed
cd backend
npm install
```

### 2. Environment Variables
Ensure your `.env` file includes:
```env
MONGODB_URI=your_mongodb_connection_string
```

### 3. Start the Server
```bash
cd backend
npm run dev
```

### 4. Populate Sample Data
```bash
cd backend
node scripts/populateTrainings.js
```

## Training Categories

### Available Categories
1. **Web Development**: Frontend, backend, full-stack development
2. **Digital Marketing**: SEO, social media, content marketing, paid ads
3. **Graphic Design**: Visual design, branding, print design
4. **Data Science**: Analytics, machine learning, statistics
5. **Mobile Development**: iOS, Android, cross-platform apps
6. **UI/UX Design**: User interface, user experience, prototyping
7. **Cybersecurity**: Security, ethical hacking, compliance
8. **Content Writing**: Copywriting, blogging, technical writing
9. **Project Management**: Agile, Scrum, leadership, planning
10. **Other**: Miscellaneous courses

### Level Guidelines
- **Beginner**: No prior experience required, basic concepts
- **Intermediate**: Some experience needed, building on fundamentals
- **Advanced**: Significant experience required, expert-level topics
- **All Levels**: Suitable for everyone, adaptive content

## Sample Data Overview

### Created Training Programs (8 total):
1. **Complete Web Development Bootcamp** (Featured)
   - Category: Web Development | Level: Beginner
   - Duration: 120h | Price: KES 25,000
   - Enrollment: 24/30 (Almost Full) | Rating: 4.8⭐

2. **Digital Marketing Mastery** (Featured)
   - Category: Digital Marketing | Level: Intermediate
   - Duration: 60h | Price: KES 18,000
   - Enrollment: 19/25 | Rating: 4.6⭐

3. **UI/UX Design Fundamentals**
   - Category: UI/UX Design | Level: Beginner
   - Duration: 75h | Price: KES 22,000
   - Enrollment: 15/20 | Rating: 4.7⭐

4. **Data Science with Python** (Featured)
   - Category: Data Science | Level: Intermediate
   - Duration: 140h | Price: KES 35,000
   - Enrollment: 8/15 | Rating: 4.9⭐

5. **Mobile App Development with React Native**
   - Category: Mobile Development | Level: Intermediate
   - Duration: 100h | Price: KES 28,000
   - Enrollment: 12/18 | Rating: 4.5⭐

6. **Introduction to Cybersecurity**
   - Category: Cybersecurity | Level: Beginner
   - Duration: 60h | Price: KES 20,000
   - Enrollment: 16/22 | Rating: 4.4⭐

7. **Content Writing and Copywriting Mastery** (FREE)
   - Category: Content Writing | Level: Beginner
   - Duration: 36h | Price: FREE
   - Enrollment: 35/40 (Almost Full) | Rating: 4.3⭐

8. **Project Management Fundamentals** (Coming Soon)
   - Category: Project Management | Level: All Levels
   - Duration: 60h | Price: KES 24,000
   - Enrollment: 14/25 | Status: Coming Soon

### Key Statistics
- **Total Enrollments**: 143/195 (73% capacity utilization)
- **Average Rating**: 4.6⭐ across all rated programs
- **Featured Programs**: 3 out of 8 programs
- **Free Programs**: 1 program (Content Writing)
- **Published Programs**: 7 out of 8 programs

## Pricing Strategy

### Price Ranges
- **Free**: Content Writing (Entry-level, high volume)
- **Budget**: KES 15,000-20,000 (Cybersecurity, Digital Marketing discounts)
- **Standard**: KES 20,000-25,000 (UI/UX, Web Development, Project Management)
- **Premium**: KES 28,000-35,000 (Mobile Development, Data Science)

### Discount System
- Regular price with optional discount price
- Percentage-based discounts calculated automatically
- Payment plans support for expensive courses

## Best Practices

### Content Creation
1. **Clear Titles**: Descriptive and keyword-rich course titles
2. **Detailed Descriptions**: Comprehensive course overview and benefits
3. **Learning Outcomes**: Specific, measurable learning objectives
4. **Prerequisites**: Clear requirements for student success
5. **Instructor Credibility**: Detailed instructor profiles and experience

### SEO Optimization
1. **Auto-generated Slugs**: URL-friendly course identifiers
2. **Meta Tags**: SEO-optimized titles and descriptions
3. **Keyword Tags**: Relevant search terms and categories
4. **Content Structure**: Well-organized course information

### Enrollment Management
1. **Capacity Planning**: Realistic enrollment limits
2. **Availability Status**: Clear availability indicators
3. **Registration Deadlines**: Time-sensitive enrollment periods
4. **Waitlist System**: Handle overflow demand

### Quality Assurance
1. **Review System**: Student feedback and ratings
2. **Content Updates**: Regular curriculum updates
3. **Instructor Support**: Ongoing instructor development
4. **Completion Tracking**: Monitor student success rates

## Analytics and Insights

### Available Metrics
- Course views and engagement
- Enrollment trends and capacity utilization
- Student ratings and reviews
- Completion and job placement rates
- Revenue and pricing optimization
- Instructor performance

### Business Intelligence
- Most popular courses and categories
- Student demographic analysis
- Revenue per course and category
- Seasonal enrollment patterns
- Competition and market analysis

## Future Enhancements

- [ ] Video content management and streaming
- [ ] Interactive assignments and quizzes
- [ ] Student progress tracking
- [ ] Certificate generation and verification
- [ ] Payment processing integration
- [ ] Email marketing automation
- [ ] Advanced analytics dashboard
- [ ] Mobile app for course access
- [ ] Discussion forums and community
- [ ] Live streaming capabilities
- [ ] AI-powered course recommendations
- [ ] Multi-language support

The training programs system provides a comprehensive foundation for educational content management with robust features for both administrators and students. 