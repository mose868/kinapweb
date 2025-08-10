# Manual Render Deployment Guide

## If you can't see your repository, follow these steps:

### 1. Go to Render Dashboard
- Visit: https://dashboard.render.com
- Sign in with your GitHub account

### 2. Create New Web Service
- Click "New +" → "Web Service"
- Choose "Build and deploy from a Git repository"
- Enter: `https://github.com/mose868/kinapweb`

### 3. Configure Service
- **Name:** `kinap-backend`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 4. Environment Variables
Add these one by one:

```
MONGODB_URI=mongodb+srv://moseskimani414:moseskim@cluster0.njyg51i.mongodb.net/kinapweb?retryWrites=true&w=majority&appName=Cluster0
GEMINI_API_KEY=AIzaSyDhj7xhHayAaoFeL8QKkm7c4yhi9b8-lPU
JWT_SECRET=your-super-secret-jwt-key-here
GMAIL_USER=kinapajira@gmail.com
GMAIL_APP_PASSWORD=nwbyktcngzpfawzq
EMAIL_FROM=kinapajira@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=kinapajira@gmail.com
EMAIL_PASS=nwbyktcngzpfawzq
BETTER_AUTH_SECRET=zk4xiM145chzOXr3jYPcHLSSRQ9G7oQP
```

### 5. Deploy
- Click "Create Web Service"
- Wait for build to complete
- Your URL will be: `https://kinap-backend.onrender.com`
