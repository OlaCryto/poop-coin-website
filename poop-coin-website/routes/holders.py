from flask import Blueprint, render_template, jsonify
from services.holders_service import get_holders_data, get_leaderboard, get_transaction_history

holders_bp = Blueprint('holders', __name__)

@holders_bp.route('/holders')
def holders():
    holders_data = get_holders_data()
    return render_template('holders.html', holders=holders_data)

@holders_bp.route('/api/holders')
def api_holders():
    holders_data = get_holders_data()
    return jsonify({'holders': holders_data})

@holders_bp.route('/api/leaderboard')
def api_leaderboard():
    return jsonify({'leaderboard': get_leaderboard()})

@holders_bp.route('/api/history')
def api_history():
    return jsonify({'history': get_transaction_history()})
