#!/usr/bin/env python3

import requests
import json
from datetime import datetime, timedelta
import jwt
import os

# Railway backend URL
BACKEND_URL = "https://fin-model-production.up.railway.app"

def test_auth_flow():
    """Test the complete authentication flow"""
    print("Testing authentication flow...")
    
    # Test user credentials
    timestamp = int(datetime.now().timestamp())
    test_email = f"test_{timestamp}@example.com"
    test_username = f"test_{timestamp}"  # Username without @ symbol
    test_password = "TestPassword123!"  # Must be at least 12 chars with uppercase
    
    print(f"Using test email: {test_email}")
    print(f"Using test username: {test_username}")
    
    # 1. Register test user
    print("\n1. Testing user registration...")
    register_data = {
        "username": test_username,  # Username without special chars
        "email": test_email,
        "password": test_password,
        "full_name": "Test User"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/v1/auth/register",
            json=register_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"   Registration status: {response.status_code}")
        if response.status_code != 201:
            print(f"   Registration failed: {response.text}")
            # Try login instead
            print("\nTrying login instead...")
            login_data = {
                "email": test_email,
                "password": test_password,
                "remember_me": False
            }
            response = requests.post(
                f"{BACKEND_URL}/api/v1/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            print(f"   Login status: {response.status_code}")
            if response.status_code != 200:
                print(f"   Login failed: {response.text}")
                return None, None
        
        auth_response = response.json() if response.status_code in [200, 201] else None
        
        # If registration succeeded but no token, try login
        if response.status_code == 201 and (not auth_response or "access_token" not in auth_response):
            print(f"   Registration successful, attempting login...")
            login_data = {
                "email": test_email,
                "password": test_password,
                "remember_me": False
            }
            response = requests.post(
                f"{BACKEND_URL}/api/v1/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            print(f"   Login status: {response.status_code}")
            if response.status_code != 200:
                print(f"   Login failed: {response.text}")
                return None, None
            auth_response = response.json()
        
        if not auth_response or "access_token" not in auth_response:
            print(f"   No access token in response: {auth_response}")
            return None, None
            
        access_token = auth_response["access_token"]
        print(f"   Got access token: {access_token[:50]}...")
        
        # 2. Decode and validate token
        print("\n2. Validating token...")
        try:
            # Decode without verification first to see contents
            decoded = jwt.decode(access_token, options={"verify_signature": False})
            print(f"   Token payload: {json.dumps(decoded, indent=2, default=str)}")
            
            # Check expiration
            if 'exp' in decoded:
                exp_time = datetime.fromtimestamp(decoded['exp'])
                now = datetime.now()
                if exp_time <= now:
                    print(f"   Token expired! Expires: {exp_time}, Now: {now}")
                else:
                    print(f"   Token valid until: {exp_time}")
            
        except Exception as e:
            print(f"   Token decode error: {e}")
        
        # 3. Test API endpoint with token
        print("\n3. Testing authenticated API call...")
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{BACKEND_URL}/api/v1/notifications/preferences",
            headers=headers,
            timeout=10
        )
        print(f"   Preferences endpoint status: {response.status_code}")
        if response.status_code == 200:
            print("   Preferences endpoint working!")
        else:
            print(f"   Preferences endpoint failed: {response.text}")
        
        # 4. Test notifications list
        print("\n4. Testing notifications list...")
        response = requests.get(
            f"{BACKEND_URL}/api/v1/notifications/?page=1&limit=10",
            headers=headers,
            timeout=10
        )
        print(f"   Notifications list status: {response.status_code}")
        if response.status_code == 200:
            print("   Notifications list working!")
        else:
            print(f"   Notifications list failed: {response.text}")
        
        return access_token, test_email
        
    except requests.exceptions.RequestException as e:
        print(f"   Network error: {e}")
        return None, None

def test_websocket_token(access_token):
    """Test WebSocket connection with token"""
    print(f"\nTesting WebSocket token validation...")
    print(f"   Token for WebSocket: {access_token[:50]}...")
    
    # The WebSocket logs show this specific token being rejected
    # Let's decode it to see what's wrong
    try:
        decoded = jwt.decode(access_token, options={"verify_signature": False})
        print(f"   WebSocket token payload:")
        for key, value in decoded.items():
            if key == 'exp':
                exp_time = datetime.fromtimestamp(value)
                print(f"     {key}: {value} ({exp_time})")
            else:
                print(f"     {key}: {value}")
        
        # Check if token matches the one in logs
        sample_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTQ1OTM3ODIsInN1YiI6IjMiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzU0NTkxOTgyfQ.6D_4BbLDrmQH7y_eXHUqZCxoez54LiS2rnAPvD2Tu_Q"
        if access_token == sample_token:
            print("   This matches the token being rejected in logs!")
        
    except Exception as e:
        print(f"   Token decode error: {e}")

if __name__ == "__main__":
    print("Authentication Flow Test")
    print("=" * 50)
    
    # Test the token that's failing in logs
    print("\nTesting token from logs...")
    log_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTQ1OTM3ODIsInN1YiI6IjMiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzU0NTkxOTgyfQ.6D_4BbLDrmQH7y_eXHUqZCxoez54LiS2rnAPvD2Tu_Q"
    test_websocket_token(log_token)
    
    # Test API endpoint with this token
    headers = {
        "Authorization": f"Bearer {log_token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/v1/notifications/preferences",
            headers=headers,
            timeout=10
        )
        print(f"\nAPI test with log token:")
        print(f"   Status: {response.status_code}")
        if response.status_code != 200:
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   Error: {e}")
    
    print("\n" + "="*50)
    access_token, test_email = test_auth_flow()
    
    if access_token:
        test_websocket_token(access_token)
        print(f"\nTest completed successfully!")
        print(f"Test email: {test_email}")
        print(f"Access token: {access_token}")
    else:
        print(f"\nAuthentication flow failed!")