@echo off
title ChipForge 8BIT Music Workshop
cd /d "%~dp0"

echo Stopping previous ChipForge server (if any)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8213" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

echo Starting ChipForge on http://localhost:8213 ...
echo (Close this window to stop the server)
echo.
start "" http://localhost:8213
python serve.py 8213

if errorlevel 1 (
  echo.
  echo [ERROR] Server failed to start. See the message above.
  pause
)
