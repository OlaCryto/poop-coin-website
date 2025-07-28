from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
import os
import json
import uuid
import threading
from werkzeug.utils import secure_filename

# Initialize the Flask application
app = Flask(__name__)

# --- Configuration ---
# A secret key is needed for flashing messages and other session-related security
app.config['SECRET_KEY'] = os.urandom(24)
# Folder where uploaded meme images will be stored
app.config['UPLOAD_FOLDER'] = 'static/memes'
# Allowed file extensions for uploads
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
# Create the upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
# Create an images folder for static assets if it doesn't exist
os.makedirs('static/images', exist_ok=True)


# --- Constants and Globals ---
# Define constants for the data file paths
WHITELIST_FILE = 'whitelist.json'
MEMES_FILE = 'memes.json'
# A lock to prevent race conditions when multiple requests try to write to files simultaneously
file_lock = threading.Lock()
# URLs for external logos
AVAX_LOGO = 'https://cryptologos.cc/logos/avalanche-avax-logo.png'
ARENA_LOGO = 'https://pbs.twimg.com/profile_images/1746564897225035776/uD6ltQpR.png'


# --- Helper Functions ---
def allowed_file(filename):
    """Checks if the uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def read_json_file(filepath):
    """Safely reads data from a JSON file, handling cases where the file doesn't exist or is empty."""
    with file_lock:
        if not os.path.exists(filepath) or os.path.getsize(filepath) == 0:
            return []
        with open(filepath, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                # Return an empty list if the file contains invalid JSON
                return []

def write_json_file(filepath, data):
    """Safely writes data to a JSON file using a lock."""
    with file_lock:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)

# --- Context Processors ---
# This makes variables available to all templates without passing them in each render_template call
@app.context_processor
def inject_global_vars():
    """Injects global variables into the template context."""
    return dict(AVAX_LOGO=AVAX_LOGO, ARENA_LOGO=ARENA_LOGO)

# --- Standard Page Routes ---
@app.route('/')
def home():
    """Renders the home page."""
    return render_template('index.html')

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template('about.html')

@app.route('/tokenomics')
def tokenomics():
    """Renders the tokenomics page."""
    return render_template('tokenomics.html')

@app.route('/how-to-buy')
def how_to_buy():
    """Renders the 'How to Buy' page."""
    return render_template('how_to_buy.html')

@app.route('/launch')
def launch():
    """Renders the launch page."""
    return render_template('launch.html')

@app.route('/community')
def community():
    """Renders the community page."""
    return render_template('community.html')


# --- Functional Routes (Meme Gallery & Whitelist) ---
@app.route('/memes', methods=['GET', 'POST'])
def memes():
    """Handles the meme gallery page, including meme uploads."""
    if request.method == 'POST':
        # Check if a file was included in the POST request
        if 'file' not in request.files:
            flash('No file part in the request.', 'error')
            return redirect(request.url)
        file = request.files['file']
        # Check if a file was actually selected by the user
        if file.filename == '':
            flash('No file selected.', 'error')
            return redirect(request.url)
        # If the file is valid and has an allowed extension
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Create a unique filename to prevent overwriting existing files
            unique_filename = f"{uuid.uuid4().hex[:8]}_{filename}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
            
            # Add the new meme's info to the JSON file
            memes_data = read_json_file(MEMES_FILE)
            new_meme = {'id': str(uuid.uuid4()), 'filename': unique_filename, 'votes': 0}
            memes_data.append(new_meme)
            write_json_file(MEMES_FILE, memes_data)
            
            flash('Meme uploaded successfully!', 'success')
            return redirect(url_for('memes'))
        else:
            flash('File type not allowed. Please use png, jpg, or gif.', 'error')
            return redirect(request.url)

    # For GET requests, read the meme data and render the page
    memes_data = read_json_file(MEMES_FILE)
    return render_template('memes.html', memes=memes_data)

@app.route('/whitelist')
def whitelist():
    """Renders the whitelist submission page."""
    return render_template('whitelist.html')


# --- API Endpoints (for JavaScript interaction) ---
@app.route('/api/whitelist', methods=['POST'])
def add_to_whitelist():
    """API endpoint to add a wallet address to the whitelist."""
    data = request.get_json()
    if not data or 'address' not in data:
        return jsonify({'error': 'Invalid request. Address is missing.'}), 400
        
    address = data.get('address')
    # Basic validation for an Ethereum-style address
    if not address or not isinstance(address, str) or not address.startswith('0x') or len(address) != 42:
        return jsonify({'error': 'Invalid address format provided.'}), 400

    whitelist_data = read_json_file(WHITELIST_FILE)
    # Check for duplicates (case-insensitive)
    if address.lower() in [addr.lower() for addr in whitelist_data]:
        return jsonify({'message': 'This address is already on the whitelist.'}), 200
    
    whitelist_data.append(address)
    write_json_file(WHITELIST_FILE, whitelist_data)
    
    return jsonify({'message': 'Success! Your address has been added to the whitelist.'}), 201

@app.route('/api/vote/<meme_id>', methods=['POST'])
def vote(meme_id):
    """API endpoint to increment the vote count for a specific meme."""
    memes_data = read_json_file(MEMES_FILE)
    meme_found = False
    updated_meme = None
    for meme in memes_data:
        if meme.get('id') == meme_id:
            meme['votes'] = meme.get('votes', 0) + 1
            meme_found = True
            updated_meme = meme
            break
    
    if not meme_found:
        return jsonify({'error': 'Meme not found.'}), 404

    write_json_file(MEMES_FILE, memes_data)
    
    return jsonify({'votes': updated_meme['votes']})


# --- Main execution block ---
if __name__ == '__main__':
    # Debug mode is turned off for production
    app.run(debug=False)
