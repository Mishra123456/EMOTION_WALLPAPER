// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import WallpaperCard from '@/components/WallpaperCard';
// import LoadingSpinner from '@/components/LoadingSpinner';

// interface WallpaperData {
//   image: string;
//   emotion: string;
//   seed?: number;
//   title?: string;
//   imageBase64?: string;
// }

// export default function PreviewPage() {
//   const router = useRouter();
//   const [wallpaperData, setWallpaperData] = useState<WallpaperData | null>(null);

//   useEffect(() => {
//     const stored = sessionStorage.getItem('wallpaperData');
//     if (stored) {
//       try {
//         const data = JSON.parse(stored) as WallpaperData;
//         setWallpaperData(data);
//       } catch (err) {
//         router.push('/upload');
//       }
//     } else {
//       router.push('/upload');
//     }
//   }, [router]);

//   if (!wallpaperData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
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
//             Your Wallpaper
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-lg text-gray-600 dark:text-gray-400"
//           >
//             Preview and download your generated wallpaper
//           </motion.p>
//         </motion.div>

//         <WallpaperCard
//           imageUrl={wallpaperData.image}
//           emotion={wallpaperData.emotion}
//           seed={wallpaperData.seed}
//           title={wallpaperData.title}
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import WallpaperCard from "@/components/WallpaperCard";
import LoadingSpinner from "@/components/LoadingSpinner";

interface WallpaperData {
  image: string; // Blob URL
  emotion: string;
  title?: string;
}

export default function PreviewPage() {
  const router = useRouter();
  const [wallpaperData, setWallpaperData] = useState<WallpaperData | null>(
    null
  );

  useEffect(() => {
    const stored = sessionStorage.getItem("wallpaperData");
    if (!stored) {
      router.push("/upload");
      return;
    }

    try {
      const data = JSON.parse(stored) as WallpaperData;
      setWallpaperData(data);
    } catch {
      router.push("/upload");
    }
  }, [router]);

  if (!wallpaperData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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
            Your Wallpaper
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Preview and download your generated wallpaper
          </motion.p>
        </motion.div>

        {/* Wallpaper Preview */}
        <WallpaperCard
          imageUrl={wallpaperData.image}
          emotion={wallpaperData.emotion}
          title={wallpaperData.title}
        />
      </div>
    </div>
  );
}
