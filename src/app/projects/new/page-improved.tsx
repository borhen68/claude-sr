"use client";
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import PhotoUploader from '@/components/upload/PhotoUploader';

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<File[]>([]);
  const [projectName, setProjectName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotosSelected = async (files: File[]) => {
    setPhotos(files);
    setIsProcessing(true);
    
    // TODO: Upload to Supabase and process
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 2000);
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
            <div className="flex justify-between mt-3 text-sm text-[#8A8279]">
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
                onPhotosSelected={handlePhotosSelected}
                maxFiles={100}
              />
              
              {isProcessing && (
                <div className="mt-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A870]" />
                  <p className="mt-4 text-[#534C43]">
                    Analyzing your photos...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div>
              <h1 className="text-4xl font-serif font-light mb-4 text-center">
                Looking good!
              </h1>
              <p className="text-center text-[#534C43] mb-12">
                We sorted {photos.length} photos into {Math.ceil(photos.length / 3)} pages
              </p>
              
              <div className="bg-white rounded-2xl p-8 mb-8">
                <p className="text-center text-[#8A8279]">
                  Preview coming soon...
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-[#EBE6DD] rounded-lg hover:bg-[#F5F2ED]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-[#1A1612] text-white rounded-lg hover:bg-[#2C2825]"
                >
                  Continue to Checkout
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Checkout */}
          {step === 3 && (
            <div>
              <h1 className="text-4xl font-serif font-light mb-12 text-center">
                Almost there
              </h1>
              
              <div className="bg-white rounded-2xl p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg">20-page hardcover book</span>
                  <span className="text-2xl font-serif">$39</span>
                </div>
                <div className="text-sm text-[#8A8279]">
                  Shipping calculated at checkout
                </div>
              </div>
              
              <button className="w-full py-4 bg-[#C9A870] text-white rounded-lg text-lg hover:bg-[#A88A58]">
                Proceed to Payment
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
        w-10 h-10 rounded-full flex items-center justify-center font-medium
        ${completed ? 'bg-[#C9A870] text-white' : ''}
        ${active ? 'bg-[#1A1612] text-white' : ''}
        ${!active && !completed ? 'bg-[#EBE6DD] text-[#8A8279]' : ''}
      `}
    >
      {completed ? '✓' : number}
    </div>
  );
}
