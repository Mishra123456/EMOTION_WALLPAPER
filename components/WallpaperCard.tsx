'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, ZoomIn, ZoomOut, Maximize2, Palette } from 'lucide-react';
import { downloadImage, copyToClipboard, extractColorsFromImage } from '@/lib/utils';
import Button from './Button';
import { cn } from '@/lib/utils';

interface WallpaperCardProps {
  imageUrl: string;
  emotion?: string;
  seed?: number;
  title?: string;
  className?: string;
}

export default function WallpaperCard({
  imageUrl,
  emotion,
  seed,
  title,
  className,
}: WallpaperCardProps) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsExtracting(true);
      extractColorsFromImage(imageUrl)
        .then((colors) => {
          setDominantColors(colors);
          setIsExtracting(false);
        })
        .catch(() => setIsExtracting(false));
    }
  }, [imageUrl]);

  const handleDownload = () => {
    const filename = title
      ? `${title.replace(/\s+/g, '-')}.png`
      : `moodcraft-wallpaper-${Date.now()}.png`;
    downloadImage(imageUrl, filename);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Wallpaper Preview with Device Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative glass dark:glass-dark rounded-2xl p-6 overflow-hidden"
      >
        {/* Mock Desktop Frame */}
        <div className="relative bg-gray-900 rounded-xl p-4 shadow-2xl">
          <div className="bg-gray-800 rounded-lg p-2 flex items-center space-x-2 mb-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center text-xs text-gray-500">
              {title || 'Wallpaper Preview'}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg bg-gray-950" style={{ aspectRatio: '16/9' }}>
            <motion.img
              src={imageUrl}
              alt={title || 'Generated wallpaper'}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center',
              }}
              animate={{
                scale: zoom,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 glass dark:glass-dark rounded-lg p-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-2 rounded hover:bg-white/10 transition-colors disabled:opacity-50"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="p-2 rounded hover:bg-white/10 transition-colors disabled:opacity-50"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            aria-label="Reset zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Info and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass dark:glass-dark rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Wallpaper Details
          </h3>
          <div className="space-y-3">
            {emotion && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Emotion:</span>
                <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{emotion}</p>
              </div>
            )}
            {seed && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Seed:</span>
                <p className="font-medium text-gray-900 dark:text-gray-100 font-mono">{seed}</p>
              </div>
            )}
            {title && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Title:</span>
                <p className="font-medium text-gray-900 dark:text-gray-100">{title}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass dark:glass-dark rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Actions
          </h3>
          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              variant="primary"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Wallpaper
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {copied ? 'Link Copied!' : 'Share'}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Dominant Colors */}
      {dominantColors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass dark:glass-dark rounded-2xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Dominant Colors
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {dominantColors.map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <div
                  className="w-12 h-12 rounded-lg shadow-lg border-2 border-white/20"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  {color}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

