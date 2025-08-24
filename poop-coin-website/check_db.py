import sqlite3
import os

conn = sqlite3.connect('instance/site.db')
cursor = conn.cursor()

# Check for meme tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%meme%'")
tables = cursor.fetchall()
print('Meme-related tables:', tables)

if tables:
    # Check meme table structure
    cursor.execute("PRAGMA table_info(meme)")
    columns = cursor.fetchall()
    print('Meme table structure:', columns)
    
    # Check sample records
    cursor.execute("SELECT * FROM meme LIMIT 5")
    rows = cursor.fetchall()
    print('Sample meme records:', rows)
    
    # Check if any filenames look like base64 or have data: prefix
    cursor.execute("SELECT filename FROM meme WHERE filename LIKE 'data:%' OR length(filename) > 100 LIMIT 5")
    base64_records = cursor.fetchall()
    print('Base64-like records:', base64_records)

# Also check what files are actually in the static/memes directory
memes_dir = 'static/memes'
if os.path.exists(memes_dir):
    files = os.listdir(memes_dir)
    print(f'Files in {memes_dir}:', files[:10])  # First 10 files
else:
    print(f'{memes_dir} directory does not exist')

conn.close()
