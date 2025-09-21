#!/bin/bash

# StrawHat DeFi Platform - Deployment Script
# IndiaCodex Hackathon 2024

echo "🏴‍☠️ Starting StrawHat DeFi Platform deployment..."

# Check if required environment variables are set
if [ -z "$MONGODB_URI" ]; then
    echo "⚠️  Warning: MONGODB_URI not set, using default local database"
    export MONGODB_URI="mongodb://localhost:27017/strawhat-defi"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build frontend
echo "🏗️  Building frontend..."
cd frontend && npm run build && cd ..

# Start backend server
echo "🚀 Starting backend server..."
cd backend && npm start &

# Store backend PID
BACKEND_PID=$!

echo "✅ Deployment completed!"
echo "📊 Backend running on: http://localhost:5000"
echo "🌐 Frontend build completed in: ./frontend/.next"
echo "📋 Backend PID: $BACKEND_PID"

# Create PID file for easy management
echo $BACKEND_PID > backend.pid

echo ""
echo "🎯 To stop the backend:"
echo "   kill \$(cat backend.pid)"
echo ""
echo "🎯 To start frontend development server:"
echo "   cd frontend && npm run dev"
echo ""
echo "🏴‍☠️ Ready to set sail for DeFi adventures!"