# Contact Management System

This document outlines the Contact Management system for handling contact form submissions, email notifications, and customer support workflows.

## Features

### Core Functionality
- ✅ **Contact Form Submission**: Public form with validation and error handling
- ✅ **Email Notifications**: Automatic email to moseskimani414@gmail.com for all submissions
- ✅ **WhatsApp Integration**: Direct links to WhatsApp (+254 792 343 958)
- ✅ **Data Persistence**: All messages stored in MongoDB with full metadata
- ✅ **Admin Dashboard**: Complete management interface for contact messages
- ✅ **Status Management**: New, In Progress, Responded, Resolved, Closed workflows
- ✅ **Priority System**: Urgent, High, Medium, Low priority levels
- ✅ **Category Organization**: 7 predefined categories for better organization
- ✅ **Rich Email Templates**: HTML formatted emails with contact details and quick actions
- ✅ **Contact Analytics**: Comprehensive statistics and insights
- ✅ **Search & Filter**: Advanced filtering by status, category, priority, and search terms

## API Endpoints

### Public Endpoints

#### Submit Contact Form
```http
POST /api/contact/submit
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "+254 712 345 678",
  "subject": "Inquiry about training programs",
  "message": "I would like to know more about your web development course...",
  "category": "Training",
  "priority": "Medium"
}
```

**Response:**
```json
{
  "message": "Your message has been sent successfully! We will get back to you soon.",
  "contactId": "64a1b2c3d4e5f6789abc1234",
  "whatsappLink": "https://wa.me/254792343958?text=Hi,%20I%20just%20sent%20a%20contact%20form..."
}
```

#### Generate WhatsApp Link
```http
POST /api/contact/whatsapp
```

**Request Body:**
```json
{
  "contactId": "64a1b2c3d4e5f6789abc1234",
  "customMessage": "Custom message for WhatsApp"
}
```

### Admin Endpoints (Authentication Required)

#### Get All Contact Messages
```http
GET /api/contact/admin
```

**Query Parameters:**
- `status` - Filter by status (New, In Progress, Responded, Resolved, Closed)
- `category` - Filter by category
- `priority` - Filter by priority (Urgent, High, Medium, Low)
- `isRead` - Filter by read status (true/false)
- `limit` - Number of messages to return (default: 50)
- `skip` - Number of messages to skip (pagination)

#### Get Single Contact Message
```http
GET /api/contact/admin/:id
```

**Response:** Single contact object with automatic read marking

#### Update Contact Status
```http
PATCH /api/contact/:id/status
```

**Request Body:**
```json
{
  "status": "In Progress",
  "responseNotes": "User contacted via email, awaiting response",
  "assignedTo": "support@ajirakinap.com"
}
```

#### Archive Contact Message
```http
PATCH /api/contact/:id/archive
```

#### Delete Contact Message
```http
DELETE /api/contact/:id
```

#### Get Contact Statistics
```http
GET /api/contact/stats/overview
```

**Response:**
```json
{
  "totalMessages": 150,
  "unreadMessages": 25,
  "newMessages": 15,
  "resolvedMessages": 100,
  "recentMessages": 30,
  "categoriesStats": [
    { "_id": "Training", "count": 45 },
    { "_id": "Technical Support", "count": 30 }
  ],
  "priorityStats": [
    { "_id": "Medium", "count": 60 },
    { "_id": "High", "count": 40 }
  ],
  "statusStats": [
    { "_id": "Resolved", "count": 100 },
    { "_id": "New", "count": 15 }
  ]
}
```

#### Bulk Operations
```http
POST /api/contact/bulk
```

**Request Body:**
```json
{
  "action": "mark-read",
  "ids": ["id1", "id2", "id3"]
}
```

**Available Actions:** mark-read, mark-unread, archive, unarchive, mark-resolved, delete

## Data Model

### Contact Schema
```javascript
{
  name: String (required),
  email: String (required),
  phone: String,
  subject: String (required),
  message: String (required),
  category: String (enum: General Inquiry, Technical Support, Partnership, Training, Complaint, Suggestion, Other),
  priority: String (enum: Low, Medium, High, Urgent),
  status: String (enum: New, In Progress, Responded, Resolved, Closed),
  source: String (enum: Website, WhatsApp, Email, Phone, Social Media),
  emailSent: Boolean (default: false),
  emailSentAt: Date,
  responseNotes: String,
  assignedTo: String,
  followUpDate: Date,
  isRead: Boolean (default: false),
  isArchived: Boolean (default: false),
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Virtual Fields
- `formattedDate`: Formatted creation date string

### Static Methods
- `getUnreadCount()`: Get count of unread messages
- `getByStatus(status, limit)`: Get messages by status

### Instance Methods
- `markAsRead()`: Mark message as read
- `updateStatus(newStatus, notes)`: Update status with notes

## Email System

### Automatic Email Notifications
When a contact form is submitted, an automatic email is sent to **moseskimani414@gmail.com** with:

- **Rich HTML formatting** with Ajira Digital branding
- **Complete contact details** (name, email, phone, category, priority)
- **Full message content** with proper formatting
- **Quick action links** for email replies and WhatsApp responses
- **Contact ID** for reference and tracking
- **Admin panel link** for management

### Email Template Features
- Professional HTML layout with Ajira Digital colors
- Responsive design for mobile email clients
- Direct reply links with pre-filled subject lines
- WhatsApp integration with pre-filled messages
- Contact metadata for admin reference

## WhatsApp Integration

### Features
- **Direct WhatsApp links** to +254 792 343 958
- **Pre-filled messages** with contact form context
- **Contact form integration** with automatic message generation
- **Manual WhatsApp links** for immediate contact
- **Admin reply functionality** with customer context

### WhatsApp Link Generation
```javascript
// Automatic after form submission
const whatsappUrl = `https://wa.me/254792343958?text=${encodeURIComponent(message)}`;

// Manual generation
POST /api/contact/whatsapp
{
  "contactId": "contact_id",
  "customMessage": "Custom message"
}
```

## Frontend Integration

### Contact Page (`/contact`)
- **Enhanced contact form** with phone number and category fields
- **Real-time form validation** with error handling
- **Success notifications** with WhatsApp integration
- **Quick contact actions** (WhatsApp, email, phone)
- **Professional layout** with Ajira Digital branding
- **Mobile-responsive design** for all devices

### Admin Interface (`/admin/contact`)
- **Complete message management** with search and filters
- **Status workflow management** with drag-and-drop updates
- **Bulk operations** for efficient admin tasks
- **Detailed message views** with full context
- **Quick reply actions** (email, WhatsApp, phone)
- **Analytics dashboard** with comprehensive statistics

## Setup Instructions

### 1. Environment Variables
Ensure your `.env` file includes email configuration:
```env
MONGODB_URI=your_mongodb_connection_string
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM="Ajira Digital" <no-reply@ajira.com>
```

### 2. Gmail Setup
1. Enable 2-factor authentication on Gmail
2. Generate an app-specific password
3. Use the app password in `EMAIL_PASS`

### 3. Start the Server
```bash
cd backend
npm run dev
```

### 4. Populate Sample Data (Optional)
```bash
cd backend
node scripts/populateContacts.js
```

## Categories and Priority Guidelines

### Categories
- **General Inquiry**: Basic information requests, general questions
- **Technical Support**: Website issues, login problems, technical difficulties
- **Partnership**: Business partnerships, collaborations, hiring opportunities
- **Training**: Course inquiries, training program questions, certification issues
- **Complaint**: Service complaints, quality issues, refund requests
- **Suggestion**: Feature suggestions, improvement ideas, feedback
- **Other**: Miscellaneous inquiries that don't fit other categories

### Priority Levels
- **Urgent**: Critical issues requiring immediate attention (system down, major bugs)
- **High**: Important requests with time sensitivity (certificate issues, partnership opportunities)
- **Medium**: Standard inquiries and support requests (general questions, course information)
- **Low**: Non-urgent suggestions and general feedback

## Workflow Management

### Status Flow
1. **New** → Contact form submitted, awaiting review
2. **In Progress** → Admin assigned, actively working on resolution
3. **Responded** → Reply sent to customer, awaiting customer response
4. **Resolved** → Issue resolved, customer satisfied
5. **Closed** → Final state, no further action needed

### Admin Best Practices
1. **Quick Response**: Aim to respond within 24 hours
2. **Status Updates**: Keep status current for team coordination
3. **Response Notes**: Document all actions taken for future reference
4. **Follow-up**: Set follow-up dates for pending items
5. **Customer Communication**: Use both email and WhatsApp for urgent matters

## Analytics and Reporting

### Available Metrics
- Total messages received
- Unread message count
- Messages by category and priority
- Response time analytics
- Resolution rate tracking
- Customer satisfaction indicators

### Admin Dashboard Stats
- Real-time message counts
- Category distribution
- Priority breakdowns
- Status progression
- Recent activity trends

## Security and Privacy

### Data Protection
- All contact data encrypted in transit and at rest
- IP address and user agent logging for security
- Secure email transmission with authentication
- Admin access control with role-based permissions

### Privacy Compliance
- Clear data collection purposes
- Secure data storage practices
- Limited data retention policies
- User consent for communication

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check EMAIL_USER and EMAIL_PASS in .env
   - Verify Gmail app password is correct
   - Ensure 2FA is enabled on Gmail account

2. **WhatsApp links not working**
   - Verify phone number format (+254792343958)
   - Check URL encoding for special characters
   - Test links in different browsers

3. **Contact form submission fails**
   - Check backend server is running
   - Verify MongoDB connection
   - Check browser console for errors

### Debugging
- Check server logs for email sending errors
- Verify contact data in MongoDB
- Test API endpoints directly
- Review browser network tab for failed requests

## Future Enhancements

- [ ] File attachment support for contact forms
- [ ] Live chat integration
- [ ] Automated response templates
- [ ] Customer satisfaction surveys
- [ ] Integration with CRM systems
- [ ] Mobile app for admin management
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Automated follow-up sequences
- [ ] Social media integration
- [ ] Voice message support
- [ ] Video call scheduling integration 