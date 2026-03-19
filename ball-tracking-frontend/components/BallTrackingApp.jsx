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
  const [activeView, setActiveView] = useState("processed");

  // CHANGE THIS TO YOUR EXACT SPACE URL:
  // Format: https://{username}-{spacename}.hf.space/analyze
  const BACKEND_URL = "https://sportsfacts-freeballtrackingsystem.hf.space/analyze";

  const startAnalysis = async () => {
    if (!selectedFile) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("ballColor", ballColor);
    formData.append("umpireDecision", umpireDecision);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
        mode: "cors", // Explicitly set CORS mode
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Server Error");
      }

      const videoBlob = await res.blob();
      setProcessedVideo(URL.createObjectURL(videoBlob));
      
      // Get the verdict from custom header
      const v = res.headers.get("X-Verdict");
      setVerdict(v || "NOT OUT");
      
      setStep("results");
      setActiveView("processed");
    } catch (err) {
      console.error("Connection Error:", err);
      alert("CONNECTION FAILED: " + err.message + ". Check if the Hugging Face Space is Public and Running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep("umpire"); // Move to umpire decision screen
    }
  };

  return (
    <div className="min-h-screen bg-[#050a0f] text-white flex flex-col items-center justify-center p-4">
      
      {/* INTRO */}
      {step === "intro" && (
        <div className="text-center">
          <h1 className="text-5xl font-black text-cyan-400 mb-8">FREE BALL TRACKING</h1>
          <button onClick={() => setStep("colour")} className="bg-emerald-500 px-10 py-4 rounded-lg font-bold text-black">START TRACKING</button>
        </div>
      )}

      {/* BALL COLOUR */}
      {step === "colour" && (
        <div className="bg-[#0b141d] p-10 rounded-3xl border border-cyan-500/20 text-center w-full max-w-md">
          <h2 className="text-xl font-bold mb-6">SELECT BALL COLOR</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button onClick={() => setBallColor("red")} className={`p-4 rounded-xl border-2 ${ballColor === 'red' ? 'border-red-500' : 'border-gray-800'}`}>RED</button>
            <button onClick={() => setBallColor("white")} className={`p-4 rounded-xl border-2 ${ballColor === 'white' ? 'border-white' : 'border-gray-800'}`}>WHITE</button>
          </div>
          <button onClick={() => setStep("upload")} className="w-full bg-cyan-500 py-3 rounded-lg text-black font-bold">NEXT</button>
        </div>
      )}

      {/* UPLOAD & UMPIRE */}
      {(step === "upload" || step === "umpire") && (
        <div className="w-full max-w-2xl bg-[#0b141d] p-6 rounded-3xl border border-cyan-500/20">
          {!selectedFile ? (
            <label className="border-2 border-dashed border-gray-700 p-20 flex flex-col items-center cursor-pointer">
              <input type="file" className="hidden" onChange={handleFile} />
              <p>Click to Upload Video</p>
            </label>
          ) : (
            <div className="space-y-4">
              <video src={previewUrl} controls className="w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setUmpireDecision("OUT")} className={`p-4 rounded-xl border-2 ${umpireDecision === 'OUT' ? 'border-red-500 text-red-500' : 'border-gray-800'}`}>OUT</button>
                <button onClick={() => setUmpireDecision("NOT OUT")} className={`p-4 rounded-xl border-2 ${umpireDecision === 'NOT OUT' ? 'border-emerald-500 text-emerald-500' : 'border-gray-800'}`}>NOT OUT</button>
              </div>
              <button disabled={loading || !umpireDecision} onClick={startAnalysis} className="w-full bg-cyan-500 py-4 rounded-xl text-black font-bold uppercase tracking-widest">
                {loading ? "PROCESSING..." : "ANALYZE DELIVERY"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* RESULTS */}
      {step === "results" && (
        <div className="w-full max-w-4xl space-y-6">
          <div className="relative border-2 border-cyan-500 rounded-2xl overflow-hidden">
            <video key={activeView} src={activeView === "processed" ? processedVideo : previewUrl} autoPlay controls className="w-full" />
            <div className="absolute top-2 left-2 bg-black/60 px-3 py-1 rounded text-[10px] uppercase">{activeView} VIEW</div>
          </div>

          <div className="bg-[#0b141d] border-2 border-cyan-500 p-8 rounded-3xl text-center">
             <div className={`text-8xl font-black italic ${verdict === 'OUT' ? 'text-red-500' : 'text-emerald-500'}`}>{verdict}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveView("original")} className="p-4 border border-cyan-900 rounded-xl text-xs font-bold">PREVIEW ORIGINAL</button>
            <button onClick={() => setActiveView("processed")} className="p-4 border border-cyan-900 rounded-xl text-xs font-bold">PREVIEW PROCESSED</button>
            <a href={processedVideo} download className="p-4 bg-cyan-900 rounded-xl text-xs font-bold text-center">DOWNLOAD VIDEO</a>
            <button onClick={() => window.location.reload()} className="p-4 bg-red-900/20 text-red-500 rounded-xl text-xs font-bold">RESET</button>
          </div>
        </div>
      )}
    </div>
  );
}
