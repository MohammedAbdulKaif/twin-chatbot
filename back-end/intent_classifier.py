from intents import INTENTS

def detect_intent(user_input):
    text = user_input.lower()
    for intent, data in INTENTS.items():
        for keyword in data["keywords"]:
            if keyword in text:
                return intent, data
    return None, None
