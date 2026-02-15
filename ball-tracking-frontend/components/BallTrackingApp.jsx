"use client";

import { useState } from "react";

export default function BallTrackingApp() {
  const [step, setStep] = useState("intro");
  const [processing, setProcessing] = useState(false);
  const [ballType, setBallType] = useState(null);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [decision, setDecision] = useState(null);

  const handleUpload = () => {
    setVideoUploaded(true);
    setStep("decision");
  };

  const analyzeDelivery = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setStep("results");
    }, 2500);
  };

  const resetSession = () => {
    setStep("intro");
    setBallType(null);
    setVideoUploaded(false);
    setDecision(null);
  };

  return (
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)]">

      {/* INTRO SCREEN */}
      {step === "intro" && (
        <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-8">

          <h1 className="text-5xl font-bold text-cyan-400 tracking-wider">
            FREE BALL TRACKING
          </h1>

          <p className="text-gray-400">
            Professional LBW Decision Review Technology
          </p>

          <button
            onClick={() => setStep("ballSelection")}
            className="px-10 py-4 bg-green-500/80 hover:bg-green-500 rounded-xl text-lg shadow-lg transition"
          >
            ▶ START BALL TRACKING
          </button>
        </div>
      )}

      {/* BALL SELECTION SCREEN */}
      {step === "ballSelection" && (
        <div className="min-h-screen flex items-center justify-center">

          <div className="bg-black/40 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-10 w-full max-w-3xl">

            <h2 className="text-3xl text-cyan-400 text-center mb-8">
              Select Ball Color
            </h2>

            <div className="grid grid-cols-2 gap-6">

              <button
                onClick={() => {
                  setBallType("red");
                  setStep("upload");
                }}
                className="p-8 rounded-xl bg-gray-900 border border-red-500/40 hover:scale-105 transition"
              >
                🔴 RED BALL
                <div className="text-sm text-gray-500 mt-2">
                  Test Cricket
                </div>
              </button>

              <button
                onClick={() => {
                  setBallType("white");
                  setStep("upload");
                }}
                className="p-8 rounded-xl bg-gray-900 border border-gray-400/40 hover:scale-105 transition"
              >
                ⚪ WHITE BALL
                <div className="text-sm text-gray-500 mt-2">
                  Limited Overs
                </div>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* UPLOAD SCREEN */}
      {step === "upload" && (
        <div className="max-w-6xl mx-auto p-6">

          <div className="bg-black/40 backdrop-blur-xl border border-cyan-400/10 rounded-2xl p-10">

            <h2 className="text-2xl text-cyan-400 mb-6">
              Upload Video
            </h2>

            <label className="flex flex-col items-center justify-center border border-dashed border-gray-700 rounded-xl p-16 cursor-pointer hover:border-cyan-400/40 transition">

              <div className="text-4xl mb-4">⬆</div>

              <span className="text-gray-400">
                Drop video or click to browse
              </span>

              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={handleUpload}
              />
            </label>
          </div>
        </div>
      )}

      {/* DECISION SCREEN */}
      {step === "decision" && (
        <div className="max-w-6xl mx-auto p-6 space-y-6">

          <div className="bg-black/40 backdrop-blur-xl border border-cyan-400/10 rounded-2xl p-10">

            <h2 className="text-2xl text-cyan-400 mb-6">
              Original Decision
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <button
                onClick={() => setDecision("out")}
                className={`py-4 rounded-lg border ${
                  decision === "out"
                    ? "border-green-400 bg-green-500/20"
                    : "border-gray-700 bg-gray-900"
                }`}
              >
                OUT
              </button>

              <button
                onClick={() => setDecision("not_out")}
                className={`py-4 rounded-lg border ${
                  decision === "not_out"
                    ? "border-green-400 bg-green-500/20"
                    : "border-gray-700 bg-gray-900"
                }`}
              >
                NOT OUT
              </button>

            </div>

            <button
              onClick={analyzeDelivery}
              className="w-full mt-6 py-4 bg-cyan-400 text-black font-semibold rounded-lg hover:opacity-80 transition"
            >
              ▶ ANALYZE DELIVERY
            </button>
          </div>
        </div>
      )}

      {/* PROCESSING SCREEN */}
      {processing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-2xl text-cyan-400 animate-pulse">
          Processing Hawk-Eye Analysis...
        </div>
      )}

      {/* RESULTS SCREEN */}
      {step === "results" && !processing && (
        <div className="max-w-6xl mx-auto p-6 space-y-8">

          <div className="bg-black/40 border border-cyan-400/20 rounded-xl p-10 text-center">

            <div className="text-sm text-gray-500 mb-2">
              HAWK-EYE VERDICT
            </div>

            <div className="text-5xl font-bold text-green-400">
              OUT
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <button className="py-4 rounded-lg bg-gray-900 border border-gray-800">
              PREVIEW ORIGINAL
            </button>

            <button className="py-4 rounded-lg bg-gray-900 border border-gray-800">
              PREVIEW PROCESSED
            </button>

            <button className="py-4 rounded-lg bg-gray-900 border border-gray-800">
              DOWNLOAD VIDEO
            </button>

            <button
              onClick={resetSession}
              className="py-4 rounded-lg bg-red-500"
            >
              CLEAR SESSION / RESET
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
