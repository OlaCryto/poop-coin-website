from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from services.memes_service import handle_meme_upload

web_bp = Blueprint('web', __name__, url_prefix='')

@web_bp.route('/')
def home():
    return render_template('index.html')

@web_bp.route('/about')
def about():
    return render_template('about.html')

@web_bp.route('/tokenomics')
def tokenomics():
    return render_template('tokenomics.html')

@web_bp.route('/history')
def history():
    return render_template('history.html')

@web_bp.route('/how-to-buy')
def how_to_buy():
    return render_template('how_to_buy.html')

@web_bp.route('/launch')
def launch():
    return render_template('launch.html')

@web_bp.route('/community')
def community():
    return render_template('community.html')

@web_bp.route('/leaderboard')
def leaderboard():
    return render_template('leaderboard.html')

@web_bp.route('/alerts')
def alerts():
    return render_template('alerts.html')

@web_bp.route('/memes', methods=['GET', 'POST'])
def memes():
    return handle_meme_upload()

@web_bp.route('/whitelist')
def whitelist():
    return render_template('whitelist.html')
