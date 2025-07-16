# Use Node.js for building frontend
FROM node:18 as frontend

WORKDIR /app

# Copy only frontend files and install dependencies
COPY project ./project
WORKDIR /app/project
RUN npm install && npm run build

# Use Python for backend
FROM python:3.10-slim as backend

# Set working directory
WORKDIR /app

# Copy backend files
COPY study_assistant_backend ./study_assistant_backend

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r study_assistant_backend/requirements.txt

# Copy built frontend from previous stage
COPY --from=frontend /app/project/dist ./study_assistant_backend/build

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=study_assistant_backend/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8000

# Expose port
EXPOSE 8000

# Run Flask
CMD ["flask", "run"]
