from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.api import api_bp  # Import the grouped API blueprint
import os

app = Flask(__name__, static_folder='dist', static_url_path='/')
CORS(app)  # Enable CORS if frontend runs on a different port during dev

# Register your API blueprint
app.register_blueprint(api_bp, url_prefix='/api')

# Serve static files (your frontend build)
@app.route('/')
@app.route('/<path:path>')
def serve_frontend(path='index.html'):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
