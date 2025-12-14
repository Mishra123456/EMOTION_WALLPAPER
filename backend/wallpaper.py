# backend/wallpaper.py
import random
import numpy as np
from PIL import Image, ImageDraw

PALETTES = {
    "happy": [(255,210,120),(255,180,90),(255,140,70),(255,230,160)],
    "sad": [(10,25,60),(25,50,90),(60,90,130),(100,130,160)],
    "angry": [(90,0,0),(150,20,20),(200,40,40),(255,80,80)],
    "fear": [(5,15,35),(20,40,70),(40,70,110),(80,110,140)],
    "surprise": [(250,220,130),(240,170,200),(190,140,255),(160,120,230)],
    "disgust": [(70,80,40),(100,120,70),(140,160,100),(170,190,130)],
    "neutral": [(210,210,210),(180,180,180),(150,150,150),(120,120,120)]
}

# ---------- STYLE FUNCTIONS ----------

def gradient(img, c1, c2, vertical=True):
    w, h = img.size
    for i in range(h if vertical else w):
        t = i / (h if vertical else w)
        col = tuple(int(c1[j]*(1-t) + c2[j]*t) for j in range(3))
        if vertical:
            img.paste(col, (0, i, w, i+1))
        else:
            img.paste(col, (i, 0, i+1, h))
    return img

def layered_panels(img, colors):
    w, h = img.size
    d = ImageDraw.Draw(img)
    for i in range(6):
        x = int(i * w / 6)
        d.rectangle((x, 0, x + w//3, h), fill=colors[i % len(colors)])
    return img

def light_beams(img, colors):
    w, h = img.size
    d = ImageDraw.Draw(img, "RGBA")
    for _ in range(12):
        x = random.randint(-300, w)
        d.rectangle((x, 0, x+200, h), fill=random.choice(colors)+(35,))
    return img

def soft_shapes(img, colors):
    w, h = img.size
    d = ImageDraw.Draw(img, "RGBA")
    for _ in range(10):
        r = random.randint(250, 450)
        x = random.randint(-r, w+r)
        y = random.randint(-r, h+r)
        d.ellipse((x, y, x+r, y+r), fill=random.choice(colors)+(45,))
    return img

def grain(img):
    arr = np.array(img).astype(np.int16)
    noise = np.random.normal(0, 6, arr.shape)
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

STYLE_RECIPES = [
    lambda i,c: gradient(i,c[0],c[1],True),
    lambda i,c: gradient(i,c[1],c[2],False),
    lambda i,c: layered_panels(i,c),
    lambda i,c: light_beams(i,c),
    lambda i,c: soft_shapes(i,c),
    lambda i,c: grain(i),
    lambda i,c: grain(soft_shapes(i,c)),
    lambda i,c: grain(light_beams(i,c)),
    lambda i,c: gradient(soft_shapes(i,c),c[2],c[3],True),
    lambda i,c: gradient(light_beams(i,c),c[0],c[2],False),
    lambda i,c: layered_panels(grain(i),c),
    lambda i,c: soft_shapes(grain(i),c),
    lambda i,c: light_beams(grain(i),c),
    lambda i,c: gradient(grain(i),c[1],c[3],True),
    lambda i,c: gradient(grain(i),c[3],c[0],False),
    lambda i,c: soft_shapes(layered_panels(i,c),c),
    lambda i,c: light_beams(layered_panels(i,c),c),
    lambda i,c: grain(layered_panels(i,c)),
    lambda i,c: gradient(i,c[2],c[0],True),
    lambda i,c: gradient(i,c[3],c[1],False),
]

# ---------- MAIN GENERATOR ----------

def generate_wallpaper(mood: str, seed: int | None = None):
    if seed is not None:
        random.seed(seed)
        np.random.seed(seed)

    size = (1920, 1080)
    palette = PALETTES[mood]
    img = Image.new("RGB", size, palette[0])

    style = random.choice(STYLE_RECIPES)
    img = style(img, palette)

    return img
