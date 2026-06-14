@echo off
cd /d "%~dp0"
echo Building FreedomBets installer...
call npm run desktop:dist
if errorlevel 1 (
  echo.
  echo Build failed.
  pause
  exit /b 1
)
echo.
echo Done. Check the release folder for the installer.
start "" "release"
pause
