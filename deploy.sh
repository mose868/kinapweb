#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
required_vars=("NODE_ENV" "MONGODB_URI" "JWT_SECRET" "SESSION_SECRET" "GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var is not set"
    exit 1
  fi
done

echo "✅ Environment variables verified"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Run tests
echo "🧪 Running tests..."
npm test

# Build client
echo "🏗️ Building client..."
cd client
npm ci --production
npm run build
cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p uploads

# Set up PM2 process
if ! command -v pm2 &> /dev/null; then
  echo "📥 Installing PM2..."
  npm install -g pm2
fi

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 delete ajira-digital 2>/dev/null || true
pm2 start index.js --name "ajira-digital" \
  --max-memory-restart 300M \
  --log ./logs/pm2.log \
  --time \
  --env production

# Save PM2 process list
pm2 save

echo "✨ Deployment completed successfully!"

# Health check
echo "🏥 Performing health check..."
sleep 5
response=$(curl -s http://localhost:${PORT:-5000}/api/health)
if [[ $response == *"success"* ]]; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed"
  exit 1
fi

echo "
🎉 Deployment Summary:
- Application: Ajira Digital
- Environment: Production
- Port: ${PORT:-5000}
- Process Manager: PM2
- Logs: ./logs/
- Health: OK
" 