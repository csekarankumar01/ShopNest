#!/bin/bash

# ShopNest - Start Both Backend and Frontend

echo "🚀 Starting ShopNest Backend and Frontend..."
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: backend and frontend directories not found!"
    echo "Please run this script from the root SHOPNEST directory"
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 1
    else
        return 0
    fi
}

# Check backend port (8000)
if ! check_port 8000; then
    echo -e "${RED}❌ Port 8000 is already in use. Please stop the service using that port.${NC}"
    exit 1
fi

# Check frontend port (3000)
if ! check_port 3000; then
    echo -e "${RED}❌ Port 3000 is already in use. Please stop the service using that port.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Ports available${NC}"
echo ""

# Start backend in background
echo -e "${YELLOW}Starting Backend (Port 8000)...${NC}"
cd backend
npm run dev > /tmp/shopnest-backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo -e "${YELLOW}Starting Frontend (Port 3000)...${NC}"
cd frontend
npm start > /tmp/shopnest-frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ Both services started!${NC}"
echo ""
echo "📝 Process IDs:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "🌐 URLs:"
echo -e "   Backend:  ${GREEN}http://localhost:8000${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f /tmp/shopnest-backend.log"
echo "   Frontend: tail -f /tmp/shopnest-frontend.log"
echo ""
echo "🛑 To stop services:"
echo "   kill $BACKEND_PID  (Backend)"
echo "   kill $FRONTEND_PID (Frontend)"
echo "   Or press Ctrl+C in the respective terminal windows"
echo ""

# Wait for both processes
wait
