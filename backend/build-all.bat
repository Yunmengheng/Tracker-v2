@echo off
REM Build script for all microservices (Windows)

echo Building Financial Tracker Microservices...
echo ================================================

call :build_service eureka-server
call :build_service api-gateway
call :build_service auth-service
call :build_service transaction-service
call :build_service analytics-service

echo.
echo ================================================
echo All services built successfully!
echo.
echo Next steps:
echo 1. Run: docker-compose up -d
echo 2. Or start services individually with: cd [service-name] ^&^& mvn spring-boot:run
echo.
goto :eof

:build_service
echo.
echo Building %1...
cd %1
call mvn clean package -DskipTests
if errorlevel 1 (
    echo Failed to build %1
    exit /b 1
)
echo %1 built successfully
cd ..
goto :eof
