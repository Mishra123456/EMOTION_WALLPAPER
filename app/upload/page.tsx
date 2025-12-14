// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { Camera, Upload as UploadIcon } from 'lucide-react';
// import UploadBox from '@/components/UploadBox';
// import WebcamCapture from '@/components/WebcamCapture';
// import Button from '@/components/Button';
// import LoadingSpinner from '@/components/LoadingSpinner';
// import { fileToBase64 } from '@/lib/api';
// import { analyzeImage } from '@/lib/api';

// export default function UploadPage() {
//   const router = useRouter();
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [showWebcam, setShowWebcam] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleFileSelect = (file: File) => {
//     setSelectedFile(file);
//     setError(null);
//   };

//   const handleWebcamCapture = (file: File) => {
//     setSelectedFile(file);
//     setShowWebcam(false);
//     setError(null);
//   };

//   const handleAnalyze = async () => {
//     if (!selectedFile) {
//       setError('Please select an image first');
//       return;
//     }

//     setIsAnalyzing(true);
//     setError(null);

//     try {
//       const base64 = await fileToBase64(selectedFile);
//       const result = await analyzeImage(base64);
      
//       // Store result in sessionStorage and navigate
//       sessionStorage.setItem('analysisResult', JSON.stringify({
//         emotion: result.emotion,
//         confidence: result.confidence,
//         imageBase64: base64,
//       }));
      
//       router.push('/result');
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <motion.h1
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]"
//           >
//             Upload Your Image
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-lg text-gray-600 dark:text-gray-400"
//           >
//             Upload a photo or capture one with your webcam to detect the mood
//           </motion.p>
//         </motion.div>

//         {!showWebcam ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="space-y-6"
//           >
//             {/* Upload Methods Toggle */}
//             <div className="flex gap-4 justify-center">
//               <Button
//                 onClick={() => setShowWebcam(false)}
//                 variant={!showWebcam ? 'primary' : 'outline'}
//                 className="flex items-center"
//               >
//                 <UploadIcon className="w-4 h-4 mr-2" />
//                 Upload File
//               </Button>
//               <Button
//                 onClick={() => setShowWebcam(true)}
//                 variant={showWebcam ? 'primary' : 'outline'}
//                 className="flex items-center"
//               >
//                 <Camera className="w-4 h-4 mr-2" />
//                 Webcam
//               </Button>
//             </div>

//             {/* Upload Box */}
//             <UploadBox onFileSelect={handleFileSelect} />

//             {/* Analyze Button */}
//             {selectedFile && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="flex justify-center"
//               >
//                 <Button
//                   onClick={handleAnalyze}
//                   variant="primary"
//                   size="lg"
//                   isLoading={isAnalyzing}
//                   disabled={isAnalyzing}
//                   className="min-w-[200px]"
//                 >
//                   {isAnalyzing ? (
//                     <>
//                       <LoadingSpinner size="sm" className="mr-2" />
//                       Analyzing...
//                     </>
//                   ) : (
//                     'Analyze Emotion'
//                   )}
//                 </Button>
//               </motion.div>
//             )}

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400"
//               >
//                 {error}
//               </motion.div>
//             )}
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//           >
//             <WebcamCapture
//               onCapture={handleWebcamCapture}
//               onClose={() => setShowWebcam(false)}
//             />
//             {selectedFile && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-6 flex justify-center"
//               >
//                 <Button
//                   onClick={handleAnalyze}
//                   variant="primary"
//                   size="lg"
//                   isLoading={isAnalyzing}
//                   disabled={isAnalyzing}
//                   className="min-w-[200px]"
//                 >
//                   {isAnalyzing ? (
//                     <>
//                       <LoadingSpinner size="sm" className="mr-2" />
//                       Analyzing...
//                     </>
//                   ) : (
//                     'Analyze Emotion'
//                   )}
//                 </Button>
//               </motion.div>
//             )}
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, Upload as UploadIcon } from "lucide-react";

import UploadBox from "@/components/UploadBox";
import WebcamCapture from "@/components/WebcamCapture";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

import { analyzeImage } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleWebcamCapture = (file: File) => {
    setSelectedFile(file);
    setShowWebcam(false);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // 🔥 Send File directly to FastAPI
      const result = await analyzeImage(selectedFile);

      // Create local preview URL (no base64)
      const imageUrl = URL.createObjectURL(selectedFile);

      // Store minimal data for result page
      sessionStorage.setItem(
        "analysisResult",
        JSON.stringify({
          mood: result.mood,
          confidence: result.confidence,
          imageUrl,
        })
      );

      router.push("/result");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze image. Please try again."
      );
      setIsAnalyzing(false);
    }
  };

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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent"
          >
            Upload Your Image
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Upload a photo or capture one with your webcam to detect the mood
          </motion.p>
        </motion.div>

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
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload File
              </Button>

              <Button
                onClick={() => setShowWebcam(true)}
                variant={showWebcam ? "primary" : "outline"}
                className="flex items-center"
              >
                <Camera className="w-4 h-4 mr-2" />
                Webcam
              </Button>
            </div>

            {/* Upload Box */}
            <UploadBox onFileSelect={handleFileSelect} />

            {/* Analyze Button */}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleAnalyze}
                  variant="primary"
                  size="lg"
                  isLoading={isAnalyzing}
                  disabled={isAnalyzing}
                  className="min-w-[200px]"
                >
                  {isAnalyzing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Emotion"
                  )}
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
              onClose={() => setShowWebcam(false)}
            />

            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-center"
              >
                <Button
                  onClick={handleAnalyze}
                  variant="primary"
                  size="lg"
                  isLoading={isAnalyzing}
                  disabled={isAnalyzing}
                  className="min-w-[200px]"
                >
                  {isAnalyzing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Emotion"
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
