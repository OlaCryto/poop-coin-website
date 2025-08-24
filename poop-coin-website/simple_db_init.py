import os
import sqlite3

# Create database file path
db_path = os.path.join('instance', 'site.db')

# Make sure instance directory exists
os.makedirs('instance', exist_ok=True)

# Create database connection
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create tables
print("Creating database tables...")

# Create whitelist table
cursor.execute('''
CREATE TABLE IF NOT EXISTS whitelist (
    id INTEGER PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL
)
''')

# Create meme table
cursor.execute('''
CREATE TABLE IF NOT EXISTS meme (
    id VARCHAR(36) PRIMARY KEY,
    filename VARCHAR(256) NOT NULL,
    votes INTEGER DEFAULT 0,
    description VARCHAR(256)
)
''')

# Commit changes
conn.commit()

# Verify tables were created
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("✅ Database created successfully!")
print("📝 Tables created:")
for table in tables:
    print(f"   - {table[0]}")

# Close connection
conn.close()

print("🚀 Database is ready for use!")
