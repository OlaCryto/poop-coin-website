#!/usr/bin/env python3

print("=== Testing minimal Flask app ===")

try:
    print("1. Importing Flask...")
    from flask import Flask
    
    print("2. Creating Flask app...")
    app = Flask(__name__)
    
    print("3. Setting basic config...")
    app.config['SECRET_KEY'] = 'test-key'
    
    print("4. Creating basic route...")
    @app.route('/')
    def hello():
        return "Hello World!"
    
    print("5. Testing app creation...")
    print(f"App name: {app.name}")
    print(f"App debug: {app.debug}")
    
    print("SUCCESS: Minimal Flask app works!")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()

print("=== Test complete ===")
