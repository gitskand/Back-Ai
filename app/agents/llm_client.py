# import requests

# class OpenRouterClient:
#     def __init__(self):
#         # ⚠️ Hardcoded for convenience; move to env var in production
#         self.api_key = "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"
#         self.base_url = "https://openrouter.ai/api/v1/chat/completions"
#         # You can change model here if desired
#         self.model = "openai/gpt-3.5-turbo"

#     def chat(self, text, persona="neutral"):
#         headers = {
#             "Authorization": f"Bearer {self.api_key}",
#             "Content-Type": "application/json"
#         }
#         system = f"You are a {persona} conversational assistant. Do not repeat the user's message back—just answer directly. Keep it concise and friendly."
#         payload = {
#             "model": self.model,
#             "messages": [
#                 {"role": "system", "content": system},
#                 {"role": "user", "content": text}
#             ]
#         }
#         try:
#             res = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
#             res.raise_for_status()
#             data = res.json()
#             return data["choices"][0]["message"]["content"].strip()
#         except Exception as e:
#             return f"Sorry, I couldn't respond right now ({e})."


import requests

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

class OpenRouterClient:
    def __init__(self, api_key=None, model="openrouter/auto", timeout=60):
        # 🔒 You asked to hardcode the key here (no env)
        self.api_key = (api_key or "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").strip()
        self.base_url = OPENROUTER_URL
        # Use a current model (3.5-turbo is retired). You can set a specific one later.
        self.model = model
        self.timeout = timeout

        if not self.api_key:
            raise RuntimeError("OpenRouter API key missing in llm_client.py")

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            # Recommended (not required) by OpenRouter:
            "HTTP-Referer": "https://friendlytalk-ai.netlify.app",
            "X-Title": "FriendlyTalk AI",
        }

    def chat(self, text, persona="neutral"):
        system = (
            f"You are a {persona} conversational assistant. "
            "Answer directly without repeating the user's message. Be concise and friendly."
        )
        payload = {
            "model": self.model,  # e.g. "openrouter/auto" or "openai/gpt-4o-mini" or "anthropic/claude-3.5-sonnet"
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": text},
            ],
        }

        try:
            r = requests.post(self.base_url, headers=self.headers, json=payload, timeout=self.timeout)
            if r.status_code == 401:
                # Common reasons: wrong/expired key, leading/trailing spaces in key, or key revoked
                return "Sorry, I couldn't respond right now (401 Unauthorized from OpenRouter — check API key)."
            r.raise_for_status()
            data = r.json()
            return data["choices"][0]["message"]["content"].strip()
        except requests.HTTPError:
            snippet = r.text[:400] if 'r' in locals() else ''
            return f"Sorry, I couldn't respond right now ({r.status_code} from OpenRouter: {snippet})."
        except Exception as e:
            return f"Sorry, I couldn't respond right now ({e})."
