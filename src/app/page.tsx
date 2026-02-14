"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      {/* Hero - No animations, just clarity */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-light leading-tight mb-6 text-[#1A1612]">
            Your photos deserve
            <br />
            better than a folder.
          </h1>
          <p className="text-xl text-[#534C43] max-w-2xl mb-10 leading-relaxed">
            Upload your photos. We'll sort them, pick the best ones, and turn them into 
            a book you'll actually want on your coffee table.
          </p>
          <div className="flex gap-4">
            <Link href="/projects/new">
              <Button size="lg">Start Your Book</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">See Pricing</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works - Simple, honest */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-light mb-16 text-center">
            Three steps. No design degree required.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-4xl font-serif text-[#C9A870] mb-4">1</div>
              <h3 className="text-xl font-medium mb-3">Upload</h3>
              <p className="text-[#534C43] leading-relaxed">
                Drop in 20-100 photos. We'll handle the rest.
              </p>
            </div>
            
            <div>
              <div className="text-4xl font-serif text-[#C9A870] mb-4">2</div>
              <h3 className="text-xl font-medium mb-3">Review</h3>
              <p className="text-[#534C43] leading-relaxed">
                We organize your photos into a beautiful layout. 
                Tweak it if you want, or leave it as-is.
              </p>
            </div>
            
            <div>
              <div className="text-4xl font-serif text-[#C9A870] mb-4">3</div>
              <h3 className="text-xl font-medium mb-3">Receive</h3>
              <p className="text-[#534C43] leading-relaxed">
                Your book arrives in 7-10 days. Premium paper, 
                professional binding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What makes it good - Features without buzzwords */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-light mb-12">
            What makes this different
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-2 h-2 rounded-full bg-[#C9A870] mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-lg font-medium mb-2">We pick the good photos</h3>
                <p className="text-[#534C43]">
                  Our system finds faces, checks for blur, and removes duplicates. 
                  You don't have to sort through 300 iPhone photos.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="w-2 h-2 rounded-full bg-[#C9A870] mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-lg font-medium mb-2">Actually good design</h3>
                <p className="text-[#534C43]">
                  No clipart. No Comic Sans. Just clean layouts that look like 
                  a real designer made them.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="w-2 h-2 rounded-full bg-[#C9A870] mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-lg font-medium mb-2">Print quality that matters</h3>
                <p className="text-[#534C43]">
                  300 DPI on thick matte paper. Hardcover binding. 
                  The colors actually match your screen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Clear, no games */}
      <section className="py-20 px-6 bg-[#1A1612] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-light mb-6">
            One price. No surprises.
          </h2>
          <div className="text-5xl font-serif mb-4">$39</div>
          <p className="text-[#EBE6DD] mb-8">
            20-page hardcover book, shipped to your door
          </p>
          <Link href="/projects/new">
            <Button variant="secondary" size="lg">
              Start Your Book
            </Button>
          </Link>
          <p className="text-sm text-[#8A8279] mt-6">
            Preview is free. Only pay when you order.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
