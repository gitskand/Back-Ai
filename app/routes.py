from flask import Blueprint, request, jsonify, render_template
from .ml.sentiment import SentimentService
from .agents.personas import PersonaEngine

api_bp = Blueprint("api", __name__)
ui_bp = Blueprint("ui", __name__)

sentiment_svc = SentimentService()
persona_engine = PersonaEngine()

@api_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True, silent=True) or {}
    user_text = (data.get("message") or "").strip()
    identity = (data.get("identity") or "neutral").strip().lower()
    name = (data.get("name") or "Friend").strip()
    locale = (data.get("locale") or "en-IN").strip()

    if not user_text:
        return jsonify({"ok": False, "error": "Empty message"}), 400

    senti = sentiment_svc.predict(user_text)
    reply = persona_engine.reply(user_text, identity, name)
    emotion = "neutral"

    return jsonify({
        "ok": True,
        "reply": reply,
        "emotion": emotion,
        "sentiment": senti,
    })

@ui_bp.route("/")
def index():
    return render_template("index.html")
