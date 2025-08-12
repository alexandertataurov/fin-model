# FinVision API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Rate Limits](#rate-limits)
7. [Examples](#examples)
8. [SDKs and Libraries](#sdks-and-libraries)
9. [Troubleshooting](#troubleshooting)

## Overview

The FinVision API is a comprehensive financial modeling and analysis platform that provides enterprise-grade tools for risk assessment, portfolio optimization, and market analysis. Built with modern technologies and industry best practices, it offers robust capabilities for financial professionals and institutions.

### Key Features

- **Risk Assessment**: Advanced Value at Risk (VaR) calculations and stress testing
- **Portfolio Optimization**: Modern portfolio theory implementation with efficient frontier analysis
- **Market Analysis**: Real-time market data integration and trend analysis
- **Scenario Modeling**: Monte Carlo simulations and what-if analysis
- **Reporting**: Comprehensive financial reports and visualizations

### Base URL

```
Production: https://fin-model-production.up.railway.app/api/v1
Development: http://localhost:8000/api/v1
```

### API Version

Current version: **v1.0.0**

## Authentication

The FinVision API uses JWT (JSON Web Tokens) for authentication. All API requests must include a valid JWT token in the Authorization header.

### Getting Started

1. **Register for an account** at the FinVision platform
2. **Generate API credentials** from your dashboard
3. **Use the credentials** to obtain a JWT token
4. **Include the token** in all subsequent requests

### Authentication Endpoints

#### POST /auth/login

Authenticate with username and password to obtain a JWT token.

**Request Body:**

```json
{
  "username": "your-username",
  "password": "your-password"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### POST /auth/refresh

Refresh an expired JWT token using a refresh token.

**Request Body:**

```json
{
  "refresh_token": "your-refresh-token"
}
```

### Request Headers

All authenticated requests must include:

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## API Endpoints

### Financial Models

#### GET /models

Retrieve all financial models for the authenticated user.

**Response:**

```json
{
  "models": [
    {
      "id": "model_123",
      "name": "Conservative Portfolio Model",
      "description": "Low-risk portfolio for retirement planning",
      "type": "portfolio_optimization",
      "parameters": {
        "risk_tolerance": 0.2,
        "time_horizon": 10,
        "investment_amount": 100000
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST /models

Create a new financial model with specified parameters.

**Request Body:**

```json
{
  "name": "Conservative Portfolio Model",
  "description": "Low-risk portfolio for retirement planning",
  "type": "portfolio_optimization",
  "parameters": {
    "risk_tolerance": 0.2,
    "time_horizon": 10,
    "investment_amount": 100000
  }
}
```

#### GET /models/{model_id}

Retrieve a specific financial model by ID.

### Risk Analysis

#### POST /risk/var

Calculate Value at Risk (VaR) for a portfolio.

**Request Body:**

```json
{
  "portfolio_id": "portfolio_123",
  "confidence_level": 0.95,
  "time_horizon": 1
}
```

**Response:**

```json
{
  "var_95": 15000.5,
  "var_99": 22000.75,
  "expected_shortfall": 18000.25,
  "confidence_interval": {
    "lower": 12000.0,
    "upper": 18000.0
  }
}
```

#### POST /risk/stress-test

Perform stress testing on financial models.

**Request Body:**

```json
{
  "portfolio_id": "portfolio_123",
  "scenarios": [
    {
      "name": "Market Crash",
      "market_shock": -0.2
    },
    {
      "name": "Interest Rate Hike",
      "rate_change": 0.02
    }
  ]
}
```

### Portfolio Optimization

#### POST /portfolio/optimize

Optimize portfolio allocation using modern portfolio theory.

**Request Body:**

```json
{
  "assets": [
    {
      "symbol": "AAPL",
      "expected_return": 0.12,
      "volatility": 0.25
    },
    {
      "symbol": "GOOGL",
      "expected_return": 0.15,
      "volatility": 0.3
    },
    {
      "symbol": "MSFT",
      "expected_return": 0.1,
      "volatility": 0.2
    }
  ],
  "target_return": 0.12,
  "risk_free_rate": 0.02
}
```

**Response:**

```json
{
  "optimal_weights": {
    "AAPL": 0.4,
    "GOOGL": 0.35,
    "MSFT": 0.25
  },
  "expected_return": 0.12,
  "portfolio_volatility": 0.18,
  "sharpe_ratio": 0.56
}
```

#### GET /portfolio/efficient-frontier

Generate efficient frontier data for portfolio analysis.

**Query Parameters:**

- `portfolio_id` (required): Portfolio identifier

## Data Models

### Financial Model

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "type": "string",
  "parameters": {
    "risk_tolerance": "number",
    "time_horizon": "number",
    "investment_amount": "number"
  },
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Portfolio

```json
{
  "id": "string",
  "name": "string",
  "assets": [
    {
      "symbol": "string",
      "weight": "number",
      "expected_return": "number",
      "volatility": "number"
    }
  ],
  "total_value": "number",
  "risk_metrics": {
    "var_95": "number",
    "sharpe_ratio": "number",
    "beta": "number"
  }
}
```

### Risk Analysis Result

```json
{
  "portfolio_id": "string",
  "var_95": "number",
  "var_99": "number",
  "expected_shortfall": "number",
  "confidence_interval": {
    "lower": "number",
    "upper": "number"
  },
  "stress_test_results": [
    {
      "scenario": "string",
      "impact": "number"
    }
  ]
}
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error messages in JSON format.

### Common Error Codes

- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Invalid or missing authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

### Example Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid portfolio parameters",
    "details": {
      "risk_tolerance": "Must be between 0 and 1"
    }
  }
}
```

## Rate Limits

To ensure fair usage and system stability, the API implements rate limiting:

- **Standard Plan**: 1,000 requests per hour
- **Professional Plan**: 10,000 requests per hour
- **Enterprise Plan**: 100,000 requests per hour

### Rate Limit Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Examples

### Python Example

```python
import requests
import json

# Base URL
base_url = "https://fin-model-production.up.railway.app/api/v1"

# Authentication
auth_response = requests.post(f"{base_url}/auth/login", json={
    "username": "your-username",
    "password": "your-password"
})

token = auth_response.json()["access_token"]
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Create a financial model
model_data = {
    "name": "Conservative Portfolio Model",
    "description": "Low-risk portfolio for retirement planning",
    "type": "portfolio_optimization",
    "parameters": {
        "risk_tolerance": 0.2,
        "time_horizon": 10,
        "investment_amount": 100000
    }
}

response = requests.post(f"{base_url}/models", json=model_data, headers=headers)
model = response.json()

# Calculate VaR
var_data = {
    "portfolio_id": "portfolio_123",
    "confidence_level": 0.95,
    "time_horizon": 1
}

response = requests.post(f"{base_url}/risk/var", json=var_data, headers=headers)
var_result = response.json()

print(f"VaR (95%): ${var_result['var_95']:,.2f}")
```

### JavaScript Example

```javascript
const baseUrl = "https://fin-model-production.up.railway.app/api/v1";

// Authentication
async function authenticate(username, password) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  return data.access_token;
}

// Create a financial model
async function createModel(token, modelData) {
  const response = await fetch(`${baseUrl}/models`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modelData),
  });

  return response.json();
}

// Usage
const token = await authenticate("your-username", "your-password");

const modelData = {
  name: "Conservative Portfolio Model",
  description: "Low-risk portfolio for retirement planning",
  type: "portfolio_optimization",
  parameters: {
    risk_tolerance: 0.2,
    time_horizon: 10,
    investment_amount: 100000,
  },
};

const model = await createModel(token, modelData);
console.log("Created model:", model);
```

## SDKs and Libraries

### Official SDKs

- **Python SDK**: `pip install finvision-api`
- **JavaScript SDK**: `npm install @finvision/api`
- **Java SDK**: Available via Maven Central

### Community Libraries

- **R**: `install.packages("finvision")`
- **Go**: `go get github.com/finvision/go-api`
- **PHP**: `composer require finvision/api`

## Troubleshooting

### Common Issues

1. **Authentication Errors**

   - Ensure your JWT token is valid and not expired
   - Check that you're using the correct username/password
   - Verify the token format: `Bearer <token>`

2. **Rate Limiting**

   - Check the rate limit headers in responses
   - Implement exponential backoff for retries
   - Consider upgrading your plan if you need higher limits

3. **Validation Errors**

   - Review the error details for specific field issues
   - Ensure all required fields are provided
   - Check data types and value ranges

4. **Network Issues**
   - Verify your internet connection
   - Check if the API is accessible from your location
   - Try using a different network if possible

### Getting Help

- **Documentation**: Visit `/api/v1/docs/` for interactive documentation
- **Support Email**: support@finvision.com
- **GitHub Issues**: Report bugs and feature requests
- **Community Forum**: Connect with other developers

### Debug Mode

Enable debug mode by setting the `X-Debug` header to `true` in your requests:

```
X-Debug: true
```

This will provide additional information in error responses for debugging purposes.

---

_Last updated: January 2024_
_API Version: 1.0.0_
