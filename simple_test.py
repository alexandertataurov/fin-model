import requests

def test_endpoints():
    base_url = "https://fin-model-production.up.railway.app"
    
    print("Testing endpoints...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        print(f"Health endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Health endpoint error: {e}")
    
    # Test notification preferences
    try:
        response = requests.get(f"{base_url}/api/v1/notifications/preferences", timeout=10)
        print(f"Notification preferences: {response.status_code}")
        if response.status_code == 401:
            print("Expected 401 for unauthenticated request")
        elif response.status_code == 200:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Notification preferences error: {e}")

if __name__ == "__main__":
    test_endpoints()
