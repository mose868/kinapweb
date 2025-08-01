# Ajira Digital KiNaP Club Platform

A full-stack web application for managing the Ajira Digital Club platform.

## Features

- User authentication with email/password and Google OAuth
- Role-based access control (admin, user)
- Protected routes and API endpoints
- Session management with MongoDB store
- Admin dashboard with user management
- RESTful API architecture
- Secure password handling and JWT tokens

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js for authentication
- Express-session for session management
- JWT for token-based authentication
- Bcrypt for password hashing
- Express-validator for input validation

### Frontend
- React.js
- Material-UI components
- Axios for API calls
- React Router for navigation
- Context API for state management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Google OAuth credentials
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ajira-digital-kinap-club
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the server directory
   - Fill in your environment variables:
     - MongoDB URI
     - JWT secret
     - Session secret
     - Google OAuth credentials
     - Frontend URL
     - Other configuration values

4. Start the development servers:
   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend development server (from client directory)
   npm start
   ```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ajira_digital_kinap

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Frontend URL
CLIENT_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/google` - Google OAuth login
- GET `/api/auth/google/callback` - Google OAuth callback
- GET `/api/auth/logout` - Logout user

### Users
- GET `/api/users/me` - Get current user profile
- PATCH `/api/users/me` - Update user profile
- GET `/api/users/:id` - Get user by ID (admin only)

### Admin Dashboard
- GET `/api/admin/stats` - Get dashboard statistics
- GET `/api/admin/users` - Get all users
- PATCH `/api/admin/users/:id/role` - Update user role

## Security Features

- CORS protection
- Helmet security headers
- Rate limiting
- MongoDB sanitization
- XSS protection
- Password hashing
- JWT token authentication
- Session management
- Role-based access control

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure
```
ajira-profile/
├── client/               # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/              # Express backend
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── index.js       # Server entry point
└── README.md
```

## Technologies Used

### Frontend
- React
- React Router DOM
- Tailwind CSS
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (file uploads)
- Bcrypt (password hashing)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ajira-profile
```

2. Install Backend Dependencies:
```bash
cd server
npm install
```

3. Create .env file in server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ajira_digital_kinap
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
```

4. Install Frontend Dependencies:
```bash
cd ../client
npm install
```

5. Create .env file in client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start MongoDB:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo service mongod start
```

2. Start Backend Server:
```bash
cd server
npm run dev
```

3. Start Frontend Development Server:
```bash
cd client
npm run dev
```

4. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Projects
- GET /api/projects - Get all projects
- POST /api/projects - Create new project
- GET /api/projects/:id - Get project by ID
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project

### Marketplace
- GET /api/marketplace - Get all items
- POST /api/marketplace - Create new item
- GET /api/marketplace/:id - Get item by ID
- PUT /api/marketplace/:id - Update item
- DELETE /api/marketplace/:id - Delete item

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Features

- 🛍️ Fiverr-style Marketplace
  - Buyer and Seller profiles
  - Gig creation and management
  - Order system
  - Reviews and ratings

- 👥 User Authentication
  - Email/Password signup
  - Google authentication
  - Role-based access (Buyer/Seller/Admin)

- 📹 Video Platform
  - MP4 video uploads
  - YouTube video embedding
  - Thumbnail generation
  - Category-based organization

- 💬 AI Chatbot
  - OpenAI-powered assistance
  - FAQs and help topics
  - Real-time responses

- 📍 Location Features
  - Google Maps integration
  - KiNaP Hub location
  - User location display

## Tech Stack

- Frontend:
  - React with TypeScript
  - Vite for development
  - Tailwind CSS for styling
  - React Query for data fetching
  - React Router for navigation

- Backend:
  - Express.js server
  - Firebase Authentication
  - Firestore database
  - Firebase Storage
  - OpenAI API integration

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ajira-digital-kinap-club.git
   cd ajira-digital-kinap-club
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys and configuration:
     ```
     # Server
     PORT=3000

     # Firebase
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id

     # OpenAI
     VITE_OPENAI_API_KEY=your_openai_api_key

     # Google Maps
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
.
├── client/                # Frontend React application
│   ├── src/
│   │   ├── api/          # API endpoints
│   │   ├── components/   # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   ├── types/       # TypeScript types
│   │   └── config/      # Configuration files
│   └── public/          # Static assets
│
├── server/              # Backend Express server
│   └── index.ts        # Server entry point
│
└── package.json        # Project dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ajira Digital](https://ajiradigital.go.ke) for the initiative
- Kiambu National Polytechnic for hosting the hub
- All contributors and supporters 