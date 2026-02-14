"use client";
import { useState, useCallback } from 'react';
import { Upload, Image, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploaderProps {
  onPhotosProcessed: (result: any) => void;
  maxFiles?: number;
}

export default function PhotoUploader({ 
  onPhotosProcessed, 
  maxFiles = 100 
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const processPhotos = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('photos', file));
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await fetch('/api/process-photos', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Processing failed');
      }
      
      setTimeout(() => onPhotosProcessed(result), 300);
      
    } catch (err: any) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} photos allowed`);
      return;
    }
    
    setSelectedFiles(files);
    processPhotos(files);
  }, [maxFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} photos allowed`);
      return;
    }
    
    setSelectedFiles(files);
    processPhotos(files);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? '#C9A870' : '#EBE6DD',
        }}
        className="relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-200 bg-white hover:bg-[#FAFAF8] overflow-hidden"
      >
        {/* Animated background */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-[#C9A870]/5 to-[#A88A58]/5"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          {isProcessing ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="relative w-20 h-20 mx-auto">
                <Loader2 className="w-20 h-20 text-[#C9A870] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-[#1A1612]">
                    {progress}%
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-xl font-medium text-[#1A1612] mb-2">
                  Analyzing your photos...
                </p>
                <p className="text-sm text-[#8A8279]">
                  Processing {selectedFiles.length} images
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="max-w-sm mx-auto">
                <div className="h-2 bg-[#EBE6DD] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-[#C9A870] to-[#A88A58]"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A870]/20 to-[#A88A58]/20 rounded-2xl rotate-6" />
                <div className="relative bg-gradient-to-br from-[#C9A870] to-[#A88A58] rounded-2xl flex items-center justify-center w-full h-full">
                  {selectedFiles.length > 0 ? (
                    <Image className="w-10 h-10 text-white" />
                  ) : (
                    <Upload className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-serif font-light mb-2 text-[#1A1612]">
                  {selectedFiles.length > 0 
                    ? `${selectedFiles.length} photos selected`
                    : 'Drop your photos here'
                  }
                </h3>
                <p className="text-[#534C43]">
                  or click to browse your files
                </p>
              </div>
              
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              
              <label
                htmlFor="file-input"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1A1612] to-[#2C2825] text-white rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-200"
              >
                <Upload className="w-5 h-5" />
                Choose Photos
              </label>
              
              <p className="text-sm text-[#8A8279]">
                Up to {maxFiles} photos • JPG, PNG, HEIC supported
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {selectedFiles.length > 0 && !isProcessing && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
            {selectedFiles.slice(0, 24).map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="aspect-square bg-gradient-to-br from-[#E8E3DE] to-[#D4CEC7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
            {selectedFiles.length > 24 && (
              <div className="aspect-square bg-gradient-to-br from-[#C9A870] to-[#A88A58] rounded-lg flex items-center justify-center text-white font-medium shadow-sm">
                +{selectedFiles.length - 24}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
