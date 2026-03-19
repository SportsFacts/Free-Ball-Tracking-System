"use client";

import { useState, useEffect } from "react";

export default function BallTrackingApp() {
  const [step, setStep] = useState("intro"); // intro, colour, upload, results
  const [ballColor, setBallColor] = useState("red");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [umpireDecision, setUmpireDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(null);
  const [verdict, setVerdict] = useState("");

  // Cleanup object URLs to prevent memory leaks
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
    }
  };

  const startAnalysis = async () => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("ballColor", ballColor);
    formData.append("umpireDecision", umpireDecision);

    try {
      const res = await fetch("https://sportsfacts-freeballtrackingsystem.hf.space/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Backend connection failed.");

      // 1. Convert video response to a playable Blob URL
      const videoBlob = await res.blob();
      setProcessedVideo(URL.createObjectURL(videoBlob));

      // 2. Read the final verdict from the custom HTTP Header
      const backendVerdict = res.headers.get("X-Verdict");
      setVerdict(backendVerdict || "NOT OUT");
      
      setStep("results");
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check if the Hugging Face backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setStep("intro");
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedVideo(null);
    setUmpireDecision(null);
    setVerdict("");
  };

  return (
    <div className="min-h-screen bg-[#050a0f] text-cyan-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Visual Background Element */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_#00f2ff_0%,_transparent_70%)]"></div>

      {/* 1. INTRO SCREEN */}
      {step === "intro" && (
        <div className="text-center z-10 animate-in fade-in zoom-in duration-500">
          <h1 className="text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600">
            FREE BALL TRACKING
          </h1>
          <p className="text-cyan-500 font-bold tracking-[0.3em] mb-12 uppercase">Professional LBW Decision Review Technology</p>
          <button 
            onClick={() => setStep("colour")}
            className="group relative px-10 py-4 bg-emerald-500/10 border-2 border-emerald-500 rounded-lg transition-all hover:bg-emerald-500 hover:shadow-[0_0_30px_#10b981]"
          >
            <span className="relative z-10 text-emerald-400 group-hover:text-black font-black flex items-center gap-3">
              <span className="text-2xl">▷</span> START BALL TRACKING
            </span>
          </button>
        </div>
      )}

      {/* 2. BALL COLOR SELECTION */}
      {step === "colour" && (
        <div className="bg-[#0b141d]/80 backdrop-blur-xl border border-cyan-500/30 p-12 rounded-3xl shadow-2xl text-center z-10 w-full max-w-xl">
          <h2 className="text-3xl font-black mb-2 text-cyan-400 uppercase italic">Select Ball Color</h2>
          <p className="text-gray-500 text-sm mb-10">Choose the type of cricket ball to track</p>
          
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div 
              onClick={() => setBallColor("red")}
              className={`group p-8 rounded-2xl border-2 cursor-pointer transition-all ${ballColor === 'red' ? 'border-red-500 bg-red-500/10' : 'border-gray-800 bg-black/40'}`}
            >
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 transition ${ballColor === 'red' ? 'bg-red-600 shadow-[0_0_25px_#dc2626]' : 'bg-red-900/40'}`}></div>
              <span className={`font-black block tracking-widest ${ballColor === 'red' ? 'text-red-500' : 'text-gray-600'}`}>RED BALL</span>
              <span className="text-[10px] text-gray-500 mt-1 block">Test Cricket</span>
            </div>
            
            <div 
              onClick={() => setBallColor("white")}
              className={`group p-8 rounded-2xl border-2 cursor-pointer transition-all ${ballColor === 'white' ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-800 bg-black/40'}`}
            >
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 transition ${ballColor === 'white' ? 'bg-slate-100 shadow-[0_0_25px_#f1f5f9]' : 'bg-slate-800/40'}`}></div>
              <span className={`font-black block tracking-widest ${ballColor === 'white' ? 'text-white' : 'text-gray-600'}`}>WHITE BALL</span>
              <span className="text-[10px] text-gray-500 mt-1 block">Limited Overs</span>
            </div>
          </div>
          
          <button onClick={() => setStep("upload")} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black rounded-xl transition shadow-lg shadow-cyan-900/20">CONTINUE</button>
        </div>
      )}

      {/* 3 & 4. UPLOAD & PREVIEW SCREEN */}
      {step === "upload" && (
        <div className="w-full max-w-4xl z-10">
          <div className="bg-[#0b141d]/90 border border-cyan-900/50 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="text-cyan-400">📹</span> UPLOAD VIDEO
            </h2>
            
            {!selectedFile ? (
               <label className="border-2 border-dashed border-cyan-900/50 rounded-2xl p-24 flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-500/5 transition group">
                 <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                 <div className="text-5xl mb-6 group-hover:-translate-y-2 transition-transform text-cyan-500">⬆</div>
                 <p className="font-black text-xl tracking-tight">Drop your video here or click to browse</p>
                 <p className="text-xs text-gray-500 mt-3 uppercase tracking-widest">Supports MP4, MOV, AVI formats</p>
               </label>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-900 shadow-2xl">
                    <video src={previewUrl} controls className="w-full" />
                </div>
                
                <div className="bg-black/60 p-8 rounded-2xl border border-cyan-900/30">
                  <p className="text-xs font-black text-gray-500 mb-6 uppercase tracking-[0.3em]">Original Decision</p>
                  <div className="grid grid-cols-2 gap-6">
                    <button 
                      onClick={() => setUmpireDecision("OUT")}
                      className={`py-5 rounded-xl font-black border-2 transition-all ${umpireDecision === 'OUT' ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-gray-800 text-gray-600'}`}
                    >
                      ⓧ OUT
                    </button>
                    <button 
                      onClick={() => setUmpireDecision("NOT OUT")}
                      className={`py-5 rounded-xl font-black border-2 transition-all ${umpireDecision === 'NOT OUT' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-gray-800 text-gray-600'}`}
                    >
                      ✓ NOT OUT
                    </button>
                  </div>
                </div>

                <button 
                  disabled={!umpireDecision || loading}
                  onClick={startAnalysis}
                  className="w-full py-5 bg-cyan-400 hover:bg-cyan-300 text-[#050a0f] font-black text-xl rounded-xl disabled:opacity-20 flex items-center justify-center gap-4 transition-all"
                >
                  {loading ? (
                    <><span className="animate-spin text-2xl">🌀</span> PROCESSING VIDEO...</>
                  ) : (
                    <><span className="text-2xl">▶</span> ANALYZE DELIVERY</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. ANALYSIS RESULTS */}
      {step === "results" && (
        <div className="w-full max-w-5xl z-10 animate-in fade-in duration-700">
          <h2 className="text-cyan-500 font-black mb-6 text-left uppercase tracking-[0.5em] italic">Analysis Results</h2>
          
          <div className="bg-[#0b141d]/90 border-2 border-cyan-500/50 p-16 rounded-[40px] mb-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.1)]">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] text-cyan-700 font-black tracking-[1em]">HAWK-EYE VERDICT</div>
            <div className={`text-[10rem] leading-none text-center font-black italic tracking-tighter ${verdict === 'OUT' ? 'text-red-500 drop-shadow-[0_0_30px_#ef4444]' : 'text-emerald-500 drop-shadow-[0_0_30px_#10b981]'}`}>
              {verdict}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
             <button onClick={() => window.open(previewUrl)} className="py-5 bg-[#0b141d] border border-cyan-900/50 rounded-xl font-black text-xs tracking-widest hover:border-cyan-400 transition text-white">PREVIEW ORIGINAL</button>
             <button onClick={() => window.open(processedVideo)} className="py-5 bg-[#0b141d] border border-cyan-900/50 rounded-xl font-black text-xs tracking-widest hover:border-cyan-400 transition text-white">PREVIEW PROCESSED</button>
          </div>
          <div className="grid grid-cols-2 gap-6">
             <a href={processedVideo} download="ball_tracking_result.mp4" className="py-5 bg-[#0b141d] border border-cyan-900/50 rounded-xl font-black text-xs tracking-widest hover:border-cyan-400 text-center transition text-white block">DOWNLOAD VIDEO</a>
             <button 
                onClick={resetSession} 
                className="py-5 bg-red-500/10 border border-red-500/30 rounded-xl font-black text-xs tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition"
             >
                CLEAR SESSION / RESET
             </button>
          </div>
        </div>
      )}
      
      <footer className="mt-12 text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em] z-10">
        Free Ball Tracking System • Powered by Computer Vision
      </footer>
    </div>
  );
}
