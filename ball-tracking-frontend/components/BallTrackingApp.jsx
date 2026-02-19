"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BallTrackingApp() {
  const [step, setStep] = useState("intro");
  const [processing, setProcessing] = useState(false);
  const [decision, setDecision] = useState(null);
  const [ballColor, setBallColor] = useState(null);

  const analyzeDelivery = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("results");
    }, 2000);
  };

  const resetSession = () => {
    setStep("intro");
    setDecision(null);
    setBallColor(null);
  };

  const screen = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pointer-events-auto">

      {/* 🔒 BACKGROUND — CANNOT BLOCK CLICKS */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_#00ffff22,_transparent)]" />
      </div>

      <AnimatePresence mode="wait">

        {/* INTRO */}
        {step === "intro" && (
          <motion.div
            key="intro"
            variants={screen}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center text-center relative z-10"
          >
            <h1 className="text-6xl font-bold text-cyan-400 drop-shadow-[0_0_30px_cyan]">
              FREE BALL TRACKING
            </h1>

            <button
              onClick={() => setStep("ballSelection")}
              className="mt-10 px-12 py-4 bg-green-500/20 border border-green-400
                         rounded-xl text-green-400 shadow-[0_0_25px_green]
                         hover:scale-105 transition pointer-events-auto"
            >
               START BALL TRACKING
            </button>
          </motion.div>
        )}

        {/* BALL SELECTION */}
        {step === "ballSelection" && (
          <motion.div
            key="ball"
            variants={screen}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-screen flex items-center justify-center relative z-10"
          >
            <div className="bg-[#050b18] border border-cyan-400/30
                            rounded-2xl p-12 shadow-[0_0_40px_#00ffff33]
                            pointer-events-auto">

              <h2 className="text-3xl text-cyan-400 text-center mb-10">
                Select Ball Color
              </h2>

              <div className="grid grid-cols-2 gap-8">

                <button
                  onClick={() => {
                    setBallColor("red");
                    setStep("upload");
                  }}
                  className="p-10 bg-black border border-red-500
                             rounded-xl shadow-[0_0_25px_#ff000055]
                             hover:scale-105 transition pointer-events-auto"
                >
                  🔴 RED BALL
                </button>

                <button
                  onClick={() => {
                    setBallColor("white");
                    setStep("upload");
                  }}
                  className="p-10 bg-black border border-gray-300
                             rounded-xl shadow-[0_0_25px_#ffffff33]
                             hover:scale-105 transition pointer-events-auto"
                >
                  ⚪ WHITE BALL
                </button>

              </div>
            </div>
          </motion.div>
        )}

        {/* UPLOAD */}
       <div className="w-full flex justify-center mt-10">
  <div className="w-[1100px] bg-gradient-to-b from-[#0f172a] to-[#020617] 
                  rounded-2xl border border-cyan-500/10 
                  shadow-[0_0_40px_rgba(0,255,255,0.08)] 
                  p-8">

    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <div className="text-cyan-400 text-xl">📹</div>
      <h2 className="text-cyan-400 text-lg font-semibold tracking-wide">
        Upload Video
      </h2>
    </div>

    {/* Drop Zone */}
    <div className="relative rounded-xl border-2 border-dashed 
                    border-cyan-400/20 bg-black/40 
                    h-[260px] flex flex-col items-center 
                    justify-center text-center">

      {/* Glow Overlay */}
      <div className="absolute inset-0 rounded-xl 
                      bg-gradient-to-b from-cyan-500/5 to-transparent" />


      {/* Main Text */}
      <p className="text-gray-200 text-lg z-10">
        Drop your video here or click to browse
      </p>

      {/* Subtext */}
      <p className="text-gray-500 text-sm mt-2 z-10">
        Supports MP4, MOV, AVI formats
      </p>

      {/* Hidden Input */}
      <input
        type="file"
        accept="video/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleVideoUpload}
      />
    </div>

    {/* Footer Text */}
    <div className="text-center mt-6">
      <p className="text-gray-600 text-sm tracking-wide">
        Free Ball Tracking System
      </p>
    </div>

  </div>
</div>

        {/* DECISION */}
        {step === "decision" && (
          <motion.div
            key="decision"
            variants={screen}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-5xl mx-auto p-10 relative z-10"
          >
            <h2 className="text-cyan-400 mb-6 text-xl">Original Decision</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setDecision("out")}
                className={`py-4 rounded-lg border ${
                  decision === "out"
                    ? "border-red-500 shadow-[0_0_20px_red]"
                    : "border-gray-700"
                }`}
              >
                OUT
              </button>

              <button
                onClick={() => setDecision("not_out")}
                className={`py-4 rounded-lg border ${
                  decision === "not_out"
                    ? "border-green-400 shadow-[0_0_20px_green]"
                    : "border-gray-700"
                }`}
              >
                NOT OUT
              </button>
            </div>

            <button
              onClick={analyzeDelivery}
              className="w-full py-4 bg-cyan-400 text-black rounded-lg font-bold"
            >
               ANALYZE DELIVERY
            </button>
          </motion.div>
        )}

       {/* RESULTS */}
{step === "results" && (
  <motion.div
    key="results"
    variants={screen}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="min-h-screen flex flex-col items-center justify-center 
               relative z-10 px-6"
  >

    {/* BIG VERDICT PANEL */}
    <div
      className="w-full max-w-6xl bg-[#050b18] 
                 border border-cyan-400/30 rounded-2xl
                 shadow-[0_0_60px_#00ffff33]
                 py-16 text-center mb-16"
    >
      <div className="text-gray-500 tracking-widest text-sm mb-4">
        BALL TRACKING VERDICT
      </div>

      <div className="text-8xl font-bold text-green-400 
                      drop-shadow-[0_0_35px_green]">
        OUT
      </div>
    </div>

    {/* BUTTON GRID */}
    <div className="w-full max-w-6xl grid grid-cols-2 gap-6">

      <button className="py-5 bg-black border border-cyan-400/30
                         rounded-xl shadow-[0_0_20px_#00ffff22]
                         hover:scale-[1.02] transition">
         PREVIEW ORIGINAL
      </button>

      <button className="py-5 bg-black border border-cyan-400/30
                         rounded-xl shadow-[0_0_20px_#00ffff22]
                         hover:scale-[1.02] transition">
         PREVIEW PROCESSED
      </button>

      <button className="py-5 bg-black border border-cyan-400/30
                         rounded-xl shadow-[0_0_20px_#00ffff22]
                         hover:scale-[1.02] transition">
         DOWNLOAD VIDEO
      </button>

      <button
        onClick={resetSession}
        className="py-5 bg-red-500/90 rounded-xl
                   shadow-[0_0_35px_red]
                   hover:scale-[1.02] transition"
      >
        CLEAR SESSION / RESET
      </button>

    </div>
  </motion.div>
)}

      </AnimatePresence>

      {/* PROCESSING */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center
                       text-3xl text-cyan-400 pointer-events-none"
          >
            Hawk-Eye Analysis Processing…
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
