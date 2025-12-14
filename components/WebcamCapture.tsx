'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { Camera, X, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { cn } from '@/lib/utils';

interface WebcamCaptureProps {
  onCapture: (file: File) => void;
  onClose?: () => void;
  className?: string;
}

export default function WebcamCapture({
  onCapture,
  onClose,
  className,
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
        onCapture(file);
        stopCamera();
        if (onClose) onClose();
      }
    }, 'image/jpeg', 0.9);
  }, [onCapture, stopCamera, onClose]);

  const toggleFacingMode = useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence>
        {!isActive ? (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-center">
              <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click to start your camera
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={startCamera} variant="primary">
                  Start Camera
                </Button>
                {onClose && (
                  <Button onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-2xl overflow-hidden bg-black"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto max-h-[600px] object-cover"
            />
            
            {/* Controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={stopCamera}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  aria-label="Stop camera"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={capturePhoto}
                  className="p-4 bg-white rounded-full hover:scale-110 transition-transform shadow-lg"
                  aria-label="Capture photo"
                >
                  <Circle className="w-8 h-8 text-gray-800 fill-current" />
                </button>
                <button
                  onClick={toggleFacingMode}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  aria-label="Switch camera"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}

