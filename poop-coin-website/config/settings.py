
import os

class BaseConfig:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'static/memes'
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    STARSARENA_API_TOKEN = os.environ.get('STARSARENA_API_TOKEN', '')

class DevConfig(BaseConfig):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URI', 'sqlite:///site.db')
    ENV = 'development'
    SESSION_COOKIE_SECURE = False

class ProdConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI', 'sqlite:///site.db')
    ENV = 'production'
    SESSION_COOKIE_SECURE = True

class Config(ProdConfig):
    pass

class OAuthConfig:
    X_CLIENT_ID = os.environ.get('X_CLIENT_ID', '')
    X_CLIENT_SECRET = os.environ.get('X_CLIENT_SECRET', '')
    X_AUTHORIZE_URL = os.environ.get('X_AUTHORIZE_URL', 'https://twitter.com/i/oauth2/authorize')
    X_TOKEN_URL = os.environ.get('X_TOKEN_URL', 'https://api.twitter.com/oauth2/token')
    X_API_BASE_URL = os.environ.get('X_API_BASE_URL', 'https://api.twitter.com/2/')
    X_REDIRECT_URI = os.environ.get('X_REDIRECT_URI', 'https://www.poop-coin.xyz/callback')
    TWITTER_BEARER_TOKEN = os.environ.get('TWITTER_BEARER_TOKEN', '')
    TWITTER_ACCESS_TOKEN = os.environ.get('TWITTER_ACCESS_TOKEN', '')
    TWITTER_ACCESS_TOKEN_SECRET = os.environ.get('TWITTER_ACCESS_TOKEN_SECRET', '')
    TWITTER_API_KEY = os.environ.get('TWITTER_API_KEY', '')
    TWITTER_API_KEY_SECRET = os.environ.get('TWITTER_API_KEY_SECRET', '')
