'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { Camera, X, Zap, RotateCcw, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { cn } from '@/lib/utils';
import * as faceapi from 'face-api.js';

interface WebcamCaptureProps {
  onCapture: (file: File) => void; // Keep for legacy/preview
  onQuickGenerate?: (emotion: string) => void; // UPDATED: Now takes emotion string
  onClose?: () => void;
  className?: string;
}

type CaptureState = 'idle' | 'camera' | 'preview';

export default function WebcamCapture({
  onCapture,
  onQuickGenerate,
  onClose,
  className,
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // Overlay canvas
  const streamRef = useRef<MediaStream | null>(null);

  const [captureState, setCaptureState] = useState<CaptureState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // AI State
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const [detectionConfidence, setDetectionConfidence] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("Face-API Models Loaded");
      } catch (e) {
        console.error("Error loading models:", e);
        setError("Failed to load AI models. Please refresh.");
      }
    };
    loadModels();
  }, []);

  // Attach stream to video element when it becomes available
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
    }
  }, []); // Stable callback

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      streamRef.current = stream;
      setCaptureState('camera');
      // Stream will be attached via the ref callback when the video element mounts
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
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
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
    setCountdown(null);
  }, []);

  // Real-time Detection Loop
  const handleVideoPlay = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !modelsLoaded) return;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    detectionInterval.current = setInterval(async () => {
      if (video.paused || video.ended) return;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // Custom UI is better
      }

      if (detections.length > 0) {
        // Get dominant emotion
        const expressions = detections[0].expressions;
        const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
        const topEmotion = sorted[0];

        if (topEmotion[1] > 0.5) { // Threshold
          setDetectedEmotion(topEmotion[0]);
          setDetectionConfidence(topEmotion[1]);
        }
      } else {
        setDetectedEmotion(null);
      }
    }, 100); // 100ms interval
  };

  const captureAndGenerate = useCallback(() => {
    if (!detectedEmotion) {
      setError("No emotion detected! Look at the camera.");
      return;
    }

    // Capture visual snapshot for preview
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
      stopCamera();
      setCaptureState('preview');
    }

    // Trigger Generation with Emotion Logic
    if (onQuickGenerate) {
      setIsProcessing(true);
      onQuickGenerate(detectedEmotion);
    }
  }, [detectedEmotion, onQuickGenerate, stopCamera]);


  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    setCaptureState('idle');
    if (onClose) onClose();
  }, [stopCamera, onClose]);

  const toggleFacingMode = useCallback(() => {
    stopCamera();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, [stopCamera]);

  useEffect(() => {
    if (captureState === 'camera') {
      startCamera();
    }
  }, [captureState, startCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {/* IDLE */}
        {captureState === 'idle' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-center bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
              <Camera className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Ready to Capture
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {modelsLoaded ? "AI Models Ready. Instant Detection." : "Loading AI Models..."}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={startCamera}
                  variant="primary"
                  className="min-w-[160px]"
                  disabled={!modelsLoaded}
                >
                  {modelsLoaded ? (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading AI...
                    </>
                  )}
                </Button>
                {onClose && (
                  <Button onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* CAMERA */}
        {captureState === 'camera' && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden bg-black shadow-2xl"
          >
            <div className="relative">
              <video
                ref={setVideoRef}
                autoPlay
                playsInline
                muted
                onPlay={handleVideoPlay}
                className="w-full h-auto max-h-[500px] object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
            </div>

            {/* AI HUD */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
              <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-mono flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${detectedEmotion ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                {detectedEmotion ? `DETECTED: ${detectedEmotion.toUpperCase()}` : "SCANNING..."}
              </div>
              {detectionConfidence > 0 && (
                <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono">
                  {(detectionConfidence * 100).toFixed(0)}% CONFIDENCE
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleClose}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* GENERATE BUTTON - ACTIVATED BY EMOTION */}
                <button
                  onClick={captureAndGenerate}
                  className={`p-5 rounded-full transition-transform shadow-xl ring-4 ring-white/30 flex items-center justify-center ${detectedEmotion
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-110 cursor-pointer'
                    : 'bg-gray-500 opacity-50 cursor-not-allowed'
                    }`}
                  disabled={!detectedEmotion}
                >
                  <Zap className="w-8 h-8 text-white fill-white" />
                </button>

                <button
                  onClick={toggleFacingMode}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </button>
              </div>
              <p className="text-center text-white/80 text-sm mt-3 font-medium">
                {detectedEmotion ? "Tap to Generate Wallpaper!" : "Look at the camera..."}
              </p>
            </div>
          </motion.div>
        )}

        {/* PREVIEW (Loading State) */}
        {captureState === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl bg-black"
          >
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-auto max-h-[500px] object-cover opacity-50"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Generating Magic...</h3>
                <p className="text-white/80">Using detected emotion: {detectedEmotion}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
