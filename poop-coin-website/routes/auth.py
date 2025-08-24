from flask import Blueprint, redirect, url_for, session, flash, current_app
from authlib.integrations.flask_client import OAuth

auth_bp = Blueprint('auth', __name__)
oauth = OAuth()

def init_oauth(app):
    oauth.init_app(app)
    required_x_keys = [
        'X_CLIENT_ID', 'X_CLIENT_SECRET', 'X_TOKEN_URL', 'X_AUTHORIZE_URL', 'X_API_BASE_URL', 'X_REDIRECT_URI'
    ]
    if all(app.config.get(k) for k in required_x_keys):
        oauth.register(
            name='x',
            client_id=app.config['X_CLIENT_ID'],
            client_secret=app.config['X_CLIENT_SECRET'],
            access_token_url=app.config['X_TOKEN_URL'],
            authorize_url=app.config['X_AUTHORIZE_URL'],
            api_base_url=app.config['X_API_BASE_URL'],
            client_kwargs={
                'scope': 'tweet.read users.read offline.access',
                'token_endpoint_auth_method': 'client_secret_post',
            }
        )

@auth_bp.route('/login')
def login():
    redirect_uri = current_app.config['X_REDIRECT_URI']
    return oauth.x.authorize_redirect(redirect_uri)

@auth_bp.route('/callback')
def callback():
    token = oauth.x.authorize_access_token()
    resp = oauth.x.get('users/me', token=token)
    profile = resp.json().get('data', {})
    session['user'] = {
        'name': profile.get('name'),
        'username': profile.get('username'),
        'id': profile.get('id'),
        'profile_image_url': profile.get('profile_image_url', ''),
    }
    flash('Logged in successfully!', 'success')
    return redirect(url_for('web.home'))

@auth_bp.route('/logout')
def logout():
    session.pop('user', None)
    flash('Logged out.', 'info')
    return redirect(url_for('web.home'))
