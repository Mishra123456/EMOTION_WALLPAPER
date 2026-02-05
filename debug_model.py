import cv2
import numpy as np
import os

def test_model():
    model_path = "emotion-ferplus-8.onnx"
    img_path = "test_face.jpg"
            
    print(f"Testing with image: {img_path}")
    
    # Load model
    net = cv2.dnn.readNetFromONNX(model_path)
    
    # Load and preprocess image
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print("Failed to load image")
        return

    # Resize to 64x64
    resized = cv2.resize(img, (64, 64))
    
    # Define labels
    labels = ['neutral', 'happy', 'surprise', 'sad', 'angry', 'disgust', 'fear', 'contempt']

    # TEST 1: Raw 0-255 (Current App Logic)
    blob1 = cv2.dnn.blobFromImage(resized, 1.0, (64, 64), (0, 0, 0), swapRB=False, crop=False)
    net.setInput(blob1)
    scores1 = net.forward()[0]
    softmax1 = np.exp(scores1) / np.sum(np.exp(scores1))
    
    # TEST 2: Normalized [0-1] (Likely Correct)
    blob2 = cv2.dnn.blobFromImage(resized, 1.0/255.0, (64, 64), (0, 0, 0), swapRB=False, crop=False)
    net.setInput(blob2)
    scores2 = net.forward()[0]
    softmax2 = np.exp(scores2) / np.sum(np.exp(scores2))

    with open("debug_log.txt", "w", encoding="utf-8") as f:
        f.write(f"Testing with image: {img_path}\n")
        f.write("\n--- TEST 1: Raw [0-255] ---\n")
        for i, label in enumerate(labels):
            f.write(f"{label}: {scores1[i]:.4f} ({softmax1[i]*100:.1f}%)\n")
        f.write(f"Result: {labels[np.argmax(scores1)]}\n")

        f.write("\n--- TEST 2: Normalized [0-1] ---\n")
        for i, label in enumerate(labels):
            f.write(f"{label}: {scores2[i]:.4f} ({softmax2[i]*100:.1f}%)\n")
        f.write(f"Result: {labels[np.argmax(scores2)]}\n")
    
    print("Logged to debug_log.txt")

if __name__ == "__main__":
    test_model()
