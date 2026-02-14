"use client";
import { GeneratedBook } from '@/lib/book-generator';

interface BookPreviewProps {
  book: GeneratedBook;
}

export default function BookPreview({ book }: BookPreviewProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-light mb-2">{book.title}</h2>
        <p className="text-[#8A8279]">
          {book.totalPages} pages • {book.pages.reduce((acc, p) => acc + p.photos.length, 0)} photos
        </p>
      </div>

      {/* Theme Preview */}
      <div className="mb-8 p-6 bg-white rounded-xl border border-[#EBE6DD]">
        <p className="text-sm text-[#8A8279] mb-3">Book Theme</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full border border-[#EBE6DD]"
              style={{ backgroundColor: book.theme.primaryColor }}
            />
            <span className="text-sm">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full border border-[#EBE6DD]"
              style={{ backgroundColor: book.theme.accentColor }}
            />
            <span className="text-sm">Accent</span>
          </div>
        </div>
      </div>

      {/* Page Previews */}
      <div className="space-y-6">
        {book.pages.map((page) => (
          <div 
            key={page.pageNumber}
            className="bg-white rounded-xl p-8 border border-[#EBE6DD]"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#8A8279]">
                Page {page.pageNumber}
              </span>
              <span className="text-xs text-[#8A8279] uppercase tracking-wider">
                {page.layout.replace('-', ' ')}
              </span>
            </div>
            
            <div className="relative aspect-[3/2] bg-[#F5F2ED] rounded-lg overflow-hidden">
              <div className="absolute inset-0 p-4">
                {page.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="absolute bg-[#EBE6DD] rounded shadow-sm flex items-center justify-center text-xs text-[#8A8279]"
                    style={{
                      left: `${photo.x}%`,
                      top: `${photo.y}%`,
                      width: `${photo.width}%`,
                      height: `${photo.height}%`,
                    }}
                  >
                    {photo.filename.slice(0, 12)}...
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
