import requests
import os

def verify():
    url = "http://localhost:8000/api/emotion"
    
    # Dynamically find an image
    wallpaper_dir = "public/wallpapers"
    test_file = None
    
    if os.path.exists(wallpaper_dir):
        files = [f for f in os.listdir(wallpaper_dir) if f.endswith(('.jpg', '.png'))]
        if files:
            test_file = os.path.join(wallpaper_dir, files[0])
            
    if not test_file:
        print("No test images found in public/wallpapers. Trying root...")
        root_files = [f for f in os.listdir(".") if f.endswith(('.jpg', '.png'))]
        if root_files:
            test_file = root_files[0]

    if not test_file:
        print("❌ No test images found at all.")
        return

    print(f"Testing {url} with {test_file}...")
    try:
        with open(test_file, 'rb') as f:
            r = requests.post(url, files={'file': f}, timeout=10)
        
        print(f"Status: {r.status_code}")
        print(f"X-Detected-Emotion: {r.headers.get('X-Detected-Emotion')}")
        print(f"Access-Control-Allow-Origin: {r.headers.get('Access-Control-Allow-Origin')}")
        
        if r.status_code == 200:
            print("✅ API is responding correctly.")
        if r.headers.get('Access-Control-Allow-Origin') == '*':
            print("✅ CORS headers are present.")
        if r.headers.get('X-Detected-Emotion'):
            print(f"✅ Emotion detected: {r.headers.get('X-Detected-Emotion')}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    verify()
