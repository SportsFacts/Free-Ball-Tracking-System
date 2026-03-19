"use client";

import { useState, useEffect, useRef } from "react";

export default function BallTrackingApp() {
  const [step, setStep] = useState("intro"); 
  const [ballColor, setBallColor] = useState("red");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [umpireDecision, setUmpireDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(null);
  const [verdict, setVerdict] = useState("");
  const [activeView, setActiveView] = useState("processed"); // 'original' or 'processed'

  const videoPlayerRef = useRef(null);

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
      const res = await fetch("https://sportsfacts-freeballtrackingsystem.hf.space", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Backend connection failed.");

      const videoBlob = await res.blob();
      setProcessedVideo(URL.createObjectURL(videoBlob));
      setVerdict(res.headers.get("X-Verdict") || "NOT OUT");
      setStep("results");
      setActiveView("processed"); 
    } catch (err) {
      alert("Analysis failed. Ensure the Hugging Face space is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a0f] text-cyan-50 flex flex-col items-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_#00f2ff_0%,_transparent_70%)]"></div>

      {step === "intro" && (
        <div className="flex-1 flex flex-col items-center justify-center z-10 text-center">
          <h1 className="text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-600">FREE BALL TRACKING</h1>
          <button onClick={() => setStep("colour")} className="px-10 py-4 border-2 border-emerald-500 text-emerald-400 font-black rounded-lg hover:bg-emerald-500 hover:text-black transition-all">START BALL TRACKING</button>
        </div>
      )}

      {step === "colour" && (
        <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-xl">
           <div className="bg-[#0b141d]/80 border border-cyan-500/30 p-12 rounded-3xl w-full text-center">
              <h2 className="text-3xl font-black mb-10 text-cyan-400 italic">SELECT BALL COLOR</h2>
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div onClick={() => setBallColor("red")} className={`p-8 rounded-2xl border-2 cursor-pointer ${ballColor === 'red' ? 'border-red-500 bg-red-500/10' : 'border-gray-800'}`}>
                  <div className="w-12 h-12 bg-red-600 rounded-full mx-auto mb-2"></div>
                  <p className="font-bold">RED BALL</p>
                </div>
                <div onClick={() => setBallColor("white")} className={`p-8 rounded-2xl border-2 cursor-pointer ${ballColor === 'white' ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-800'}`}>
                  <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-2"></div>
                  <p className="font-bold">WHITE BALL</p>
                </div>
              </div>
              <button onClick={() => setStep("upload")} className="w-full py-4 bg-cyan-600 text-black font-black rounded-xl">CONTINUE</button>
           </div>
        </div>
      )}

      {step === "upload" && (
        <div className="w-full max-w-4xl z-10 mt-10">
          {!selectedFile ? (
            <label className="border-2 border-dashed border-cyan-900/50 rounded-2xl p-24 flex flex-col items-center cursor-pointer hover:bg-cyan-500/5 transition">
              <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
              <span className="text-5xl mb-4 text-cyan-500">⬆</span>
              <p className="font-black text-xl">Upload Cricket Delivery</p>
            </label>
          ) : (
            <div className="space-y-6">
              <video src={previewUrl} controls className="w-full rounded-2xl border-2 border-cyan-900 shadow-2xl" />
              <div className="bg-black/40 p-6 rounded-2xl border border-cyan-900/30">
                <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Original Umpire Call</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setUmpireDecision("OUT")} className={`py-4 rounded-xl font-black border-2 ${umpireDecision === 'OUT' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-gray-800 text-gray-600'}`}>OUT</button>
                  <button onClick={() => setUmpireDecision("NOT OUT")} className={`py-4 rounded-xl font-black border-2 ${umpireDecision === 'NOT OUT' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-gray-800 text-gray-600'}`}>NOT OUT</button>
                </div>
              </div>
              <button disabled={!umpireDecision || loading} onClick={startAnalysis} className="w-full py-5 bg-cyan-400 text-[#050a0f] font-black text-xl rounded-xl disabled:opacity-20 transition-all">
                {loading ? "PROCESSING..." : "ANALYZE DELIVERY"}
              </button>
            </div>
          )}
        </div>
      )}

      {step === "results" && (
        <div className="w-full max-w-5xl z-10 animate-in fade-in duration-500 space-y-8">
          {/* Main Display Player */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-500 shadow-[0_0_30px_rgba(0,242,255,0.2)]">
            <video 
              key={activeView} 
              src={activeView === "processed" ? processedVideo : previewUrl} 
              autoPlay 
              controls 
              className="w-full" 
            />
            <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-full border border-cyan-500/50 text-[10px] font-black tracking-widest text-cyan-400">
              VIEWING: {activeView.toUpperCase()}
            </div>
          </div>

          {/* Verdict Box */}
          <div className="bg-[#0b141d]/90 border-2 border-cyan-500/50 p-12 rounded-[40px] text-center shadow-2xl">
            <p className="text-xs text-cyan-700 font-black tracking-[1em] mb-4">HAWK-EYE VERDICT</p>
            <div className={`text-[120px] leading-none font-black italic tracking-tighter ${verdict === 'OUT' ? 'text-red-500' : 'text-emerald-500'}`}>
              {verdict}
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveView("original")} className={`py-4 rounded-xl font-black text-xs tracking-widest border transition ${activeView === 'original' ? 'bg-cyan-500 text-black border-cyan-500' : 'border-cyan-900 text-cyan-600'}`}>
              PREVIEW ORIGINAL
            </button>
            <button onClick={() => setActiveView("processed")} className={`py-4 rounded-xl font-black text-xs tracking-widest border transition ${activeView === 'processed' ? 'bg-cyan-500 text-black border-cyan-500' : 'border-cyan-900 text-cyan-600'}`}>
              PREVIEW PROCESSED
            </button>
            <a href={processedVideo} download="tracking_result.mp4" className="py-4 bg-[#0b141d] border border-cyan-900 rounded-xl font-black text-xs tracking-widest text-white text-center">
              DOWNLOAD VIDEO
            </a>
            <button onClick={() => window.location.reload()} className="py-4 bg-red-500/10 border border-red-500/50 rounded-xl font-black text-xs tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition">
              RESET SESSION
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
