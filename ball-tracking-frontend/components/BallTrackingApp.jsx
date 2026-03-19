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
  const [activeView, setActiveView] = useState("processed"); // Toggle for preview buttons

  // URL for your Hugging Face Space
  const BACKEND_URL = "https://sportsfacts-freeballtrackingsystem.hf.space/analyze";

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
      const res = await fetch(BACKEND_URL, { method: "POST", body: formData });

      if (!res.ok) throw new Error("Connection failed");

      const videoBlob = await res.blob();
      setProcessedVideo(URL.createObjectURL(videoBlob));
      setVerdict(res.headers.get("X-Verdict") || "NOT OUT");
      setStep("results");
      setActiveView("processed");
    } catch (err) {
      alert("Analysis failed. Ensure the Hugging Face space is Public and Running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a0f] text-cyan-50 flex flex-col items-center justify-center p-6 font-sans">
      
      {step === "intro" && (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">FREE BALL TRACKING</h1>
          <button onClick={() => setStep("colour")} className="mt-8 px-12 py-4 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 font-bold rounded-full hover:bg-emerald-500 hover:text-black transition-all">START TRACKING</button>
        </div>
      )}

      {step === "colour" && (
        <div className="bg-[#0b141d] border border-cyan-500/20 p-10 rounded-3xl max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-8 text-cyan-400">SELECT BALL COLOR</h2>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div onClick={() => setBallColor("red")} className={`p-6 rounded-xl border-2 cursor-pointer transition ${ballColor === 'red' ? 'border-red-600 bg-red-600/10' : 'border-gray-800'}`}>
              <div className="w-10 h-10 bg-red-600 rounded-full mx-auto mb-3 shadow-[0_0_15px_red]"></div>
              <p className="font-bold text-xs uppercase tracking-widest">Red Ball</p>
            </div>
            <div onClick={() => setBallColor("white")} className={`p-6 rounded-xl border-2 cursor-pointer transition ${ballColor === 'white' ? 'border-white bg-white/10' : 'border-gray-800'}`}>
              <div className="w-10 h-10 bg-slate-100 rounded-full mx-auto mb-3 shadow-[0_0_15px_white]"></div>
              <p className="font-bold text-xs uppercase tracking-widest">White Ball</p>
            </div>
          </div>
          <button onClick={() => setStep("upload")} className="w-full py-4 bg-cyan-500 text-black font-black rounded-xl hover:bg-cyan-400 transition">CONTINUE</button>
        </div>
      )}

      {step === "upload" && (
        <div className="w-full max-w-3xl space-y-6">
          {!selectedFile ? (
            <label className="border-2 border-dashed border-cyan-500/30 rounded-3xl p-20 flex flex-col items-center cursor-pointer hover:bg-cyan-500/5 transition group">
              <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
              <span className="text-4xl group-hover:-translate-y-2 transition-transform">📁</span>
              <p className="mt-4 font-bold text-cyan-700">UPLOAD VIDEO CLIP</p>
            </label>
          ) : (
            <div className="bg-[#0b141d] p-6 rounded-3xl border border-cyan-500/20 space-y-6">
              <video src={previewUrl} controls className="w-full rounded-xl shadow-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setUmpireDecision("OUT")} className={`py-4 rounded-xl font-bold border-2 transition ${umpireDecision === 'OUT' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-gray-800 text-gray-500'}`}>OUT</button>
                <button onClick={() => setUmpireDecision("NOT OUT")} className={`py-4 rounded-xl font-bold border-2 transition ${umpireDecision === 'NOT OUT' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-gray-800 text-gray-500'}`}>NOT OUT</button>
              </div>
              <button disabled={!umpireDecision || loading} onClick={startAnalysis} className="w-full py-5 bg-cyan-500 text-black font-black text-xl rounded-xl disabled:opacity-20 shadow-lg shadow-cyan-500/20">
                {loading ? "ANALYZING TRAJECTORY..." : "RUN ANALYSIS"}
              </button>
            </div>
          )}
        </div>
      )}

      {step === "results" && (
        <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-700">
          <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl">
            <video key={activeView} src={activeView === "processed" ? processedVideo : previewUrl} autoPlay controls className="w-full" />
            <div className="absolute top-4 left-4 bg-black/80 px-4 py-1 rounded-full text-[10px] font-black tracking-widest border border-cyan-500/30 text-cyan-400">
              {activeView.toUpperCase()} VIEW
            </div>
          </div>

          <div className="bg-[#0b141d] border-2 border-cyan-500/50 p-10 rounded-[30px] text-center">
            <p className="text-[10px] font-black tracking-[0.5em] text-cyan-800 mb-2 uppercase">Decision Support System</p>
            <div className={`text-9xl font-black italic italic tracking-tighter ${verdict === 'OUT' ? 'text-red-500' : 'text-emerald-500'}`}>
              {verdict}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveView("original")} className={`py-4 rounded-xl font-black text-[10px] border tracking-widest transition ${activeView === 'original' ? 'bg-cyan-500 text-black border-cyan-500' : 'border-gray-800 text-gray-500'}`}>VIEW ORIGINAL</button>
            <button onClick={() => setActiveView("processed")} className={`py-4 rounded-xl font-black text-[10px] border tracking-widest transition ${activeView === 'processed' ? 'bg-cyan-500 text-black border-cyan-500' : 'border-gray-800 text-gray-500'}`}>VIEW PROCESSED</button>
            <a href={processedVideo} download="HawkEye_Result.mp4" className="py-4 bg-[#0b141d] border border-cyan-900 rounded-xl font-black text-[10px] tracking-widest text-center">DOWNLOAD VIDEO</a>
            <button onClick={() => window.location.reload()} className="py-4 bg-red-500/10 border border-red-500/40 rounded-xl font-black text-[10px] tracking-widest text-red-500">NEW ANALYSIS</button>
          </div>
        </div>
      )}
    </div>
  );
}
