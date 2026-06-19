#!/bin/bash

# ShopNest - Development environment setup

echo "🔧 ShopNest Development Setup"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: backend and frontend directories not found!"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ Backend dependencies already installed"
fi
cd ..

echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ Frontend dependencies already installed"
fi
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure environment variables:"
echo "   - Backend: Check backend/.env"
echo "   - Frontend: Check frontend/.env.local"
echo ""
echo "2. Start the services:"
echo "   - macOS/Linux: ./start.sh"
echo "   - Windows: start.bat"
echo ""
echo "3. Or manually start:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm start"
echo ""
