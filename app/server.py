# from flask import Flask
# from .routes import api_bp, ui_bp

# def create_app():
#     app = Flask(__name__)
#     app.register_blueprint(api_bp, url_prefix="/api")
#     app.register_blueprint(ui_bp)
#     return app


from flask import Flask
from .routes import api_bp, ui_bp

def create_app():
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(ui_bp)

    # Health check (optional but useful for Render)
    @app.route("/health")
    def health():
        return {"status": "ok"}, 200

    # Handle 404 errors gracefully
    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Route not found"}, 404

    return app
