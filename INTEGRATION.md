# Backend Integration Guide

## 🔌 Connecting to Streamlit Backend

This frontend application is designed to work with a Streamlit backend server that provides emotion detection and wallpaper generation capabilities.

## 📡 API Endpoints

### Required Endpoint: `/analyze`

**Method**: `POST`  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "image": "base64_encoded_image_string"
}
```

**Response**:
```json
{
  "emotion": "happy",
  "confidence": 0.95
}
```

**Implementation Location**: `lib/api.ts` → `analyzeImage()`

### Optional Endpoint: `/generate`

**Method**: `POST`  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "emotion": "happy",
  "image": "base64_encoded_image_string",
  "seed": 12345,
  "title": "Happy Wallpaper",
  "resolution": "1920x1080"
}
```

**Response**:
```json
{
  "image": "base64_encoded_wallpaper",
  "seed": 12345,
  "title": "Happy Wallpaper"
}
```

**Implementation Location**: `lib/api.ts` → `generateWallpaper()`

**Note**: If this endpoint returns 404, the app will automatically redirect to the Streamlit UI with query parameters.

## 🔄 Integration Flow

### 1. Image Upload → Analysis
```
User uploads image
  ↓
Convert to base64 (lib/api.ts: fileToBase64)
  ↓
POST /analyze with base64 image
  ↓
Display emotion + confidence (app/result/page.tsx)
```

### 2. Emotion → Wallpaper Generation
```
User confirms/edits emotion
  ↓
POST /generate with emotion + image
  ↓
If 404: Redirect to Streamlit UI with params
If success: Display wallpaper preview (app/preview/page.tsx)
```

## ⚙️ Configuration

### Environment Variable

Set `NEXT_PUBLIC_API_URL` in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8501
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-streamlit-app.herokuapp.com
```

### API URL Resolution

The app uses this priority:
1. `process.env.NEXT_PUBLIC_API_URL` (from `.env.local`)
2. Default: `http://localhost:8501`

**Location**: `lib/api.ts` line 3

## 🔧 Streamlit Backend Requirements

### CORS Configuration

Your Streamlit backend must allow requests from your frontend domain. Add to your Streamlit app:

```python
import streamlit as st
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Expected Response Format

Ensure your backend returns JSON in the exact format shown above. The frontend expects:
- `emotion`: string (e.g., "happy", "calm", "energetic")
- `confidence`: number between 0 and 1

## 🧪 Testing the Integration

### 1. Test Analyze Endpoint

```bash
# Using curl
curl -X POST http://localhost:8501/analyze \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_image_string"}'
```

### 2. Test Generate Endpoint

```bash
curl -X POST http://localhost:8501/generate \
  -H "Content-Type: application/json" \
  -d '{
    "emotion": "happy",
    "image": "base64_image_string",
    "resolution": "1920x1080"
  }'
```

## 🐛 Troubleshooting

### CORS Errors
- Add your frontend URL to backend CORS allowed origins
- Check browser console for specific CORS error messages

### 404 Errors
- Verify the endpoint paths match exactly (`/analyze`, `/generate`)
- Check that your Streamlit server is running
- Verify `NEXT_PUBLIC_API_URL` is correct

### Timeout Errors
- Increase timeout in `lib/api.ts` (currently 30s for analyze, 60s for generate)
- Check backend server performance

### Base64 Encoding Issues
- The frontend automatically handles base64 encoding
- Ensure backend expects base64 without data URL prefix
- Check `lib/api.ts:fileToBase64()` for encoding logic

## 📝 Code Examples

### Using the API in Your Components

```typescript
import { analyzeImage, generateWallpaper, fileToBase64 } from '@/lib/api';

// In your component
const handleUpload = async (file: File) => {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    // Analyze emotion
    const result = await analyzeImage(base64);
    console.log('Emotion:', result.emotion);
    console.log('Confidence:', result.confidence);
    
    // Generate wallpaper
    const wallpaper = await generateWallpaper({
      emotion: result.emotion,
      image: base64,
      resolution: '1920x1080'
    });
    
    // Use wallpaper.image (base64) or redirect URL
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

## 🔐 Security Considerations

1. **API URL**: Never commit `.env.local` to version control
2. **Image Size**: Frontend limits uploads to 10MB (configurable in `components/UploadBox.tsx`)
3. **Base64**: Large images can create very long base64 strings - consider compression
4. **Rate Limiting**: Implement rate limiting on your backend

## 📚 Additional Resources

- See `lib/api.ts` for full API implementation
- See `app/upload/page.tsx` for upload flow
- See `app/result/page.tsx` for analysis display
- See `app/preview/page.tsx` for wallpaper preview




