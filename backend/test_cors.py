#!/usr/bin/env python3
"""
Test script to verify CORS configuration
"""

import requests


def test_cors_configuration():
    """Test CORS configuration on the deployed API."""
    
    # Test URLs
    base_url = "https://fin-model-production.up.railway.app"
    test_urls = [
        f"{base_url}/health",
        f"{base_url}/cors-debug",
        f"{base_url}/api/v1/",
    ]
    
    # Test headers that should be present
    expected_headers = [
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods", 
        "Access-Control-Allow-Headers",
    ]
    
    print("🔍 Testing CORS Configuration...")
    print(f"Base URL: {base_url}")
    print("-" * 50)
    
    for url in test_urls:
        print(f"\n📡 Testing: {url}")
        try:
            # Test GET request
            response = requests.get(url, timeout=10)
            print(f"✅ Status: {response.status_code}")
            
            # Check CORS headers
            cors_headers = {}
            for header in expected_headers:
                if header in response.headers:
                    cors_headers[header] = response.headers[header]
                    print(f"✅ {header}: {response.headers[header]}")
                else:
                    print(f"❌ {header}: Missing")
            
            # Print response content for debug endpoint
            if "cors-debug" in url:
                try:
                    content = response.json()
                    print("📋 CORS Debug Info:")
                    print(f"   Origins: {content.get('cors_origins', 'N/A')}")
                    print(f"   Raw Origins: {content.get('raw_cors_origins', 'N/A')}")
                except Exception:
                    response_text = response.text[:200]
                    print(f"📋 Response: {response_text}...")
                    
        except requests.exceptions.RequestException as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 CORS Test Complete")
    
    # Test OPTIONS request (preflight)
    print("\n🔄 Testing OPTIONS preflight request...")
    try:
        response = requests.options(f"{base_url}/health", timeout=10)
        print(f"✅ OPTIONS Status: {response.status_code}")
        
        for header in expected_headers:
            if header in response.headers:
                print(f"✅ {header}: {response.headers[header]}")
            else:
                print(f"❌ {header}: Missing")
                
    except requests.exceptions.RequestException as e:
        print(f"❌ OPTIONS Error: {e}")


if __name__ == "__main__":
    test_cors_configuration()
