from flask import Blueprint
from routes.motivation import motivation_bp
from routes.study_plan import plan_bp

# Create a parent blueprint to group all API routes
api_bp = Blueprint('api', __name__)

# Register each route blueprint under the parent API blueprint
api_bp.register_blueprint(motivation_bp, url_prefix='/motivation')
api_bp.register_blueprint(plan_bp, url_prefix='/plan')
