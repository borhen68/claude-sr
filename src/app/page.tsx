"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Link from "next/link";

const features = [
  {
    icon: "🤖",
    title: "AI Design Director",
    description: "Our AI analyzes your photos — detecting themes, emotions, and colors — then crafts a cohesive design that tells your story.",
  },
  {
    icon: "📖",
    title: "Smart Layouts",
    description: "Automatic page layouts that follow editorial design principles. Hero spreads, grids, collages, and quote pages — perfectly balanced.",
  },
  {
    icon: "✏️",
    title: "Visual Editor",
    description: "Drag, drop, resize, and rearrange. Full control over every page with an intuitive editor that feels like magic.",
  },
  {
    icon: "🖨️",
    title: "Print-Ready Quality",
    description: "300 DPI, CMYK color, proper bleeds and margins. Your book arrives looking exactly like the preview — or better.",
  },
  {
    icon: "🎨",
    title: "Premium Templates",
    description: "Curated design themes from minimal elegance to bold storytelling. Each template is a complete design system.",
  },
  {
    icon: "📦",
    title: "Delivered to Your Door",
    description: "Premium printing on uncoated silk paper with soft-touch covers. Shipped worldwide in protective packaging.",
  },
];

const testimonials = [
  {
    quote: "I uploaded 200 wedding photos and had a stunning book in 10 minutes. The AI understood the story better than I could have arranged it myself.",
    author: "Sarah M.",
    role: "Wedding Client",
  },
  {
    quote: "As a photographer, I've tried every photo book service. Frametale is the first one that actually produces design-quality layouts automatically.",
    author: "James K.",
    role: "Professional Photographer",
  },
  {
    quote: "The print quality is exceptional. Soft-touch cover, beautiful paper stock. My family thought I hired a designer.",
    author: "Priya R.",
    role: "Family Book",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#8A8279] text-sm tracking-[0.2em] uppercase mb-6"
          >
            AI-Powered Photo Books
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-light leading-tight mb-8"
          >
            Your memories,
            <br />
            <span className="italic">beautifully told</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#8A8279] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload your photos. Our AI analyzes every image — detecting emotions, themes, and colors —
            then designs a stunning photo book you&apos;ll treasure forever.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/projects/new">
              <Button size="lg">Create Your Book</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">View Pricing</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Preview mockup */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-[#E8E3DE]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-gradient-to-br from-[#E8E3DE] to-[#D4CEC7] flex items-center justify-center text-[#8A8279]"
                >
                  <svg className="w-8 h-8 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                  </svg>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center text-[#8A8279] text-sm">
              ↑ Your photos will appear here — AI arranges them into perfect layouts
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#8A8279] text-sm tracking-[0.2em] uppercase mb-4">How It Works</p>
            <h2 className="text-4xl font-serif font-light">Design intelligence meets your memories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-2xl hover:bg-[#F5F0EB] transition-colors duration-300"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-medium mb-2 font-sans">{f.title}</h3>
                <p className="text-[#8A8279] text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#8A8279] text-sm tracking-[0.2em] uppercase mb-4">Testimonials</p>
            <h2 className="text-4xl font-serif font-light">Loved by thousands</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-[#E8E3DE]"
              >
                <p className="text-[#2C2825] leading-relaxed mb-6 italic font-serif text-sm">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-medium text-sm">{t.author}</p>
                  <p className="text-[#8A8279] text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#2C2825]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-light text-[#F5F0EB] mb-6">
            Ready to tell your story?
          </h2>
          <p className="text-[#8A8279] mb-10 leading-relaxed">
            Upload your photos and let AI create something beautiful. Your first book preview is free.
          </p>
          <Link href="/projects/new">
            <Button variant="secondary" size="lg">Start Creating — It&apos;s Free</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
