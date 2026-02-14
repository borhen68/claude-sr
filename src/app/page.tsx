"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Sparkles, Wand2, Palette, BookOpen, Printer, Package } from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "Intelligent Layout Engine",
    description: "Advanced algorithms analyze your photos—composition, lighting, and subject matter—then craft layouts that tell your story beautifully.",
  },
  {
    icon: Palette,
    title: "Automatic Color Harmony",
    description: "Every page is color-coordinated based on your photos. We extract palettes and create cohesive themes that feel intentional.",
  },
  {
    icon: Sparkles,
    title: "Smart Photo Selection",
    description: "Our system identifies your best shots, removes duplicates, and arranges everything chronologically for a natural flow.",
  },
  {
    icon: BookOpen,
    title: "Editorial-Quality Design",
    description: "Layouts inspired by premium magazines and coffee table books. No templates—each book is uniquely designed.",
  },
  {
    icon: Printer,
    title: "Museum-Grade Printing",
    description: "Thick archival paper, true-to-screen colors, and hardcover binding. Your book will last decades.",
  },
  {
    icon: Package,
    title: "Delivered Worldwide",
    description: "Protective packaging, tracked shipping, and a 100% satisfaction guarantee. We stand behind every book.",
  },
];

const process = [
  {
    step: "01",
    title: "Upload Your Photos",
    description: "Drag and drop 20-100 photos. We handle the rest.",
  },
  {
    step: "02",
    title: "AI Organizes & Designs",
    description: "Our system analyzes, sorts, and creates a stunning layout in minutes.",
  },
  {
    step: "03",
    title: "Review & Customize",
    description: "Preview your book. Tweak layouts, add text, or approve as-is.",
  },
  {
    step: "04",
    title: "Print & Deliver",
    description: "We print, bind, and ship your book. Arrives in 7-10 days.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background gradient orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#C9A870]/10 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#EBE6DD] rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-[#C9A870]" />
                <span className="text-sm text-[#534C43]">Powered by intelligent design</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-serif font-light leading-[1.1] mb-6 text-[#1A1612]">
                Your memories,
                <br />
                <span className="italic text-[#C9A870]">beautifully bound</span>
              </h1>
              
              <p className="text-xl text-[#534C43] leading-relaxed mb-8 max-w-xl">
                Transform your photos into heirloom-quality books with intelligent design. 
                Upload your images, and our system creates a stunning layout in minutes.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/projects/new">
                  <Button size="lg" className="group">
                    Create Your Book
                    <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-[#EBE6DD]">
                <div>
                  <div className="text-2xl font-serif text-[#1A1612]">$39</div>
                  <div className="text-sm text-[#8A8279]">Starting price</div>
                </div>
                <div className="w-px h-12 bg-[#EBE6DD]" />
                <div>
                  <div className="text-2xl font-serif text-[#1A1612]">7-10 days</div>
                  <div className="text-sm text-[#8A8279]">Delivery</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl bg-gradient-to-br from-white to-[#F5F2ED] shadow-2xl overflow-hidden border border-[#EBE6DD]">
                <div className="absolute inset-0 p-8">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-gradient-to-br from-[#E8E3DE] to-[#D4CEC7] animate-pulse"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-[#EBE6DD]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A870] to-[#A88A58] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1A1612]">Smart Design</div>
                    <div className="text-xs text-[#8A8279]">Zero effort required</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light mb-4 text-[#1A1612]">
              From photos to printed book in four steps
            </h2>
            <p className="text-lg text-[#534C43] max-w-2xl mx-auto">
              Our intelligent system handles the design work. You just upload and approve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-serif text-[#EBE6DD] mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#1A1612]">
                  {item.title}
                </h3>
                <p className="text-[#534C43] leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light mb-4 text-[#1A1612]">
              Designed to be exceptional
            </h2>
            <p className="text-lg text-[#534C43] max-w-2xl mx-auto">
              Every detail matters when creating something meant to last generations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-white hover:bg-[#FAFAF8] border border-[#EBE6DD] hover:border-[#C9A870] hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A870] to-[#A88A58] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-3 text-[#1A1612]">
                  {feature.title}
                </h3>
                <p className="text-[#534C43] leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#1A1612] to-[#2C2825] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-light mb-6">
              Ready to create something beautiful?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Start with a free preview. See your book before you buy. 
              No credit card required.
            </p>
            
            <Link href="/projects/new">
              <Button variant="secondary" size="lg" className="group">
                Start Creating Now
                <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            
            <p className="text-sm text-gray-400 mt-6">
              Free preview • Pay only when you order • 100% satisfaction guarantee
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
