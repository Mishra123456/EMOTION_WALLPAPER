import requests
import io
import time

def verify_live():
    url = "http://localhost:8000/api/emotion"
    print(f"Connecting to {url}...")
    
    # Create dummy image
    dummy_data = b'\x00' * 1024 # Just random bytes, might fail validation but should hit server
    # Better: valid minimal jpeg header?
    # Let's just use a simple robust check: root health check first
    
    try:
        r = requests.get("http://localhost:8000/")
        print(f"Root status: {r.status_code}") # Should be 404 or 200 depending on app.py routes
    except Exception as e:
        print(f"❌ Root check failed: {e}")
        return

    # Now post
    # minimal transparent 1x1 gif or something?
    # or just use the local test file if exists
    # let's try to pass an empty file and expect 400 or 500, but CONNECTED
    
    try:
        files = {'file': ('test.txt', io.BytesIO(b'test'), 'text/plain')}
        r = requests.post(url, files=files, timeout=5)
        print(f"POST Status: {r.status_code}")
        print(f"Response: {r.text[:200]}")
        print(f"CORS: {r.headers.get('Access-Control-Allow-Origin')}")
        
    except Exception as e:
        print(f"❌ POST failed: {e}")

if __name__ == "__main__":
    verify_live()
