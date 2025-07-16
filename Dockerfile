# Stage 1: Build frontend
FROM node:18-alpine as frontend

WORKDIR /app

COPY project ./project

WORKDIR /app/project

RUN npm install && npm run build

# Stage 2: Backend with built frontend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential gcc curl && rm -rf /var/lib/apt/lists/*

# Copy backend code
COPY study_assistant_backend /app/study_assistant_backend

# Copy frontend build into backend
COPY --from=frontend /app/project/dist /app/study_assistant_backend/build

# Copy root requirements.txt (if it's in the root)
COPY requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Set working directory to backend
WORKDIR /app/study_assistant_backend

# Run app using Gunicorn (prod-safe) or fallback to Flask for dev
CMD ["python", "app.py"]
