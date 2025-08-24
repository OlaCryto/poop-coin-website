#!/usr/bin/env python3
"""
Initialize Database - Create all tables
"""
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import db

def init_database():
    """Initialize the database with all required tables"""
    with app.app_context():
        print("🗃️  Initializing database...")
        
        # Create all tables
        db.create_all()
        
        print("✅ Database tables created successfully!")
        print("📝 Tables available:")
        
        # List all tables
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        for table in tables:
            print(f"   - {table}")
            
        if not tables:
            print("   (No tables found - this might indicate an issue)")
            
        print("🚀 Database ready for use!")

if __name__ == '__main__':
    init_database()
