#!/usr/bin/env python3
"""
Test script to verify CORS and API fixes
"""

import requests
import json

def test_api_endpoints():
    """Test API endpoints to verify fixes."""
    
    base_url = "https://fin-model-production.up.railway.app"
    
    print("🔍 Testing API Endpoints...")
    print(f"Base URL: {base_url}")
    print("-" * 50)
    
    # Test endpoints
    endpoints = [
        "/",
        "/health", 
        "/cors-debug",
        "/api/v1/"
    ]
    
    for endpoint in endpoints:
        url = f"{base_url}{endpoint}"
        print(f"\n📡 Testing: {url}")
        
        try:
            response = requests.get(url, timeout=10)
            print(f"✅ Status: {response.status_code}")
            
            # Check CORS headers
            cors_headers = [
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Methods",
                "Access-Control-Allow-Headers"
            ]
            
            for header in cors_headers:
                if header in response.headers:
                    print(f"✅ {header}: {response.headers[header]}")
                else:
                    print(f"❌ {header}: Missing")
            
            # Print response for debug endpoint
            if "cors-debug" in endpoint:
                try:
                    content = response.json()
                    print("📋 CORS Debug Info:")
                    print(f"   Origins: {content.get('cors_origins', 'N/A')}")
                except:
                    print(f"📋 Response: {response.text[:200]}...")
                    
        except requests.exceptions.RequestException as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 API Test Complete")

def test_cors_preflight():
    """Test CORS preflight requests."""
    
    base_url = "https://fin-model-production.up.railway.app"
    
    print("\n🔄 Testing CORS Preflight...")
    
    # Test OPTIONS request
    try:
        response = requests.options(f"{base_url}/health", timeout=10)
        print(f"✅ OPTIONS Status: {response.status_code}")
        
        expected_headers = [
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods", 
            "Access-Control-Allow-Headers"
        ]
        
        for header in expected_headers:
            if header in response.headers:
                print(f"✅ {header}: {response.headers[header]}")
            else:
                print(f"❌ {header}: Missing")
                
    except requests.exceptions.RequestException as e:
        print(f"❌ OPTIONS Error: {e}")

if __name__ == "__main__":
    test_api_endpoints()
    test_cors_preflight()
