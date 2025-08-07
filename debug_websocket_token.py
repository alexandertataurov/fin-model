#!/usr/bin/env python3

import jwt
from datetime import datetime

def analyze_websocket_token():
    """Analyze the WebSocket token from the latest error"""
    
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTQ1OTY4MTcsInN1YiI6IjMiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzU0NTk1MDE3fQ.43GEDsSzbjVzMeHBdUKNOGBi_cu8GKZXqKMnXROVqZA"
    
    print("=== WebSocket Token Analysis ===")
    print(f"Token: {token[:50]}...")
    
    try:
        # Decode token without verification to see contents
        decoded = jwt.decode(token, options={"verify_signature": False})
        
        print("\nToken payload:")
        for key, value in decoded.items():
            if key == 'exp':
                exp_time = datetime.fromtimestamp(value)
                now = datetime.now()
                is_expired = exp_time <= now
                print(f"  {key}: {value} ({exp_time}) {'[EXPIRED]' if is_expired else '[VALID]'}")
            elif key == 'iat':
                iat_time = datetime.fromtimestamp(value)
                print(f"  {key}: {value} ({iat_time})")
            else:
                print(f"  {key}: {value}")
        
        # Check token validity
        exp_time = datetime.fromtimestamp(decoded.get('exp', 0))
        now = datetime.now()
        
        if exp_time <= now:
            print(f"\n❌ Token is EXPIRED")
            print(f"   Expired: {exp_time}")
            print(f"   Current: {now}")
            print(f"   Difference: {now - exp_time}")
        else:
            print(f"\n✅ Token is VALID")
            print(f"   Expires: {exp_time}")
            print(f"   Time remaining: {exp_time - now}")
            
    except Exception as e:
        print(f"❌ Token decode error: {e}")

if __name__ == "__main__":
    analyze_websocket_token()