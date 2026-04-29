#!/bin/bash

# Ensure PROJECT_ID is set
if [ -z "$PROJECT_ID" ]; then
    echo "Error: PROJECT_ID environment variable is not set."
    echo "Usage: PROJECT_ID=your-gcp-project-id ./deploy.sh"
    exit 1
fi

# Set region
REGION=${REGION:-"us-central1"}
SERVICE_NAME="ai-portfolio-backend"
IMAGE_URL="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "Building Docker image..."
gcloud builds submit --tag $IMAGE_URL

echo "Deploying to Google Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_URL \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --set-env-vars="ENVIRONMENT=production"

echo "Deployment completed successfully!"
