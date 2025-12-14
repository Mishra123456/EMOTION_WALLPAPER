// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { ArrowRight, Edit2, Sparkles } from 'lucide-react';
// import EmotionCard from '@/components/EmotionCard';
// import Button from '@/components/Button';
// import LoadingSpinner from '@/components/LoadingSpinner';
// import { generateWallpaper, base64ToBlobUrl } from '@/lib/api';
// import { saveToHistory } from '@/lib/utils';

// interface AnalysisResult {
//   emotion: string;
//   confidence: number;
//   imageBase64: string;
// }

// export default function ResultPage() {
//   const router = useRouter();
//   const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
//   const [emotion, setEmotion] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showEdit, setShowEdit] = useState(false);
//   const [customEmotion, setCustomEmotion] = useState('');

//   useEffect(() => {
//     const stored = sessionStorage.getItem('analysisResult');
//     if (stored) {
//       try {
//         const result = JSON.parse(stored) as AnalysisResult;
//         setAnalysisResult(result);
//         setEmotion(result.emotion);
//         setCustomEmotion(result.emotion);
//       } catch (err) {
//         router.push('/upload');
//       }
//     } else {
//       router.push('/upload');
//     }
//   }, [router]);

//   const handleGenerate = async () => {
//     if (!emotion || !analysisResult) return;

//     setIsGenerating(true);
//     setError(null);

//     try {
//       const result = await generateWallpaper({
//         emotion: emotion,
//         image: analysisResult.imageBase64,
//         resolution: '1920x1080',
//       });

//       // If redirect URL is returned (endpoint doesn't exist)
//       if ('redirectUrl' in result && result.redirectUrl) {
//         window.location.href = result.redirectUrl;
//         return;
//       }

//       // If image is returned
//       if (result.image) {
//         const imageUrl = base64ToBlobUrl(result.image);
//         const wallpaperData = {
//           image: imageUrl,
//           emotion: emotion,
//           seed: result.seed,
//           title: result.title || `${emotion} Wallpaper`,
//         };

//         // Save to history
//         saveToHistory(wallpaperData);

//         // Store in sessionStorage and navigate
//         sessionStorage.setItem('wallpaperData', JSON.stringify({
//           ...wallpaperData,
//           imageBase64: result.image, // Store base64 for download
//         }));

//         router.push('/preview');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to generate wallpaper. Please try again.');
//       setIsGenerating(false);
//     }
//   };

//   const handleSaveEmotion = () => {
//     if (customEmotion.trim()) {
//       setEmotion(customEmotion.trim());
//       setShowEdit(false);
//     }
//   };

//   if (!analysisResult) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

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
//             Emotion Detected
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-lg text-gray-600 dark:text-gray-400"
//           >
//             Review the detected mood and generate your wallpaper
//           </motion.p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mb-8"
//         >
//           <EmotionCard
//             emotion={emotion}
//             confidence={analysisResult.confidence}
//             onEdit={() => setShowEdit(true)}
//             editable
//           />
//         </motion.div>

//         {/* Edit Emotion Modal */}
//         {showEdit && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowEdit(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               onClick={(e) => e.stopPropagation()}
//               className="glass dark:glass-dark rounded-2xl p-6 max-w-md w-full"
//             >
//               <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
//                 Edit Emotion
//               </h3>
//               <input
//                 type="text"
//                 value={customEmotion}
//                 onChange={(e) => setCustomEmotion(e.target.value)}
//                 placeholder="Enter emotion (e.g., happy, calm, energetic)"
//                 className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 autoFocus
//               />
//               <div className="flex gap-3">
//                 <Button onClick={handleSaveEmotion} variant="primary" className="flex-1">
//                   Save
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     setShowEdit(false);
//                     setCustomEmotion(emotion);
//                   }}
//                   variant="outline"
//                   className="flex-1"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Generate Button */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="flex flex-col items-center space-y-4"
//         >
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Button
//                 onClick={handleGenerate}
//                 variant="primary"
//                 size="lg"
//                 isLoading={isGenerating}
//                 disabled={isGenerating || !emotion}
//                 className="min-w-[250px] group shadow-xl shadow-blue-500/50"
//               >
//                 {isGenerating ? (
//                   <>
//                     <LoadingSpinner size="sm" className="mr-2" />
//                     Generating Wallpaper...
//                   </>
//                 ) : (
//                   <>
//                     <motion.div
//                       animate={{ rotate: [0, 10, -10, 0] }}
//                       transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
//                     >
//                       <Sparkles className="w-5 h-5 mr-2" />
//                     </motion.div>
//                     Generate Wallpaper
//                     <motion.div
//                       animate={{ x: [0, 5, 0] }}
//                       transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
//                     >
//                       <ArrowRight className="w-5 h-5 ml-2" />
//                     </motion.div>
//                   </>
//                 )}
//               </Button>
//             </motion.div>

//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 max-w-md text-center"
//             >
//               {error}
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import EmotionCard from "@/components/EmotionCard";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

import { generateWallpaper } from "@/lib/api";
import { saveToHistory } from "@/lib/utils";

interface AnalysisResult {
  mood: string;
  confidence: number;
  imageUrl: string; // local object URL
}

export default function ResultPage() {
  const router = useRouter();

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [emotion, setEmotion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult");
    if (!stored) {
      router.push("/upload");
      return;
    }

    try {
      const result = JSON.parse(stored) as AnalysisResult;
      setAnalysisResult(result);
      setEmotion(result.mood);
    } catch {
      router.push("/upload");
    }
  }, [router]);

  const handleGenerate = async () => {
    if (!analysisResult) return;

    setIsGenerating(true);
    setError(null);

    try {
      // 🔥 Fetch original file back from preview URL
      const response = await fetch(analysisResult.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "face.png", { type: blob.type });

      // 🔥 Call FastAPI → returns Blob URL
      const wallpaperUrl = await generateWallpaper(file);

      const wallpaperData = {
        image: wallpaperUrl,
        emotion,
        title: `${emotion} Wallpaper`,
      };

      saveToHistory(wallpaperData);

      sessionStorage.setItem("wallpaperData", JSON.stringify(wallpaperData));

      router.push("/preview");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate wallpaper. Please try again."
      );
      setIsGenerating(false);
    }
  };

  if (!analysisResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
            Emotion Detected
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Review the detected mood and generate your wallpaper
          </motion.p>
        </motion.div>

        {/* Emotion Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <EmotionCard
            emotion={emotion}
            confidence={analysisResult.confidence}
          />
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleGenerate}
              variant="primary"
              size="lg"
              isLoading={isGenerating}
              disabled={isGenerating}
              className="min-w-[250px] group shadow-xl shadow-blue-500/50"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating Wallpaper...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Wallpaper
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 max-w-md text-center"
            >
              {error}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
