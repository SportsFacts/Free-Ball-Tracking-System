"use client";

import { useState, useEffect } from "react";

export default function BallTrackingApp() {
  const [step, setStep] = useState("intro"); 
  const [ballColor, setBallColor] = useState("red");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [umpireDecision, setUmpireDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(null);
  const [verdict, setVerdict] = useState("");
  const [activeView, setActiveView] = useState("processed"); // Toggles between original/processed

  // Update this to your EXACT Hugging Face direct space URL
  const BACKEND_URL = "https://sportsfacts-freeballtrackingsystem.hf.space/analyze";

  // Cleanup Blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (processedVideo) URL.revokeObjectURL(processedVideo);
    };
  }, [previewUrl, processedVideo]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep("umpire"); // Move to decision selection
    }
  };

  const startAnalysis = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("ballColor", ballColor);
    formData.append("umpireDecision", umpireDecision);

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
        mode: "cors", // Explicitly handle Cross-Origin
      });

      if (!res.ok) throw new Error(`Server Error: ${res.status}`);

      // 1. Get the Processed Video Blob
      const videoBlob = await res.blob();
      const videoObjectUrl = URL.createObjectURL(videoBlob);
      setProcessedVideo(videoObjectUrl);

      // 2. Extract the Final Verdict from custom HTTP Header
      const backendVerdict = res.headers.get("X-Verdict");
      setVerdict(backendVerdict || "NOT OUT");
      
      setStep("results");
      setActiveView("processed");
    } catch (err) {
      console.error("Connection Error:", err);
      alert("CONNECTION FAILED: Make sure your Hugging Face Space is Public and the app.py bridge is working.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a0f] text-white flex flex-col items-center justify-center p-6 font-sans">
      
      {/* 1. INTRO SCREEN */}
      {step === "intro" && (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            HAWK-EYE SYSTEM
          </h1>
          <p className="text-cyan-500 tracking-[0.3em] font-bold text-sm uppercase">Free Ball Tracking Technology</p>
          <button 
            onClick={() => setStep("colour")} 
            className="px-12 py-4 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 font-black rounded-full hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            START ANALYSIS
          </button>
        </div>
      )}

      {/* 2. COLOR SELECTION */}
      {step === "colour" && (
        <div className="bg-[#0b141d] border border-cyan-500/20 p-10 rounded-3xl max-w-lg w-full text-center shadow-2xl">
          <h2 className="text-2xl font-bold mb-8 text-cyan-400 italic">SELECT BALL TYPE</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div 
              onClick={() => setBallColor("red")} 
              className={`p-6 rounded-2xl border-2 cursor-pointer transition ${ballColor === 'red' ? 'border-red-600 bg-red-600/10' : 'border-gray-800'}`}
            >
              <div className="w-12 h-12 bg-red-600 rounded-full mx-auto mb-3 shadow-[0_0_15px_red]"></div>
              <p className="font-bold text-xs uppercase tracking-widest">Red Ball</p>
            </div>
            <div 
              onClick={() => setBallColor("white")} 
              className={`p-6 rounded-2xl border-2 cursor-pointer transition ${ballColor === 'white' ? 'border-white bg-white/10' : 'border-gray-800'}`}
            >
              <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-3 shadow-[0_0_15px_white]"></div>
              <p className="font-bold text-xs uppercase tracking-widest">White Ball</p>
            </div>
          </div>
          <button onClick={() => setStep("upload")} className="w-full py-4 bg-cyan-500 text-black font-black rounded-xl hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20">CONTINUE</button>
        </div>
      )}

      {/* 3. UPLOAD & DECISION */}
      {(step === "upload" || step === "umpire") && (
        <div className="w-full max-w-3xl space-y-6 animate-in slide-in-from-bottom-4">
          {!selectedFile ? (
            <label className="border-2 border-dashed border-cyan-500/30 rounded-[40px] p-24 flex flex-col items-center cursor-pointer hover:bg-cyan-500/5 transition group">
              <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
              <span className="text-5xl group-hover:-translate-y-2 transition-transform mb-4">📹</span>
              <p className="font-bold text-cyan-700 tracking-widest uppercase text-xs">Upload Delivery Clip</p>
            </label>
          ) : (
            <div className="bg-[#0b141d] p-6 rounded-3xl border border-cyan-500/20 space-y-6 shadow-2xl">
              <video src={previewUrl} controls className="w-full rounded-2xl border border-cyan-900" />
              
              <div className="bg-black/40 p-6 rounded-2xl border border-cyan-900/30">
                <p className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-[0.3em]">Field Umpire Call</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setUmpireDecision("OUT")} className={`py-4 rounded-xl font-bold border-2 transition ${umpireDecision === 'OUT' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-gray-800 text-gray-500'}`}>OUT</button>
                  <button onClick={() => setUmpireDecision("NOT OUT")} className={`py-4 rounded-xl font-bold border-2 transition ${umpireDecision === 'NOT OUT' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-gray-800 text-gray-500'}`}>NOT OUT</button>
                </div>
              </div>

              <button 
                disabled={!umpireDecision || loading} 
                onClick={startAnalysis} 
                className="w-full py-5 bg-cyan-500 text-black font-black text-xl rounded-2xl disabled:opacity-20 shadow-lg shadow-cyan-500/20 active:scale-95 transition"
              >
                {loading ? "ANALYZING TRAJECTORY..." : "RUN HAWK-EYE"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. RESULTS */}
      {step === "results" && (
        <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-700">
          <div className="relative rounded-[32px] overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_50px_rgba(0,242,255,0.15)]">
            <video 
              key={activeView} 
              src={activeView === 'processed' ? processedVideo : previewUrl} 
              autoPlay 
              controls 
              className="w-full" 
            />
            <div className="absolute top-6 left-6 bg-black/80 px-4 py-1 rounded-full text-[10px] font-black tracking-widest border border-cyan-500/30 text-cyan-400 uppercase">
              {activeView} View
            </div>
          </div>

          <div className="bg-[#0b141d] border-2 border-cyan-500/50 p-12 rounded-[40px] text-center shadow-2xl">
            <p className="text-[10px] font-black tracking-[0.5em] text-cyan-800 mb-2 uppercase italic">Hawk-Eye Final Verdict</p>
            <div className={`text-9xl font-black italic tracking-tighter ${verdict === 'OUT' ? 'text-red-500 drop-shadow-[0_0_20px_#ef4444]' : 'text-emerald-500 drop-shadow-[0_0_20px_#10b981]'}`}>
              {verdict}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveView("original")} className={`py-4 rounded-xl font-black text-[10px] border tracking-widest transition ${activeView === 'original' ? 'bg-cyan-500 text-black border-cyan-500' : 'border-gray-800 text-gray-500 hover:text-white'}`}>PREVIEW ORIGINAL</button>
            <button onClick={() => setActiveView("processed")} className={`py-4 rounded-xl font-black text-[10px] border tracking-widest transition ${activeView === 'processed' ? 'bg-cyan-500 text-black border-cyan-500' : 'border-gray-800 text-gray-500 hover:text-white'}`}>PREVIEW PROCESSED</button>
            <a 
              href={processedVideo} 
              download="HawkEye_Result.mp4" 
              className="py-4 bg-[#0b141d] border border-cyan-900 rounded-xl font-black text-[10px] tracking-widest text-center hover:border-cyan-400 transition"
            >
              DOWNLOAD VIDEO
            </a>
            <button 
              onClick={() => window.location.reload()} 
              className="py-4 bg-red-500/10 border border-red-500/40 rounded-xl font-black text-[10px] tracking-widest text-red-500 hover:bg-red-600 hover:text-white transition"
            >
              NEW ANALYSIS
            </button>
          </div>
        </div>
      )}

      <footer className="mt-12 text-[10px] text-gray-800 font-bold uppercase tracking-[0.5em]">
        Hawk-Eye Decision Support System • {new Date().getFullYear()}
      </footer>
    </div>
  );
}
