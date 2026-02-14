"use client";

import { useState } from "react";

export default function BallTrackingApp() {
  const [step, setStep] = useState("intro");

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
                onChange={() => setStep("processing")}
              />

              <span className="text-sm text-gray-500">
                Drag & Drop or Click to Browse
              </span>
            </label>
          </div>
        )}

        {step === "processing" && (
          <div className="text-center space-y-6">
            
            <div className="animate-pulse text-2xl">
              Processing Footage...
            </div>

            <div className="w-full bg-gray-800 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full w-2/3 animate-pulse"></div>
            </div>

            <button
              onClick={() => setStep("complete")}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
            >
              Simulate Completion
            </button>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center space-y-6">
            
            <div className="text-3xl text-green-400">
              ✅ Tracking Complete
            </div>

            <button
              onClick={() => setStep("intro")}
              className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              Start New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


    setTimeout(() => {
      setProcessing(false);
      setStep("results");
    }, 2500); // simulate processing
  };

  const resetSession = () => {
    setVideo(null);
    setBallColor(null);
    setDecision(null);
    setStep("upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0b1120] to-black text-white flex items-center justify-center">

      {/* INTRO SCREEN */}
      {step === "intro" && (
        <div className="text-center animate-fadeIn">
          <h1 className="text-5xl font-bold text-cyan-400 drop-shadow-[0_0_25px_cyan] mb-10">
            FREE BALL TRACKING SYSTEM
          </h1>

          <button
            onClick={() => setStep("upload")}
            className="px-10 py-4 rounded-full bg-green-500 text-black font-semibold 
                       shadow-[0_0_25px_rgba(34,197,94,0.8)] hover:shadow-[0_0_40px_rgba(34,197,94,1)]
                       transition-all duration-300 animate-pulse"
          >
            START BALL TRACKING
          </button>
        </div>
      )}

      {/* MAIN FLOW CONTAINER */}
      {step !== "intro" && (
        <div className="w-full max-w-4xl p-10 rounded-2xl 
                        bg-gradient-to-br from-[#0b1120] to-[#050816]
                        shadow-[0_0_40px_rgba(0,255,255,0.08)]">

          {/* VIDEO UPLOAD */}
          {step === "upload" && (
            <div className="text-center">
              <h2 className="text-2xl text-cyan-400 mb-6">Upload Cricket Footage</h2>

              <label className="block border-2 border-dashed border-cyan-500/40 
                                rounded-xl p-12 cursor-pointer hover:border-cyan-400 transition">
                <p className="text-gray-400 mb-2">Drag & Drop Video</p>
                <p className="text-sm text-gray-500">or Click to Browse</p>

                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleVideoUpload(e.target.files[0])}
                />
              </label>
            </div>
          )}

          {/* BALL COLOR */}
          {step === "ballColor" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl text-cyan-400 mb-2">Select Ball Color</h2>
              <p className="text-gray-500 mb-8">
                Choose the type of cricket ball to track
              </p>

              <div className="grid grid-cols-2 gap-6">

                {/* RED BALL */}
                <div
                  onClick={() => {
                    setBallColor("red");
                    setStep("decision");
                  }}
                  className={`p-6 rounded-xl cursor-pointer border transition-all
                    ${ballColor === "red"
                      ? "border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.6)]"
                      : "border-red-500/30 hover:border-red-400"}`}
                >
                  <div className="text-3xl mb-3">🔴</div>
                  <h3 className="text-red-400 font-bold">RED BALL</h3>
                  <p className="text-gray-500 text-sm">Test Cricket</p>
                </div>

                {/* WHITE BALL */}
                <div
                  onClick={() => {
                    setBallColor("white");
                    setStep("decision");
                  }}
                  className={`p-6 rounded-xl cursor-pointer border transition-all
                    ${ballColor === "white"
                      ? "border-gray-200 shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                      : "border-gray-400/30 hover:border-gray-200"}`}
                >
                  <div className="text-3xl mb-3">⚪</div>
                  <h3 className="text-white font-bold">WHITE BALL</h3>
                  <p className="text-gray-500 text-sm">Limited Overs</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-6">
                Ball color affects tracking algorithm optimization
              </p>
            </div>
          )}

          {/* UMPIRE DECISION */}
          {step === "decision" && (
            <div className="animate-fadeIn mt-6">
              <h2 className="text-2xl text-cyan-400 mb-6">Umpire Decision</h2>

              <div className="flex gap-6">
                {["OUT", "NOT OUT"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDecision(opt)}
                    className={`flex-1 py-3 rounded-xl border transition-all
                      ${decision === opt
                        ? "border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                        : "border-gray-600 hover:border-cyan-400/50"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {decision && (
                <button
                  onClick={startProcessing}
                  className="w-full mt-8 py-4 rounded-xl bg-cyan-400 text-black font-bold
                             shadow-[0_0_25px_rgba(0,255,255,0.6)]
                             hover:shadow-[0_0_40px_rgba(0,255,255,1)]
                             transition-all"
                >
                  START BALL TRACKING
                </button>
              )}
            </div>
          )}

          {/* PROCESSING */}
          {step === "processing" && (
            <div className="text-center animate-fadeIn">
              <h2 className="text-2xl text-cyan-400 mb-6">Processing Delivery</h2>

              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent 
                              rounded-full animate-spin mx-auto" />

              <p className="text-gray-500 mt-4">
                Analysing Ball Trajectory...
              </p>
            </div>
          )}

          {/* RESULTS */}
          {step === "results" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl text-cyan-400 mb-8">Tracking Results</h2>

              <div className="grid grid-cols-2 gap-4">

                <button className="result-btn">Preview Original Video</button>
                <button className="result-btn">Preview Processed Video</button>
                <button className="result-btn">Download Processed Video</button>
                <button onClick={resetSession} className="result-btn reset">
                  Clear Session / Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
