"use client";
import { useState, useCallback } from 'react';

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

  const processPhotos = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('photos', file));
      
      const response = await fetch('/api/process-photos', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Processing failed');
      }
      
      onPhotosProcessed(result);
      
    } catch (err: any) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setIsProcessing(false);
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
    <div className="w-full max-w-3xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-16 text-center
          transition-colors duration-200
          ${isDragging 
            ? 'border-[#C9A870] bg-[#F5F2ED]' 
            : 'border-[#EBE6DD] bg-white'
          }
        `}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A870]" />
            <p className="text-lg text-[#534C43]">
              Analyzing {selectedFiles.length} photos...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-5xl">📸</div>
            <h3 className="text-2xl font-serif">
              {selectedFiles.length > 0 
                ? `${selectedFiles.length} photos selected`
                : 'Drop your photos here'
              }
            </h3>
            <p className="text-[#534C43]">
              or click to browse
            </p>
            
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
              className="inline-block px-6 py-3 bg-[#1A1612] text-white rounded-lg cursor-pointer hover:bg-[#2C2825] transition-colors"
            >
              Choose Photos
            </label>
            
            <p className="text-sm text-[#8A8279]">
              Up to {maxFiles} photos • JPG, PNG, HEIC
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      {selectedFiles.length > 0 && !isProcessing && (
        <div className="mt-8 grid grid-cols-6 gap-2">
          {selectedFiles.slice(0, 12).map((file, i) => (
            <div 
              key={i} 
              className="aspect-square bg-[#EBE6DD] rounded-lg overflow-hidden"
            >
              <img 
                src={URL.createObjectURL(file)} 
                alt={`Preview ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {selectedFiles.length > 12 && (
            <div className="aspect-square bg-[#EBE6DD] rounded-lg flex items-center justify-center text-sm text-[#534C43]">
              +{selectedFiles.length - 12}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
