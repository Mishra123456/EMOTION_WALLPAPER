'use client';

import { useCallback, useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

export default function UploadBox({
  onFileSelect,
  maxSizeMB = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'],
  className,
}: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please upload ${acceptedTypes.map(t => t.split('/')[1]).join(', ')} files.`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxSizeMB}MB limit.`;
    }
    return null;
  }, [acceptedTypes, maxSizeMB]);

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
  }, [onFileSelect, validateFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleClear = useCallback(() => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className={cn('w-full', className)}>
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 overflow-hidden',
          isDragging
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 scale-105 shadow-xl shadow-blue-500/30'
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600',
          preview && 'border-solid border-blue-500 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated gradient background */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl"
              />
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <motion.div
                  animate={isDragging ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  } : {
                    scale: 1,
                  }}
                  transition={{ duration: 1, repeat: isDragging ? Infinity : 0 }}
                  className="p-4 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 inline-block shadow-lg shadow-blue-500/50"
                >
                  {isDragging ? (
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      <Upload className="w-8 h-8 text-white" />
                    </motion.div>
                  ) : (
                    <ImageIcon className="w-8 h-8 text-white" />
                  )}
                </motion.div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {isDragging ? 'Drop your image here' : 'Drag & drop your image'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    or <span className="text-blue-500 font-medium bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">browse</span> to upload
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Supports JPG, PNG (max {maxSizeMB}MB)
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
