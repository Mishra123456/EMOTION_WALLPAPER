// NEW: Generate based on client-side detected emotion string
export async function generateWallpaperFromEmotion(
  emotion: string,
  retries: number = 2
): Promise<{ imageUrl: string; emotion: string }> {

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${API_URL}/api/emotion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emotion }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `API Error: ${res.status}`);
    }

    const blob = await res.blob();
    const imageUrl = URL.createObjectURL(blob);

    // Use the requested emotion (or what backend confirms)
    // The backend might map 'happy' -> 'joy', etc.
    // For now assume it returns valid image.

    return { imageUrl, emotion };
  } catch (error) {
    clearTimeout(timeoutId);

    if (retries > 0 && (error instanceof TypeError || (error as Error).name === 'AbortError')) {
      console.log(`Retrying... (${retries} attempts left)`);
      return generateWallpaperFromEmotion(emotion, retries - 1);
    }

    if ((error as Error).name === 'AbortError') {
      throw new Error('Response timed out. Please try again.');
    }

    console.error("Wallpaper generation failed:", error);
    throw error;
  }
}

// DEPRECATED: Old file-based generation (Backend ML)
export async function generateWallpaper(
  file: File,
  retries: number = 2
): Promise<{ imageUrl: string; emotion: string }> {

  const formData = new FormData();
  formData.append("file", file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const res = await fetch("http://localhost:8000/api/emotion", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `API Error: ${res.status}`);
    }

    const blob = await res.blob();
    const imageUrl = URL.createObjectURL(blob);

    // Header is case-insensitive, but we look for the specific one from backend
    const emotionHeader = res.headers.get("X-Detected-Emotion");
    // Fallback only if header is completely missing
    const emotion = emotionHeader || "Neutral";

    return { imageUrl, emotion };
  } catch (error) {
    clearTimeout(timeoutId);

    // Retry on network errors or timeouts
    if (retries > 0 && (error instanceof TypeError || (error as Error).name === 'AbortError')) {
      console.log(`Retrying... (${retries} attempts left)`);
      return generateWallpaper(file, retries - 1);
    }

    // User-friendly error messages
    if ((error as Error).name === 'AbortError') {
      throw new Error('Response timed out. The AI model might be warming up. Please try again.');
    }

    console.error("Wallpaper generation failed:", error);
    throw error;
  }
}
