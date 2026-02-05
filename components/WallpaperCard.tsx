'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { downloadImage } from '@/lib/utils';
import Button from './Button';
import { cn } from '@/lib/utils';

interface WallpaperCardProps {
  imageUrl: string;
  emotion?: string;
  title?: string;
  className?: string;
}

export default function WallpaperCard({
  imageUrl,
  emotion,
  title,
  className,
}: WallpaperCardProps) {
  const [zoom, setZoom] = useState(1);

  const handleDownload = () => {
    const filename = title
      ? `${title.replace(/\s+/g, '-')}.png`
      : `moodcraft-wallpaper-${Date.now()}.png`;

    // Handle Blob URL download
    if (imageUrl.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      downloadImage(imageUrl, filename);
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
          <span className="text-sm font-medium min-w-[3rem] text-center text-gray-700 dark:text-gray-200">
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

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass dark:glass-dark rounded-2xl p-6"
      >
        <Button
          onClick={handleDownload}
          variant="primary"
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Wallpaper
        </Button>
      </motion.div>
    </div>
  );
}
