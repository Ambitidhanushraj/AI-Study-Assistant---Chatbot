#!/bin/bash

echo "🚀 Starting AI Study Assistant..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🔥 Starting development server..."
./node_modules/.bin/next dev 