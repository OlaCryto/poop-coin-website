# $OHSHIT Meme Coin Website

A modern, community-driven meme coin web app built with Flask, SQLAlchemy, and Jinja2. This project is designed for fun, engagement, and accessibility, with a focus on modularity, security, and easy deployment.

## Features

- **Meme Gallery**: Upload, view, and vote on memes. (Works with or without a database; in-memory fallback included.)
- **Whitelist**: Submit your wallet to join the whitelist (DB-backed or static page).
- **Live Holders & Leaderboard**: Fetches and displays live holders and top leaderboard from StarsArena API.
- **Alerts & Notifications**: Real-time alerts for new events (bot simulation included).
- **OAuth Login (X/Twitter)**: Optional Twitter login for enhanced features (disabled if not configured).
- **Configurable Branding**: All site branding, colors, and logos are centralized and can be overridden by environment variables or `site-config.json`.
- **Security**: Uses Flask-Talisman for security headers and CSP.
- **Accessibility**: ARIA, alt text, and keyboard navigation in meme gallery.
- **Modern UI**: Responsive, Tailwind CSS-powered design.
- **Easy Setup**: Requirements pinned, dev requirements included, and VAPID key generator for push notifications.

## Project Structure

```
poop-coin-website/
├── app.py                # Main Flask app, routes, and app setup
├── models.py             # SQLAlchemy models (Meme, Whitelist)
├── helpers/
│   └── api_utils.py      # Helper functions for API logic
├── config/
│   └── settings.py       # Site and Flask config (can be overridden by env vars)
├── routes/
│   └── api.py            # API endpoints (vote, whitelist, etc.)
├── static/
│   ├── memes/            # Uploaded meme images
│   ├── images/           # Branding and UI images
│   ├── css/              # Tailwind CSS
│   ├── js/               # Client JS (site-config, voting, etc.)
│   └── ...
├── templates/
│   ├── base.html         # Main layout
│   ├── memes.html        # Meme gallery page
│   └── ...               # Other Jinja2 templates
├── requirements.txt      # Production dependencies (pinned)
├── requirements-dev.txt  # Dev/test dependencies
├── site-config.json      # Branding and theme config (optional)
└── instance/
    └── site.db           # SQLite DB (if using DB mode)
```

## How the Pieces Relate

- **app.py**: The entry point. Sets up Flask, loads config, registers blueprints, and defines main routes. Handles both DB and in-memory modes for memes.
- **models.py**: Defines the Meme and Whitelist models for SQLAlchemy. Used if a database is configured.
- **helpers/api_utils.py**: Contains logic for API endpoints (e.g., voting, whitelist submission).
- **config/settings.py**: Central place for all config. Can be overridden by environment variables for secrets and deployment.
- **routes/api.py**: All API endpoints (vote, whitelist, holders, etc.) are registered here as a Flask blueprint.
- **static/**: All static assets (memes, images, CSS, JS, sounds, etc.). Uploaded memes go in `static/memes/`.
- **templates/**: Jinja2 HTML templates for all pages. `base.html` is the main layout; others extend it.
- **site-config.json**: Optional. Allows branding, colors, and fonts to be set without code changes.
- **instance/site.db**: SQLite database file (if using DB mode).

## Setup & Usage

1. **Clone the repo**
2. **Install dependencies**
   ```
   pip install -r requirements.txt
   ```
3. **(Optional) Set up environment variables**
   - `SECRET_KEY`, `SQLALCHEMY_DATABASE_URI`, OAuth keys, etc.
4. **Run the app**
   ```
   python app.py
   ```
5. **Visit** [http://127.0.0.1:5000](http://127.0.0.1:5000)

- If no database is configured, meme uploads and votes are stored in memory (not persistent).
- For production, set up a real database and configure all secrets via environment variables.

## Security & Best Practices
- All secrets/configs can be set via environment variables.
- Talisman sets strict security headers.
- File uploads are sanitized and only allow images.
- All user input is validated.

## Development
- Use `requirements-dev.txt` for linting and testing.
- Run `python generate_vapid_keys.py` to generate push notification keys if needed.
- All code is modular and easy to extend.

## Contributing
PRs and issues welcome! Please follow best practices and keep the code modular and secure.

---

**Enjoy the dump! 💩**
