#!/bin/bash

# CollabBoard AI Setup Script
echo "🎨 Setting up CollabBoard AI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MongoDB is installed (optional)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. You can install it or use Docker."
fi

# Check if Redis is installed (optional)
if ! command -v redis-server &> /dev/null; then
    echo "⚠️  Redis is not installed. You can install it or use Docker."
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment files
echo "🔧 Creating environment files..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please edit .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p backend/uploads

# Set permissions
echo "🔐 Setting permissions..."
chmod +x setup.sh
chmod +x scripts/*.sh 2>/dev/null || true

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB and Redis (or use Docker)"
echo "3. Run 'npm run dev' to start development servers"
echo "4. Visit http://localhost:5173 to see the application"
echo ""
echo "For Docker setup, run: docker-compose up -d"
echo ""

