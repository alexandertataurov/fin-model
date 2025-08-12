# FinVision API - Quick Start Guide

## 🚀 Getting Started

Welcome to the FinVision API! This guide will help you get up and running quickly with our Financial Modeling and Analysis Platform.

## 📋 Prerequisites

- **API Access**: A valid FinVision account with API credentials
- **Programming Language**: Any language that supports HTTP requests (Python, JavaScript, Java, etc.)
- **Network Access**: Ability to make HTTPS requests to our API endpoints

## 🔐 Authentication

### Step 1: Get Your Credentials

1. Log in to your FinVision dashboard
2. Navigate to **API Settings** → **Credentials**
3. Generate a new API key or use your existing credentials

### Step 2: Authenticate

```bash
curl -X POST "https://fin-model-production.up.railway.app/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your-username",
    "password": "your-password"
  }'
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

### Step 3: Use the Token

Include the token in all subsequent requests:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  "https://fin-model-production.up.railway.app/api/v1/models"
```

## 🎯 Your First API Call

### Create a Financial Model

```python
import requests

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

# Create your first model
model_data = {
    "name": "My First Portfolio",
    "description": "A simple portfolio for learning",
    "type": "portfolio_optimization",
    "parameters": {
        "risk_tolerance": 0.3,
        "time_horizon": 5,
        "investment_amount": 50000
    }
}

response = requests.post(f"{base_url}/models", json=model_data, headers=headers)
print(f"Created model: {response.json()}")
```

## 📊 Common Use Cases

### 1. Portfolio Optimization

```python
# Optimize a portfolio
portfolio_data = {
    "assets": [
        {"symbol": "AAPL", "expected_return": 0.12, "volatility": 0.25},
        {"symbol": "GOOGL", "expected_return": 0.15, "volatility": 0.30},
        {"symbol": "MSFT", "expected_return": 0.10, "volatility": 0.20}
    ],
    "target_return": 0.12,
    "risk_free_rate": 0.02
}

response = requests.post(f"{base_url}/portfolio/optimize",
                        json=portfolio_data, headers=headers)
optimization_result = response.json()
print(f"Optimal weights: {optimization_result['optimal_weights']}")
```

### 2. Risk Analysis

```python
# Calculate Value at Risk
var_data = {
    "portfolio_id": "your_portfolio_id",
    "confidence_level": 0.95,
    "time_horizon": 1
}

response = requests.post(f"{base_url}/risk/var", json=var_data, headers=headers)
var_result = response.json()
print(f"VaR (95%): ${var_result['var_95']:,.2f}")
```

### 3. Stress Testing

```python
# Perform stress testing
stress_data = {
    "portfolio_id": "your_portfolio_id",
    "scenarios": [
        {"name": "Market Crash", "market_shock": -0.2},
        {"name": "Interest Rate Hike", "rate_change": 0.02}
    ]
}

response = requests.post(f"{base_url}/risk/stress-test",
                        json=stress_data, headers=headers)
stress_results = response.json()
print(f"Stress test results: {stress_results}")
```

## 🔧 SDKs and Libraries

### Python SDK

```bash
pip install finvision-api
```

```python
from finvision import FinVisionAPI

api = FinVisionAPI("your-username", "your-password")
models = api.get_models()
```

### JavaScript SDK

```bash
npm install @finvision/api
```

```javascript
import { FinVisionAPI } from "@finvision/api";

const api = new FinVisionAPI("your-username", "your-password");
const models = await api.getModels();
```

## 📚 Documentation Resources

- **Interactive Docs**: `/api/v1/docs/` - Main documentation hub
- **ReDoc**: `/api/v1/docs/redoc` - Beautiful, responsive docs
- **Swagger UI**: `/api/v1/docs/swagger` - Interactive testing
- **Full Documentation**: `/api/v1/docs/markdown` - Comprehensive guide
- **Postman Collection**: `/api/v1/docs/postman` - Ready-to-use collection

## ⚡ Quick Tips

### Error Handling

```python
try:
    response = requests.post(f"{base_url}/models", json=data, headers=headers)
    response.raise_for_status()  # Raises an exception for 4XX/5XX status codes
    result = response.json()
except requests.exceptions.HTTPError as e:
    error_detail = e.response.json()
    print(f"Error: {error_detail['error']['message']}")
```

### Rate Limiting

```python
# Check rate limit headers
response = requests.get(f"{base_url}/models", headers=headers)
remaining = response.headers.get('X-RateLimit-Remaining')
print(f"Requests remaining: {remaining}")
```

### Token Refresh

```python
# Refresh expired token
refresh_response = requests.post(f"{base_url}/auth/refresh", json={
    "refresh_token": "your-refresh-token"
})
new_token = refresh_response.json()["access_token"]
```

## 🆘 Getting Help

### Common Issues

1. **401 Unauthorized**

   - Check your username/password
   - Ensure your token hasn't expired
   - Verify the token format: `Bearer <token>`

2. **422 Validation Error**

   - Review the error details for specific field issues
   - Check data types and value ranges
   - Ensure all required fields are provided

3. **429 Too Many Requests**
   - Implement exponential backoff
   - Check your rate limit headers
   - Consider upgrading your plan

### Support Channels

- **Email**: support@finvision.com
- **Documentation**: `/api/v1/docs/`
- **GitHub Issues**: Report bugs and feature requests
- **Community Forum**: Connect with other developers

## 🎉 Next Steps

1. **Explore the Documentation**: Visit `/api/v1/docs/` for detailed guides
2. **Try the Examples**: Use our Postman collection for hands-on testing
3. **Join the Community**: Connect with other developers
4. **Build Something**: Start integrating the API into your applications

---

**Ready to get started?** Visit `/api/v1/docs/` for the complete documentation!

_Last updated: January 2024_
_API Version: 1.0.0_
