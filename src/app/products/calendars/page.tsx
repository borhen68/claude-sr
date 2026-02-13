"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Upload, Wand2, ShoppingCart, Plus, X, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const photoColors = ["#8B7355","#6B8E6B","#7B8BA3","#A0826D","#8E7BA0","#6B9E9E","#A08E6B","#7B6B8E","#9E6B6B","#6B8E8B","#A09B6B","#8B6B7B"];
const layouts = [
  { id: "classic", name: "Classic", desc: "Photo on top, calendar below" },
  { id: "full", name: "Full Bleed", desc: "Photo fills entire top" },
  { id: "collage", name: "Collage", desc: "Multiple photos per month" },
  { id: "minimal", name: "Minimal", desc: "Small photo, clean grid" },
];

export default function CalendarBuilder() {
  const [cur, setCur] = useState(0);
  const [layout, setLayout] = useState("classic");
  const [size, setSize] = useState("11x8.5");
  const [customDates, setCustomDates] = useState<{m:number;d:number;l:string}[]>([]);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDay, setNewDay] = useState(1);

  const getDays = (m: number) => new Date(2026, m + 1, 0).getDate();
  const getFirst = (m: number) => new Date(2026, m, 1).getDay();
  const builtIn = [{m:0,d:1,l:"New Year"},{m:1,d:14,l:"Valentine's"},{m:11,d:25,l:"Christmas"}];
  const allDates = [...builtIn, ...customDates];

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products" className="text-[#8A8279] hover:text-[#2C2825]"><ChevronLeft className="w-5 h-5" /></Link>
            <div><h1 className="text-3xl font-serif font-light">Calendar Builder</h1><p className="text-[#8A8279] text-sm">Design your 2026 photo calendar</p></div>
          </div>
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div>
              <motion.div key={cur} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E8E3DE]">
                <div className="aspect-[4/3] relative flex items-center justify-center" style={{ backgroundColor: photoColors[cur] }}>
                  <Upload className="w-10 h-10 text-white/30" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 text-xs font-medium">{months[cur]} 2026</div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif mb-4">{months[cur]} <span className="text-[#8A8279]">2026</span></h3>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="text-[10px] text-[#8A8279] uppercase tracking-wider py-2">{d}</div>)}
                    {Array.from({ length: getFirst(cur) }, (_, i) => <div key={`e${i}`} />)}
                    {Array.from({ length: getDays(cur) }, (_, i) => {
                      const day = i + 1;
                      const ev = allDates.find(x => x.m === cur && x.d === day);
                      return <div key={day} className={`relative py-2 rounded-lg text-sm cursor-pointer transition-colors ${ev ? "bg-amber-50 font-medium" : "hover:bg-[#F5F0EB]"}`}>{day}{ev && <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />}</div>;
                    })}
                  </div>
                  {allDates.filter(x => x.m === cur).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#E8E3DE]">{allDates.filter(x => x.m === cur).map((x, i) => <div key={i} className="flex items-center gap-2 text-xs text-[#8A8279] py-1"><Star className="w-3 h-3 text-amber-500" />{months[x.m]} {x.d} — {x.l}</div>)}</div>
                  )}
                </div>
              </motion.div>
              <div className="flex items-center justify-center gap-4 mt-6">
                <button onClick={() => setCur(Math.max(0, cur - 1))} disabled={cur === 0} className="p-2 rounded-xl bg-white shadow disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
                <div className="flex gap-1">{months.map((_, i) => <button key={i} onClick={() => setCur(i)} className={`w-2.5 h-2.5 rounded-full ${cur === i ? "bg-[#2C2825] scale-125" : "bg-[#D4CEC7]"}`} />)}</div>
                <button onClick={() => setCur(Math.min(11, cur + 1))} disabled={cur === 11} className="p-2 rounded-xl bg-white shadow disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-[#E8E3DE]">
                <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Size</h3>
                <div className="grid grid-cols-3 gap-2">{["11x8.5","8x6","12x12"].map(s => <button key={s} onClick={() => setSize(s)} className={`p-2 rounded-xl text-xs border ${size === s ? "border-[#2C2825] bg-[#F5F0EB] font-medium" : "border-[#E8E3DE]"}`}>{s}</button>)}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E8E3DE]">
                <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Layout</h3>
                <div className="space-y-2">{layouts.map(l => <button key={l.id} onClick={() => setLayout(l.id)} className={`w-full text-left p-3 rounded-xl border ${layout === l.id ? "border-[#2C2825] bg-[#F5F0EB]" : "border-[#E8E3DE]"}`}><p className="text-xs font-medium">{l.name}</p><p className="text-[10px] text-[#8A8279]">{l.desc}</p></button>)}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E8E3DE]">
                <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Special Dates</h3>
                <div className="space-y-1.5 mb-3">{allDates.map((x, i) => <div key={i} className="flex items-center justify-between text-xs p-2 bg-[#F5F0EB] rounded-lg"><span>{months[x.m]} {x.d} — {x.l}</span>{i >= builtIn.length && <button onClick={() => setCustomDates(customDates.filter((_, j) => j !== i - builtIn.length))}><X className="w-3 h-3 text-red-400" /></button>}</div>)}</div>
                {adding ? (
                  <div className="space-y-2"><input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Event name" className="w-full p-2 text-xs border border-[#E8E3DE] rounded-lg" /><div className="flex gap-2"><input type="number" value={newDay} onChange={e => setNewDay(Number(e.target.value))} min={1} max={31} className="w-16 p-2 text-xs border border-[#E8E3DE] rounded-lg" /><button onClick={() => { if(newLabel){setCustomDates([...customDates,{m:cur,d:newDay,l:newLabel}]);setNewLabel("");setAdding(false);} }} className="flex-1 p-2 text-xs bg-[#2C2825] text-white rounded-lg">Add</button><button onClick={() => setAdding(false)} className="p-2 text-xs border border-[#E8E3DE] rounded-lg">Cancel</button></div></div>
                ) : (
                  <button onClick={() => setAdding(true)} className="w-full p-2 text-xs border border-dashed border-[#D4CEC7] rounded-lg text-[#8A8279] flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Add Date</button>
                )}
              </div>
              <button className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-700 text-sm flex items-center gap-3"><Wand2 className="w-5 h-5" /><div className="text-left"><p className="font-medium">AI Auto-Fill</p><p className="text-[10px] text-purple-500">Best photo for each month</p></div></button>
              <button className="w-full p-4 rounded-2xl bg-[#2C2825] text-white font-medium flex items-center justify-center gap-2"><ShoppingCart className="w-5 h-5" /> Order Calendar — $19</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
