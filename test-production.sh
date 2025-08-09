#!/bin/bash

echo "🧪 Testing Production Build Locally"
echo "==================================="

# Build production version
echo "📦 Building production..."
./build.sh

if [ $? -ne 0 ]; then
    echo "❌ Production build failed"
    exit 1
fi

# Test frontend build
echo "🌐 Testing frontend build..."
cd frontend
npm run preview &
FRONTEND_PID=$!

# Wait for server to start
sleep 3

# Test if frontend is accessible
if curl -f http://localhost:4173 > /dev/null 2>&1; then
    echo "✅ Frontend build test passed"
else
    echo "❌ Frontend build test failed"
    kill $FRONTEND_PID
    exit 1
fi

# Cleanup
kill $FRONTEND_PID

echo "✅ All production tests passed!"
echo "🚀 Ready for deployment!"
