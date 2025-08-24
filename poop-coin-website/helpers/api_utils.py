import logging
from flask import jsonify, request, session
from models import Whitelist, Meme, db
from datetime import datetime

def validate_address(address):
    if not address or not isinstance(address, str) or not address.startswith('0x') or len(address) != 42:
        return False
    return True

def add_to_whitelist_api():
    data = request.get_json()
    if not data or 'address' not in data:
        return jsonify({'error': 'Invalid request. Address is missing.'}), 400
    address = data.get('address')
    if not validate_address(address):
        return jsonify({'error': 'Invalid address format provided.'}), 400
    existing = Whitelist.query.filter(db.func.lower(Whitelist.address) == address.lower()).first()
    if existing:
        return jsonify({'message': 'This address is already on the whitelist.'}), 200
    new_entry = Whitelist(address=address)
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({'message': 'Success! Your address has been added to the whitelist.'}), 201

def vote_api(meme_id):
    if 'voted_memes' not in session:
        session['voted_memes'] = []
    if meme_id in session['voted_memes']:
        return jsonify({'error': 'You have already voted for this meme.'}), 403
    meme = Meme.query.get(meme_id)
    if not meme:
        return jsonify({'error': 'Meme not found.'}), 404
    meme.votes = (meme.votes or 0) + 1
    db.session.commit()
    session['voted_memes'].append(meme_id)
    session.modified = True
    return jsonify({'votes': meme.votes})

def get_vote_updates_api():
    """
    Get vote updates for real-time polling.
    Returns all memes with their current vote counts.
    """
    try:
        # Get all memes with their current vote counts
        memes = Meme.query.all()
        updates = []
        
        for meme in memes:
            updates.append({
                'memeId': str(meme.id),
                'votes': meme.votes or 0
            })
        
        return jsonify(updates)
    
    except Exception as e:
        logging.error(f"Error getting vote updates: {e}")
        return jsonify({'error': 'Failed to get vote updates'}), 500
