# --- Helper functions for meme upload route ---
def process_upload_form():
    if 'file' not in request.files:
        flash('No file part in the request.', 'error')
        return redirect(request.url)
        
    file = request.files['file']
    if file.filename == '':
        flash('No file selected.', 'error')
        return redirect(request.url)
        
    description = request.form.get('description', '')
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex[:8]}_{filename}"
        # Save to the correct absolute path within the Flask app
        file_path = os.path.join(current_app.root_path, 'static', 'memes', unique_filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)  # Ensure directory exists
        file.save(file_path)
        meme_id = str(uuid.uuid4())
        save_meme(meme_id, unique_filename, description)
        flash('Meme uploaded successfully!', 'success')
        return redirect(url_for('web.memes'))
    else:
        flash('File type not allowed. Please use png, jpg, or gif.', 'error')
        return redirect(request.url)

def get_memes_page(page):
    try:
        memes_list = get_memes()
        pages = 1
        warning = None
    except Exception as e:
        memes_list = []
        pages = 1
        warning = f"Error loading memes: {e}"
    return memes_list, pages, warning
import os
import uuid
from flask import render_template, request, redirect, url_for, flash, current_app, session
from werkzeug.utils import secure_filename
from models import Meme, db

MEMES = []  # In-memory meme storage

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


# Service abstraction for meme storage
def use_db():
    return bool(current_app.config.get('SQLALCHEMY_DATABASE_URI'))

def get_memes():
    if use_db():
        memes_data = Meme.query.all()
        return [
            {'id': m.id, 'filename': m.filename, 'votes': m.votes, 'description': getattr(m, 'description', '')}
            for m in memes_data
        ]
    else:
        return MEMES.copy()

def save_meme(meme_id, unique_filename, description):
    if use_db():
        new_meme = Meme(id=meme_id, filename=unique_filename, votes=0, description=description)
        db.session.add(new_meme)
        db.session.commit()
    else:
        meme_obj = {'id': meme_id, 'filename': unique_filename, 'votes': 0, 'description': description}
        MEMES.append(meme_obj)

def handle_meme_upload():
    warning = None
    if not use_db():
        warning = 'Warning: Meme gallery is running in memory only. Memes will be lost after server restart.'
    if request.method == 'POST':
        return process_upload_form()
    page = request.args.get('page', 1, type=int)
    memes_list, pages, error_warning = get_memes_page(page)
    if error_warning:
        warning = error_warning
    return render_template('memes.html', memes=memes_list, warning=warning, pages=pages, page=page)
