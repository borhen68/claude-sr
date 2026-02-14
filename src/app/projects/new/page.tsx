"use client";
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import PhotoUploader from '@/components/upload/PhotoUploader';
import BookPreview from '@/components/preview/BookPreview';
import { generateBook, GeneratedBook } from '@/lib/book-generator';
import { PhotoAnalysis } from '@/lib/photo-analyzer';

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [processedPhotos, setProcessedPhotos] = useState<PhotoAnalysis[]>([]);
  const [generatedBook, setGeneratedBook] = useState<GeneratedBook | null>(null);

  const handlePhotosProcessed = (result: any) => {
    console.log('Photos processed:', result);
    setProcessedPhotos(result.photos);
    
    // Generate book immediately
    const book = generateBook(result.photos, 'My Photo Book');
    setGeneratedBook(book);
    
    // Move to preview
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4">
              <Step number={1} active={step === 1} completed={step > 1} />
              <div className="w-16 h-0.5 bg-[#EBE6DD]" />
              <Step number={2} active={step === 2} completed={step > 2} />
              <div className="w-16 h-0.5 bg-[#EBE6DD]" />
              <Step number={3} active={step === 3} completed={step > 3} />
            </div>
            <div className="flex justify-between mt-3 text-sm text-[#8A8279] max-w-md mx-auto">
              <span>Upload</span>
              <span>Review</span>
              <span>Order</span>
            </div>
          </div>

          {/* Step 1: Upload */}
          {step === 1 && (
            <div>
              <h1 className="text-4xl font-serif font-light mb-4 text-center">
                Upload your photos
              </h1>
              <p className="text-center text-[#534C43] mb-12">
                We'll organize them into a beautiful book
              </p>
              
              <PhotoUploader 
                onPhotosProcessed={handlePhotosProcessed}
                maxFiles={100}
              />
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && generatedBook && (
            <div>
              <h1 className="text-4xl font-serif font-light mb-4 text-center">
                Looking good!
              </h1>
              <p className="text-center text-[#534C43] mb-12">
                We created a {generatedBook.totalPages}-page book from your {processedPhotos.length} photos
              </p>
              
              <BookPreview book={generatedBook} />
              
              <div className="flex gap-4 justify-center mt-12">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-[#EBE6DD] rounded-lg hover:bg-[#F5F2ED] transition-colors"
                >
                  Start Over
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-[#1A1612] text-white rounded-lg hover:bg-[#2C2825] transition-colors"
                >
                  Continue to Checkout
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Checkout */}
          {step === 3 && generatedBook && (
            <div>
              <h1 className="text-4xl font-serif font-light mb-12 text-center">
                Almost there
              </h1>
              
              <div className="bg-white rounded-2xl p-8 mb-8 border border-[#EBE6DD]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-1">{generatedBook.title}</h3>
                    <p className="text-sm text-[#8A8279]">
                      {generatedBook.totalPages}-page hardcover book
                    </p>
                  </div>
                  <span className="text-2xl font-serif">$39</span>
                </div>
                <div className="text-sm text-[#8A8279] border-t border-[#EBE6DD] pt-4">
                  Shipping: $7 (US) • Arrives in 7-10 days
                </div>
              </div>
              
              <button className="w-full py-4 bg-[#C9A870] text-white rounded-lg text-lg hover:bg-[#A88A58] transition-colors mb-4">
                Proceed to Payment
              </button>
              
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 text-[#534C43] hover:text-[#1A1612] transition-colors"
              >
                ← Back to Preview
              </button>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}

function Step({ number, active, completed }: { number: number; active: boolean; completed: boolean }) {
  return (
    <div 
      className={`
        w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors
        ${completed ? 'bg-[#C9A870] text-white' : ''}
        ${active ? 'bg-[#1A1612] text-white' : ''}
        ${!active && !completed ? 'bg-[#EBE6DD] text-[#8A8279]' : ''}
      `}
    >
      {completed ? '✓' : number}
    </div>
  );
}
