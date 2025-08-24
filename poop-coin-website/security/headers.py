from flask_talisman import Talisman

def setup_security(app):
    try:
        csp = {
            "default-src": ["'self'"],
            "img-src": ["'self'", 'data:', 'https:'],
            "script-src": ["'self'", 'https:', "'unsafe-inline'"],
            "style-src": ["'self'", 'https:', "'unsafe-inline'"],
            "font-src": ["'self'", 'https:', 'data:'],
            "media-src": ["'self'", 'data:', 'https:'],
            "connect-src": ["'self'", 'https:']
        }
        Talisman(app, content_security_policy=csp, force_https=False)
    except Exception:
        pass

def set_security_headers(response):
    response.headers.setdefault('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.setdefault('X-Content-Type-Options', 'nosniff')
    response.headers.setdefault('X-Frame-Options', 'DENY')
    response.headers.setdefault('Referrer-Policy', 'strict-origin-when-cross-origin')
    return response
