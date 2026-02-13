"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for a single photo book",
    features: ["1 photo book project", "Up to 40 pages", "AI layout generation", "3 design templates", "Standard print quality", "PDF export"],
  },
  {
    name: "Studio",
    price: 59,
    popular: true,
    description: "For the avid memory keeper",
    features: ["5 photo book projects", "Up to 80 pages each", "AI layout + style generation", "All design templates", "Premium print quality", "PDF + print-ready export", "Custom color palettes", "Priority support"],
  },
  {
    name: "Professional",
    price: 99,
    description: "For photographers & studios",
    features: ["Unlimited projects", "Up to 200 pages each", "Advanced AI design director", "Custom template creation", "Ultra-premium print quality", "All export formats", "White-label option", "Dedicated support", "API access"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C2825] mb-4">Simple, transparent pricing</h1>
          <p className="text-[#8A8279] text-lg max-w-2xl mx-auto">Choose the plan that fits your storytelling needs. Every plan includes our AI-powered design engine.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`relative rounded-2xl p-8 ${plan.popular ? "bg-[#2C2825] text-white shadow-2xl scale-105" : "bg-white text-[#2C2825] shadow-lg"}`}>
              {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-semibold px-4 py-1 rounded-full">Most Popular</span>}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.popular ? "text-gray-300" : "text-[#8A8279]"}`}>{plan.description}</p>
              <div className="mb-8"><span className="text-4xl font-serif">${plan.price}</span><span className={`text-sm ${plan.popular ? "text-gray-400" : "text-[#8A8279]"}`}>/month</span></div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (<li key={f} className="flex items-start gap-3 text-sm"><Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-amber-400" : "text-green-600"}`} />{f}</li>))}
              </ul>
              <Link href="/projects/new" className={`block text-center py-3 rounded-xl font-medium transition-all ${plan.popular ? "bg-white text-[#2C2825] hover:bg-gray-100" : "bg-[#2C2825] text-white hover:bg-[#3d3a36]"}`}>Get Started</Link>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
