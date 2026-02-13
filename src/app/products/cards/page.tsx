"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Upload, Wand2, ShoppingCart, RotateCcw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

const templates = [
  { id: "holiday", name: "Holiday Joy", cat: "Holiday", bg: "#1a3a2a", text: "#ffffff", accent: "#c4a35a" },
  { id: "thankyou", name: "Thank You", cat: "Thank You", bg: "#F5F0EB", text: "#2C2825", accent: "#8B7355" },
  { id: "birthday", name: "Happy Birthday", cat: "Birthday", bg: "#fdf2f8", text: "#831843", accent: "#ec4899" },
  { id: "wedding", name: "Save the Date", cat: "Wedding", bg: "#fffbeb", text: "#78350f", accent: "#d97706" },
  { id: "baby", name: "Baby Announcement", cat: "Baby", bg: "#eff6ff", text: "#1e3a5f", accent: "#3b82f6" },
  { id: "congrats", name: "Congratulations", cat: "Congrats", bg: "#f0fdf4", text: "#14532d", accent: "#22c55e" },
  { id: "sympathy", name: "With Sympathy", cat: "Sympathy", bg: "#f8f8f8", text: "#4a4a4a", accent: "#9ca3af" },
  { id: "minimal", name: "Minimal", cat: "General", bg: "#ffffff", text: "#2C2825", accent: "#D4CEC7" },
];

const sizes = [
  { id: "5x7f", label: "5\u00d77 Flat", price: 2 },
  { id: "5x7d", label: "5\u00d77 Folded", price: 3 },
  { id: "4x6", label: "4\u00d76 Postcard", price: 1.5 },
];

export default function CardBuilder() {
  const [tmpl, setTmpl] = useState(templates[0]);
  const [sz, setSz] = useState(sizes[0]);
  const [headline, setHeadline] = useState("Season's Greetings");
  const [message, setMessage] = useState("Wishing you joy and warmth this holiday season.");
  const [fromName, setFromName] = useState("The Smith Family");
  const [qty, setQty] = useState(25);
  const [showBack, setShowBack] = useState(false);
  const [cat, setCat] = useState("all");

  const cats = ["all", ...Array.from(new Set(templates.map(t => t.cat)))];
  const filtered = cat === "all" ? templates : templates.filter(t => t.cat === cat);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products" className="text-[#8A8279] hover:text-[#2C2825]"><ChevronLeft className="w-5 h-5" /></Link>
            <div><h1 className="text-3xl font-serif font-light">Card Builder</h1><p className="text-[#8A8279] text-sm">Design custom photo cards</p></div>
          </div>
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="flex flex-col items-center">
              <div className="relative w-[350px] max-w-full">
                <motion.div key={showBack ? "b" : "f"} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} className="rounded-2xl shadow-2xl overflow-hidden border border-[#E8E3DE] aspect-[5/7]" style={{ backgroundColor: tmpl.bg }}>
                  {!showBack ? (
                    <div className="w-full h-full flex flex-col p-8 justify-between">
                      <div className="flex-1 rounded-xl mb-4 flex items-center justify-center bg-black/10"><Upload className="w-8 h-8 opacity-30" style={{ color: tmpl.text }} /></div>
                      <div className="text-center">
                        <h2 className="text-2xl font-serif mb-2" style={{ color: tmpl.text }}>{headline}</h2>
                        <div className="w-12 h-px mx-auto mb-3" style={{ backgroundColor: tmpl.accent }} />
                        <p className="text-sm leading-relaxed mb-4" style={{ color: tmpl.text, opacity: 0.8 }}>{message}</p>
                        <p className="text-xs font-medium tracking-wider uppercase" style={{ color: tmpl.accent }}>{fromName}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white">
                      <p className="font-serif text-lg text-[#2C2825] mb-2">Frametale</p>
                      <p className="text-[10px] text-[#8A8279]">AI-designed with love</p>
                    </div>
                  )}
                </motion.div>
                <button onClick={() => setShowBack(!showBack)} className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white rounded-xl shadow-lg text-xs flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> {showBack ? "Front" : "Back"}</button>
              </div>
              <div className="mt-12 w-full">
                <div className="flex gap-2 mb-4 overflow-x-auto">{cats.map(c => <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${cat === c ? "bg-[#2C2825] text-white" : "bg-white text-[#8A8279] border border-[#E8E3DE]"}`}>{c === "all" ? "All" : c}</button>)}</div>
                <div className="grid grid-cols-4 gap-3">{filtered.map(t => <button key={t.id} onClick={() => setTmpl(t)} className={`rounded-xl overflow-hidden border-2 ${tmpl.id === t.id ? "border-[#2C2825] shadow-lg scale-105" : "border-[#E8E3DE]"}`}><div className="aspect-[5/7] p-3 flex flex-col items-center justify-center" style={{ backgroundColor: t.bg }}><div className="w-8 h-6 rounded mb-2" style={{ backgroundColor: t.accent, opacity: 0.5 }} /><span className="text-[8px] font-medium" style={{ color: t.text }}>{t.name}</span></div></button>)}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-[#E8E3DE]">
                <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Size</h3>
                <div className="space-y-2">{sizes.map(s => <button key={s.id} onClick={() => setSz(s)} className={`w-full text-left p-3 rounded-xl border flex justify-between ${sz.id === s.id ? "border-[#2C2825] bg-[#F5F0EB]" : "border-[#E8E3DE]"}`}><span className="text-xs font-medium">{s.label}</span><span className="text-xs text-[#8A8279]">${s.price}/ea</span></button>)}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E8E3DE]">
                <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Text</h3>
                <div className="space-y-3">
                  <div><label className="text-[10px] text-[#8A8279]">Headline</label><input value={headline} onChange={e => setHeadline(e.target.value)} className="w-full p-2 text-sm border border-[#E8E3DE] rounded-lg focus:outline-none focus:border-[#2C2825] font-serif" /></div>
                  <div><label className="text-[10px] text-[#8A8279]">Message</label><textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full p-2 text-xs border border-[#E8E3DE] rounded-lg focus:outline-none resize-none" /></div>
                  <div><label className="text-[10px] text-[#8A8279]">From</label><input value={fromName} onChange={e => setFromName(e.target.value)} className="w-full p-2 text-xs border border-[#E8E3DE] rounded-lg focus:outline-none" /></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E8E3DE]">
                <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Quantity</h3>
                <div className="flex gap-2">{[10,25,50,100].map(q => <button key={q} onClick={() => setQty(q)} className={`flex-1 py-2 text-xs rounded-xl border ${qty === q ? "border-[#2C2825] bg-[#F5F0EB] font-medium" : "border-[#E8E3DE]"}`}>{q}</button>)}</div>
              </div>
              <button className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-700 text-sm flex items-center gap-3"><Wand2 className="w-5 h-5" /><div className="text-left"><p className="font-medium">AI Write Message</p><p className="text-[10px] text-purple-500">Generate perfect text</p></div></button>
              <button className="w-full p-4 rounded-2xl bg-[#2C2825] text-white font-medium flex items-center justify-center gap-2"><ShoppingCart className="w-5 h-5" /> Order {qty} Cards — ${qty * sz.price}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
