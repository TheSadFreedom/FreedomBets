@echo off
cd /d "%~dp0"

call npm run build
if errorlevel 1 pause & exit /b 1

start cmd /k "npm run server"
timeout /t 2 >nul

start cmd /k "npm run preview"
timeout /t 5 >nul

start "" "http://localhost:4173/"
