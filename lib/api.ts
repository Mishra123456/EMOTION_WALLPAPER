// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8501';

// export interface AnalyzeResponse {
//   emotion: string;
//   confidence: number;
// }

// export interface GenerateWallpaperOptions {
//   emotion: string;
//   seed?: number;
//   title?: string;
//   resolution?: string;
//   image?: string; // base64 image
// }

// export interface GenerateWallpaperResponse {
//   image: string; // base64 image
//   seed?: number;
//   title?: string;
// }

// /**
//  * Analyzes an image and returns detected emotion and confidence
//  */
// export async function analyzeImage(base64: string): Promise<AnalyzeResponse> {
//   try {
//     const response = await axios.post<AnalyzeResponse>(
//       `${API_URL}/analyze`,
//       { image: base64 },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         timeout: 30000,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(
//         error.response?.data?.error || 
//         `Failed to analyze image: ${error.message}`
//       );
//     }
//     throw new Error('Failed to analyze image');
//   }
// }

// /**
//  * Generates a wallpaper based on emotion and options
//  */
// export async function generateWallpaper(
//   options: GenerateWallpaperOptions
// ): Promise<GenerateWallpaperResponse> {
//   try {
//     const response = await axios.post<GenerateWallpaperResponse>(
//       `${API_URL}/generate`,
//       options,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         timeout: 60000, // 60 seconds for generation
//       }
//     );
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       // If /generate endpoint doesn't exist, return a redirect URL
//       if (error.response?.status === 404) {
//         const params = new URLSearchParams({
//           emotion: options.emotion,
//           ...(options.seed && { seed: options.seed.toString() }),
//           ...(options.title && { title: options.title }),
//           ...(options.resolution && { resolution: options.resolution }),
//         });
//         return {
//           image: '',
//           redirectUrl: `${API_URL}/?${params.toString()}`,
//         } as any;
//       }
//       throw new Error(
//         error.response?.data?.error || 
//         `Failed to generate wallpaper: ${error.message}`
//       );
//     }
//     throw new Error('Failed to generate wallpaper');
//   }
// }

// /**
//  * Converts a file to base64 string
//  */
// export function fileToBase64(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const result = reader.result as string;
//       // Remove data:image/...;base64, prefix if present
//       const base64 = result.includes(',') ? result.split(',')[1] : result;
//       resolve(base64);
//     };
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// }

// /**
//  * Converts base64 to blob URL for display
//  */
// export function base64ToBlobUrl(base64: string, mimeType: string = 'image/png'): string {
//   const byteCharacters = atob(base64);
//   const byteNumbers = new Array(byteCharacters.length);
//   for (let i = 0; i < byteCharacters.length; i++) {
//     byteNumbers[i] = byteCharacters.charCodeAt(i);
//   }
//   const byteArray = new Uint8Array(byteNumbers);
//   const blob = new Blob([byteArray], { type: mimeType });
//   return URL.createObjectURL(blob);
// }

// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000";


// export interface AnalyzeResponse {
//   mood: string;
//   confidence: number;
// }

// /**
//  * Analyze image → emotion + confidence
//  */
// export async function analyzeImage(file: File): Promise<AnalyzeResponse> {
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const res = await axios.post<AnalyzeResponse>(
//       `${API_URL}/predict`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         timeout: 30000,
//       }
//     );
//     return res.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.detail || "Failed to analyze image");
//   }
// }

// /**
//  * Generate wallpaper → returns Blob URL
//  */
// export async function generateWallpaper(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const res = await axios.post(`${API_URL}/wallpaper`, formData, {
//       responseType: "blob", // 👈 VERY IMPORTANT
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       timeout: 60000,
//     });

//     return URL.createObjectURL(res.data);
//   } catch (error: any) {
//     throw new Error(
//       error.response?.data?.detail || "Failed to generate wallpaper"
//     );
//   }
// }


// lib/api.ts

export interface AnalyzeResponse {
  mood: string;
  confidence: number;
}

/**
 * Convert File → RAW base64 (NO data:image/... prefix)
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // IMPORTANT: remove data:image/...;base64,
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Analyze image → emotion
 * Calls Next.js API route
 */
export async function analyzeImage(file: File): Promise<AnalyzeResponse> {
  const imageBase64 = await fileToBase64(file);

  const res = await fetch("/api/emotion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageBase64 }),
  });

  if (!res.ok) {
    throw new Error("Failed to analyze image");
  }

  return res.json();
}
