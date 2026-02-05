"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmotionCardProps {
  emotion?: string | null;
  className?: string;
}

const emotionColors: Record<string, string> = {
  happy: "from-blue-400 to-cyan-500",
  sad: "from-blue-500 to-indigo-600",
  angry: "from-blue-600 to-red-500",
  calm: "from-cyan-400 to-blue-500",
  excited: "from-blue-500 to-purple-600",
  peaceful: "from-cyan-400 to-blue-500",
  energetic: "from-blue-500 to-cyan-600",
  melancholic: "from-blue-600 to-indigo-700",
  joyful: "from-blue-400 to-cyan-400",
  serene: "from-cyan-500 to-blue-600",
  neutral: "from-gray-400 to-gray-600",
};

const DEFAULT_GRADIENT = "from-blue-500 to-cyan-600";

const getEmotionGradient = (emotion?: string | null): string => {
  if (!emotion) return DEFAULT_GRADIENT;

  const lowerEmotion = emotion.toLowerCase();

  for (const [key, gradient] of Object.entries(emotionColors)) {
    if (lowerEmotion.includes(key)) {
      return gradient;
    }
  }

  return DEFAULT_GRADIENT;
};

export default function EmotionCard({
  emotion,
  className,
}: EmotionCardProps) {
  // 🔒 SAFE FALLBACKS
  const safeEmotion = emotion || "Neutral";
  const gradient = getEmotionGradient(safeEmotion);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 glass dark:glass-dark",
        className,
      )}
    >
      {/* Background gradient */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-10",
          gradient,
        )}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <div className="relative z-10 flex items-center space-x-4">
        <motion.div
          className={cn(
            "p-3 rounded-xl bg-gradient-to-br shadow-lg",
            gradient,
          )}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-6 h-6 text-white" />
        </motion.div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Detected Mood
          </h3>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
              gradient,
            )}
          >
            {safeEmotion}
          </motion.h2>
        </div>
      </div>
    </motion.div>
  );
}
