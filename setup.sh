#!/bin/bash

echo "🚀 AFFILIMART - Replit Setup Script"
echo "=================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Setup database
echo "🗄️ Setting up database..."
npm run db:setup

# Start the application
echo "🎯 Starting AFFILIMART..."
npm run dev

echo "✅ Setup complete! AFFILIMART is running on Replit!" 