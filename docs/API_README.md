# FinVision API Documentation

This directory contains comprehensive documentation for the FinVision API, a financial modeling and analysis platform.

## 📁 Documentation Files

- **`API_DOCUMENTATION.md`** - Complete API reference with all endpoints, examples, and usage instructions
- **`openapi.yaml`** - OpenAPI 3.1 specification for Swagger UI and other API tools
- **`FinVision_API.postman_collection.json`** - Postman collection for easy API testing
- **`API_README.md`** - This file with quick start guide

## 🚀 Quick Start

### 1. View Interactive Documentation

The API provides automatic interactive documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/api/v1/openapi.json`

### 2. Test with Postman

1. Import the `FinVision_API.postman_collection.json` file into Postman
2. Set the `base_url` variable to your API server (default: `http://localhost:8000`)
3. Start with the "Login" request to get an access token
4. The token will be automatically saved and used for subsequent requests

### 3. Authentication

The API uses JWT Bearer token authentication:

```bash
# Login to get token
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Use token in subsequent requests
curl -X GET "http://localhost:8000/api/v1/dashboard/metrics" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 API Features

### Core Functionality
- **Authentication**: JWT tokens, MFA, WebAuthn, OAuth
- **Dashboard**: Metrics, charts, analytics
- **File Management**: Upload, process, download files
- **Parameters**: Financial parameters and variables
- **Scenarios**: Financial scenario modeling
- **Statements**: Generate financial statements
- **Notifications**: User notification system
- **Tasks**: Task management
- **Lean Financial**: Lean metrics calculations
- **Administration**: User and system management

### Security Features
- JWT token authentication
- Multi-factor authentication (MFA)
- WebAuthn support
- OAuth integration (Google, Microsoft)
- Rate limiting
- CORS protection
- Input validation

## 📊 Data Models

The API includes comprehensive data models for:

- **Users**: Authentication and profile management
- **Files**: Upload and processing status
- **Parameters**: Financial variables and calculations
- **Scenarios**: Financial modeling scenarios
- **Notifications**: User notifications
- **Tasks**: Task management
- **Lean Metrics**: Financial performance indicators

## 🔗 API Endpoints Overview

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/password-reset` - Password reset

### Dashboard
- `GET /api/v1/dashboard/metrics` - Get dashboard metrics
- `GET /api/v1/dashboard/charts` - Get chart data
- `GET /api/v1/dashboard/metrics/overview` - Get overview metrics

### Files
- `POST /api/v1/files/upload` - Upload file
- `GET /api/v1/files/` - Get user files
- `GET /api/v1/files/{id}` - Get file details
- `GET /api/v1/files/{id}/download` - Download file
- `DELETE /api/v1/files/{id}` - Delete file

### Parameters
- `GET /api/v1/parameters/` - Get parameters
- `POST /api/v1/parameters/` - Create parameter
- `PUT /api/v1/parameters/{id}` - Update parameter
- `DELETE /api/v1/parameters/{id}` - Delete parameter

### Scenarios
- `GET /api/v1/scenarios/` - Get scenarios
- `POST /api/v1/scenarios/` - Create scenario
- `PUT /api/v1/scenarios/{id}` - Update scenario
- `DELETE /api/v1/scenarios/{id}` - Delete scenario
- `POST /api/v1/scenarios/{id}/run` - Run scenario analysis

## 🛠️ Development

### Running the API Locally

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment:**
   ```bash
   cp backend/env.example backend/.env
   # Edit .env with your configuration
   ```

3. **Run migrations:**
   ```bash
   alembic upgrade head
   ```

4. **Start server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Testing

```bash
# Run all tests
pytest backend/tests/

# Run specific test file
pytest backend/tests/test_auth.py

# Run with coverage
pytest --cov=backend backend/tests/
```

## 📝 Error Handling

The API returns standardized error responses:

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 🔒 Rate Limiting

The API implements rate limiting:
- Authentication endpoints: 5 requests/minute
- File upload: 10 requests/hour
- General endpoints: 100 requests/minute
- Admin endpoints: 50 requests/minute

## 🌐 CORS Configuration

The API supports CORS for:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `https://*.netlify.app`
- `https://*.railway.app`
- Production domains

## 📚 Additional Resources

- **Full API Documentation**: See `API_DOCUMENTATION.md`
- **OpenAPI Specification**: See `openapi.yaml`
- **Postman Collection**: See `FinVision_API.postman_collection.json`
- **GitHub Repository**: [Link to repository]
- **Support**: support@finvision.com

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Last updated: January 2024*
*API Version: 1.0.0*
