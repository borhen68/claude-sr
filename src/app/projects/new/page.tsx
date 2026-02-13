"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Check, ArrowRight, ArrowLeft, Loader2, Image, Wand2, LayoutGrid, Palette, X } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

type Step = "upload" | "analyzing" | "results" | "template" | "generating" | "done";

interface AnalysisResult {
  themes: string[];
  dominantColors: string[];
  emotion: string;
  eventType: string;
  timeRange: string;
  mood: string[];
  coverSuggestion: { photoIndex: number; reason: string };
}

const templates = [
  { id: "quiet-luxe", name: "Quiet Luxe", description: "Minimal elegance, warm tones, editorial feel", colors: ["#F5F0EB", "#2C2825", "#D4CEC7", "#E8D5B7"] },
  { id: "bold-story", name: "Bold Story", description: "High contrast, dramatic layouts, strong typography", colors: ["#1a1a1a", "#ffffff", "#ff4444", "#333333"] },
  { id: "garden-party", name: "Garden Party", description: "Soft pastels, floral accents, light & airy", colors: ["#f8f5f0", "#6b7c5e", "#d4a9a1", "#e8ddd3"] },
  { id: "urban-journal", name: "Urban Journal", description: "Monochrome base, gritty textures, street style", colors: ["#f0f0f0", "#222222", "#888888", "#cccccc"] },
  { id: "golden-hour", name: "Golden Hour", description: "Warm amber tones, sunset palette, dreamy", colors: ["#fdf6e3", "#b58900", "#cb4b16", "#6c4e31"] },
  { id: "arctic-clean", name: "Arctic Clean", description: "Cool whites, icy blues, ultra-minimal", colors: ["#f7f9fc", "#4a90d9", "#2c3e50", "#ecf0f1"] },
];

export default function NewProject() {
  const [step, setStep] = useState<Step>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [title, setTitle] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("quiet-luxe");
  const [analyzeProgress, setAnalyzeProgress] = useState(0);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    setStep("analyzing");
    // Simulate progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((r) => setTimeout(r, 60));
      setAnalyzeProgress(i);
    }
    setAnalysis({
      themes: ["family", "celebration", "outdoor", "nature"],
      dominantColors: ["#E8D5B7", "#4A6741", "#8B4513", "#F5F0EB", "#87CEEB"],
      emotion: "Joyful & Warm",
      eventType: "Family Gathering",
      timeRange: "June 15-17, 2024",
      mood: ["intimate", "unhurried", "refined"],
      coverSuggestion: { photoIndex: 3, reason: "Best emotional expression with balanced composition and golden light" },
    });
    setStep("results");
  };

  const generateBook = async () => {
    setStep("generating");
    await new Promise((r) => setTimeout(r, 3000));
    setStep("done");
  };

  const stepIndex = ["upload", "analyzing", "results", "template", "generating", "done"].indexOf(step);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {["Upload", "Analysis", "Template", "Generate"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 ${
                  i <= Math.min(stepIndex, 3) / 1 ? "bg-[#2C2825] text-white scale-110" : "bg-[#E8E3DE] text-[#8A8279]"
                } ${i === Math.floor(stepIndex / (stepIndex <= 2 ? 1 : 1.5)) ? "ring-4 ring-[#2C2825]/20" : ""}`}>
                  {i < stepIndex / 1.5 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs text-[#8A8279] hidden sm:block">{label}</span>
                {i < 3 && <div className={`w-12 h-px transition-colors duration-500 ${i < stepIndex / 1.5 ? "bg-[#2C2825]" : "bg-[#E8E3DE]"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* UPLOAD STEP */}
            {step === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-serif font-light mb-3">Create Your Photo Book</h1>
                  <p className="text-[#8A8279]">Upload your photos and let AI design your book</p>
                </div>

                <div className="mb-6">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Name your book (e.g., Summer in Tuscany)"
                    className="w-full p-4 text-lg font-serif bg-white border border-[#E8E3DE] rounded-2xl focus:outline-none focus:border-[#2C2825] text-center placeholder:text-[#D4CEC7]"
                  />
                </div>

                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                    dragOver ? "border-[#2C2825] bg-[#2C2825]/5 scale-[1.01]" : "border-[#D4CEC7] hover:border-[#8A8279] bg-white"
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F0EB] rounded-2xl flex items-center justify-center">
                    <Upload className={`w-7 h-7 transition-colors ${dragOver ? "text-[#2C2825]" : "text-[#8A8279]"}`} />
                  </div>
                  <p className="text-lg font-medium mb-2">Drop your photos here</p>
                  <p className="text-[#8A8279] text-sm mb-4">or click to browse · JPG, PNG, HEIC · up to 500 photos</p>
                  <label className="inline-block px-6 py-2.5 bg-[#2C2825] text-white rounded-xl cursor-pointer hover:bg-[#3d3a36] transition-colors text-sm">
                    Browse Files
                    <input type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
                  </label>
                </div>

                {files.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">{files.length} photos selected</span>
                      <button onClick={() => setFiles([])} className="text-xs text-red-500 hover:text-red-700">Clear all</button>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-1">
                      {files.map((file, i) => (
                        <div key={i} className="aspect-square bg-gradient-to-br from-[#D4CEC7] to-[#c4bdb4] rounded-lg relative group">
                          <button onClick={() => removeFile(i)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={startAnalysis}
                      disabled={files.length < 3}
                      className="mt-6 w-full py-4 bg-[#2C2825] text-white rounded-2xl font-medium hover:bg-[#3d3a36] disabled:opacity-30 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                      <Sparkles className="w-5 h-5" /> Analyze with AI
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ANALYZING STEP */}
            {step === "analyzing" && (
              <motion.div key="analyzing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-8 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-[#E8E3DE]" />
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="#2C2825" strokeWidth="4" strokeDasharray={`${analyzeProgress * 2.26} 226`} strokeLinecap="round" className="transition-all duration-200" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-mono font-medium">{analyzeProgress}%</span>
                  </div>
                </div>
                <h2 className="text-2xl font-serif font-light mb-3">Analyzing your photos...</h2>
                <div className="space-y-2 text-sm text-[#8A8279]">
                  <p className={analyzeProgress > 10 ? "text-[#2C2825]" : ""}>🔍 Detecting faces and subjects...</p>
                  <p className={analyzeProgress > 30 ? "text-[#2C2825]" : ""}>🎨 Extracting color palettes...</p>
                  <p className={analyzeProgress > 50 ? "text-[#2C2825]" : ""}>💭 Understanding emotions and themes...</p>
                  <p className={analyzeProgress > 70 ? "text-[#2C2825]" : ""}>📅 Building timeline...</p>
                  <p className={analyzeProgress > 90 ? "text-[#2C2825]" : ""}>✨ Choosing design direction...</p>
                </div>
              </motion.div>
            )}

            {/* RESULTS STEP */}
            {step === "results" && analysis && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-10">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                  </motion.div>
                  <h2 className="text-2xl font-serif font-light mb-2">Analysis Complete</h2>
                  <p className="text-[#8A8279]">Here is what our AI discovered about your photos</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E3DE]">
                    <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Detected Emotion</h3>
                    <p className="text-2xl font-serif">{analysis.emotion}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E3DE]">
                    <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Event Type</h3>
                    <p className="text-2xl font-serif">{analysis.eventType}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E3DE]">
                    <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Timeline</h3>
                    <p className="text-lg font-serif">{analysis.timeRange}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E3DE]">
                    <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Mood</h3>
                    <div className="flex gap-2">{analysis.mood.map((m) => <span key={m} className="px-3 py-1 bg-[#F5F0EB] rounded-full text-sm capitalize">{m}</span>)}</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E3DE]">
                    <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Themes</h3>
                    <div className="flex flex-wrap gap-2">{analysis.themes.map((t) => <span key={t} className="px-3 py-1 bg-[#F5F0EB] rounded-full text-sm capitalize">{t}</span>)}</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E3DE]">
                    <h3 className="text-xs uppercase tracking-wider text-[#8A8279] mb-3">Color Palette</h3>
                    <div className="flex gap-2">{analysis.dominantColors.map((c) => <div key={c} className="w-10 h-10 rounded-xl shadow-inner border border-white/50" style={{ backgroundColor: c }} />)}</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 mb-8">
                  <div className="flex items-start gap-3">
                    <Wand2 className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-purple-900 mb-1">AI Cover Recommendation</h3>
                      <p className="text-sm text-purple-700">{analysis.coverSuggestion.reason}</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => setStep("template")} className="w-full py-4 bg-[#2C2825] text-white rounded-2xl font-medium hover:bg-[#3d3a36] transition-all flex items-center justify-center gap-2">
                  Choose Template <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* TEMPLATE STEP */}
            {step === "template" && (
              <motion.div key="template" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-serif font-light mb-2">Choose Your Design</h2>
                  <p className="text-[#8A8279]">AI recommends <strong>Quiet Luxe</strong> based on your photos</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {templates.map((t) => (
                    <motion.div
                      key={t.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all ${
                        selectedTemplate === t.id ? "border-[#2C2825] shadow-lg" : "border-[#E8E3DE] hover:border-[#8A8279]"
                      }`}
                    >
                      {t.id === "quiet-luxe" && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mb-2 inline-block">AI Recommended</span>}
                      <div className="flex gap-1.5 mb-3">
                        {t.colors.map((c) => <div key={c} className="w-8 h-8 rounded-lg" style={{ backgroundColor: c }} />)}
                      </div>
                      <h3 className="font-medium mb-1">{t.name}</h3>
                      <p className="text-xs text-[#8A8279]">{t.description}</p>
                      {selectedTemplate === t.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-3 flex items-center gap-1 text-xs text-[#2C2825] font-medium">
                          <Check className="w-4 h-4" /> Selected
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("results")} className="px-6 py-4 border border-[#E8E3DE] rounded-2xl hover:border-[#2C2825] transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={generateBook} className="flex-1 py-4 bg-[#2C2825] text-white rounded-2xl font-medium hover:bg-[#3d3a36] transition-all flex items-center justify-center gap-2">
                    <Wand2 className="w-5 h-5" /> Generate My Book <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* GENERATING STEP */}
            {step === "generating" && (
              <motion.div key="generating" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-16">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 mx-auto mb-8">
                  <Wand2 className="w-16 h-16 text-[#2C2825]" />
                </motion.div>
                <h2 className="text-2xl font-serif font-light mb-3">Creating your masterpiece...</h2>
                <p className="text-[#8A8279]">AI is designing {files.length || 24} pages with the {selectedTemplate.replace("-", " ")} template</p>
              </motion.div>
            )}

            {/* DONE STEP */}
            {step === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}>
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-serif font-light mb-3">Your book is ready!</h2>
                <p className="text-[#8A8279] mb-8">13 pages designed with the Quiet Luxe template</p>
                <Link href="/editor/new" className="inline-flex items-center gap-2 px-8 py-4 bg-[#2C2825] text-white rounded-2xl font-medium hover:bg-[#3d3a36] transition-all text-lg">
                  Open in Editor <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
