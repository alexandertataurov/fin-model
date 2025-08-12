#!/bin/bash

# FinVision API Documentation Deployment Script
# This script ensures documentation files are properly deployed to Railway

set -e

echo "🚀 Deploying FinVision API Documentation..."

# Check if we're in the right directory
if [ ! -f "railway.json" ]; then
    echo "❌ Error: railway.json not found. Please run this script from the project root."
    exit 1
fi

# Create docs directory if it doesn't exist
if [ ! -d "docs/redocs" ]; then
    echo "❌ Error: docs/redocs directory not found. Please ensure documentation files exist."
    exit 1
fi

# Verify required files exist
required_files=(
    "docs/redocs/landing.html"
    "docs/redocs/index.html"
    "docs/redocs/swagger.html"
    "docs/openapi.yaml"
    "docs/FinVision_API.postman_collection.json"
    "docs/API_DOCUMENTATION.md"
)

echo "📋 Checking required documentation files..."

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        missing_files=true
    fi
done

if [ "$missing_files" = true ]; then
    echo "❌ Some required files are missing. Please ensure all documentation files exist."
    exit 1
fi

# Check if backend endpoints are properly configured
if [ ! -f "backend/app/api/v1/endpoints/docs.py" ]; then
    echo "❌ Error: docs.py endpoint not found. Please ensure the documentation endpoint is created."
    exit 1
fi

echo "✅ All documentation files verified"

# Create a deployment manifest
echo "📝 Creating deployment manifest..."
cat > docs/deployment_manifest.txt << EOF
FinVision API Documentation Deployment Manifest
Generated: $(date)
Version: 1.0.0

Files included:
$(find docs/ -type f -name "*.html" -o -name "*.yaml" -o -name "*.json" -o -name "*.md" | sort)

Endpoints configured:
- /docs/ - Documentation landing page
- /docs/redoc - ReDoc interface
- /docs/swagger - Swagger UI interface
- /docs/openapi.yaml - OpenAPI specification
- /docs/postman - Postman collection

Railway deployment ready!
EOF

echo "✅ Deployment manifest created: docs/deployment_manifest.txt"

# Test the documentation locally (optional)
if command -v python3 &> /dev/null; then
    echo "🧪 Testing documentation locally..."
    cd docs/redocs
    if python3 -m http.server 8080 &> /dev/null; then
        echo "✅ Local test server started on http://localhost:8080"
        echo "   Press Ctrl+C to stop the test server"
        echo "   Visit http://localhost:8080/landing.html to test"
    else
        echo "⚠️  Could not start local test server"
    fi
else
    echo "⚠️  Python3 not found, skipping local test"
fi

echo ""
echo "🎉 Documentation deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Commit all changes to git"
echo "2. Push to your Railway-connected repository"
echo "3. Railway will automatically deploy the updated documentation"
echo ""
echo "🌐 Your documentation will be available at:"
echo "   - https://your-railway-app.railway.app/docs/"
echo "   - https://your-railway-app.railway.app/docs/redoc"
echo "   - https://your-railway-app.railway.app/docs/swagger"
echo ""
echo "📚 For more information, see: docs/deployment_manifest.txt"
