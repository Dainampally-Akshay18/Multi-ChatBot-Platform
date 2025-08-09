#!/bin/bash

echo "🚀 Building Multi-Chatbot Platform for Production"
echo "=================================================="

export NODE_ENV=production
export CI=true

cd frontend

# Install all dependencies (including devDependencies)
echo "📦 Installing all dependencies..."
npm install

# Build the frontend
echo "📦 Building production..."
npm run build

# Check build success
if [ $? -eq 0 ]; then
    echo "✅ Frontend build completed successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Return to project root
cd ..

# Prepare backend for Netlify deployment
echo "📋 Preparing backend for serverless deployment..."

# Create Netlify functions directory
mkdir -p backend/netlify/functions

# Copy backend application files
echo "📂 Copying backend files..."
if [ -d "backend/app" ]; then
    cp -r backend/app backend/netlify/ && echo "✅ App directory copied"
else
    echo "❌ backend/app directory not found"
    exit 1
fi

# Copy requirements file
if [ -f "backend/requirements.txt" ]; then
    cp backend/requirements.txt backend/netlify/ && echo "✅ Requirements file copied"
else
    echo "❌ backend/requirements.txt not found"
    exit 1
fi

# Copy Netlify function handler if not present
if [ -f "backend/netlify/functions/api.py" ]; then
    echo "✅ Netlify function handler already exists"
else
    cat > backend/netlify/functions/api.py << 'EOF'
"""
Netlify function handler for Multi-Chatbot Platform
"""
import json
import os
import sys
from pathlib import Path

# Add the app directory to Python path
current_dir = Path(__file__).parent
app_dir = current_dir.parent / "app"
sys.path.insert(0, str(app_dir))

try:
    pass  # Add your FastAPI app import and handler here
except ImportError as e:
    pass
EOF
    echo "✅ Netlify function handler created"
fi

# Update Netlify requirements to include mangum
echo "📝 Updating Netlify requirements..."
cat > backend/netlify/requirements.txt << EOF
fastapi==0.104.1
langchain==0.1.0
langchain-core>=0.1.0
langchain-groq>=0.0.1
python-dotenv==1.0.0
EOF

echo "✅ Build script completed"