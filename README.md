# 🎭 Emotion Wallpaper Engine (MoodCraft AI)

An AI-powered web application that detects your real-time emotion and instantaneously generates a stunning, personalized 4K wallpaper.

## ✨ Key Features

- **🧠 Client-Side AI**: Uses `face-api.js` to detect emotions (Happy, Sad, Angry, Surprised, etc.) directly in your browser. **Your video data never leaves your device.**
- **♾️ Infinite Wallpapers**: Powered by **Pollinations.ai Generative AI**. If a curated wallpaper isn't found, the app dreams up a brand new, unique image on the fly.
- **⚡ Zero Latency**: Emotion detection happens in milliseconds.
- **🎨 Modern UI**: Built with Glassmorphism, Framer Motion animations, and a responsive design.
- **🛠️ Lightweight Backend**: A simple FastAPI proxy that handles API requests without needing heavy GPU servers.

## 📸 Screenshots

![App Screenshot](https://via.placeholder.com/800x450?text=Emotion+Wallpaper+App+Demo)
*(Add your actual app execution screenshot here)*

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion.
- **AI (Vision)**: Face-API.js (TensorFlow.js wrapper).
- **AI (Generation)**: Pollinations.ai API.
- **Backend**: Python FastAPI (for proxying and logic).
- **Deployment**: Vercel (Frontend) + Render (Backend).

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+

### 1. Installation

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Running Locally

**Start Backend (Port 8000):**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**Start Frontend (Port 3000):**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 📦 Deployment

### Frontend (Vercel)
1. Push code to GitHub.
2. Import repo into Vercel.
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://your-app.onrender.com`)

### Backend (Render)
1. Create a new "Web Service" on Render.
2. Connect GitHub repo.
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn app:app --host 0.0.0.0 --port 10000`

## 🛡️ Privacy Note
This application utilizes **Client-Side Processing** for facial recognition. No video streams or face data are sent to any server. Only the detected emotion label (e.g., "happy") is sent to fetch the wallpaper.

---
Made with ❤️ by Mishra4561
