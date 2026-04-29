# Use official Python 3.12 slim image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements if available, else standard fallback
COPY requirements.txt* ./
RUN if [ -f "requirements.txt" ]; then pip install --no-cache-dir -r requirements.txt; \
    else pip install --no-cache-dir fastapi uvicorn pydantic[email] psycopg2-binary anthropic; fi

# Copy the rest of the backend code
COPY . .

# Expose port (Google Cloud Run typical default)
EXPOSE 8080

# Command to run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
