"use client";

import { useState } from "react";

export default function BallTrackingApp() {
  const [step, setStep] = useState("intro");
  const [processing, setProcessing] = useState(false);

  const handleUpload = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setStep("results");
    }, 2500);
  };

  const resetSession = () => {
    setStep("intro");
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
      
      <div className="w-full max-w-3xl bg-gray-900/60 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-gray-800">
        
        <h1 className="text-4xl font-bold mb-6 text-center">
          Ball Tracking System
        </h1>

        {step === "intro" && (
          <div className="text-center space-y-6">
            
            <p className="text-gray-400">
              Upload your cricket footage to begin tracking analysis
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-10 cursor-pointer hover:border-blue-500 transition">
              
              <span className="text-lg mb-3">📁 Upload Video</span>

              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleUpload}
              />

              <span className="text-sm text-gray-500">
                Drag & Drop or Click to Browse
              </span>
            </label>
          </div>
        )}

        {processing && (
          <div className="text-center space-y-6">
            
            <div className="animate-pulse text-2xl">
              Processing Footage...
            </div>

            <div className="w-full bg-gray-800 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full w-2/3 animate-pulse"></div>
            </div>
          </div>
        )}

        {step === "results" && !processing && (
          <div className="text-center space-y-6">
            
            <div className="text-3xl text-green-400">
              ✅ Tracking Complete
            </div>

            <button
              onClick={resetSession}
              className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              Start New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
<div className="bg-red-500 p-10">
  TEST
</div>
}
