import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

MODEL_NAME = "trpakov/vit-face-expression"

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
model.eval()

EMOTIONS = ["angry","disgust","fear","happy","sad","surprise","neutral"]

def detect_emotion(img: Image.Image):
    inputs = processor(images=img, return_tensors="pt")
    with torch.no_grad():
        logits = model(**inputs).logits

    probs = torch.softmax(logits, dim=1)[0]
    idx = int(probs.argmax())
    return EMOTIONS[idx], float(probs[idx])
