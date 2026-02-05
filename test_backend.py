import requests
import os
import sys

def test_api():
    url = "http://127.0.0.1:8000/api/emotion"
    # Find any image in the project to test
    test_image = "public/wallpapers/happy_0.jpg"
    
    if not os.path.exists(test_image):
        print(f"Test image not found at {test_image}")
        return

    print(f"Testing API with {test_image}...")
    try:
        with open(test_image, 'rb') as f:
            r = requests.post(url, files={'file': f}, timeout=10)
        
        print(f"Status: {r.status_code}")
        print(f"Emotion: {r.headers.get('X-Detected-Emotion')}")
        print(f"Response size: {len(r.content)} bytes")
        
        if r.status_code == 200 and r.headers.get('X-Detected-Emotion'):
            print("✅ TEST PASSED")
        else:
            print("❌ TEST FAILED")
    except Exception as e:
        print(f"❌ TEST ERROR: {e}")

if __name__ == "__main__":
    test_api()
