from flask import Blueprint, request, jsonify
from helpers.api_utils import add_to_whitelist_api, vote_api, get_vote_updates_api

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/whitelist', methods=['POST'])
def api_whitelist():
    return add_to_whitelist_api()

@api_bp.route('/api/vote/<meme_id>', methods=['POST'])
def api_vote(meme_id):
    return vote_api(meme_id)

@api_bp.route('/api/votes/updates', methods=['GET'])
def api_vote_updates():
    return get_vote_updates_api()
