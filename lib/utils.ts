import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts dominant colors from an image
 */
export function extractColorsFromImage(imageUrl: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve([]);
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const colorMap = new Map<string, number>();
      
      // Sample pixels (every 10th pixel for performance)
      for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const rgb = `rgb(${r},${g},${b})`;
        colorMap.set(rgb, (colorMap.get(rgb) || 0) + 1);
      }
      
      // Get top 5 most common colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([color]) => color);
      
      resolve(sortedColors);
    };
    img.onerror = () => resolve([]);
    img.src = imageUrl;
  });
}

/**
 * Downloads an image from a URL
 */
export function downloadImage(url: string, filename: string = 'wallpaper.png') {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (e) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Saves wallpaper to localStorage history
 */
export interface WallpaperHistoryItem {
  id: string;
  image: string;
  emotion: string;
  seed?: number;
  title?: string;
  timestamp: number;
}

const HISTORY_KEY = 'moodcraft_wallpaper_history';
const MAX_HISTORY = 50;

export function saveToHistory(item: Omit<WallpaperHistoryItem, 'id' | 'timestamp'>): void {
  try {
    const history = getHistory();
    const newItem: WallpaperHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    history.unshift(newItem);
    // Keep only last MAX_HISTORY items
    const trimmed = history.slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export function getHistory(): WallpaperHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get history:', error);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

