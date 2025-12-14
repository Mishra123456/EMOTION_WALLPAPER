'use client';

import { motion } from 'framer-motion';
import { Heart, TrendingUp, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface EmotionCardProps {
  emotion: string;
  confidence: number;
  onEdit?: () => void;
  editable?: boolean;
  className?: string;
}

const emotionColors: Record<string, string> = {
  happy: 'from-blue-400 to-cyan-500',
  sad: 'from-blue-500 to-indigo-600',
  angry: 'from-blue-600 to-red-500',
  calm: 'from-cyan-400 to-blue-500',
  excited: 'from-blue-500 to-purple-600',
  peaceful: 'from-cyan-400 to-blue-500',
  energetic: 'from-blue-500 to-cyan-600',
  melancholic: 'from-blue-600 to-indigo-700',
  joyful: 'from-blue-400 to-cyan-400',
  serene: 'from-cyan-500 to-blue-600',
};

const getEmotionGradient = (emotion: string): string => {
  const lowerEmotion = emotion.toLowerCase();
  for (const [key, gradient] of Object.entries(emotionColors)) {
    if (lowerEmotion.includes(key)) {
      return gradient;
    }
  }
  return 'from-blue-500 to-cyan-600';
};

export default function EmotionCard({
  emotion,
  confidence,
  onEdit,
  editable = false,
  className,
}: EmotionCardProps) {
  const gradient = getEmotionGradient(emotion);
  const confidencePercentage = Math.round(confidence * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 glass dark:glass-dark',
        className
      )}
    >
      {/* Animated background gradient */}
      <motion.div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-10',
          gradient
        )}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      {/* Glow effect */}
      <motion.div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-5 blur-2xl',
          gradient
        )}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className={cn(
                'p-3 rounded-xl bg-gradient-to-br shadow-lg',
                gradient
              )}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
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
                  'text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                  gradient
                )}
              >
                {emotion}
              </motion.h2>
            </div>
          </div>
          {editable && onEdit && (
            <Button
              onClick={onEdit}
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>

        {/* Confidence bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Confidence
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {confidencePercentage}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={cn(
                'h-full bg-gradient-to-r rounded-full shadow-lg',
                gradient
              )}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
