from flask import Blueprint, jsonify, request

plan_bp = Blueprint('plan', __name__)

# Example route to get a study plan
@plan_bp.route('/get', methods=['GET'])
def get_study_plan():
    return jsonify({
        "plan": [
            {"subject": "Math", "duration": 60},
            {"subject": "Science", "duration": 45}
        ]
    })

# Example route to post a new plan
@plan_bp.route('/create', methods=['POST'])
def create_study_plan():
    data = request.json
    # Normally you'd process or save the plan here
    return jsonify({"message": "Study plan received", "data": data}), 201
