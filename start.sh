#!/bin/bash

# Start ShopNest development servers

if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "Error: Run from the root SHOPNEST directory"
    exit 1
fi

echo "Starting backend (http://localhost:8000)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "Starting frontend (http://localhost:3000)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both services running. Press Ctrl+C to stop."
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
