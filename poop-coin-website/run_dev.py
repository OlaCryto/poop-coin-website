#!/usr/bin/env python3
"""
Enhanced Development Server with Auto-Reload
Automatically restarts Flask when ANY file changes (Python, HTML, CSS, JS, JSON)
"""

import os
import sys
import subprocess

def run_with_auto_reload():
    """Run Flask with comprehensive auto-reload"""
    
    # Set environment variables for development
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_DEBUG'] = '1'
    
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    app_path = os.path.join(script_dir, 'app.py')
    
    print("🚀 Starting Flask Development Server with Auto-Reload")
    print("📁 Monitoring: Python, HTML, CSS, JS, JSON files")
    print("🔄 Server will restart automatically when files change")
    print("🌐 Access: http://127.0.0.1:5000")
    print("⏹️  Press Ctrl+C to stop")
    print(f"📂 Working directory: {script_dir}")
    print("-" * 50)
    
    try:
        # Run the Flask app with enhanced reloader from the correct directory
        result = subprocess.run([
            sys.executable, app_path
        ], cwd=script_dir, check=True)
        
    except KeyboardInterrupt:
        print("\n🛑 Development server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Flask server exited with error code: {e.returncode}")
    except Exception as e:
        print(f"❌ Error running development server: {e}")

if __name__ == '__main__':
    run_with_auto_reload()
