# STAGE 1: Build the React Frontend
FROM node:22 AS build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN CI=false npm run build

# STAGE 2: Setup Python Flask App
FROM python:3.9-slim
WORKDIR /app

# Install Python dependencies (ensure gunicorn is in requirements.txt)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy Python backend code
COPY app.py .

# Copy the built React files from STAGE 1 into the Python container
COPY --from=build /app/frontend/dist /app/frontend/dist

# Expose the port (Render will automatically detect this)
EXPOSE 8080

# Start the Flask app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
