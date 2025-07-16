# Stage 1: Build frontend
FROM node:18-alpine as frontend

WORKDIR /app

COPY project ./project

WORKDIR /app/project

RUN npm install && npm run build

# Stage 2: Setup backend + serve frontend
FROM python:3.11-slim as backend

WORKDIR /app

# Install OS dependencies for pip + Python
RUN apt-get update && apt-get install -y build-essential gcc curl && rm -rf /var/lib/apt/lists/*

# Copy backend and frontend build
COPY study_assistant_backend /app/study_assistant_backend
COPY --from=frontend /app/project/dist /app/study_assistant_backend/build

# Copy requirements to root
COPY requirements.txt /app/

# Install backend dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Expose Flask port
EXPOSE 5000

# Set working directory
WORKDIR /app/study_assistant_backend

# Use Gunicorn to serve app.py
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
