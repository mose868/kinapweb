# FAQ Management System

This document outlines the FAQ (Frequently Asked Questions) backend system for managing questions, answers, and user interactions.

## Features

### Core Functionality
- ✅ **CRUD Operations**: Create, read, update, delete FAQ items
- ✅ **Category Management**: Organize FAQs by category (General, Membership, Events, Training, Technical, Certification, Career, Payment)
- ✅ **Priority System**: Numerical priority for ordering (0-10 scale)
- ✅ **Publication Status**: Published/Unpublished control
- ✅ **Popular FAQs**: Mark important FAQs as popular/featured
- ✅ **Tag System**: Flexible tagging for better organization and search
- ✅ **User Voting**: Helpful/Not Helpful voting with prevention of multiple votes
- ✅ **View Tracking**: Automatic view count incrementing
- ✅ **Search Functionality**: Full-text search across questions and answers
- ✅ **SEO Optimization**: Meta titles, descriptions, and keywords
- ✅ **Related FAQs**: Link related questions together
- ✅ **Analytics**: Comprehensive statistics and insights
- ✅ **Bulk Operations**: Batch publish, unpublish, delete operations

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Get Published FAQs
```http
GET /api/faq
```

**Query Parameters:**
- `category` - Filter by category (General, Membership, etc.)
- `popular` - Show only popular FAQs (true/false)
- `search` - Full-text search in questions and answers
- `limit` - Number of FAQs to return (default: 50)
- `skip` - Number of FAQs to skip (for pagination)

**Example:**
```http
GET /api/faq?category=Training&popular=true&limit=10
```

#### Get Single FAQ
```http
GET /api/faq/:id
```

**Response:** Single FAQ object with view count incremented

#### Search FAQs
```http
GET /api/faq/search?q=training&category=Training
```

**Query Parameters:**
- `q` - Search query (required)
- `category` - Filter by category
- `limit` - Number of results (default: 20)

#### Vote on FAQ
```http
POST /api/faq/:id/helpful
POST /api/faq/:id/not-helpful
```

**Response:** Updated vote counts and helpfulness ratio

#### Get Categories
```http
GET /api/faq/meta/categories
```

**Response:** Available categories and counts

### Admin Endpoints (Authentication Required)

#### Get All FAQs (Including Unpublished)
```http
GET /api/faq/admin
```

**Query Parameters:**
- `category` - Filter by category
- `isPublished` - Filter by publish status (true/false)
- `limit` - Number of FAQs to return (default: 100)
- `skip` - Number of FAQs to skip

#### Get Single FAQ (Admin)
```http
GET /api/faq/admin/:id
```

#### Create New FAQ
```http
POST /api/faq
```

**Request Body:**
```json
{
  "question": "How do I reset my password?",
  "answer": "To reset your password, go to the login page...",
  "category": "Technical",
  "tags": ["password", "reset", "login"],
  "priority": 5,
  "isPublished": true,
  "isPopular": false,
  "relatedFAQs": ["faq_id_1", "faq_id_2"],
  "seoMeta": {
    "metaTitle": "Password Reset Guide",
    "metaDescription": "Learn how to reset your account password",
    "keywords": ["password", "reset", "help"]
  },
  "displayOrder": 0
}
```

#### Update Existing FAQ
```http
PUT /api/faq/:id
```

#### Delete FAQ
```http
DELETE /api/faq/:id
```

#### Toggle Publish Status
```http
PATCH /api/faq/:id/publish
```

#### Toggle Popular Status
```http
PATCH /api/faq/:id/popular
```

#### Get FAQ Statistics
```http
GET /api/faq/stats/overview
```

**Response:**
```json
{
  "totalFAQs": 25,
  "publishedFAQs": 20,
  "unpublishedFAQs": 5,
  "popularFAQs": 8,
  "categoriesStats": [
    { "_id": "General", "count": 5 },
    { "_id": "Training", "count": 4 }
  ],
  "totalViews": 1500,
  "totalHelpfulVotes": 120,
  "totalNotHelpfulVotes": 15,
  "mostViewedFAQs": [...],
  "mostHelpfulFAQs": [...]
}
```

#### Bulk Operations
```http
POST /api/faq/bulk
```

**Request Body:**
```json
{
  "action": "publish",
  "ids": ["faq_id_1", "faq_id_2"]
}
```

**Available Actions:** publish, unpublish, mark-popular, unmark-popular, delete

## Data Model

### FAQ Schema
```javascript
{
  question: String (required),
  answer: String (required),
  category: String (enum: General, Membership, Events, Training, Technical, Certification, Career, Payment),
  tags: [String],
  priority: Number (0-10, default: 0),
  isPublished: Boolean (default: true),
  isPopular: Boolean (default: false),
  viewCount: Number (default: 0),
  helpfulCount: Number (default: 0),
  notHelpfulCount: Number (default: 0),
  relatedFAQs: [ObjectId] (references to other FAQs),
  lastUpdatedBy: String,
  seoMeta: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  displayOrder: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Virtual Fields
- `helpfulnessRatio`: Calculated percentage of helpful votes

### Static Methods
- `getPublished(options)`: Get published FAQs with filtering

### Instance Methods
- `incrementViews()`: Increment view count
- `markHelpful()`: Increment helpful count
- `markNotHelpful()`: Increment not helpful count

## Frontend Integration

### Admin Interface
- **Path:** `/admin/faq`
- **Component:** `FAQAdmin.jsx`
- **Features:** Full CRUD, statistics dashboard, search/filter, bulk operations

### Public FAQ Page
- **Path:** `/faq`
- **Component:** `FaqPage.tsx`
- **Features:** Search, filtering, voting, responsive design, view tracking

## Setup Instructions

### 1. Install Dependencies
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

### 4. Populate Sample Data (Optional)
```bash
cd backend
node scripts/populateFAQs.js
```

## Usage Examples

### Creating a General FAQ
```javascript
const generalFAQ = {
  question: "What are the club's operating hours?",
  answer: "We're open Monday-Friday, 8 AM to 6 PM, and Saturdays 9 AM to 4 PM.",
  category: "General",
  tags: ["hours", "schedule", "office"],
  priority: 6,
  isPublished: true,
  isPopular: false
};
```

### Searching FAQs
```javascript
// Search for training-related FAQs
const trainingFAQs = await fetch('/api/faq/search?q=training courses&category=Training');

// Get popular FAQs
const popularFAQs = await fetch('/api/faq?popular=true&limit=5');

// Filter by category
const membershipFAQs = await fetch('/api/faq?category=Membership');
```

### Voting on FAQ
```javascript
// Mark FAQ as helpful
await fetch('/api/faq/faq_id_123/helpful', { method: 'POST' });

// Mark FAQ as not helpful
await fetch('/api/faq/faq_id_123/not-helpful', { method: 'POST' });
```

## Best Practices

### Content Guidelines
1. **Questions:** Clear, specific, user-focused questions
2. **Answers:** Comprehensive, actionable, easy to understand
3. **Length:** Questions under 100 characters, answers 50-500 words
4. **Tone:** Professional, helpful, friendly
5. **Updates:** Regular review and updates based on user feedback

### SEO Optimization
1. Include relevant keywords in questions and answers
2. Write compelling meta descriptions
3. Use specific, searchable question formats
4. Tag consistently for better categorization

### Category Usage
- **General:** Basic club information, overview questions
- **Membership:** Joining, benefits, requirements, renewal
- **Events:** Event attendance, schedules, requirements
- **Training:** Courses, programs, certifications, schedules
- **Technical:** Website issues, account problems, platform help
- **Certification:** Certificates, verification, credentials
- **Career:** Job placement, opportunities, career guidance
- **Payment:** Fees, methods, refunds, billing

### Priority Guidelines
- **10:** Most critical questions (What is the club? How to join?)
- **8-9:** Very important (Core services, main features)
- **6-7:** Important (Common questions, key processes)
- **4-5:** Moderately important (Specific features, details)
- **1-3:** Less important (Edge cases, rare questions)
- **0:** Default priority

## Voting System

### Vote Prevention
- Uses localStorage to prevent multiple votes from same browser
- Each vote is stored as `faq_vote_{faqId}` with value `helpful` or `not-helpful`
- Server validates but doesn't enforce (relies on client-side prevention)

### Vote Display
- Shows helpful/not helpful counts
- Calculates helpfulness ratio
- Visual feedback for voted FAQs
- Disabled state after voting

## Analytics & Insights

### Available Metrics
- Total views per FAQ
- Helpful vs not helpful ratios
- Most viewed FAQs
- Most helpful FAQs
- Category performance
- Search query analysis (server logs)

### Admin Dashboard Stats
- Total FAQ count
- Published vs unpublished
- Popular FAQ count
- Category distribution
- Overall engagement metrics

## Troubleshooting

### Common Issues

1. **FAQs not appearing:** Check `isPublished` and `isActive` status
2. **Search not working:** Verify full-text search index is created
3. **Voting not recording:** Check localStorage and server logs
4. **Categories missing:** Ensure at least one published FAQ per category

### Debugging
- Check browser console for API errors
- Verify backend server is running on port 5000
- Confirm MongoDB connection is active
- Review server logs for detailed error messages
- Test API endpoints directly using tools like Postman

## Future Enhancements

- [ ] Rich text editor for answers
- [ ] Image/video attachments in answers
- [ ] FAQ templates for common questions
- [ ] Advanced analytics dashboard
- [ ] User question submission system
- [ ] FAQ recommendations based on user behavior
- [ ] Integration with support chat system
- [ ] Email notifications for new FAQs
- [ ] FAQ approval workflow
- [ ] Multi-language support
- [ ] FAQ rating system (star ratings)
- [ ] FAQ comments/discussions 