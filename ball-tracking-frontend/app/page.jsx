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
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">

      {/* MAIN CONTAINER — CRITICAL FIX */}
      <div className="relative z-10">

        {/* INTRO */}
        {screen === "intro" && (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-cyan-400 mb-6">
              Ball Tracking System
            </h1>

            <button
              onClick={() => setScreen("color")}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400
                         text-black font-semibold rounded-xl
                         shadow-lg transition"
            >
              Start Ball Tracking
            </button>
          </div>
        )}

        {/* COLOR */}
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

        {/* UPLOAD */}
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

              <p className="text-gray-500 text-sm mt-2">
                Supports MP4, MOV, AVI
              </p>

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {videoFile && (
              <div className="mt-6 text-green-400">
                ✅ {videoFile.name}
              </div>
            )}

            <button
              disabled={!videoFile}
              onClick={() => setScreen("tracking")}
              className={`mt-6 w-full py-3 rounded-xl font-semibold transition
                ${videoFile
                  ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"}
              `}
            >
              Start Tracking
            </button>
          </div>
        )}

        {/* TRACKING */}
        {screen === "tracking" && (
          <div className="text-center">
            <h2 className="text-3xl text-cyan-400 mb-4">
              Tracking Initialized
            </h2>

            <p className="text-gray-400">
              Ball Colour: {ballColor}
            </p>

            <p className="text-gray-400">
              Video: {videoFile?.name}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
