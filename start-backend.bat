@echo off
echo ========================================
echo Financial Tracker - Quick Start
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/4] Building backend services...
cd backend
call build-all.bat
if errorlevel 1 (
    echo ERROR: Failed to build services
    pause
    exit /b 1
)

echo.
echo [2/4] Starting backend services with Docker Compose...
docker-compose up -d
if errorlevel 1 (
    echo ERROR: Failed to start services
    pause
    exit /b 1
)

echo.
echo [3/4] Waiting for services to be ready...
timeout /t 30 /nobreak >nul

echo.
echo [4/4] Services Status:
docker-compose ps

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Eureka Dashboard: http://localhost:8761
echo API Gateway: http://localhost:8080
echo Swagger Docs:
echo   - Auth Service: http://localhost:8081/swagger-ui.html
echo   - Transaction Service: http://localhost:8082/swagger-ui.html
echo   - Analytics Service: http://localhost:8083/swagger-ui.html
echo.
echo To start the Angular frontend:
echo   cd ..
echo   npm start
echo.
echo To view logs:
echo   docker-compose logs -f
echo.
echo To stop all services:
echo   docker-compose down
echo.
pause
