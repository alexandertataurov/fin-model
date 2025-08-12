# Railway Documentation Deployment Guide

This guide explains how to deploy your FinVision API documentation to Railway and access it online.

## 🚀 Quick Deployment

### Option 1: Automatic Deployment (Recommended)

1. **Run the deployment script:**

   ```bash
   ./scripts/deploy_docs.sh
   ```

2. **Commit and push your changes:**

   ```bash
   git add .
   git commit -m "Add API documentation endpoints and web interface"
   git push origin main
   ```

3. **Railway will automatically deploy** your updated application with the documentation endpoints.

### Option 2: Manual Deployment

1. **Verify all files exist:**

   - `docs/redocs/landing.html`
   - `docs/redocs/index.html` (ReDoc)
   - `docs/redocs/swagger.html` (Swagger UI)
   - `docs/openapi.yaml`
   - `docs/FinVision_API.postman_collection.json`
   - `backend/app/api/v1/endpoints/docs.py`

2. **Push to Railway:**
   ```bash
   git add .
   git commit -m "Add API documentation"
   git push origin main
   ```

## 🌐 Accessing Your Documentation

Once deployed, your documentation will be available at:

### Main Documentation Hub

- **URL**: `https://your-railway-app.railway.app/docs/`
- **Description**: Landing page with links to all documentation formats

### Individual Documentation Formats

- **ReDoc**: `https://your-railway-app.railway.app/docs/redoc`
- **Swagger UI**: `https://your-railway-app.railway.app/docs/swagger`
- **OpenAPI Spec**: `https://your-railway-app.railway.app/docs/openapi.yaml`
- **Postman Collection**: `https://your-railway-app.railway.app/docs/postman`

### Legacy Endpoints (Redirects)

- **FastAPI /docs**: `https://your-railway-app.railway.app/docs` → Redirects to custom docs

## 📁 File Structure

```
docs/
├── redocs/
│   ├── landing.html          # Documentation hub
│   ├── index.html           # ReDoc interface
│   ├── swagger.html         # Swagger UI interface
│   ├── server.py            # Local development server
│   └── README.md            # Local docs guide
├── openapi.yaml             # OpenAPI specification
├── FinVision_API.postman_collection.json  # Postman collection
├── API_DOCUMENTATION.md     # Comprehensive markdown docs
├── API_README.md            # Quick start guide
└── RAILWAY_DEPLOYMENT.md    # This file
```

## 🔧 Configuration Details

### FastAPI Endpoints Added

The following endpoints have been added to your FastAPI application:

```python
# Main documentation router
/api/v1/docs/              # Landing page
/api/v1/docs/redoc         # ReDoc interface
/api/v1/docs/swagger       # Swagger UI interface
/api/v1/docs/openapi.yaml  # OpenAPI specification
/api/v1/docs/postman       # Postman collection

# Legacy redirect
/docs                      # Redirects to /api/v1/docs/
```

### Railway Configuration

Your `railway.json` remains unchanged:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python backend/start.py"
  }
}
```

## 🧪 Testing Locally

Before deploying, you can test the documentation locally:

### Option 1: Using the Local Server

```bash
cd docs/redocs
python server.py
```

Then visit: `http://localhost:8080/landing.html`

### Option 2: Using FastAPI Development Server

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then visit: `http://localhost:8000/docs/`

## 🔍 Troubleshooting

### Common Issues

1. **Documentation not loading**

   - Check that all files exist in the `docs/` directory
   - Verify the file paths in `backend/app/api/v1/endpoints/docs.py`
   - Check Railway deployment logs

2. **404 errors**

   - Ensure the docs router is included in `backend/app/api/v1/api.py`
   - Verify the endpoint paths are correct
   - Check that files are being served from the correct location

3. **CORS issues**
   - The documentation is served from the same domain, so CORS shouldn't be an issue
   - If accessing from a different domain, check your CORS configuration

### Railway-Specific Issues

1. **Build failures**

   - Check Railway build logs
   - Ensure all Python dependencies are in `requirements.txt`
   - Verify the start command in `railway.json`

2. **Runtime errors**
   - Check Railway runtime logs
   - Verify database connections
   - Ensure environment variables are set

## 🔄 Updating Documentation

To update your documentation:

1. **Modify the documentation files** in the `docs/` directory
2. **Run the deployment script** to verify everything:
   ```bash
   ./scripts/deploy_docs.sh
   ```
3. **Commit and push** your changes:
   ```bash
   git add .
   git commit -m "Update API documentation"
   git push origin main
   ```

## 📊 Monitoring

### Railway Dashboard

- Monitor your application in the Railway dashboard
- Check deployment status and logs
- Monitor resource usage

### Documentation Analytics

Consider adding analytics to track documentation usage:

- Google Analytics
- Railway's built-in analytics
- Custom tracking endpoints

## 🔐 Security Considerations

### Public Access

- Documentation endpoints are publicly accessible
- No authentication required for documentation access
- API endpoints remain protected by your existing authentication

### Content Security

- Documentation files are static and don't execute code
- No sensitive information is exposed in documentation
- OpenAPI spec only contains public endpoint information

## 🎯 Best Practices

1. **Keep documentation updated** with API changes
2. **Test locally** before deploying
3. **Monitor documentation usage** and feedback
4. **Version your documentation** with your API versions
5. **Provide multiple formats** for different user preferences

## 📞 Support

If you encounter issues:

1. **Check Railway logs** for deployment and runtime errors
2. **Verify file paths** and configurations
3. **Test locally** to isolate issues
4. **Review this guide** for common solutions

---

_Last updated: January 2024_
_Documentation Version: 1.0.0_
