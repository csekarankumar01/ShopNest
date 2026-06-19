@echo off
REM ShopNest - Start Both Backend and Frontend (Windows)

echo.
echo 🚀 Starting ShopNest Backend and Frontend...
echo.

REM Check if we're in the right directory
if not exist "backend\" (
    echo ❌ Error: backend directory not found!
    echo Please run this script from the root SHOPNEST directory
    pause
    exit /b 1
)

if not exist "frontend\" (
    echo ❌ Error: frontend directory not found!
    echo Please run this script from the root SHOPNEST directory
    pause
    exit /b 1
)

echo ✓ Directories found
echo.

REM Start backend in new window
echo 🔵 Starting Backend (Port 8000)...
start "ShopNest Backend" cmd /k "cd backend && npm run dev"

REM Wait a moment
timeout /t 3 /nobreak

REM Start frontend in new window
echo 🔵 Starting Frontend (Port 3000)...
start "ShopNest Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both services started in separate windows!
echo.
echo 🌐 URLs:
echo    Backend:  http://localhost:8000
echo    Frontend: http://localhost:3000
echo.
echo 📋 Check the respective command windows for logs
echo.
