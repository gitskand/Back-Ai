from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

class SentimentService:
    def __init__(self):
        self.vectorizer = CountVectorizer()
        self.model = LogisticRegression(max_iter=500)
        data = [
            ("I love this!", "pos"),
            ("This is awful", "neg"),
            ("It's okay, not great", "neu"),
            ("Absolutely fantastic!", "pos"),
            ("I hate this, it's terrible", "neg"),
            ("Meh, it's fine", "neu"),
        ]
        X = self.vectorizer.fit_transform([t for t,_ in data])
        y = [l for _,l in data]
        self.model.fit(X, y)

    def predict(self, text: str) -> str:
        X = self.vectorizer.transform([text])
        return self.model.predict(X)[0]
