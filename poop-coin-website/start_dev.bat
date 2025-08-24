@echo off
echo 🚀 Starting POOP Coin Development Server...
echo.

REM Set development environment
set FLASK_ENV=development
set FLASK_DEBUG=1

REM Install watchdog if not present (for better auto-reload)
python -c "import watchdog" 2>nul || (
    echo 📦 Installing watchdog for better auto-reload...
    pip install watchdog
    echo.
)

REM Start the development server
echo 🌐 Server will be available at: http://127.0.0.1:5000
echo 🔄 Auto-reload is ENABLED - server restarts when files change
echo ⏹️  Press Ctrl+C to stop the server
echo.
echo ================================
echo.

python run_dev.py

pause
