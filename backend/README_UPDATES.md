# Club Updates Management System

This document outlines the club updates backend system for managing news, announcements, events, and other club communications.

## Features

### Core Functionality
- ✅ **CRUD Operations**: Create, read, update, delete club updates
- ✅ **Category Management**: Organize updates by type (Event, Announcement, Achievement, Training, Partnership, General)
- ✅ **Priority System**: Urgent, High, Medium, Low priority levels
- ✅ **Status Management**: Draft, Published, Archived status
- ✅ **Featured Updates**: Highlight important updates
- ✅ **Rich Content**: Support for HTML/Markdown content
- ✅ **Image Support**: Multiple image uploads per update
- ✅ **Tag System**: Flexible tagging for better organization
- ✅ **SEO Optimization**: Meta titles, descriptions, and keywords
- ✅ **Event Details**: Special fields for event-type updates
- ✅ **Engagement Tracking**: Views, likes, shares tracking
- ✅ **Expiry Dates**: Automatic hiding of expired updates
- ✅ **Search & Filtering**: Full-text search and category filtering
- ✅ **Bulk Operations**: Batch publish, archive, delete operations

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Get Published Updates
```http
GET /api/updates
```

**Query Parameters:**
- `category` - Filter by category (Event, Announcement, etc.)
- `tags` - Filter by tags (comma-separated)
- `featured` - Show only featured updates (true/false)
- `limit` - Number of updates to return (default: 10)
- `skip` - Number of updates to skip (for pagination)
- `search` - Search in title, excerpt, content, and tags

**Example:**
```http
GET /api/updates?category=Event&featured=true&limit=5
```

#### Get Single Update
```http
GET /api/updates/:id
```

**Response:** Single update object with view count incremented

#### Get Filter Options
```http
GET /api/updates/meta/filters
```

**Response:** Available categories and tags for filtering

### Admin Endpoints (Authentication Required)

#### Get All Updates (Including Drafts)
```http
GET /api/updates/admin
```

**Query Parameters:**
- `status` - Filter by status (Draft, Published, Archived)
- `category` - Filter by category
- `limit` - Number of updates to return (default: 20)
- `skip` - Number of updates to skip

#### Get Single Update (Admin)
```http
GET /api/updates/admin/:id
```

#### Create New Update
```http
POST /api/updates
```

**Request Body:**
```json
{
  "title": "Update Title",
  "excerpt": "Short description",
  "content": "Full content here",
  "author": "Author Name",
  "authorEmail": "author@email.com",
  "category": "Event",
  "tags": ["tag1", "tag2"],
  "featured": false,
  "priority": "Medium",
  "status": "Draft",
  "publishDate": "2025-01-15T00:00:00.000Z",
  "expiryDate": "2025-12-31T00:00:00.000Z",
  "images": ["base64_image_data"],
  "eventDetails": {
    "eventDate": "2025-02-15T00:00:00.000Z",
    "location": "Event Location",
    "registrationLink": "https://registration-link.com",
    "capacity": 100
  },
  "seoMeta": {
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Description",
    "keywords": ["keyword1", "keyword2"]
  }
}
```

#### Update Existing Update
```http
PUT /api/updates/:id
```

#### Delete Update
```http
DELETE /api/updates/:id
```

#### Publish Update
```http
PATCH /api/updates/:id/publish
```

#### Archive Update
```http
PATCH /api/updates/:id/archive
```

#### Toggle Featured Status
```http
PATCH /api/updates/:id/feature
```

#### Get Update Statistics
```http
GET /api/updates/stats/overview
```

**Response:**
```json
{
  "totalUpdates": 25,
  "publishedUpdates": 20,
  "draftUpdates": 3,
  "featuredUpdates": 5,
  "categoriesStats": [
    { "_id": "Event", "count": 8 },
    { "_id": "Announcement", "count": 6 }
  ],
  "totalViews": 1250
}
```

#### Bulk Operations
```http
POST /api/updates/bulk
```

**Request Body:**
```json
{
  "action": "publish",
  "ids": ["update_id_1", "update_id_2"]
}
```

**Available Actions:** publish, archive, delete, feature, unfeature

## Data Model

### ClubUpdate Schema
```javascript
{
  title: String (required),
  excerpt: String (required),
  content: String (required),
  author: String (required),
  authorEmail: String,
  category: String (enum: Announcement, Event, Achievement, Training, Partnership, General),
  tags: [String],
  featured: Boolean (default: false),
  priority: String (enum: Low, Medium, High, Urgent),
  status: String (enum: Draft, Published, Archived),
  publishDate: Date,
  expiryDate: Date,
  images: [String], // Base64 or URLs
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  eventDetails: {
    eventDate: Date,
    location: String,
    registrationLink: String,
    capacity: Number
  },
  engagement: {
    views: Number (default: 0),
    likes: Number (default: 0),
    shares: Number (default: 0)
  },
  seoMeta: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  isActive: Boolean (default: true),
  displayOrder: Number,
  lastUpdatedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration

### Admin Interface
- **Path:** `/admin/updates`
- **Component:** `UpdatesAdmin.jsx`
- **Features:** Full CRUD, statistics dashboard, bulk operations

### Public Updates Page
- **Path:** `/updates`
- **Component:** `UpdatesPage.tsx`
- **Features:** Filtering, search, responsive design

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
node scripts/populateUpdates.js
```

## Usage Examples

### Creating an Event Update
```javascript
const eventUpdate = {
  title: "Tech Workshop: React Fundamentals",
  excerpt: "Learn React basics in this hands-on workshop",
  content: "Detailed workshop description...",
  author: "John Doe",
  category: "Event",
  tags: ["react", "workshop", "frontend"],
  featured: true,
  priority: "High",
  status: "Published",
  eventDetails: {
    eventDate: "2025-03-15T14:00:00.000Z",
    location: "Computer Lab A",
    registrationLink: "https://forms.gle/workshop",
    capacity: 30
  }
};
```

### Filtering Updates
```javascript
// Get featured events
const featuredEvents = await fetch('/api/updates?category=Event&featured=true');

// Search for AI-related updates
const aiUpdates = await fetch('/api/updates?search=artificial intelligence');

// Get recent announcements
const announcements = await fetch('/api/updates?category=Announcement&limit=5');
```

## Best Practices

### Content Guidelines
1. **Title:** Clear, descriptive, under 60 characters
2. **Excerpt:** Compelling summary, 120-150 characters
3. **Content:** Well-structured with headings and bullet points
4. **Tags:** Use consistent, relevant tags (3-7 per update)
5. **Images:** Optimize for web, max 5MB per image

### SEO Optimization
1. Include relevant keywords in title and content
2. Write compelling meta descriptions
3. Use proper heading structure (H1, H2, H3)
4. Add alt text for images

### Category Usage
- **Event:** Workshops, meetups, conferences, training sessions
- **Announcement:** Policy changes, new partnerships, general news
- **Achievement:** Success stories, milestones, awards
- **Training:** Course launches, certification programs
- **Partnership:** New collaborations, sponsor announcements
- **General:** Other club-related updates

## Troubleshooting

### Common Issues

1. **Updates not appearing:** Check status is "Published" and not expired
2. **Images not loading:** Verify Base64 encoding is correct
3. **Search not working:** Ensure search terms match content/tags
4. **Categories not filtering:** Check category names match exactly

### Debugging
- Check browser console for API errors
- Verify backend server is running on port 5000
- Confirm MongoDB connection is active
- Review server logs for detailed error messages

## Future Enhancements

- [ ] Email notifications for new updates
- [ ] Social media integration
- [ ] Update templates
- [ ] Advanced analytics
- [ ] Member commenting system
- [ ] Update scheduling
- [ ] Rich text editor integration
- [ ] File attachment support 