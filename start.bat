@echo off

start cmd /k "npm run server"
timeout /t 2 >nul

start cmd /k "npm run dev"
timeout /t 5 >nul

start "" "http://localhost:5173/"