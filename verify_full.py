import requests
import io
import os
from PIL import Image
import numpy as np

def verify_full():
    url = "http://localhost:8000/api/emotion"
    
    # 1. Use existing test_face.jpg
    test_file = "test_face.jpg"
    if not os.path.exists(test_file):
        print("Test file missing!")
        return

    print("Testing Full Flow...")
    try:
        with open(test_file, 'rb') as f:
            files = {'file': (test_file, f, 'image/jpeg')}
            headers = {'Origin': 'http://localhost:3000'}
        
            r = requests.post(url, files=files, headers=headers, timeout=10)
        
        print(f"Status: {r.status_code}")
        print(f"CORS Header: {r.headers.get('access-control-allow-origin')}")
        print(f"Emotion Header: {r.headers.get('X-Detected-Emotion')}")
        
        if r.status_code == 200:
            print("✅ 200 OK")
        else:
            print(f"❌ Status {r.status_code}: {r.text}")
            
        if r.headers.get('access-control-allow-origin') == '*':
            print("✅ CORS OK")
        else:
            print(f"❌ CORS MISSING: {r.headers}")

    except Exception as e:
        print(f"❌ FAILED: {e}")

if __name__ == "__main__":
    verify_full()
