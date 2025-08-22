# FinVision API Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you get up and running with the FinVision API quickly.

## Prerequisites

- Python 3.8+
- pip or poetry
- Git
- PostgreSQL (for local development)

## 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd fin-model

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## 2. Environment Configuration

```bash
# Copy environment template
cp backend/env.example backend/.env

# Edit the .env file with your settings
nano backend/.env
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/finvision

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

## 3. Database Setup

```bash
# Run database migrations
cd backend
alembic upgrade head

# Create initial admin user (optional)
python -c "
from app.services.auth_service import AuthService
from app.models.base import get_db
from app.schemas.user import UserRegister

db = next(get_db())
auth_service = AuthService(db)
user = auth_service.create_user(UserRegister(
    email='admin@example.com',
    password='admin123',
    first_name='Admin',
    last_name='User'
))
print(f'Admin user created: {user.email}')
"
```

## 4. Start the Server

```bash
# Start the API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Your API is now running at `http://localhost:8000`

## 5. Test the API

### Using curl

```bash
# Check API status
curl http://localhost:8000/api/v1/status

# Register a new user
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'

# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using the Interactive Documentation

1. Open your browser to `http://localhost:8000/docs`
2. Try the authentication endpoints
3. Use the "Authorize" button to set your Bearer token
4. Test other endpoints

## 6. First API Call

Here's a complete example of uploading a file and getting dashboard metrics:

```python
import requests
import json

# Base URL
BASE_URL = "http://localhost:8000/api/v1"

# 1. Login
login_response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "test@example.com",
    "password": "password123"
})

token = login_response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Get dashboard metrics
metrics_response = requests.get(f"{BASE_URL}/dashboard/metrics", headers=headers)
print("Dashboard Metrics:", json.dumps(metrics_response.json(), indent=2))

# 3. Upload a file
with open("sample_financial_data.csv", "rb") as f:
    files = {"file": f}
    upload_response = requests.post(f"{BASE_URL}/files/upload", headers=headers, files=files)
    print("File Upload:", json.dumps(upload_response.json(), indent=2))
```

## 7. Common Operations

### Authentication Flow

```python
# Complete authentication flow
def authenticate(email, password):
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    return response.json()["access_token"]

# Use the token
token = authenticate("user@example.com", "password123")
headers = {"Authorization": f"Bearer {token}"}
```

### File Operations

```python
# Upload file
def upload_file(file_path, token):
    headers = {"Authorization": f"Bearer {token}"}
    with open(file_path, "rb") as f:
        files = {"file": f}
        response = requests.post(f"{BASE_URL}/files/upload", headers=headers, files=files)
        return response.json()

# Get file list
def get_files(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/files/", headers=headers)
    return response.json()

# Download file
def download_file(file_id, token, save_path):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/files/{file_id}/download", headers=headers)
    with open(save_path, "wb") as f:
        f.write(response.content)
```

### Dashboard Operations

```python
# Get all dashboard data
def get_dashboard_data(token):
    headers = {"Authorization": f"Bearer {token}"}

    # Get metrics
    metrics = requests.get(f"{BASE_URL}/dashboard/metrics", headers=headers).json()

    # Get charts
    charts = requests.get(f"{BASE_URL}/dashboard/charts", headers=headers).json()

    # Get overview metrics
    overview = requests.get(f"{BASE_URL}/dashboard/metrics/overview", headers=headers).json()

    return {
        "metrics": metrics,
        "charts": charts,
        "overview": overview
    }
```

## 8. Error Handling

```python
import requests
from requests.exceptions import RequestException

def safe_api_call(func):
    """Decorator for safe API calls with error handling"""
    def wrapper(*args, **kwargs):
        try:
            response = func(*args, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 401:
                print("Authentication failed. Please check your credentials.")
            elif e.response.status_code == 403:
                print("Access denied. You don't have permission for this operation.")
            elif e.response.status_code == 404:
                print("Resource not found.")
            else:
                print(f"HTTP Error: {e.response.status_code} - {e.response.text}")
        except RequestException as e:
            print(f"Request failed: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")
        return None
    return wrapper

# Usage
@safe_api_call
def get_user_profile(token):
    headers = {"Authorization": f"Bearer {token}"}
    return requests.get(f"{BASE_URL}/auth/profile", headers=headers)
```

## 9. Testing with Postman

1. Import the Postman collection:

   - File: `docs/FinVision_API.postman_collection.json`
   - Import into Postman

2. Set environment variables:

   - `base_url`: `http://localhost:8000`
   - `token`: (will be set automatically after login)

3. Run the collection:
   - Start with "Login" request
   - Token will be automatically saved
   - Run other requests in sequence

## 10. Next Steps

- Read the [Full API Documentation](API_DOCUMENTATION.md)
- Explore the [OpenAPI Specification](openapi.yaml)
- Check out the [Postman Collection](FinVision_API.postman_collection.json)
- Review the [Data Models](#data-models) section
- Learn about [Error Handling](#error-handling)

## Troubleshooting

### Common Issues

**Database Connection Error:**

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Create database
createdb finvision
```

**Port Already in Use:**

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

**Import Errors:**

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Environment Variables Not Loading:**

```bash
# Check if .env file exists
ls -la backend/.env

# Verify environment variables
python -c "import os; print(os.getenv('DATABASE_URL'))"
```

## Support

- **Documentation**: Check the docs folder
- **Issues**: Create an issue on GitHub
- **Email**: support@finvision.com

---

_This guide covers the basics. For advanced usage, see the full documentation._
