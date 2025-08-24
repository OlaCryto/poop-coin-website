from flask_sqlalchemy import SQLAlchemy
from flask import Flask

db = SQLAlchemy()

class Whitelist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(42), unique=True, nullable=False)


class Meme(db.Model):
    id = db.Column(db.String(36), primary_key=True)  # UUID string
    filename = db.Column(db.String(256), nullable=False)
    votes = db.Column(db.Integer, default=0)
    description = db.Column(db.String(256), nullable=True)
