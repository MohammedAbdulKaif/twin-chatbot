from flask import Flask, request, jsonify
from flask_cors import CORS
from chat import get_bot_response
import uuid

app = Flask(__name__)
CORS(app)   # Enable CORS for frontend access

# -------------------------------
# HEALTH / HOME ROUTE
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    return "Twin Health Chatbot API is running."

# -------------------------------
# CHAT ENDPOINT
# -------------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)

    message = data.get("message", "")
    session_id = data.get("session_id") or str(uuid.uuid4())

    reply, confidence = get_bot_response(session_id, message)

    return jsonify({
        "reply": reply,
        "confidence": confidence,
        "session_id": session_id
    })

# -------------------------------
# APP START
# -------------------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
