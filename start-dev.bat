@echo off
echo Starting Financial Tracker...
echo.

echo [1/3] Starting MongoDB...
docker start financial-tracker-mongodb
timeout /t 2 /nobreak > nul

echo [2/3] Starting Node.js API Server...
start "API Server" cmd /k "cd server && node server.js"
timeout /t 3 /nobreak > nul

echo [3/3] Starting Angular App...
start "Angular App" cmd /k "npm start"

echo.
echo ✅ All services started!
echo.
echo - MongoDB: localhost:27017
echo - API Server: http://localhost:3000
echo - Angular App: Will open in browser automatically
echo.
echo Press any key to exit this window...
pause > nul
