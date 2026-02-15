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
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)]">

      {/* HEADER */}
      <div className="w-full border-b border-cyan-500/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

          <div className="text-cyan-400 font-bold text-xl tracking-wider">
            HAWK-EYE
            <span className="text-xs text-gray-500 block">
              BALL TRACKING SYSTEM
            </span>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm hover:border-cyan-500/40 transition">
              🔴 RED BALL
            </button>

            <button
              onClick={resetSession}
              className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm hover:border-cyan-500/40 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto p-6">

        {/* PANEL */}
        <div className="bg-gradient-to-b from-gray-900/60 to-black/40 backdrop-blur-xl border border-cyan-500/10 rounded-2xl shadow-2xl p-8">

          <h1 className="text-2xl font-semibold text-cyan-400 mb-6">
            Upload Video
          </h1>

          {step === "intro" && (
            <label className="flex flex-col items-center justify-center border border-dashed border-gray-700 rounded-xl p-16 cursor-pointer hover:border-cyan-400/40 transition">

              <div className="text-4xl mb-4 text-cyan-400">
                ⬆
              </div>

              <span className="text-lg text-gray-300">
                Drop your video here or click to browse
              </span>

              <span className="text-sm text-gray-500 mt-2">
                Supports MP4, MOV, AVI formats
              </span>

              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleUpload}
              />
            </label>
          )}

          {processing && (
            <div className="text-center py-16">
              <div className="text-2xl text-cyan-400 animate-pulse">
                Processing Delivery...
              </div>
            </div>
          )}

          {step === "results" && !processing && (
            <div className="space-y-8">

              {/* VERDICT BOX */}
              <div className="bg-black/40 border border-cyan-400/20 rounded-xl p-10 text-center shadow-lg">

                <div className="text-sm text-gray-500 mb-2">
                  HAWK-EYE VERDICT
                </div>

                <div className="text-5xl font-bold text-green-400 tracking-wider">
                  OUT
                </div>
              </div>

              {/* BUTTON GRID */}
              <div className="grid grid-cols-2 gap-4">

                <button className="py-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-cyan-400/40 transition">
                  PREVIEW ORIGINAL
                </button>

                <button className="py-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-cyan-400/40 transition">
                  PREVIEW PROCESSED
                </button>

                <button className="py-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-cyan-400/40 transition">
                  DOWNLOAD VIDEO
                </button>

                <button
                  onClick={resetSession}
                  className="py-4 rounded-lg bg-red-500/80 hover:bg-red-500 transition text-white"
                >
                  CLEAR SESSION / RESET
                </button>

              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-600 mt-6">
          Free Ball Tracking System · Powered by Computer Vision
        </div>
      </div>
    </div>
  );
}
