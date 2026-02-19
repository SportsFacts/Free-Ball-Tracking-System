"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BallTrackingApp() {
  const [step, setStep] = useState("intro");
  const [processing, setProcessing] = useState(false);
  const [decision, setDecision] = useState(null);

  const analyzeDelivery = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setStep("results");
    }, 2500);
  };

  const resetSession = () => {
    setStep("intro");
    setDecision(null);
    setProcessing(false);
  };

  const screen = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 }
  };

  return (
    <div className="min-h-screen text-white bg-black relative overflow-hidden">

      {/* BACKGROUND (NO CLICK BLOCKING) */}
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
            transition={{ duration: 0.4 }}
            className="min-h-screen flex flex-col items-center justify-center text-center"
          >
            <h1 className="text-6xl font-bold text-cyan-400 tracking-wider drop-shadow-[0_0_25px_cyan]">
              FREE BALL TRACKING
            </h1>

            <p className="text-gray-500 mt-4">
              Professional LBW Decision Review Technology
            </p>

            <button
              onClick={() => setStep("ballSelection")}
              className="mt-10 px-12 py-4 bg-green-500/20 border border-green-400 
                         rounded-xl text-lg text-green-400 
                         shadow-[0_0_25px_green] hover:scale-105 transition"
            >
              ▶ START BALL TRACKING
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
            transition={{ duration: 0.4 }}
            className="min-h-screen flex items-center justify-center"
          >
            <div className="bg-[#050b18] border border-cyan-400/20 
                            rounded-2xl p-12 shadow-[0_0_40px_#00ffff22]">

              <h2 className="text-3xl text-cyan-400 text-center mb-10">
                Select Ball Color
              </h2>

              <div className="grid grid-cols-2 gap-6">

                <button
                  onClick={() => setStep("upload")}
                  className="p-10 bg-black border border-red-500/30 rounded-xl 
                             hover:scale-105 transition shadow-[0_0_25px_#ff000044]"
                >
                  🔴 RED BALL
                </button>

                <button
                  onClick={() => setStep("upload")}
                  className="p-10 bg-black border border-gray-400/30 rounded-xl 
                             hover:scale-105 transition shadow-[0_0_25px_#ffffff22]"
                >
                  ⚪ WHITE BALL
                </button>

              </div>
            </div>
          </motion.div>
        )}

        {/* UPLOAD */}
        {step === "upload" && (
          <motion.div
            key="upload"
            variants={screen}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto p-10"
          >
            <div className="bg-[#050b18] border border-cyan-400/10 rounded-2xl p-12">

              <h2 className="text-2xl text-cyan-400 mb-6">
                Upload Video
              </h2>

              <label className="flex flex-col items-center justify-center 
                                border border-dashed border-gray-700 
                                rounded-xl p-20 cursor-pointer 
                                hover:border-cyan-400/40 transition">

                ⬆ Drop Video

                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={() => setStep("decision")}
                />
              </label>
            </div>
          </motion.div>
        )}

        {/* DECISION */}
        {step === "decision" && (
          <motion.div
            key="decision"
            variants={screen}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto p-10"
          >
            <div className="bg-[#050b18] border border-cyan-400/10 rounded-2xl p-12">

              <h2 className="text-3xl text-cyan-400 mb-8">
                Original Decision
              </h2>

              <div className="grid grid-cols-2 gap-6">

                {/* OUT → RED */}
                <button
                  onClick={() => setDecision("out")}
                  className={`py-5 rounded-xl border transition text-lg ${
                    decision === "out"
                      ? "border-red-500 bg-red-500/20 shadow-[0_0_25px_red]"
                      : "border-gray-700"
                  }`}
                >
                  OUT
                </button>

                {/* NOT OUT → GREEN */}
                <button
                  onClick={() => setDecision("not_out")}
                  className={`py-5 rounded-xl border transition text-lg ${
                    decision === "not_out"
                      ? "border-green-400 bg-green-400/20 shadow-[0_0_25px_green]"
                      : "border-gray-700"
                  }`}
                >
                  NOT OUT
                </button>
              </div>

              <button
                onClick={analyzeDelivery}
                className="w-full mt-8 py-5 bg-cyan-400 text-black 
                           rounded-xl font-semibold text-lg
                           shadow-[0_0_35px_cyan] hover:scale-[1.02] transition"
              >
                ▶ ANALYZE DELIVERY
              </button>
            </div>
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
    transition={{ duration: 0.4 }}
    className="max-w-6xl mx-auto p-10 space-y-10"
  >
    <div className="bg-[#050b18] border border-cyan-400/30 
                    rounded-xl p-12 text-center 
                    shadow-[0_0_40px_#00ffff33]">

      <div className="text-sm text-gray-500 mb-3">
        HAWK-EYE VERDICT
      </div>

      <div className="text-6xl font-bold text-green-400 
                      drop-shadow-[0_0_25px_green]">
        OUT
      </div>
    </div>

    {/* CONTROL PANEL */}
    <div className="grid grid-cols-2 gap-4">

      <button className="py-4 bg-black border border-cyan-400/20 
                         rounded-lg hover:border-cyan-400 transition">
        ▶ PREVIEW ORIGINAL
      </button>

      <button className="py-4 bg-black border border-cyan-400/20 
                         rounded-lg hover:border-cyan-400 transition">
        ▶ PREVIEW PROCESSED
      </button>

      <button className="py-4 bg-black border border-cyan-400/20 
                         rounded-lg hover:border-cyan-400 transition">
        ⬇ DOWNLOAD VIDEO
      </button>

      <button
        onClick={resetSession}
        className="py-4 bg-red-500/80 rounded-lg 
                   shadow-[0_0_25px_red] hover:scale-[1.02] transition"
      >
        CLEAR SESSION / RESET
      </button>

    </div>
  </motion.div>
)
}
