"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";

import EmotionCard from "@/components/EmotionCard";
import WallpaperCard from "@/components/WallpaperCard";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

interface GeneratedResult {
  emotion: string;
  imageUrl: string;
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<GeneratedResult | null>(null);

  useEffect(() => {
    // Read from normalized key
    const stored = sessionStorage.getItem("generatedWallpaper");
    if (!stored) {
      router.push("/upload");
      return;
    }

    try {
      const parsed = JSON.parse(stored) as GeneratedResult;
      if (!parsed.imageUrl || !parsed.emotion) {
        throw new Error("Invalid data");
      }
      setResult(parsed);
    } catch {
      router.push("/upload");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent"
          >
            Your Wallpaper
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Based on your detected mood: <span className="font-semibold text-primary">{result.emotion}</span>
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Emotion Info */}
          <div className="md:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <EmotionCard emotion={result.emotion} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={() => router.push("/upload")}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Try Another Photo
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Wallpaper Result */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <WallpaperCard
                imageUrl={result.imageUrl}
                emotion={result.emotion}
                title={`${result.emotion} Wallpaper`}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
