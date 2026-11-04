#!/bin/bash

# Update API Documentation Script for Cidadão.AI
# This script updates the OpenAPI specification from the Hugging Face backend

echo "🔄 Updating Cidadão.AI API documentation..."

# API endpoint for OpenAPI spec
API_URL="https://cidadao-api-production.up.railway.app/openapi.json"

# Download the latest OpenAPI spec
echo "📥 Downloading OpenAPI spec from: $API_URL"

if command -v wget >/dev/null 2>&1; then
    wget -O openapi.json "$API_URL" --timeout=30 --tries=3
elif command -v curl >/dev/null 2>&1; then
    curl -o openapi.json "$API_URL" --connect-timeout 30 --max-time 60
else
    echo "❌ Error: Neither wget nor curl is available"
    exit 1
fi

# Check if download was successful
if [ -f openapi.json ] && [ -s openapi.json ]; then
    echo "✅ OpenAPI spec updated successfully"
    echo "📊 File size: $(wc -c < openapi.json) bytes"
    
    # Validate JSON format
    if command -v python3 >/dev/null 2>&1; then
        if python3 -m json.tool openapi.json >/dev/null 2>&1; then
            echo "✅ JSON format is valid"
        else
            echo "⚠️  Warning: JSON format might be invalid"
        fi
    fi
    
    # Show API info
    echo "📋 API Information:"
    if command -v jq >/dev/null 2>&1; then
        jq '.info' openapi.json 2>/dev/null || echo "   (install jq for detailed info)"
    else
        grep -o '"title":"[^"]*"' openapi.json | head -1 || echo "   Basic API"
    fi
    
    echo ""
    echo "🎉 API documentation updated successfully!"
    echo "💡 The documentation hub uses iframe for live updates, but this local file can be used for offline development."
    
else
    echo "❌ Failed to download or empty file received"
    exit 1
fi