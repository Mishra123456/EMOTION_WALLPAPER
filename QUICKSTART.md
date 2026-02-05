# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8501
```

Replace with your actual Streamlit backend URL.

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 What's Next?

1. **Start your Streamlit backend** (if not already running)
2. **Upload an image** at `/upload`
3. **View detected emotion** at `/result`
4. **Generate and preview wallpaper** at `/preview`

## 🔧 Troubleshooting

**API Connection Issues?**
- Check that your Streamlit server is running
- Verify `NEXT_PUBLIC_API_URL` matches your backend URL
- Check browser console for CORS errors

**Build Errors?**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

For more details, see [README.md](./README.md)




