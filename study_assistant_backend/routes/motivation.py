from flask import Blueprint, request, jsonify
import random

motivation_bp = Blueprint("motivation", __name__)

messages = [
    {"message": "Keep going, you're doing amazing!", "type": "encouragement"},
    {"message": "Finish one more task and reward yourself!", "type": "challenge"},
    {"message": "Remember your goals, stay focused!", "type": "reminder"},
    {"message": "You've come far. Celebrate progress!", "type": "celebration"},
]

@motivation_bp.route("/api/motivation", methods=["POST"])
def generate_motivation():
    data = request.get_json()
    user_input = data.get("mood", "")
    selected = random.choice(messages)
    return jsonify({
        "message": selected["message"],
        "type": selected["type"]
    })
