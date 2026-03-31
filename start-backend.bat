@echo off
REM Script untuk start backend dengan monitoring
REM Ini akan auto-restart jika backend crash

echo.
echo ========================================
echo   STARTING BACKEND WITH MONITORING
echo ========================================
echo.

setlocal enabledelayedexpansion

set RESTART_COUNT=0
set MAX_RESTARTS=5

:start_server
cls
set /a RESTART_COUNT=!RESTART_COUNT!+1

if !RESTART_COUNT! GTR !MAX_RESTARTS! (
    echo.
    echo ❌ ERROR: Exceeded maximum restart attempts (!MAX_RESTARTS!)
    echo ⚠️  Please check the error logs above
    pause
    exit /b 1
)

if !RESTART_COUNT! GTR 1 (
    echo.
    echo 🔄 Restarting backend... (Attempt !RESTART_COUNT!/!MAX_RESTARTS!)
    echo ⏳ Waiting 3 seconds before restart...
    timeout /t 3 /nobreak
)

echo.
echo ✅ Starting backend server...
echo 🕐 Process started at: %date% %time%
echo.

cd /d "%~dp0backend"
npm start

echo.
echo ⚠️  Backend process ended (Exit Code: %ERRORLEVEL%)
echo 🔄 Will automatically restart in 3 seconds...
echo.

timeout /t 3 /nobreak
goto start_server
