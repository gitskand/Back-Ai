# from app.server import create_app

# app = create_app()

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=8000, debug=True)


# from app.server import create_app

# app = create_app()

# if __name__ == "__main__":
#     # ✅ Render will inject its own PORT via env var
#     import os
#     port = int(os.environ.get("PORT", 8000))
#     app.run(host="0.0.0.0", port=port, debug=False)


# run.py (at repo root)
import os
try:
    # if create_app is in app/server.py
    from app.server import create_app
except ImportError:
    # if create_app is in app/__init__.py
    from app import create_app

app = create_app()

@app.get("/health")
def health():
    return "ok", 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)
