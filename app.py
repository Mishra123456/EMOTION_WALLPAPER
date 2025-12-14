from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from PIL import Image, ImageDraw
import numpy as np
import random
import io
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification

app = FastAPI()

MODEL_NAME = "trpakov/vit-face-expression"
processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)

EMOTIONS = ["angry","disgust","fear","happy","sad","surprise","neutral"]

PALETTES = {
    "happy": [(255,210,120),(255,180,90),(255,140,70),(255,230,160)],
    "sad": [(10,25,60),(25,50,90),(60,90,130),(100,130,160)],
    "angry": [(90,0,0),(150,20,20),(200,40,40),(255,80,80)],
    "fear": [(5,15,35),(20,40,70),(40,70,110),(80,110,140)],
    "surprise": [(250,220,130),(240,170,200),(190,140,255),(160,120,230)],
    "disgust": [(70,80,40),(100,120,70),(140,160,100),(170,190,130)],
    "neutral": [(210,210,210),(180,180,180),(150,150,150),(120,120,120)]
}

def detect_emotion(img):
    inputs = processor(images=img, return_tensors="pt")
    with torch.no_grad():
        logits = model(**inputs).logits
    probs = torch.softmax(logits, dim=1)[0]
    idx = int(probs.argmax())
    return EMOTIONS[idx]

def gradient(img, c1, c2):
    w,h = img.size
    for y in range(h):
        t = y / h
        col = tuple(int(c1[i]*(1-t) + c2[i]*t) for i in range(3))
        img.paste(col, (0,y,w,y+1))
    return img

def soft_shapes(img, colors):
    draw = ImageDraw.Draw(img, "RGBA")
    w,h = img.size
    for _ in range(12):
        r = random.randint(200,450)
        x = random.randint(-r,w+r)
        y = random.randint(-r,h+r)
        draw.ellipse((x,y,x+r,y+r), fill=random.choice(colors)+(50,))
    return img

STYLE_RECIPES = [
    lambda i,c: gradient(i,c[0],c[1]),
    lambda i,c: gradient(i,c[1],c[2]),
    lambda i,c: soft_shapes(i,c),
    lambda i,c: soft_shapes(gradient(i,c[2],c[3]),c),
    lambda i,c: gradient(soft_shapes(i,c),c[3],c[0]),
]

def generate_wallpaper(mood):
    img = Image.new("RGB",(1920,1080),PALETTES[mood][0])
    style = random.choice(STYLE_RECIPES)
    img = style(img, PALETTES[mood])
    return img

@app.post("/generate")
async def generate(file: UploadFile = File(...)):
    img = Image.open(file.file).convert("RGB")
    mood = detect_emotion(img)
    wallpaper = generate_wallpaper(mood)

    buf = io.BytesIO()
    wallpaper.save(buf, format="PNG")
    buf.seek(0)

    return Response(
        content=buf.read(),
        media_type="image/png"
    )
