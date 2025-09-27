# from .llm_client import OpenRouterClient

# class PersonaEngine:
#     def __init__(self):
#         self.llm = OpenRouterClient()

#     def reply(self, user_text: str, identity: str = "neutral", name: str = "Friend") -> str:
#         # Greeting with optional name
#         greeting = f"Hi {name}, " if name and name.lower() != "friend" else ""
#         # Persona mapping
#         persona_map = {
#             "male": "warm, friendly male voice, witty but respectful",
#             "female": "warm, friendly female voice, witty but respectful",
#             "neutral": "neutral, friendly, concise assistant",
#         }
#         persona = persona_map.get(identity, persona_map["neutral"])

#         # Special easter-egg: who made you?
#         lowered = user_text.strip().lower()
#         if any(k in lowered for k in ["who made you", "who created you", "your creator", "who built you"]):
#             return greeting + ("I was created by software engineer **Mr. Skand Raj Gaur**. "
#                                "Without him, I’d just be a normal voice artist—now I’ve got brains too 😉")

#         # Normal LLM answer
#         answer = self.llm.chat(user_text, persona=persona)

#         # Strip accidental echo like: “You said '...’” if model returns it
#         remove_prefixes = ["you said", "you asked", "as you said"]
#         cleaned = answer.strip()
#         for p in remove_prefixes:
#             if cleaned.lower().startswith(p):
#                 # remove first sentence
#                 parts = cleaned.split(". ", 1)
#                 cleaned = parts[1] if len(parts) > 1 else ""
#                 break
#         return greeting + cleaned


from .llm_client import OpenRouterClient

class PersonaEngine:
    def __init__(self):
        self.llm = OpenRouterClient()

    def reply(self, user_text: str, identity: str = "neutral", name: str = "Friend") -> str:
        """
        Generate a persona-aware reply based on user text, persona type, and optional name.
        """

        # 👋 Greeting with name if provided
        greeting = f"Hi {name}, " if name and name.lower() != "friend" else ""

        # 🧠 Persona tone mapping (now aligned with speech defaults)
        persona_map = {
            "male": (
                "Respond in a warm, witty yet respectful tone like a male assistant. "
                "Imagine the speaking style of 'Aaron' in American English — clear, confident, and natural."
            ),
            "female": (
                "Respond in a warm, empathetic, and friendly tone like a female assistant. "
                "Imagine the speaking style of 'Samantha' in British English — polite, natural, and helpful."
            ),
            "neutral": (
                "Respond in a neutral, concise, and professional tone. "
                "Focus on being clear, friendly, and helpful without leaning towards any gendered style."
            ),
        }

        persona = persona_map.get(identity, persona_map["neutral"])

        # 🐣 Easter Egg: Creator message
        lowered = user_text.strip().lower()
        if any(k in lowered for k in ["who made you", "who created you", "your creator", "who built you"]):
            return greeting + (
                "I was created by software engineer **Mr. Skand Raj Gaur**. "
                "Without him, I’d just be a regular assistant — now I’ve got a personality too 😉"
            )

        # 💬 Generate a response from the LLM with persona context
        answer = self.llm.chat(user_text, persona=persona)

        # 🧹 Clean up accidental model echoes like “You said...” etc.
        remove_prefixes = ["you said", "you asked", "as you said"]
        cleaned = answer.strip()
        for p in remove_prefixes:
            if cleaned.lower().startswith(p):
                parts = cleaned.split(". ", 1)
                cleaned = parts[1] if len(parts) > 1 else ""
                break

        return greeting + cleaned
