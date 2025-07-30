import json
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
import requests
import os
import json
import uuid
import threading
from werkzeug.utils import secure_filename
from pywebpush import webpush, WebPushException

# Initialize the Flask application
app = Flask(__name__)

# ...existing code before alert system...
# ...existing code...

## Removed live chart route and template reference

app.config['SECRET_KEY'] = os.urandom(24)
app.config['UPLOAD_FOLDER'] = 'static/memes'

# Helper function to fetch holders data
def get_holders_data():
    api_url = "https://api.starsarena.com/shares/holders"
    params = {
        "userId": "dca14b91-a7c0-463a-bfad-fb69978f3c3d",
        "page": 1,
        "pageSize": 20
    }
    headers = {
        "Authorization": "Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiZmYyODczZmItMzhiYi00ZjQxLThhYzgtOGI3MWIyNjIzYjAwIiwidHdpdHRlcklkIjoiMTM5NjQzMTAyNDg4NDc5NzQ0NCIsInR3aXR0ZXJIYW5kbGUiOiJOZXRXaGl6Q3J5cHRvIiwidHdpdHRlck5hbWUiOiJOZXRfV2hpel82MTYiLCJ0d2l0dGVyUGljdHVyZSI6Imh0dHBzOi8vc3RhdGljLnN0YXJzYXJlbmEuY29tL3VwbG9hZHMvMTNhYzU0N2MtODAzYi01MDcyLWRmMDUtMWZlNzdlZDU0NTc4MTc1MjAyOTIzNDMwMi5wbmciLCJhZGRyZXNzIjoiMHhiY2I1NzdhNTczNGVkYjc2NzAwMDZkYTI5MWZiM2NiNDQ0NzFhNWZiIn0sImlhdCI6MTc1MjE5MTAzNCwiZXhwIjoxNzYwODMxMDM0fQ.S8aVPEfdFl6hja-ja_f2kUyLpMk9aDkpRMgNmKz3n5XkFwACMkUC8gseady1dX1nIiUfu04G1AquzqzBTKeP1TMbsiUFjO2_MNdCCF2_ZAQ9iSTylqep82w582qe8OWcKCGFdJoPGS6ThC10d580oXFyQoklKufJLut8jGUudfgPN9RkDq75-qKW8aVI589ph3eaWyhguQx0wFaeG2kTOQo2VyJPtahmZChJtoE2ad5k_o6z0XIDLadEGq8xLOgqkO5fZYI8eucUZckj1S6MdTwpLnc5JodN2anDkxOKBQRhJOON_rvdPNxNOXlvSgpPgLGHSmHsXjFKH7XqwwRmZcurT5UFg6SX8q9cWMAR75FMMH-Rp0J7R9cSKJl6CYPzOymc0N7XlBf9xcWt2SSBghj7rXnwowdUqkS5bTQb_K8et1R17FomdGu3GgJY0Bcz47jzv1ZV_DU4YrjiPd7UF5rp0qfnY4sSxJkvFvKgEJlxoutRB0mE-mywMHdL1c5K1BZkNP_sDdOi_QuIRDUq3FRgny6FcRsqyfDEUE3uMVEtSW92QNfOwr2u_4V2u9v9l8NNNAtumRHvXvtF1-rBvRLu3E-3Bw2b_l0bi-xgq5sUDHvavRNHXTSaxlPki8Ps04P6K_oyUTGuuy69Av9gLhp9i1k1DbrhWX8mJzTrC4k"
    }
    try:
        response = requests.get(api_url, params=params, headers=headers)
        response.raise_for_status()
        holders_data = response.json().get('holders', [])
    except Exception as e:
        holders_data = []
    return holders_data

# --- Ticket Holders Route ---
@app.route('/holders')
def holders():
    holders_data = get_holders_data()
    return render_template('holders.html', holders=holders_data)

# --- API endpoint for holders (AJAX polling) ---
@app.route('/api/holders')
def api_holders():
    holders_data = get_holders_data()
    return jsonify({'holders': holders_data})

# --- Ticket Holders Route ---
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


@app.route('/')
def home():
    """Renders the home page."""
    return render_template('index.html')

# --- Alerts Page Route ---
@app.route('/alerts')
def alerts():
    return render_template('alerts.html')

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template('about.html')

@app.route('/tokenomics')
def tokenomics():
    """Renders the tokenomics page."""
    return render_template('tokenomics.html')

@app.route('/history')
def history():
    return render_template('history.html')

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


@app.route('/leaderboard')
def leaderboard():
    return render_template('leaderboard.html')


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




# --- API endpoint for homepage notification polling ---
# Store previous holders state in memory
import time
from flask import g


# --- Transaction History and Leaderboard ---
previous_holders_state = {}
transaction_history = []  # List of {name, action, amount, avatar, timestamp}

def update_transaction_history(changes):
    import datetime
    now = datetime.datetime.utcnow().isoformat()
    for change in changes:
        transaction_history.append({
            'name': change['name'],
            'action': change['action'],
            'amount': change['amount'],
            'avatar': change.get('avatar'),
            'timestamp': now
        })
    # Keep only last 100 events
    if len(transaction_history) > 100:
        transaction_history[:] = transaction_history[-100:]

def get_leaderboard():
    holders = previous_holders_state.get('holders', [])
    leaderboard = sorted([
        {
            'name': h['traderUser']['twitterName'],
            'handle': h['traderUser']['twitterHandle'],
            'avatar': h['traderUser']['twitterPicture'],
            'amount': h['amount']
        } for h in holders
    ], key=lambda x: x['amount'], reverse=True)
    return leaderboard[:10]


def detect_changes(prev, current):
    changes = []
    prev_map = {h['traderUser']['twitterHandle']: h['amount'] for h in prev}
    curr_map = {h['traderUser']['twitterHandle']: h['amount'] for h in current}
    # Detect buys and sells
    for handle, amount in curr_map.items():
        prev_amount = prev_map.get(handle, 0)
        if amount > prev_amount:
            changes.append({
                'name': next(h['traderUser']['twitterName'] for h in current if h['traderUser']['twitterHandle'] == handle),
                'action': 'buy',
                'amount': amount - prev_amount
            })
        elif amount < prev_amount:
            changes.append({
                'name': next(h['traderUser']['twitterName'] for h in current if h['traderUser']['twitterHandle'] == handle),
                'action': 'sell',
                'amount': prev_amount - amount
            })
    # Detect new buyers
    for handle, amount in curr_map.items():
        if handle not in prev_map:
            changes.append({
                'name': next(h['traderUser']['twitterName'] for h in current if h['traderUser']['twitterHandle'] == handle),
                'action': 'buy',
                'amount': amount
            })
    # Detect sellers who left (amount dropped to 0)
    for handle, amount in prev_map.items():
        if handle not in curr_map:
            changes.append({
                'name': next(h['traderUser']['twitterName'] for h in prev if h['traderUser']['twitterHandle'] == handle),
                'action': 'sell',
                'amount': amount
            })
    return changes


@app.route('/api/holders_count')
def api_holders_count():
    global previous_holders_state
    holders_data = get_holders_data()
    prev = previous_holders_state.get('holders', [])
    changes = detect_changes(prev, holders_data)
    # Add avatar to changes
    for change in changes:
        for h in holders_data:
            if h['traderUser']['twitterName'] == change['name']:
                change['avatar'] = h['traderUser']['twitterPicture']
                break
    update_transaction_history(changes)
    previous_holders_state['holders'] = holders_data
    return jsonify({'count': len(holders_data), 'changes': changes})

# --- API endpoint for transaction history ---
@app.route('/api/history')
def api_history():
    return jsonify({'history': transaction_history[-50:]})

# --- API endpoint for leaderboard ---
@app.route('/api/leaderboard')
def api_leaderboard():
    return jsonify({'leaderboard': get_leaderboard()})

# --- Main execution block ---
import threading
import time

# --- Bot Simulation: Periodically send test alerts to /api/alerts ---
def bot_simulator():
    import requests
    count = 1
    while True:
        alert = {
            "header": "🧠 PROFILE BASED LAUNCH",
            "name": f"TestToken{count}",
            "symbol": f"TT{count}",
            "contract": f"0x{count:03x}...abc",
            "creator": f"0x{count:03x}...def",
            "tokens_created": count,
            "bonding": 10 + count,
            "liquidity": 5 + count,
            "avax_used": 2.5 + count,
            "market_cap": f"${10000 + count*100}",
            "deployer_balance": 1.2 + count,
            "profile_linked": True,
            "twitter": f"testuser{count}",
            "followers_arena": 100 + count,
            "followers_twitter": 500 + count,
            "arena_volume": 20 + count,
            "ticket_price_avax": 0.01 + count/100,
            "arena_buys": 5 + count,
            "arena_sells": 2 + count,
            "badges": ["OG", "Whale"] if count % 2 == 0 else ["Newbie"],
            "tier": "green" if count % 3 == 0 else "red",
            "reasons": ["Reason 1", "Reason 2"] if count % 2 == 0 else [],
            "watchlisted": count % 5 == 0,
            "arena_link": "https://arena.trade/",
            "arenapro_link": "https://arenapro.io",
            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        }
        try:
            requests.post("http://127.0.0.1:5000/api/alerts", json=alert, timeout=3)
        except Exception as e:
            print("[BotSim] Failed to send alert:", e)
        count += 1
        time.sleep(10)  # Send every 10 seconds

if __name__ == '__main__':
    app.run(debug=True)
