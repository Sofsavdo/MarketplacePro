#!/bin/bash

echo "🚀 AFFILIMART Replit Setup Script"
echo "=================================="

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/logs
mkdir -p frontend/.next

# Copy environment files
echo "📄 Setting up environment files..."
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "✅ Backend .env created"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/env.example frontend/.env.local
    echo "✅ Frontend .env.local created"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Setup database
echo "🗄️ Setting up database..."
npm run db:setup

echo "✅ Setup completed successfully!"
echo "🎉 AFFILIMART is ready to run!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "Or start individually:"
echo "  Backend:  npm run dev:backend"
echo "  Frontend: npm run dev:frontend" 