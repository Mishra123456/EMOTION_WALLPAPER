import cv2
import time
import os

print("Starting minimal load test...")
model_path = "emotion-ferplus-8.onnx"

if not os.path.exists(model_path):
    print(f"❌ Model missing: {model_path}")
    exit(1)

size = os.path.getsize(model_path)
print(f"Model size: {size / (1024*1024):.2f} MB")

start = time.time()
try:
    net = cv2.dnn.readNetFromONNX(model_path)
    print(f"✅ Loaded successfully in {time.time() - start:.2f}s")
except Exception as e:
    print(f"❌ Failed to load: {e}")
