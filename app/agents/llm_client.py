# # import requests

# # class OpenRouterClient:
# #     def __init__(self):
# #         # ⚠️ Hardcoded for convenience; move to env var in production
# #         self.api_key = "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"
# #         self.base_url = "https://openrouter.ai/api/v1/chat/completions"
# #         # You can change model here if desired
# #         self.model = "openai/gpt-3.5-turbo"

# #     def chat(self, text, persona="neutral"):
# #         headers = {
# #             "Authorization": f"Bearer {self.api_key}",
# #             "Content-Type": "application/json"
# #         }
# #         system = f"You are a {persona} conversational assistant. Do not repeat the user's message back—just answer directly. Keep it concise and friendly."
# #         payload = {
# #             "model": self.model,
# #             "messages": [
# #                 {"role": "system", "content": system},
# #                 {"role": "user", "content": text}
# #             ]
# #         }
# #         try:
# #             res = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
# #             res.raise_for_status()
# #             data = res.json()
# #             return data["choices"][0]["message"]["content"].strip()
# #         except Exception as e:
# #             return f"Sorry, I couldn't respond right now ({e})."



# import os
# import requests

# class OpenRouterClient:
#     def __init__(self):
#         # ✅ Read API key from environment variable for security
#         self.api_key = "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"

#         if not self.api_key:
#             raise ValueError(
#                 "❌ OPENROUTER_API_KEY not found. Please set it as an environment variable."
#             )

#         self.base_url = "https://openrouter.ai/api/v1/chat/completions"
#         self.model = "openai/gpt-3.5-turbo"  # you can change to GPT-4 or others

#     def chat(self, text, persona="neutral"):
#         headers = {
#             "Authorization": f"Bearer {self.api_key}",
#             "Content-Type": "application/json",
#         }

#         system_prompt = (
#             f"You are a {persona} conversational assistant. "
#             f"Do not repeat the user's message back—just answer directly. "
#             f"Keep it concise and friendly."
#         )

#         payload = {
#             "model": self.model,
#             "messages": [
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": text},
#             ],
#         }

#         try:
#             res = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
#             res.raise_for_status()

#             data = res.json()
#             return data["choices"][0]["message"]["content"].strip()

#         except requests.exceptions.HTTPError as http_err:
#             # Detailed HTTP error handling
#             return f"⚠️ API error: {res.status_code} - {res.text}"
#         except requests.exceptions.Timeout:
#             return "⏱️ The request to OpenRouter timed out. Please try again."
#         except Exception as e:
#             return f"❌ An unexpected error occurred: {e}"


# import os
# import requests
# from dotenv import load_dotenv  # ✅ new import

# # ✅ Load the .env file
# load_dotenv()

# class OpenRouterClient:
#     def __init__(self):
#         # ✅ Get the key from the .env file
#         self.api_key = os.getenv("OPENROUTER_API_KEY")

#         if not self.api_key:
#             raise ValueError("❌ OPENROUTER_API_KEY not found. Make sure it's in .env")

#         self.base_url = "https://openrouter.ai/api/v1/chat/completions"
#         self.model = "openai/gpt-3.5-turbo"

#     def chat(self, text, persona="neutral"):
#         headers = {
#             "Authorization": f"Bearer {self.api_key}",
#             "Content-Type": "application/json",
#         }

#         system_prompt = (
#             f"You are a {persona} conversational assistant. "
#             f"Do not repeat the user's message back—just answer directly. "
#             f"Keep it concise and friendly."
#         )

#         payload = {
#             "model": self.model,
#             "messages": [
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": text},
#             ],
#         }

#         try:
#             res = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
#             res.raise_for_status()
#             data = res.json()
#             return data["choices"][0]["message"]["content"].strip()

#         except requests.exceptions.HTTPError:
#             return f"⚠️ API error: {res.status_code} - {res.text}"
#         except requests.exceptions.Timeout:
#             return "⏱️ The request timed out. Try again."
#         except Exception as e:
#             return f"❌ Unexpected error: {e}"

# import os
# import requests
# from dotenv import load_dotenv

# class OpenRouterClient:
#     def __init__(self):
#         # ✅ Load environment variables from .env
#         load_dotenv()

#         # ✅ Get the API key
#         self.api_key = os.getenv("OPENROUTER_API_KEY")
#         print("🔍 DEBUG API KEY:", self.api_key)  # 👈 Debug line (remove later in production)

#         # 🛑 Safety check
#         if not self.api_key:
#             raise ValueError(
#                 "❌ OPENROUTER_API_KEY not found. Make sure it's set in your .env file."
#             )

#         # ✅ Base URL and model
#         self.base_url = "https://openrouter.ai/api/v1/chat/completions"
#         self.model = "openai/gpt-3.5-turbo"  # change to "gpt-4" if needed

#     def chat(self, text, persona="neutral"):
#         headers = {
#             "Authorization": f"Bearer {self.api_key}",
#             "Content-Type": "application/json",
#         }

#         system_prompt = (
#             f"You are a {persona} conversational assistant. "
#             "Do not repeat the user's message back — just answer directly. "
#             "Keep it concise and friendly."
#         )

#         payload = {
#             "model": self.model,
#             "messages": [
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": text},
#             ],
#         }

#         try:
#             res = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
#             res.raise_for_status()

#             data = res.json()
#             return data["choices"][0]["message"]["content"].strip()

#         except requests.exceptions.HTTPError:
#             # If the key is invalid or revoked, this will show the server's error message
#             return f"⚠️ API error: {res.status_code} - {res.text}"

#         except requests.exceptions.Timeout:
#             return "⏱️ The request to OpenRouter timed out. Please try again."

#         except Exception as e:
#             return f"❌ Unexpected error: {e}"

import os, requests
from dotenv import load_dotenv

load_dotenv()  # local dev only; on Render it just no-ops

class OpenRouterClient:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY missing")

        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "openai/gpt-3.5-turbo"

    def chat(self, text, persona="neutral"):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system",
                 "content": f"You are a {persona} assistant. Be concise and friendly."},
                {"role": "user", "content": text},
            ],
        }
        res = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
        try:
            res.raise_for_status()
        except Exception:
            return f"⚠️ API error: {res.status_code} - {res.text}"
        data = res.json()
        return data["choices"][0]["message"]["content"].strip()
