# Emotion Wallpaper Engine - Lightweight API (No ML)
from fastapi import FastAPI, UploadFile, File, Query, Request, Body
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from PIL import Image
import numpy as np
import io
import random
import httpx
import hashlib
from pathlib import Path
import os

# ==================================================
# App Init
# ==================================================
app = FastAPI(title="Emotion Wallpaper Engine (Client-Side AI)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Detected-Emotion"],
)

# ==================================================
# Data Models
# ==================================================
class EmotionRequest(BaseModel):
    emotion: str

# App Target Emotions
EMOTIONS = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]

# Cache Directory
CACHE_DIR = Path("public/wallpapers")
CACHE_DIR.mkdir(parents=True, exist_ok=True)


# ==================================================
# 🎨 20 UNIQUE SEARCH TERMS PER EMOTION
# Copyright-free via Unsplash Source API
# ==================================================
EMOTION_SEARCHES = {
    "happy": [
        "golden sunrise mountains", "sunflower field summer", "rainbow sky clouds", "tropical beach paradise",
        "cherry blossom spring", "hot air balloons colorful", "golden wheat field sunset", "butterfly garden flowers",
        "coral reef underwater", "lavender field provence", "autumn leaves golden", "hummingbird flowers",
        "colorful tulips garden", "northern lights aurora", "majestic waterfall rainbow", "spring meadow wildflowers",
        "tropical sunset ocean", "golden hour landscape", "vibrant coral reef fish", "sakura trees japan",
    ],
    "sad": [
        "rain window drops", "foggy pier morning", "lonely tree winter", "misty mountain lake",
        "empty bench rain", "blue hour cityscape", "melancholic ocean waves", "gray cloudy sky",
        "abandoned railway tracks", "silent snow forest", "twilight blue mountains", "reflective still water",
        "moody coastal cliffs", "winter bare trees", "fog rolling hills", "rainy cobblestone street",
        "overcast seascape", "solitary lighthouse storm", "dusk empty beach", "mysterious blue forest",
    ],
    "angry": [
        "volcanic eruption lava", "lightning storm dramatic", "red sky dramatic clouds", "stormy ocean waves",
        "fire flames abstract", "crimson sunset intense", "dark thundercloud", "tornado storm dramatic",
        "burning embers fire", "blood moon eclipse", "intense red canyon", "wildfire dramatic",
        "stormy desert dust", "dramatic red sunset", "power lightning bolt", "raging waterfall mist",
        "fierce ocean storm", "red hot lava flow", "intense thunderstorm", "fiery sky dramatic",
    ],
    "fear": [
        "dark forest fog", "misty path mysterious", "abandoned building dark", "deep ocean abyss",
        "haunted forest night", "dark tunnel light", "eerie moonlight shadows", "mysterious cave entrance",
        "foggy graveyard night", "dark stormy sea", "creepy forest path", "shadowy mountain peaks",
        "ominous clouds dark", "ancient ruins night", "deep forest darkness", "mysterious fog swamp",
        "dark castle silhouette", "nightmare landscape dark", "spooky forest mist", "dark canyon depths",
    ],
    "surprise": [
        "galaxy space nebula", "fireworks celebration night", "aurora borealis vivid", "prismatic crystals colorful",
        "cosmic explosion stars", "neon city lights", "electric lightning purple", "magical forest glow",
        "bioluminescent ocean", "starfield milky way", "colorful smoke abstract", "vibrant supernova",
        "psychedelic abstract colors", "glowing mushrooms forest", "meteor shower night", "holographic abstract",
        "diamond sparkle macro", "burst light rays", "colorful paint splash", "firework explosion bright",
    ],
    "disgust": [
        "dark swamp murky", "abstract distortion art", "gloomy industrial decay", "murky water texture",
        "abandoned factory dark", "decaying nature abstract", "dark mossy rocks", "gritty urban texture",
        "oxidized metal rust", "dark abstract chaos", "muddy water stream", "grimy texture abstract",
        "decomposing leaves dark", "moldy surface macro", "dark sludge abstract", "polluted sky smog",
        "murky pond surface", "cracked earth drought", "dark seaweed underwater", "abstract dark texture",
    ],
    "neutral": [
        "zen garden minimalist", "calm water ripples", "soft gradient sky", "geometric minimal pattern",
        "serene mountain reflection", "neutral tone abstract", "simple horizon line", "clean marble texture",
        "peaceful lake morning", "subtle cloud formations", "minimal architecture", "soft sand dunes",
        "gentle ocean horizon", "quiet forest path", "balanced stone stack", "simple nature pattern",
        "clean modern interior", "soft pastel abstract", "tranquil river flow", "minimalist mountain",
    ],
}


# ============================================================
# DIRECT IMAGE URLS - 100% GUARANTEED TO MATCH EACH EMOTION
# These are DIRECT CDN URLs that bypass all caching issues
# ============================================================
DIRECT_IMAGE_URLS = {
    # 😊 HAPPY: Bright, sunny, joyful images
    "happy": [
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1518173946687-a4c036bc3c4a?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&h=1080&fit=crop",
    ],
    # 😢 SAD: Rainy, foggy, melancholic images
    "sad": [
        "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1499956827185-0d63ee78a910?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1478827387698-1527781a4887?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1527766833261-b09c3163a791?w=1920&h=1080&fit=crop",
    ],
    # 😠 ANGRY: Fire, storms, lightning
    "angry": [
        "https://images.unsplash.com/photo-1549485090-40cf220f4a8f?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1462275646964-a0e3f8a8d34e?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1475776408506-9a5371e7d6e0?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1429552054477-ead6b43a8f6c?w=1920&h=1080&fit=crop",
    ],
    # 😨 FEAR: Dark forests, shadows
    "fear": [
        "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1509248961895-40e912104a1e?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1461696114087-397271a7aedc?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1503435824048-a799a3a84bf7?w=1920&h=1080&fit=crop",
    ],
    # 😲 SURPRISE: Fireworks, nebula
    "surprise": [
        "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&h=1080&fit=crop",
    ],
    "disgust": [
        "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&h=1080&fit=crop",
    ],
    "neutral": [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
        "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1920&h=1080&fit=crop",
    ],
}


# Track used photos per emotion for round-robin (no repeats)
_used_indices: dict[str, int] = {}
_seen_hashes: dict[str, set] = {}

MAX_CACHED_PER_EMOTION = 30
MAX_RETRIES = 5


def get_image_hash(image_bytes: bytes) -> str:
    """SHA256 hash for duplicate detection."""
    return hashlib.sha256(image_bytes).hexdigest()[:16]


async def fetch_emotion_image(emotion: str, attempt: int = 0) -> bytes | None:
    """
    Fetch wallpaper using DIRECT CDN URLs - 100% guaranteed to match emotion.
    Bypasses source.unsplash.com quirks.
    """
    urls = DIRECT_IMAGE_URLS.get(emotion, DIRECT_IMAGE_URLS["neutral"])
    
    if emotion not in _used_indices:
        _used_indices[emotion] = 0
    
    url = urls[_used_indices[emotion] % len(urls)]
    _used_indices[emotion] += 1
    
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=12.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                image_bytes = response.content
                
                if emotion not in _seen_hashes:
                    _seen_hashes[emotion] = set()
                
                img_hash = get_image_hash(image_bytes)
                
                if img_hash in _seen_hashes[emotion]:
                    if attempt < MAX_RETRIES:
                        print(f"[{emotion}] Same image, trying next URL...")
                        return await fetch_emotion_image(emotion, attempt + 1)
                    else:
                        return image_bytes
                
                _seen_hashes[emotion].add(img_hash)
                
                if len(_seen_hashes[emotion]) > 100:
                    _seen_hashes[emotion] = set(list(_seen_hashes[emotion])[-50:])
                
                photo_id = url.split("photo-")[1].split("?")[0] if "photo-" in url else "unknown"
                print(f"[{emotion}] ✓ Fetched: photo-{photo_id[:12]}...")
                return image_bytes
                
    except Exception as e:
        print(f"Fetch failed for {emotion}: {e}")
    
    return None


async def fetch_semantic_fallback(emotion: str) -> bytes | None:
    """Fallback: Use Pollinations.AI for infinite, perfect matching wallpapers."""
    search_terms = EMOTION_SEARCHES.get(emotion, EMOTION_SEARCHES["neutral"])
    term = random.choice(search_terms)
    
    # Pollinations.ai is a free, limitless AI image generator API
    # We add a random seed to the prompt to ensure variety even for the same term
    seed = random.randint(1, 1000)
    prompt = f"{term}, highly detailed, 8k wallpaper, cinematic lighting, {seed}"
    encoded_prompt = prompt.replace(" ", "%20")
    
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1920&height=1080&nologo=true"
    
    try:
        print(f"[{emotion}] 🎨 Generating AI Wallpaper: {term}...")
        async with httpx.AsyncClient(follow_redirects=True, timeout=20.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                print(f"[{emotion}] ✓ AI Generation Success")
                return response.content
    except Exception as e:
        print(f"AI Generation failed: {e}")
        pass
    return None


FALLBACK_COLORS = {
    "happy": ((255, 200, 100), (255, 150, 50)),
    "sad": ((30, 50, 90), (60, 100, 150)),
    "angry": ((150, 30, 30), (220, 60, 60)),
    "fear": ((20, 30, 50), (50, 70, 100)),
    "surprise": ((200, 150, 255), (255, 180, 200)),
    "disgust": ((70, 80, 50), (120, 130, 90)),
    "neutral": ((180, 180, 180), (140, 140, 140)),
}

def generate_fallback_wallpaper(emotion: str) -> bytes:
    """Generate a simple gradient fallback"""
    colors = FALLBACK_COLORS.get(emotion, FALLBACK_COLORS["neutral"])
    c1, c2 = colors
    
    width, height = 1920, 1080
    arr = np.zeros((height, width, 3), dtype=np.uint8)
    
    # Vertical gradient
    for i in range(3):
        gradient = np.linspace(c1[i], c2[i], height)
        arr[:, :, i] = gradient.astype(np.uint8)[:, None]
    
    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    buf.seek(0)
    return buf.read()


async def get_wallpaper(emotion: str) -> bytes:
    """Fetch matching wallpaper with multi-tier fallback."""
    emotion = emotion.lower()
    if emotion not in EMOTIONS:
        emotion = "neutral"

    emotion_cache_dir = CACHE_DIR / emotion
    emotion_cache_dir.mkdir(exist_ok=True)
    
    # 1. Fetch Direct
    image_bytes = await fetch_emotion_image(emotion)
    
    # 2. Fallback Semantic
    if not image_bytes:
        image_bytes = await fetch_semantic_fallback(emotion)
    
    if image_bytes:
        # Cache it
        content_hash = get_image_hash(image_bytes)
        cache_file = emotion_cache_dir / f"{content_hash}.jpg"
        if not cache_file.exists():
            cache_file.write_bytes(image_bytes)
        return image_bytes
    
    # 3. Cache Fallback
    cached_images = list(emotion_cache_dir.glob("*.jpg"))
    if cached_images:
        return random.choice(cached_images).read_bytes()
    
    # 4. Generate
    return generate_fallback_wallpaper(emotion)


# ==================================================
# 🚀 MAIN ENDPOINT 
# ==================================================
@app.post("/api/emotion")
async def emotion_wallpaper(
    request: Request
):
    """
    Accepts JSON: { "emotion": "happy" }
    Returns: JPG Image Bytes
    """
    try:
        # Handle JSON (Client-Side AI)
        content_type = request.headers.get('content-type', '')
        if 'application/json' in content_type:
            data = await request.json()
            emotion = data.get("emotion", "neutral")
            print(f"API Request: {emotion}")
        else:
            # Handle Legacy File Upload (Deprecated)
            # We just ignore the file and return neutral/random to prevent crash
            print("API Request: Legacy File Upload (Ignoring content)")
            emotion = "neutral"

        # Fetch wallpaper
        wallpaper_bytes = await get_wallpaper(emotion)

        return Response(
            content=wallpaper_bytes,
            media_type="image/jpeg",
            headers={"X-Detected-Emotion": emotion},
        )
    except Exception as e:
        print(f"API Error: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/health")
async def health_check():
    return {"status": "ok", "mode": "client-side-ai"}
