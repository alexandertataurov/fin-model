# FinVision API Documentation

## Overview

The FinVision API is a comprehensive financial modeling and analysis platform built with FastAPI. This documentation provides detailed information about all available endpoints, authentication methods, data models, and usage examples.

## Base Information

- **Base URL**: `/api/v1`
- **OpenAPI Schema**: `/api/v1/openapi.json`
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **Version**: 1.0.0

## Table of Contents

1. [Authentication](#authentication)
2. [Core Endpoints](#core-endpoints)
3. [Dashboard](#dashboard)
4. [File Management](#file-management)
5. [Parameters](#parameters)
6. [Scenarios](#scenarios)
7. [Financial Statements](#financial-statements)
8. [Notifications](#notifications)
9. [Tasks](#tasks)
10. [Lean Financial](#lean-financial)
11. [Administration](#administration)
12. [WebSocket](#websocket)
13. [Data Models](#data-models)
14. [Error Handling](#error-handling)
15. [Rate Limiting](#rate-limiting)

## Authentication

### Authentication Methods

The API supports multiple authentication methods:

1. **JWT Bearer Token** (Primary)
2. **Multi-Factor Authentication (MFA)**
3. **WebAuthn**
4. **OAuth** (Google, Microsoft)

### JWT Authentication

#### Login

```http
POST /api/v1/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "refresh_token": "refresh_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "is_verified": true
  }
}
```

#### Register

```http
POST /api/v1/auth/register
```

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh
```

**Headers:**

```
Authorization: Bearer <refresh_token>
```

#### Password Reset

```http
POST /api/v1/auth/password-reset
```

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

### MFA Authentication

#### Setup MFA

```http
POST /api/v1/auth/mfa/setup
```

#### Verify MFA

```http
POST /api/v1/auth/mfa/verify
```

**Request Body:**

```json
{
  "code": "123456"
}
```

### WebAuthn Authentication

#### Register WebAuthn

```http
POST /api/v1/auth/webauthn/register
```

#### Authenticate with WebAuthn

```http
POST /api/v1/auth/webauthn/authenticate
```

### OAuth Authentication

#### Google OAuth

```http
GET /api/v1/auth/oauth/google
```

#### Microsoft OAuth

```http
GET /api/v1/auth/oauth/microsoft
```

## Core Endpoints

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "cache_status": "enabled"
}
```

### API Status

```http
GET /api/v1/status
```

**Response:**

```json
{
  "status": "operational",
  "version": "1.0.0"
}
```

## Dashboard

### Get Dashboard Metrics

```http
GET /api/v1/dashboard/metrics
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "total_files": 25,
  "completed_files": 20,
  "processing_files": 3,
  "total_parameters": 150,
  "total_reports": 0
}
```

### Get Dashboard Charts

```http
GET /api/v1/dashboard/charts
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "revenue_trend": [1000, 1200, 1100, 1300],
  "expense_breakdown": {
    "COGS": 600,
    "OPEX": 300
  }
}
```

### Get Overview Metrics

```http
GET /api/v1/dashboard/metrics/overview?period=ytd
```

**Query Parameters:**

- `period` (string): Time period for metrics
  - `mtd` - Month to Date
  - `qtd` - Quarter to Date
  - `ytd` - Year to Date
  - `last_30_days` - Last 30 Days
  - `last_90_days` - Last 90 Days
  - `last_12_months` - Last 12 Months
  - `custom` - Custom Period

## File Management

### Upload File

```http
POST /api/v1/files/upload
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**

- `file`: File to upload
- `description` (optional): File description
- `tags` (optional): Comma-separated tags

### Get User Files

```http
GET /api/v1/files/
```

**Query Parameters:**

- `page` (int): Page number (default: 1)
- `size` (int): Page size (default: 20)
- `status` (string): Filter by status
- `search` (string): Search term

### Get File Details

```http
GET /api/v1/files/{file_id}
```

### Delete File

```http
DELETE /api/v1/files/{file_id}
```

### Download File

```http
GET /api/v1/files/{file_id}/download
```

## Parameters

### Get Parameters

```http
GET /api/v1/parameters/
```

**Query Parameters:**

- `page` (int): Page number
- `size` (int): Page size
- `category` (string): Filter by category
- `search` (string): Search term

### Create Parameter

```http
POST /api/v1/parameters/
```

**Request Body:**

```json
{
  "name": "Revenue Growth Rate",
  "value": 0.15,
  "category": "financial",
  "description": "Annual revenue growth rate",
  "unit": "percentage"
}
```

### Update Parameter

```http
PUT /api/v1/parameters/{parameter_id}
```

### Delete Parameter

```http
DELETE /api/v1/parameters/{parameter_id}
```

## Scenarios

### Get Scenarios

```http
GET /api/v1/scenarios/
```

**Query Parameters:**

- `page` (int): Page number
- `size` (int): Page size
- `status` (string): Filter by status

### Create Scenario

```http
POST /api/v1/scenarios/
```

**Request Body:**

```json
{
  "name": "Base Case Scenario",
  "description": "Base case financial projections",
  "parameters": {
    "revenue_growth": 0.15,
    "margin": 0.25
  }
}
```

### Update Scenario

```http
PUT /api/v1/scenarios/{scenario_id}
```

### Delete Scenario

```http
DELETE /api/v1/scenarios/{scenario_id}
```

### Run Scenario Analysis

```http
POST /api/v1/scenarios/{scenario_id}/run
```

## Financial Statements

### Get Statements

```http
GET /api/v1/statements/
```

**Query Parameters:**

- `type` (string): Statement type (income, balance, cash_flow)
- `period` (string): Time period
- `scenario_id` (int): Scenario ID

### Generate Statement

```http
POST /api/v1/statements/generate
```

**Request Body:**

```json
{
  "type": "income",
  "period": "2024",
  "scenario_id": 1
}
```

## Notifications

### Get Notifications

```http
GET /api/v1/notifications/
```

**Query Parameters:**

- `page` (int): Page number
- `size` (int): Page size
- `read` (boolean): Filter by read status

### Mark Notification as Read

```http
PUT /api/v1/notifications/{notification_id}/read
```

### Mark All Notifications as Read

```http
PUT /api/v1/notifications/read-all
```

### Delete Notification

```http
DELETE /api/v1/notifications/{notification_id}
```

## Tasks

### Get Tasks

```http
GET /api/v1/tasks/
```

**Query Parameters:**

- `status` (string): Filter by status
- `priority` (string): Filter by priority

### Create Task

```http
POST /api/v1/tasks/
```

**Request Body:**

```json
{
  "title": "Review Q4 Financials",
  "description": "Review and validate Q4 financial statements",
  "priority": "high",
  "due_date": "2024-01-15"
}
```

### Update Task

```http
PUT /api/v1/tasks/{task_id}
```

### Delete Task

```http
DELETE /api/v1/tasks/{task_id}
```

## Lean Financial

### Get Lean Metrics

```http
GET /api/v1/lean-financial/metrics
```

### Calculate Lean Metrics

```http
POST /api/v1/lean-financial/calculate
```

**Request Body:**

```json
{
  "revenue": 1000000,
  "costs": 800000,
  "inventory": 50000,
  "accounts_receivable": 75000,
  "accounts_payable": 25000
}
```

## Administration

### User Management

#### Get Users

```http
GET /api/v1/admin/users/
```

**Headers:**

```
Authorization: Bearer <admin_token>
```

#### Create User

```http
POST /api/v1/admin/users/
```

#### Update User

```http
PUT /api/v1/admin/users/{user_id}
```

#### Delete User

```http
DELETE /api/v1/admin/users/{user_id}
```

### System Management

#### Get System Info

```http
GET /api/v1/admin/system/info
```

#### Get System Logs

```http
GET /api/v1/admin/system/logs
```

### Database Management

#### Get Database Status

```http
GET /api/v1/admin/database/status
```

#### Run Database Migration

```http
POST /api/v1/admin/database/migrate
```

## WebSocket

### Connect to WebSocket

```javascript
const ws = new WebSocket("ws://localhost:8000/ws");
```

### WebSocket Events

#### Authentication

```json
{
  "type": "auth",
  "token": "your_jwt_token"
}
```

#### File Processing Updates

```json
{
  "type": "file_processing",
  "file_id": 123,
  "status": "processing",
  "progress": 75
}
```

#### Notifications

```json
{
  "type": "notification",
  "message": "File processing completed",
  "notification_id": 456
}
```

## Data Models

### User Model

```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "is_verified": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### File Model

```json
{
  "id": 1,
  "filename": "financial_data.xlsx",
  "original_filename": "financial_data.xlsx",
  "file_size": 1024000,
  "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "status": "completed",
  "description": "Q4 financial data",
  "tags": ["financial", "q4"],
  "uploaded_at": "2024-01-01T00:00:00Z",
  "processed_at": "2024-01-01T00:05:00Z"
}
```

### Parameter Model

```json
{
  "id": 1,
  "name": "Revenue Growth Rate",
  "value": 0.15,
  "category": "financial",
  "description": "Annual revenue growth rate",
  "unit": "percentage",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Scenario Model

```json
{
  "id": 1,
  "name": "Base Case Scenario",
  "description": "Base case financial projections",
  "parameters": {
    "revenue_growth": 0.15,
    "margin": 0.25
  },
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Notification Model

```json
{
  "id": 1,
  "title": "File Processing Complete",
  "message": "Your file has been processed successfully",
  "type": "success",
  "is_read": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Error Handling

### Standard Error Response

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

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Common Error Types

1. **Authentication Errors**

   - Invalid credentials
   - Expired token
   - Missing token

2. **Validation Errors**

   - Missing required fields
   - Invalid data types
   - Constraint violations

3. **Permission Errors**

   - Insufficient permissions
   - Role-based access denied

4. **Resource Errors**
   - Resource not found
   - Resource already exists
   - Resource in use

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **File upload**: 10 requests per hour
- **General endpoints**: 100 requests per minute
- **Admin endpoints**: 50 requests per minute

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## CORS Configuration

The API supports CORS for the following origins:

- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `https://*.netlify.app`
- `https://*.railway.app`
- Production domains

## Caching

The API uses Redis caching for:

- Dashboard metrics (5 minutes)
- File processing status
- User session data

## Security Features

1. **JWT Token Authentication**
2. **Multi-Factor Authentication (MFA)**
3. **WebAuthn Support**
4. **OAuth Integration**
5. **Rate Limiting**
6. **CORS Protection**
7. **Input Validation**
8. **SQL Injection Prevention**

## Development and Testing

### Running the API Locally

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**

   ```bash
   cp backend/env.example backend/.env
   # Edit .env with your configuration
   ```

3. **Run database migrations:**

   ```bash
   alembic upgrade head
   ```

4. **Start the server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Testing

Run tests with pytest:

```bash
pytest backend/tests/
```

### API Documentation Access

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/api/v1/openapi.json`

## Support and Contact

For API support and questions:

- **Documentation**: This document
- **Issues**: GitHub repository issues
- **Email**: support@finvision.com

---

_Last updated: January 2024_
_Version: 1.0.0_
