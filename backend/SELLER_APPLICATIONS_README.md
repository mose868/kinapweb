# Seller Applications System with AI Vetting

This system provides a comprehensive backend for managing seller applications with AI-powered vetting using Hugging Face models and persistent MongoDB storage.

## 🚀 Features

### Core Functionality
- **Seller Application Submission**: Complete application form with personal, professional, and business information
- **AI-Powered Vetting**: Automated analysis using Hugging Face models
- **Status Management**: Multi-stage approval process
- **Admin Review System**: Manual review capabilities for applications
- **Persistent Storage**: MongoDB integration with comprehensive data models

### AI Vetting Capabilities
- **Sentiment Analysis**: Evaluates application tone and professionalism
- **Quality Assessment**: Analyzes content quality and completeness
- **Risk Detection**: Identifies potential issues and red flags
- **Motivation Evaluation**: Assesses applicant commitment and goals
- **Experience Analysis**: Evaluates professional experience descriptions

## 📋 API Endpoints

### Public Endpoints
None - All endpoints require authentication

### User Endpoints (Requires Auth)
- `POST /api/seller-applications` - Submit new application
- `GET /api/seller-applications/my-application` - Get user's application

### Admin Endpoints (Requires Admin Auth)
- `GET /api/seller-applications` - List all applications
- `GET /api/seller-applications/:id` - Get specific application
- `PUT /api/seller-applications/:id/review` - Review application
- `POST /api/seller-applications/:id/retry-ai` - Retry AI vetting
- `GET /api/seller-applications/stats/dashboard` - Get dashboard stats

## 🗄️ Data Models

### SellerApplication Schema
```javascript
{
  userId: ObjectId,                    // Reference to User
  personalInfo: {                      // Personal details
    fullName: String,
    email: String,
    phoneNumber: String,
    dateOfBirth: Date,
    nationality: String,
    idNumber: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  professionalInfo: {                  // Professional background
    skills: [String],
    experience: String,
    education: String,
    certifications: [String],
    portfolio: String,
    linkedinProfile: String,
    githubProfile: String,
    website: String
  },
  businessInfo: {                      // Business details
    businessName: String,
    businessType: String,
    services: [String],
    targetMarket: String,
    pricingStrategy: String,
    expectedEarnings: Number
  },
  applicationContent: {                // Content for AI analysis
    motivation: String,
    experienceDescription: String,
    serviceDescription: String,
    valueProposition: String,
    sampleWork: String
  },
  aiVetting: {                         // AI analysis results
    isProcessed: Boolean,
    processedAt: Date,
    confidence: Number,
    riskScore: Number,
    qualityScore: Number,
    recommendations: [String],
    flaggedIssues: [String],
    aiNotes: String,
    modelUsed: String
  },
  status: String,                      // Application status
  review: {                            // Manual review details
    reviewedBy: ObjectId,
    reviewedAt: Date,
    reviewNotes: String,
    finalDecision: String,
    rejectionReason: String
  },
  documents: {                         // Supporting documents
    idDocument: String,
    portfolioSamples: [String],
    certificates: [String],
    references: [String]
  },
  submittedAt: Date,
  updatedAt: Date,
  expiresAt: Date,
  viewCount: Number,
  lastViewed: Date
}
```

## 🤖 AI Vetting Process

### Models Used
- **Sentiment Analysis**: `cardiffnlp/twitter-roberta-base-sentiment-latest`
- **Zero-Shot Classification**: `facebook/bart-large-mnli`
- **Text Generation**: `gpt2` (fallback)

### Analysis Components
1. **Sentiment Analysis**: Evaluates overall tone and professionalism
2. **Quality Assessment**: Analyzes content completeness and clarity
3. **Risk Detection**: Identifies potential issues or suspicious content
4. **Motivation Evaluation**: Assesses applicant commitment and goals
5. **Experience Analysis**: Evaluates professional experience descriptions

### Scoring System
- **Confidence Score**: Overall AI confidence in the analysis
- **Quality Score**: Content quality assessment (0-1)
- **Risk Score**: Risk assessment (0-1, lower is better)

### Status Flow
```
pending → ai_processing → ai_approved/ai_rejected/manual_review → approved/rejected
```

## 🔧 Setup Instructions

### 1. Environment Variables
Add to your `.env` file:
```env
HUGGING_FACE_API_KEY=your_hugging_face_api_key
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

### 2. Install Dependencies
```bash
npm install node-fetch
```

### 3. Database Setup
The system will automatically create the necessary collections and indexes.

### 4. Test the System
```bash
node test-seller-applications.js
```

## 📊 Usage Examples

### Submit Application
```javascript
const applicationData = {
  personalInfo: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+254700000000',
    dateOfBirth: '1990-01-01',
    nationality: 'Kenyan',
    idNumber: '12345678',
    address: {
      street: '123 Main St',
      city: 'Nairobi',
      state: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya'
    }
  },
  professionalInfo: {
    skills: ['Web Development', 'React', 'Node.js'],
    experience: '5 years of development experience',
    education: 'Bachelor of Computer Science',
    certifications: ['AWS Certified Developer'],
    portfolio: 'https://johndoe.dev'
  },
  businessInfo: {
    businessName: 'John Doe Development',
    businessType: 'Sole Proprietorship',
    services: ['Web Development', 'Mobile Apps'],
    targetMarket: 'Small businesses',
    pricingStrategy: 'Project-based pricing',
    expectedEarnings: 50000
  },
  applicationContent: {
    motivation: 'Passionate about creating quality web applications...',
    experienceDescription: 'Worked on various projects including...',
    serviceDescription: 'I offer comprehensive web development services...',
    valueProposition: 'High-quality, custom web solutions with fast delivery...',
    sampleWork: 'Successfully delivered projects for clients including...'
  },
  documents: {
    idDocument: 'https://example.com/id.pdf',
    portfolioSamples: ['https://example.com/portfolio1.jpg']
  }
};

const response = await fetch('/api/seller-applications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(applicationData)
});
```

### Check Application Status
```javascript
const response = await fetch('/api/seller-applications/my-application', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { application } = await response.json();
console.log('Status:', application.status);
console.log('AI Confidence:', application.aiVetting.confidence);
```

### Admin Review Application
```javascript
const reviewData = {
  finalDecision: 'approved',
  reviewNotes: 'Application looks good, approved after AI vetting',
  rejectionReason: null
};

const response = await fetch(`/api/seller-applications/${applicationId}/review`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify(reviewData)
});
```

## 🔍 AI Vetting Results

### Sample AI Analysis Output
```javascript
{
  isProcessed: true,
  processedAt: "2024-01-15T10:30:00.000Z",
  confidence: 0.85,
  qualityScore: 0.78,
  riskScore: 0.12,
  recommendations: [
    "Consider improving the tone and professionalism of your application",
    "Provide more specific examples and detailed descriptions of your work"
  ],
  flaggedIssues: [],
  aiNotes: "AI Analysis Summary:\n- Sentiment Score: 85.0%\n- Quality Score: 78.0%\n- Risk Score: 12.0%\n- Motivation Score: 82.0%\n- Experience Score: 75.0%\n\n✅ High quality application",
  modelUsed: "huggingface-multi-model"
}
```

## 🛡️ Security Features

- **Authentication Required**: All endpoints require valid JWT tokens
- **Admin Authorization**: Sensitive operations require admin privileges
- **Input Validation**: Comprehensive validation of all application data
- **Rate Limiting**: Built-in protection against abuse
- **Data Sanitization**: All user inputs are sanitized

## 📈 Monitoring and Analytics

### Dashboard Statistics
- Total applications
- Applications by status
- Pending AI processing
- Pending manual review
- Recent applications

### AI Performance Metrics
- Processing success rate
- Average confidence scores
- Model usage statistics
- Error rates and fallbacks

## 🔄 Error Handling

### AI Service Failures
- Automatic fallback to manual review
- Graceful degradation when AI models are unavailable
- Comprehensive error logging
- Retry mechanisms for failed AI processing

### Application Errors
- Detailed error messages
- Proper HTTP status codes
- Validation error feedback
- Database error handling

## 🚀 Future Enhancements

### Planned Features
- **Advanced AI Models**: Integration with more sophisticated models
- **Document Analysis**: AI-powered document verification
- **Real-time Processing**: WebSocket-based real-time updates
- **Advanced Analytics**: Machine learning insights and trends
- **Multi-language Support**: Support for multiple languages
- **Integration APIs**: Third-party service integrations

### Performance Optimizations
- **Caching**: Redis-based caching for frequently accessed data
- **Async Processing**: Background job processing for AI analysis
- **Database Optimization**: Advanced indexing and query optimization
- **CDN Integration**: Content delivery for documents and assets

## 📞 Support

For technical support or questions about the seller applications system:
- Check the logs for detailed error information
- Review the AI vetting results for application insights
- Monitor the dashboard statistics for system health
- Contact the development team for advanced issues

---

**Note**: This system is designed to work with the existing marketplace and authentication infrastructure. Ensure all dependencies are properly configured before deployment. 