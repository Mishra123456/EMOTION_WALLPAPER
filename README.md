# MoodCraft AI – Emotion-Based Wallpaper Generator

A premium, production-ready web application that transforms emotions into stunning wallpapers using AI. Upload an image, detect the mood, and generate beautiful wallpapers with smooth gradients and cinematic effects.

![MoodCraft AI](https://via.placeholder.com/1200x600/0ea5e9/ffffff?text=MoodCraft+AI)

## ✨ Features

### Core Features
- **Image Upload**: Drag & drop or browse to upload images (.jpg, .png)
- **Webcam Capture**: Real-time camera capture for instant mood detection
- **Emotion Detection**: Advanced AI analyzes images to detect emotions with confidence scores
- **Wallpaper Generation**: Premium wallpaper generation using A+C (Smooth Gradient + Cinematic Effects) engine
- **Wallpaper Preview**: Beautiful preview with zoom controls and device frame mockup
- **Download**: High-quality wallpaper downloads
- **Share**: Copy shareable links to your wallpapers

### Extra Features
- **History**: LocalStorage-based history of generated wallpapers
- **Dark/Light Mode**: Beautiful theme toggle with system preference detection
- **Color Extraction**: Automatically extracts dominant colors from generated wallpapers
- **Responsive Design**: Fully responsive and mobile-friendly
- **Smooth Animations**: Framer Motion powered transitions and animations
- **Modern UI**: Glassmorphism and neumorphism design elements

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- A running Streamlit backend server (or API endpoint)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emotion_wallpaper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8501
   ```
   
   Replace `http://localhost:8501` with your Streamlit backend URL.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
emotion_wallpaper/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Navbar & Footer
│   ├── page.tsx           # Home page
│   ├── upload/            # Upload page
│   ├── result/            # Emotion result page
│   ├── preview/           # Wallpaper preview page
│   ├── about/             # About page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx         # Navigation bar
│   ├── Footer.tsx         # Footer component
│   ├── Button.tsx         # Reusable button component
│   ├── LoadingSpinner.tsx # Loading spinner
│   ├── UploadBox.tsx      # Drag & drop upload component
│   ├── WebcamCapture.tsx  # Webcam capture component
│   ├── EmotionCard.tsx    # Emotion display card
│   └── WallpaperCard.tsx  # Wallpaper preview card
├── lib/                   # Utility functions
│   ├── api.ts             # API integration layer
│   ├── utils.ts           # Helper functions
│   └── storage.ts         # LocalStorage utilities
├── public/                # Static assets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # TailwindCSS configuration
├── next.config.js         # Next.js configuration
└── README.md              # This file
```

## 🔌 API Integration

The application connects to a Streamlit backend server. The API endpoints expected are:

### Analyze Endpoint
```typescript
POST /analyze
Body: { image: string } // base64 encoded image
Response: { emotion: string, confidence: number }
```

### Generate Endpoint (Optional)
```typescript
POST /generate
Body: {
  emotion: string,
  image?: string,        // base64 encoded image
  seed?: number,
  title?: string,
  resolution?: string
}
Response: { image: string, seed?: number, title?: string }
```

If the `/generate` endpoint doesn't exist, the app will redirect to the Streamlit UI with query parameters.

### Integration Snippet

The frontend automatically handles:
1. Converting uploaded images to base64
2. Calling the `/analyze` endpoint
3. Displaying results
4. Generating wallpapers via `/generate` or redirecting to Streamlit

Example usage in the codebase:
```typescript
// lib/api.ts
import { analyzeImage, generateWallpaper } from '@/lib/api';
import { fileToBase64 } from '@/lib/api';

// Upload and analyze
const base64 = await fileToBase64(file);
const result = await analyzeImage(base64);

// Generate wallpaper
const wallpaper = await generateWallpaper({
  emotion: result.emotion,
  image: base64,
  resolution: '1920x1080'
});
```

## 🚢 Deployment

### Vercel (Recommended for Next.js)

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   
   Or connect your GitHub repository to [Vercel](https://vercel.com)

3. **Set Environment Variables**
   
   In Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your Streamlit backend URL
   - Example: `https://your-streamlit-app.herokuapp.com`

4. **Redeploy**
   
   After setting environment variables, trigger a new deployment.

### Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Add environment variable: `NEXT_PUBLIC_API_URL`

### Other Platforms

For other platforms (Railway, Render, etc.):
1. Set `NEXT_PUBLIC_API_URL` environment variable
2. Run `npm run build` and `npm start`
3. Ensure Node.js 18+ is available

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: {
    // Your color palette
  }
}
```

### Adding New Emotions

Edit `components/EmotionCard.tsx` to add emotion-specific gradients:
```typescript
const emotionColors: Record<string, string> = {
  yourEmotion: 'from-color-400 to-color-500',
  // ...
};
```

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Home+Page)

### Upload Page
![Upload Page](https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Upload+Page)

### Result Page
![Result Page](https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Result+Page)

### Preview Page
![Preview Page](https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Preview+Page)

## 🐛 Troubleshooting

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings on your backend
- Ensure the backend server is running

### Image Upload Issues
- Check file size (default max: 10MB)
- Verify file type (JPG, PNG only)
- Check browser console for errors

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for creators and emotion enthusiasts



