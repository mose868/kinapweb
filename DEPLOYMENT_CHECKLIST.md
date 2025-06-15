# Deployment Checklist

## Environment Setup
1. Create a `.env` file in the root directory with the following variables:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Set up Firebase Storage with the following rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 100 * 1024 * 1024 // 100MB max file size
                   && request.resource.contentType.matches('video/.*|image/.*')
    }
  }
}
```

## Pre-deployment Checks
1. Color Theme Consistency:
   - Primary: #000000 (Black)
   - Accent: #FF0000 (Red)
   - Success: #008000 (Green)
   - Light: #FFFFFF (White)
   - Use predefined Tailwind classes (ajira-primary, ajira-accent, etc.)

2. Content Storage:
   - Videos and images are stored in Firebase Storage
   - Content is cached appropriately
   - File size limits are enforced (100MB max)
   - Proper file type validation

3. Performance Optimization:
   - Enable Firestore caching
   - Implement lazy loading for images and videos
   - Use compression for uploaded media
   - Enable Firebase Performance Monitoring

4. Security:
   - Secure API keys in environment variables
   - Implement proper Firebase Security Rules
   - Enable Firebase App Check
   - Set up proper CORS configuration

## Build and Deploy
1. Run tests:
```bash
npm run test
```

2. Build the project:
```bash
npm run build
```

3. Deploy to hosting:
```bash
firebase deploy
```

## Post-deployment
1. Verify all routes are working
2. Test file uploads and storage
3. Check authentication flows
4. Monitor error reporting
5. Set up automated backups for Firestore
6. Configure Firebase Analytics

## Maintenance
1. Regular backups of:
   - Firestore data
   - User-generated content
   - Configuration files

2. Monitoring:
   - Set up Firebase Alerts
   - Monitor storage usage
   - Track API usage limits
   - Set up error tracking

3. Updates:
   - Schedule regular dependency updates
   - Plan for security patches
   - Monitor Firebase console for important updates

## Important Notes
- Videos and images uploaded to Firebase Storage do not expire
- Content is served from Firebase's global CDN
- Implement proper cleanup for unused files
- Set up proper backup and disaster recovery procedures
- Monitor storage costs and implement cleanup policies if needed 