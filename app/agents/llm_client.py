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



import os
import requests
from dotenv import load_dotenv  # ✅ new import

# ✅ Load the .env file
load_dotenv()

import os
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Just to verify (optional - remove later)
print("✅ Loaded key:", os.getenv("OPENROUTER_API_KEY"))


class OpenRouterClient:
    def __init__(self):
        # ✅ Get the key from the .env file
        self.api_key = os.getenv("OPENROUTER_API_KEY")

        if not self.api_key:
            raise ValueError("❌ OPENROUTER_API_KEY not found. Make sure it's in .env")

        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "openai/gpt-3.5-turbo"

    def chat(self, text, persona="neutral"):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        system_prompt = (
            f"You are a {persona} conversational assistant. "
            f"Do not repeat the user's message back—just answer directly. "
            f"Keep it concise and friendly."
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text},
            ],
        }

        try:
            res = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
            res.raise_for_status()
            data = res.json()
            return data["choices"][0]["message"]["content"].strip()

        except requests.exceptions.HTTPError:
            return f"⚠️ API error: {res.status_code} - {res.text}"
        except requests.exceptions.Timeout:
            return "⏱️ The request timed out. Try again."
        except Exception as e:
            return f"❌ Unexpected error: {e}"
