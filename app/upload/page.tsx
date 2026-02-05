"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload as UploadIcon, Sparkles, CheckCircle, Loader2 } from "lucide-react";
import * as faceapi from 'face-api.js';

import UploadBox from "@/components/UploadBox";
import WebcamCapture from "@/components/WebcamCapture";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

import { generateWallpaperFromEmotion } from "@/lib/api";

type ProgressStep = 'idle' | 'loading_ai' | 'capturing' | 'analyzing' | 'generating' | 'complete';

export default function UploadPage() {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState<ProgressStep>('idle');
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        if (modelsLoaded) return;
        setProgressStep('loading_ai');
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL), // Use tiny for speed
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("AI Models Loaded (Upload Page)");
        setProgressStep('idle');
      } catch (e) {
        console.error("Failed to load models:", e);
        setError("Failed to load AI. Please refresh.");
      }
    };
    loadModels();
  }, []); // Only run once on mount

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleWebcamCapture = (file: File) => {
    setSelectedFile(file);
    setShowWebcam(false);
    setError(null);
  };

  // Quick capture from Webcam: Receives detected emotion string
  const handleQuickGenerate = async (emotion: string) => {
    setShowWebcam(false);
    setError(null);
    await processEmotionAndGenerate(emotion, null); // No file needed for logic, but maybe for preview?
    // Note: WebcamCapture managed the preview internally, but for result page we might want an image.
    // For now, we focus on the wallpaper.
  };

  const processEmotionAndGenerate = async (emotion: string, file: File | null) => {
    setIsAnalyzing(true);
    setError(null);
    setProgressStep('generating');

    try {
      console.log(`Generating wallpaper for: ${emotion}`);

      const { imageUrl, emotion: finalEmotion } = await generateWallpaperFromEmotion(emotion);

      setProgressStep('complete');

      // Brief pause
      await new Promise(resolve => setTimeout(resolve, 500));

      // Store in Session Storage
      // If we have a file, we could show it as "Your Photo". If not (webcam stream), we might not have it.
      // The Result page currently expects { emotion, imageUrl }.
      sessionStorage.setItem(
        "generatedWallpaper",
        JSON.stringify({
          emotion: finalEmotion,
          imageUrl,
        })
      );

      router.push("/result");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate wallpaper. Please try again."
      );
      setIsAnalyzing(false);
      setProgressStep('idle');
    }
  };

  const handleAnalyzeFile = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }
    if (!modelsLoaded) {
      setError("AI models are still loading...");
      return;
    }

    setIsAnalyzing(true);
    setProgressStep('analyzing');
    setError(null);

    try {
      // Detect emotion from file
      const image = await faceapi.bufferToImage(selectedFile);
      const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

      let detectedEmotion = "neutral";

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        // Find max
        const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
        detectedEmotion = sorted[0][0];
        console.log(`Detected from file: ${detectedEmotion} (${sorted[0][1]})`);
      } else {
        console.warn("No face detected in file, defaulting to neutral");
        // Optional: setError("No face detected in image"); return;
      }

      await processEmotionAndGenerate(detectedEmotion, selectedFile);

    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze image. Try another one.");
      setIsAnalyzing(false);
      setProgressStep('idle');
    }
  };


  const getProgressInfo = () => {
    switch (progressStep) {
      case 'loading_ai':
        return { text: 'Loading AI Models...', icon: Loader2, color: 'text-gray-500 animate-spin' };
      case 'capturing':
        return { text: 'Capturing...', icon: Camera, color: 'text-blue-500' };
      case 'analyzing':
        return { text: 'Detecting emotion...', icon: Sparkles, color: 'text-purple-500' };
      case 'generating':
        return { text: 'Creating wallpaper...', icon: Sparkles, color: 'text-cyan-500' };
      case 'complete':
        return { text: 'Done!', icon: CheckCircle, color: 'text-green-500' };
      default:
        return null;
    }
  };

  const progressInfo = getProgressInfo();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent"
          >
            Upload Your Image
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Capture your mood or upload a photo to generate a wallpaper
          </motion.p>
        </motion.div>

        {/* Progress Indicator */}
        <AnimatePresence>
          {(isAnalyzing || progressStep === 'loading_ai') && progressInfo && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-center gap-4">
                  {progressStep !== 'complete' ? (
                    <LoadingSpinner size="md" className={progressInfo.color} />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  )}
                  <span className={`text-lg font-medium`}>
                    {progressInfo.text}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showWebcam ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Upload / Webcam Toggle */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setShowWebcam(false)}
                variant={!showWebcam ? "primary" : "outline"}
                className="flex items-center"
                disabled={isAnalyzing}
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload File
              </Button>

              <Button
                onClick={() => setShowWebcam(true)}
                variant={showWebcam ? "primary" : "outline"}
                className="flex items-center"
                disabled={isAnalyzing}
              >
                <Camera className="w-4 h-4 mr-2" />
                Webcam
              </Button>
            </div>

            {/* Upload Box */}
            <UploadBox onFileSelect={handleFileSelect} />

            {/* Generate Button */}
            {selectedFile && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleAnalyzeFile}
                  variant="primary"
                  size="lg"
                  isLoading={isAnalyzing}
                  disabled={isAnalyzing || !modelsLoaded}
                  className="min-w-[220px]"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {modelsLoaded ? "Generate Wallpaper" : "Loading AI..."}
                </Button>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <WebcamCapture
              onCapture={handleWebcamCapture}
              onQuickGenerate={handleQuickGenerate}
              onClose={() => setShowWebcam(false)}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
