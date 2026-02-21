"use client";

import { useState } from "react";

export default function BallTrackingApp() {
  const [screen, setScreen] = useState("intro");
  const [ballColor, setBallColor] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setVideoFile(file);

    /* ✅ DIRECTLY GO TO RESULTS */
    setScreen("results");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">

      {/* INTRO */}
      {screen === "intro" && (
        <div className="text-center">
          <h1 className="text-5xl font-bold text-cyan-400 mb-6">
            Ball Tracking System
          </h1>

          <button
            onClick={() => setScreen("color")}
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400
                       text-black font-semibold rounded-xl transition"
          >
            Start Ball Tracking
          </button>
        </div>
      )}

      {/* COLOR SELECTION */}
      {screen === "color" && (
        <div className="w-[500px] bg-[#0f172a] rounded-2xl p-8 border border-cyan-500/10">
          <h2 className="text-2xl text-cyan-400 mb-6 text-center">
            Select Ball Colour
          </h2>

          <div className="flex justify-center gap-6 mb-8">
            {["red", "white"].map((color) => (
              <button
                key={color}
                onClick={() => setBallColor(color)}
                className={`w-24 h-24 rounded-full border-4 transition
                  ${ballColor === color
                    ? "border-cyan-400 scale-110"
                    : "border-gray-600 hover:border-cyan-400"}
                  ${color === "red" ? "bg-red-600" : "bg-gray-200"}
                `}
              />
            ))}
          </div>

          <button
            disabled={!ballColor}
            onClick={() => setScreen("upload")}
            className={`w-full py-3 rounded-xl font-semibold transition
              ${ballColor
                ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"}
            `}
          >
            Continue
          </button>
        </div>
      )}

      {/* VIDEO UPLOAD */}
      {screen === "upload" && (
        <div className="w-[700px] bg-[#0f172a] rounded-2xl p-8 border border-cyan-500/10">
          <h2 className="text-2xl text-cyan-400 mb-6">
            Upload Video
          </h2>

          <div className="relative border-2 border-dashed border-cyan-400/20
                          rounded-xl h-[260px] flex flex-col items-center
                          justify-center text-center bg-black/40">

            <div className="text-5xl mb-4">⬆️</div>

            <p className="text-gray-200 text-lg">
              Drop your video here or click to browse
            </p>

            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* RESULTS */}
      {screen === "results" && (
        <div className="w-[900px] bg-gradient-to-br from-black to-[#020617]
                        border border-cyan-400/20 rounded-2xl p-10">

          <h2 className="text-cyan-400 text-3xl mb-10">
            ANALYSIS RESULTS
          </h2>

          <div className="text-center mb-10">
            <div className="inline-block px-20 py-10 rounded-xl
                            border border-cyan-400/30 bg-black/60">

              <p className="text-cyan-400 tracking-widest mb-4">
                HAWK-EYE VERDICT
              </p>

              <p className="text-6xl text-green-400 font-bold">
                OUT
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button className="py-4 border border-cyan-400/30 rounded-xl">
              PREVIEW ORIGINAL
            </button>

            <button className="py-4 border border-cyan-400/30 rounded-xl">
              PREVIEW PROCESSED
            </button>

            <button className="py-4 border border-cyan-400/30 rounded-xl">
              DOWNLOAD VIDEO
            </button>

            <button
              onClick={() => {
                setScreen("intro");
                setBallColor(null);
                setVideoFile(null);
              }}
              className="py-4 bg-red-400 text-black rounded-xl"
            >
              CLEAR SESSION / RESET
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
