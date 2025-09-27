import requests

class OpenRouterClient:
    def __init__(self):
        # ⚠️ Hardcoded for convenience; move to env var in production
        self.api_key = "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"
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        # You can change model here if desired
        self.model = "openai/gpt-3.5-turbo"

    def chat(self, text, persona="neutral"):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        system = f"You are a {persona} conversational assistant. Do not repeat the user's message back—just answer directly. Keep it concise and friendly."
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": text}
            ]
        }
        try:
            res = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
            res.raise_for_status()
            data = res.json()
            return data["choices"][0]["message"]["content"].strip()
        except Exception as e:
            return f"Sorry, I couldn't respond right now ({e})."
