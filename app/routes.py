from flask import Blueprint, request, jsonify, render_template
from .ml.sentiment import SentimentService
from .agents.personas import PersonaEngine
from flask import request, jsonify   # add if not already present
import random                        # add if not already present


api_bp = Blueprint("api", __name__)
ui_bp = Blueprint("ui", __name__)

sentiment_svc = SentimentService()
persona_engine = PersonaEngine()

# --- Auto-reply: creator/father question interceptor ------------------------
_CREATOR_TRIGGERS = [
    "who created you", "who made you", "who developed you", "who built you",
    "who coded you", "who programmed you","who developed you",
    "your creator", "your father", "your dad", "who is your father", "who is your dad"
    
]

_FUNNY_QUOTES = [
    "Powered by coffee, compiled by chaos ☕️",
    " with 99% code, 1% vibes.",
    "If I misbehave, blame my dad 😜",
    "Born in code, raised on stack traces.",
    "Running on electrons and dad jokes ⚡️",
]

@api_bp.before_request
def _creator_autoreply():
    """
    Intercepts POST /api/chat with 'who created you' style questions
    and returns a fixed, funny answer — without touching your existing handler.
    """
    # Only for POSTs to /api/chat
    if request.method != "POST":
        return None
    if request.path.rstrip("/") != "/api/chat":
        return None

    data = request.get_json(silent=True) or {}
    text = (data.get("message") or "").strip().lower()
    if not text:
        return None

    if any(trigger in text for trigger in _CREATOR_TRIGGERS):
        line = "I was made, created, and developed by Mr. Skand Raj Gaur."
        quip = random.choice(_FUNNY_QUOTES)
        # Match your API shape: { ok: true, reply: "..." }
        return jsonify(ok=True, reply=f"{line} {quip}")

    # Let your original /api/chat handler run
    return None


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
