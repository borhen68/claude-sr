"use client";
import { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface PhotoUploadPanelProps {
  onPhotoSelect: (url: string) => void;
}

export default function PhotoUploadPanel({ onPhotoSelect }: PhotoUploadPanelProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    // Convert to data URLs
    const urls = await Promise.all(
      files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    setPhotos(prev => [...prev, ...urls]);
    setIsUploading(false);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Your Photos
        </h3>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-3 h-3" />
              Upload
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No photos yet</p>
          <p className="text-xs mt-1">Click Upload to add photos</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
          {photos.map((url, i) => (
            <button
              key={i}
              onClick={() => onPhotoSelect(url)}
              className="aspect-square rounded-lg overflow-hidden hover:ring-2 ring-blue-500 transition-all group relative"
            >
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
                  Add to canvas
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
