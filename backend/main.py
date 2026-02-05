from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
import io

from model import detect_emotion
from wallpaper import generate_wallpaper

app = FastAPI(
    title="Emotion Wallpaper API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- EMOTION PREDICTION --------------------

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Detect emotion from a face image
    """
    img = Image.open(file.file).convert("RGB")
    mood, confidence = detect_emotion(img)

    return {
        "mood": mood,
        "confidence": round(confidence, 3)
    }

# -------------------- WALLPAPER GENERATION --------------------

@app.post("/wallpaper")
async def wallpaper(
    file: UploadFile = File(...),
    seed: int | None = Query(
        default=None,
        description="Optional seed for reproducible wallpapers"
    ),
):
    """
    Generate a premium wallpaper based on detected emotion.
    Uses 20+ randomized styles per emotion.
    """
    img = Image.open(file.file).convert("RGB")

    # Detect mood again (keeps API stateless)
    mood, _ = detect_emotion(img)

    # Generate rich wallpaper (20-style engine)
    wp = generate_wallpaper(mood, seed=seed)

    buf = io.BytesIO()
    wp.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="image/png",
        headers={
            "X-Mood": mood,
            "X-Seed": str(seed) if seed is not None else "random"
        }
    )
