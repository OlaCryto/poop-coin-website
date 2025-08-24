import requests
import threading
import datetime


# Encapsulate state in a service class for better maintainability and thread safety
class HoldersStateService:
    def __init__(self):
        self.previous_holders_state = {'holders': []}
        self.transaction_history = []  # List of {name, action, amount, avatar, timestamp}

    def get_previous_holders(self):
        return self.previous_holders_state.get('holders', [])

    def set_previous_holders(self, holders):
        self.previous_holders_state['holders'] = holders

    def add_transaction(self, change, avatar, now):
        entry = {
            'name': change['name'],
            'action': change['action'],
            'amount': change['amount'],
            'avatar': avatar,
            'timestamp': now
        }
        self.transaction_history.append(entry)
        if len(self.transaction_history) > 100:
            self.transaction_history[:] = self.transaction_history[-100:]

    def get_transaction_history(self, limit=50):
        return self.transaction_history[-limit:]

holders_state_service = HoldersStateService()

API_URL = "https://api.starsarena.com/shares/holders"
API_PARAMS = {
    "userId": "dca14b91-a7c0-463a-bfad-fb69978f3c3d",
    "page": 1,
    "pageSize": 20
}
from flask import current_app

def get_holders_data():
    try:
        api_token = current_app.config.get('STARSARENA_API_TOKEN', '')
        api_headers = {"Authorization": f"Bearer {api_token}"} if api_token else {}
        response = requests.get(API_URL, params=API_PARAMS, headers=api_headers)
        response.raise_for_status()
        holders_data = response.json().get('holders', [])
    except Exception:
        holders_data = []
    return holders_data

def detect_changes(prev, current):
    changes = []
    prev_map = {h['traderUser']['twitterHandle']: h['amount'] for h in prev}
    curr_map = {h['traderUser']['twitterHandle']: h['amount'] for h in current}
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
    for handle, amount in curr_map.items():
        if handle not in prev_map:
            changes.append({
                'name': next(h['traderUser']['twitterName'] for h in current if h['traderUser']['twitterHandle'] == handle),
                'action': 'buy',
                'amount': amount
            })
    for handle, amount in prev_map.items():
        if handle not in curr_map:
            changes.append({
                'name': next(h['traderUser']['twitterName'] for h in prev if h['traderUser']['twitterHandle'] == handle),
                'action': 'sell',
                'amount': amount
            })
    return changes

def update_transaction_history(changes, holders_data):
    now = datetime.datetime.utcnow().isoformat()
    for change in changes:
        avatar = None
        for h in holders_data:
            if h['traderUser']['twitterName'] == change['name']:
                avatar = h['traderUser']['twitterPicture']
                break
        holders_state_service.add_transaction(change, avatar, now)

def get_leaderboard():
    holders = holders_state_service.get_previous_holders()
    leaderboard = sorted([
        {
            'name': h['traderUser']['twitterName'],
            'handle': h['traderUser']['twitterHandle'],
            'avatar': h['traderUser']['twitterPicture'],
            'amount': h['amount']
        } for h in holders
    ], key=lambda x: x['amount'], reverse=True)
    return leaderboard[:10]

def get_transaction_history():
    return holders_state_service.get_transaction_history(50)

def update_holders_state():
    holders_data = get_holders_data()
    prev = holders_state_service.get_previous_holders()
    changes = detect_changes(prev, holders_data)
    update_transaction_history(changes, holders_data)
    holders_state_service.set_previous_holders(holders_data)
    return len(holders_data), changes
