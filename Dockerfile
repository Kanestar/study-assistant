# Step 1: Build the React frontend
FROM node:20 AS frontend-builder

WORKDIR /app

# Copy frontend files
COPY project ./project
WORKDIR /app/project

# Install and build React app
RUN npm install && npm run build

# Step 2: Set up the Python backend
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend files
COPY . .

# Copy built frontend from previous stage to /app/dist
COPY --from=frontend-builder /app/project/dist ./dist

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 5000

# Run with Gunicorn in production mode
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
