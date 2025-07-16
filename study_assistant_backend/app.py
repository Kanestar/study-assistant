from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.api import api_bp
import os

app = Flask(__name__, static_folder='dist', static_url_path='/')
CORS(app)

# Register API routes
app.register_blueprint(api_bp, url_prefix='/api')

# Serve frontend (React build from /dist)
@app.route('/')
@app.route('/<path:path>')
def serve_frontend(path=''):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Do NOT include app.run(); Gunicorn will run the app
