#!/usr/bin/env python3

print("Starting test...")

try:
    print("Testing Flask import...")
    from flask import Flask
    print("Flask imported successfully")
    
    print("Testing app module import...")
    import app
    print("App module imported successfully")
    
    print("Testing app object...")
    print(f"App: {app.app}")
    print(f"App name: {app.app.name}")
    
    print("All tests passed!")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
