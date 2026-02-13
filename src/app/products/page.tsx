"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Calendar, CreditCard, Gift, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const products = [
  { id: "photobook", name: "Photo Books", tagline: "Your stories, beautifully bound", desc: "AI-designed photo books with premium printing. Multiple sizes and covers.", price: 29, href: "/projects/new", gradient: "from-amber-50 to-orange-50", border: "border-amber-200", accent: "text-amber-700", features: ["AI layout", "9 page types", "Premium paper", "Hard & soft cover"] },
  { id: "calendar", name: "Photo Calendars", tagline: "A year of your best moments", desc: "Wall and desk calendars. AI picks the best shot for each month.", price: 19, href: "/products/calendars", gradient: "from-blue-50 to-indigo-50", border: "border-blue-200", accent: "text-blue-700", features: ["AI selection", "Custom dates", "3 sizes", "Multiple layouts"] },
  { id: "cards", name: "Photo Cards", tagline: "Send memories, not just words", desc: "Greeting, holiday, and thank you cards. Flat or folded with envelopes.", price: 2, href: "/products/cards", gradient: "from-rose-50 to-pink-50", border: "border-rose-200", accent: "text-rose-700", features: ["50+ templates", "Custom text", "Envelopes", "Bulk pricing"] },
  { id: "gifts", name: "Photo Gifts", tagline: "Turn photos into keepsakes", desc: "Canvas prints, framed photos, mugs, and puzzles.", price: 15, href: "#", gradient: "from-emerald-50 to-teal-50", border: "border-emerald-200", accent: "text-emerald-700", features: ["Auto-enhance", "Multiple sizes", "Gift wrap", "Direct ship"] },
];

const iconMap: Record<string, React.ReactNode> = {
  photobook: <BookOpen className="w-8 h-8" />,
  calendar: <Calendar className="w-8 h-8" />,
  cards: <CreditCard className="w-8 h-8" />,
  gifts: <Gift className="w-8 h-8" />,
};

export default function Products() {
  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="text-[#8A8279] text-sm tracking-[0.2em] uppercase mb-4">Products</p>
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">Create something beautiful</h1>
            <p className="text-[#8A8279] text-lg max-w-2xl mx-auto">Every product is AI-powered. Upload photos once, create anything.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={p.href}>
                  <div className={`bg-gradient-to-br ${p.gradient} rounded-3xl p-8 border ${p.border} hover:shadow-xl transition-all hover:-translate-y-1 h-full`}>
                    <div className={`${p.accent} mb-4`}>{iconMap[p.id]}</div>
                    <h2 className="text-2xl font-serif font-light mb-1">{p.name}</h2>
                    <p className={`text-sm ${p.accent} mb-3`}>{p.tagline}</p>
                    <p className="text-[#8A8279] text-sm mb-4">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">{p.features.map(f => <span key={f} className="text-[10px] px-2 py-1 bg-white/60 rounded-full">{f}</span>)}</div>
                    <div className="flex items-center justify-between pt-4 border-t border-black/5">
                      <span className="text-lg font-serif">From ${p.price}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
