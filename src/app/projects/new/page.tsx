"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import PhotoUploader from '@/components/upload/PhotoUploader';
import BookPreview from '@/components/preview/BookPreview';
import { generateBook, GeneratedBook } from '@/lib/book-generator';
import { PhotoAnalysis } from '@/lib/photo-analyzer';
import Button from '@/components/ui/Button';

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [processedPhotos, setProcessedPhotos] = useState<PhotoAnalysis[]>([]);
  const [generatedBook, setGeneratedBook] = useState<GeneratedBook | null>(null);

  const handlePhotosProcessed = (result: any) => {
    console.log('Photos processed:', result);
    setProcessedPhotos(result.photos);
    
    const book = generateBook(result.photos, 'My Photo Book');
    setGeneratedBook(book);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white">
      <Navbar />
      
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Progress Bar */}
          <div className="mb-16">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[
                { num: 1, label: 'Upload', icon: Upload },
                { num: 2, label: 'Review', icon: Sparkles },
                { num: 3, label: 'Order', icon: CheckCircle2 },
              ].map((item, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div 
                      className={`
                        w-14 h-14 rounded-full flex items-center justify-center font-medium transition-all duration-300
                        ${step > item.num ? 'bg-gradient-to-br from-[#C9A870] to-[#A88A58] text-white scale-110' : ''}
                        ${step === item.num ? 'bg-gradient-to-br from-[#1A1612] to-[#2C2825] text-white scale-110 shadow-lg' : ''}
                        ${step < item.num ? 'bg-white border-2 border-[#EBE6DD] text-[#8A8279]' : ''}
                      `}
                    >
                      {step > item.num ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <item.icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`mt-3 text-sm font-medium ${step >= item.num ? 'text-[#1A1612]' : 'text-[#8A8279]'}`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {i < 2 && (
                    <div className={`h-0.5 flex-1 mx-4 transition-all duration-300 ${step > item.num ? 'bg-[#C9A870]' : 'bg-[#EBE6DD]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Upload */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#EBE6DD] rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-[#C9A870]" />
                <span className="text-sm text-[#534C43]">Step 1 of 3</span>
              </div>
              
              <h1 className="text-5xl font-serif font-light mb-4">
                Upload your photos
              </h1>
              <p className="text-xl text-[#534C43] mb-12 max-w-2xl mx-auto">
                Our intelligent system will analyze, sort, and design a beautiful book from your images
              </p>
              
              <PhotoUploader 
                onPhotosProcessed={handlePhotosProcessed}
                maxFiles={100}
              />
              
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto text-sm">
                {[
                  { icon: Sparkles, text: "AI analyzes each photo" },
                  { icon: CheckCircle2, text: "Removes duplicates" },
                  { icon: ArrowRight, text: "Creates perfect layouts" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-[#8A8279]">
                    <item.icon className="w-5 h-5 text-[#C9A870]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Review */}
          {step === 2 && generatedBook && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C9A870]/10 to-[#A88A58]/10 border border-[#C9A870]/20 rounded-full mb-6">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A870]" />
                  <span className="text-sm text-[#534C43]">Book generated successfully!</span>
                </div>
                
                <h1 className="text-5xl font-serif font-light mb-4">
                  Your book is ready
                </h1>
                <p className="text-xl text-[#534C43] max-w-2xl mx-auto">
                  We created a {generatedBook.totalPages}-page masterpiece from your {processedPhotos.length} photos
                </p>
              </div>
              
              <BookPreview book={generatedBook} />
              
              <div className="flex gap-4 justify-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  ← Start Over
                </Button>
                <Button
                  size="lg"
                  onClick={() => setStep(3)}
                  className="group"
                >
                  Continue to Checkout
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Checkout */}
          {step === 3 && generatedBook && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-12">
                <h1 className="text-5xl font-serif font-light mb-4">
                  One step away
                </h1>
                <p className="text-xl text-[#534C43]">
                  Review your order and proceed to payment
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#EBE6DD] mb-8">
                <div className="flex items-start gap-6 mb-6 pb-6 border-b border-[#EBE6DD]">
                  <div className="w-24 h-32 bg-gradient-to-br from-[#E8E3DE] to-[#D4CEC7] rounded-lg flex items-center justify-center text-[#8A8279] text-xs">
                    Preview
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-light mb-2">{generatedBook.title}</h3>
                    <p className="text-[#8A8279] mb-4">
                      {generatedBook.totalPages} pages • Hardcover • Premium paper
                    </p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border border-[#EBE6DD]"
                        style={{ backgroundColor: generatedBook.theme.accentColor }}
                      />
                      <span className="text-sm text-[#8A8279]">Custom color theme</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-serif text-[#1A1612]">$39</div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8A8279]">Subtotal</span>
                    <span className="text-[#1A1612]">$39.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8279]">Shipping (US)</span>
                    <span className="text-[#1A1612]">$7.00</span>
                  </div>
                  <div className="pt-3 border-t border-[#EBE6DD] flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span className="text-[#1A1612]">$46.00</span>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="w-full mb-4 group">
                Proceed to Payment
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 text-[#534C43] hover:text-[#1A1612] transition-colors"
              >
                ← Back to Preview
              </button>
              
              <div className="mt-8 p-4 bg-[#F5F2ED] rounded-xl text-center text-sm text-[#8A8279]">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-[#C9A870]" />
                100% satisfaction guarantee • Free returns within 30 days
              </div>
            </motion.div>
          )}
          
        </div>
      </main>
    </div>
  );
}
