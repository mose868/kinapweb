# KiNaP Ajira Digital Marketplace Backend

A comprehensive marketplace backend for freelancers and clients to connect, trade services, and manage orders.

## 🏗️ Architecture

### Models
- **Gig**: Service listings with packages, pricing, and requirements
- **Order**: Transaction management with status tracking
- **Review**: Rating and feedback system
- **User**: Extended user model with marketplace features

### Features
- ✅ **Gig Management**: Create, update, and manage service listings
- ✅ **Order System**: Complete order lifecycle management
- ✅ **Review System**: Rating and feedback for quality assurance
- ✅ **Search & Filtering**: Advanced search with multiple filters
- ✅ **Authentication**: JWT-based authentication with role-based access
- ✅ **Real-time Updates**: Socket.io integration for live updates
- ✅ **Payment Integration**: Support for multiple payment methods
- ✅ **File Upload**: Image and attachment handling

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env` file with:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 3. Populate Sample Data
```bash
npm run populate-marketplace
```

### 4. Start Development Server
```bash
npm run dev
```

## 📡 API Endpoints

### Gigs

#### Get All Gigs
```http
GET /api/marketplace/gigs
```

**Query Parameters:**
- `category`: Filter by category
- `minPrice`/`maxPrice`: Price range filter
- `rating`: Minimum rating filter
- `search`: Text search
- `sort`: Sort by (newest, price-low, price-high, rating, orders)
- `page`: Page number
- `limit`: Items per page

#### Get Featured Gigs
```http
GET /api/marketplace/gigs/featured
```

#### Get Gig by ID
```http
GET /api/marketplace/gigs/:id
```

#### Create Gig (Protected)
```http
POST /api/marketplace/gigs
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Professional Web Development",
  "description": "I'll create a modern website...",
  "category": "web-development",
  "pricing": {
    "type": "fixed",
    "amount": 25000,
    "currency": "KES"
  },
  "packages": [
    {
      "name": "basic",
      "title": "Basic Website",
      "price": 15000,
      "deliveryTime": 7,
      "revisions": 2,
      "features": ["Responsive design", "Contact form"]
    }
  ]
}
```

#### Update Gig (Protected)
```http
PUT /api/marketplace/gigs/:id
Authorization: Bearer <token>
```

#### Delete Gig (Protected)
```http
DELETE /api/marketplace/gigs/:id
Authorization: Bearer <token>
```

### Orders

#### Create Order (Protected)
```http
POST /api/marketplace/orders
Authorization: Bearer <token>
```

**Body:**
```json
{
  "gigId": "gig_id_here",
  "packageName": "basic",
  "requirements": [
    {
      "question": "What type of website do you need?",
      "answer": "E-commerce website"
    }
  ],
  "paymentMethod": "mpesa"
}
```

#### Get User Orders (Protected)
```http
GET /api/marketplace/orders?role=buyer&status=completed
Authorization: Bearer <token>
```

#### Get Order by ID (Protected)
```http
GET /api/marketplace/orders/:id
Authorization: Bearer <token>
```

#### Update Order Status (Protected)
```http
PATCH /api/marketplace/orders/:id/status
Authorization: Bearer <token>
```

**Body:**
```json
{
  "status": "in-progress",
  "note": "Started working on the project"
}
```

#### Add Message to Order (Protected)
```http
POST /api/marketplace/orders/:id/messages
Authorization: Bearer <token>
```

**Body:**
```json
{
  "message": "How is the project coming along?",
  "attachments": [
    {
      "name": "reference.png",
      "url": "https://example.com/file.png"
    }
  ]
}
```

### Reviews

#### Create Review (Protected)
```http
POST /api/marketplace/reviews
Authorization: Bearer <token>
```

**Body:**
```json
{
  "orderId": "order_id_here",
  "rating": {
    "overall": 5,
    "communication": 5,
    "quality": 5,
    "value": 4,
    "onTime": 5
  },
  "title": "Excellent work!",
  "comment": "The developer delivered exactly what I needed..."
}
```

#### Get Reviews by Gig
```http
GET /api/marketplace/gigs/:gigId/reviews?page=1&limit=10
```

#### Get Reviews by Seller
```http
GET /api/marketplace/sellers/:sellerId/reviews?page=1&limit=10
```

### Search

#### Search Gigs
```http
GET /api/marketplace/search?q=web+development&category=web-development&minPrice=10000&maxPrice=50000&rating=4&sort=rating
```

### Statistics

#### Get Marketplace Stats
```http
GET /api/marketplace/stats
```

## 🔐 Authentication

### Protected Routes
Most marketplace routes require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **buyer**: Can create orders and reviews
- **seller**: Can create gigs and manage orders
- **admin**: Full access to all features

## 📊 Data Models

### Gig Schema
```javascript
{
  seller: ObjectId,           // Reference to User
  title: String,              // Gig title
  description: String,        // Detailed description
  category: String,           // Service category
  subcategory: String,        // Service subcategory
  tags: [String],             // Search tags
  pricing: {
    type: String,             // 'fixed' or 'hourly'
    amount: Number,           // Price amount
    currency: String          // Currency code
  },
  packages: [{                // Service packages
    name: String,             // 'basic', 'standard', 'premium'
    title: String,            // Package title
    description: String,      // Package description
    price: Number,            // Package price
    deliveryTime: Number,     // Delivery time in days
    revisions: Number,        // Number of revisions
    features: [String]        // Package features
  }],
  images: [{                  // Gig images
    url: String,
    alt: String
  }],
  requirements: [{            // Custom requirements
    question: String,
    type: String,             // 'text', 'file', 'choice'
    required: Boolean,
    options: [String]         // For choice type
  }],
  stats: {                    // Gig statistics
    views: Number,
    orders: Number,
    rating: Number,
    reviews: Number
  },
  status: String,             // 'draft', 'active', 'paused', 'rejected'
  featured: Boolean,          // Featured gig flag
  verified: Boolean,          // Verified seller flag
  location: {                 // Seller location
    country: String,
    city: String
  },
  languages: [String],        // Languages spoken
  skills: [String],           // Skills and technologies
  portfolio: [{               // Portfolio items
    title: String,
    description: String,
    image: String,
    url: String
  }],
  availability: String,       // 'available', 'busy', 'unavailable'
  responseTime: Number,       // Response time in hours
  completionRate: Number      // Completion rate percentage
}
```

### Order Schema
```javascript
{
  buyer: ObjectId,            // Reference to User
  seller: ObjectId,           // Reference to User
  gig: ObjectId,              // Reference to Gig
  package: {                  // Selected package
    name: String,
    title: String,
    price: Number,
    deliveryTime: Number,
    revisions: Number,
    features: [String]
  },
  requirements: [{            // Buyer requirements
    question: String,
    answer: String,
    files: [{
      name: String,
      url: String
    }]
  }],
  status: String,             // Order status
  payment: {                  // Payment information
    amount: Number,
    currency: String,
    method: String,
    transactionId: String,
    status: String,
    paidAt: Date
  },
  delivery: {                 // Delivery information
    dueDate: Date,
    deliveredAt: Date,
    files: [{
      name: String,
      url: String,
      description: String
    }],
    message: String
  },
  messages: [{                // Order messages
    sender: ObjectId,
    message: String,
    attachments: [{
      name: String,
      url: String
    }],
    timestamp: Date
  }],
  rating: {                   // Order rating
    score: Number,
    review: String,
    ratedAt: Date
  },
  timeline: [{                // Order timeline
    status: String,
    timestamp: Date,
    note: String
  }]
}
```

### Review Schema
```javascript
{
  order: ObjectId,            // Reference to Order
  gig: ObjectId,              // Reference to Gig
  reviewer: ObjectId,         // Reference to User (buyer)
  seller: ObjectId,           // Reference to User (seller)
  rating: {                   // Detailed ratings
    overall: Number,
    communication: Number,
    quality: Number,
    value: Number,
    onTime: Number
  },
  title: String,              // Review title
  comment: String,            // Review comment
  images: [{                  // Review images
    url: String,
    alt: String
  }],
  helpful: [{                 // Helpful votes
    user: ObjectId,
    helpful: Boolean
  }],
  status: String,             // 'pending', 'approved', 'rejected'
  isVerified: Boolean,        // Verified purchase flag
  response: {                 // Seller response
    seller: {
      comment: String,
      respondedAt: Date
    }
  }
}
```

## 🛠️ Development

### Adding New Features

1. **Create Model**: Add new schema in `models/` directory
2. **Add Routes**: Create routes in `routes/marketplace.js`
3. **Update Middleware**: Add authentication/authorization as needed
4. **Test**: Test endpoints with sample data
5. **Document**: Update this README

### Database Indexes

The marketplace uses optimized indexes for better performance:

```javascript
// Gig indexes
gigSchema.index({ seller: 1, status: 1 });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ title: 'text', description: 'text', tags: 'text' });
gigSchema.index({ 'pricing.amount': 1 });
gigSchema.index({ featured: 1, status: 1 });
gigSchema.index({ createdAt: -1 });

// Order indexes
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ seller: 1, status: 1 });
orderSchema.index({ gig: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Review indexes
reviewSchema.index({ gig: 1, status: 1 });
reviewSchema.index({ seller: 1, status: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ order: 1 }, { unique: true });
reviewSchema.index({ createdAt: -1 });
```

## 🧪 Testing

### Test API Endpoints

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Test endpoints**:
   ```bash
   # Get all gigs
   curl http://localhost:5000/api/marketplace/gigs

   # Get featured gigs
   curl http://localhost:5000/api/marketplace/gigs/featured

   # Search gigs
   curl "http://localhost:5000/api/marketplace/search?q=web+development"

   # Get marketplace stats
   curl http://localhost:5000/api/marketplace/stats
   ```

### Sample Data

The marketplace comes with sample data including:
- 5 different gig categories
- Various pricing packages
- Sample requirements and skills
- Realistic pricing in KES

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `PORT` | Server port | 5000 |

### Categories

Available gig categories:
- `web-development`
- `mobile-development`
- `graphic-design`
- `digital-marketing`
- `content-writing`
- `data-entry`
- `video-editing`
- `translation`
- `virtual-assistant`
- `other`

### Payment Methods

Supported payment methods:
- `mpesa` - M-Pesa mobile money
- `card` - Credit/debit cards
- `bank` - Bank transfers
- `paypal` - PayPal

## 🚀 Deployment

### Production Checklist

- [ ] Set environment variables
- [ ] Configure MongoDB Atlas
- [ ] Set up SSL certificates
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all endpoints
- [ ] Set up CI/CD pipeline

### Performance Optimization

- [ ] Enable MongoDB indexes
- [ ] Implement caching (Redis)
- [ ] Optimize image uploads
- [ ] Set up CDN for static files
- [ ] Monitor API response times
- [ ] Implement rate limiting

## 📝 License

This project is part of the KiNaP Ajira Digital platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation 