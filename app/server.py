from flask import Flask
from .routes import api_bp, ui_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(ui_bp)
    return app
