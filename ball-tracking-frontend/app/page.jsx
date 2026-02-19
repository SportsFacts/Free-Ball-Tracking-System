"use client";

import { useState } from "react";

export default function BallTrackingApp() {
  const [screen, setScreen] = useState("intro");
  const [ballColor, setBallColor] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleColorSelect = (color) => {
    setBallColor(color);
    setScreen("upload");
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setScreen("tracking");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
      <div className="w-full max-w-2xl p-10 rounded-2xl bg-gradient-to-br from-[#020617] to-[#0f172a] border border-cyan-500/10">

        {/* INTRO SCREEN */}
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
          <div className="text-center">
            <h2 className="text-3xl text-cyan-400 mb-8">
              Select Ball Colour
            </h2>

            <div className="flex justify-center gap-6">
              {["red", "white"].map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className="px-6 py-3 bg-[#0f172a] hover:bg-cyan-500/10
                             border border-cyan-500/20 rounded-xl transition"
                >
                  {color.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO UPLOAD */}
        {screen === "upload" && (
          <div className="text-center">
            <h2 className="text-3xl text-cyan-400 mb-6">
              Upload Delivery Video
            </h2>

            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="block w-full text-sm text-gray-400
                         file:mr-4 file:py-3 file:px-6
                         file:rounded-xl file:border-0
                         file:bg-cyan-500 file:text-black
                         hover:file:bg-cyan-400"
            />
          </div>
        )}

        {/* TRACKING SCREEN */}
        {screen === "tracking" && (
          <div className="text-center">
            <h2 className="text-3xl text-cyan-400 mb-4">
              Tracking Initialized
            </h2>

            <p className="text-gray-400">
              Ball Colour: {ballColor}
            </p>

            <p className="text-gray-400 mb-6">
              Video: {videoFile?.name}
            </p>

            <button
              onClick={() => setScreen("results")}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400
                         text-black font-semibold rounded-xl transition"
            >
              View Results
            </button>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {screen === "results" && (
          <div className="text-center">
            <h2 className="text-4xl text-cyan-400 mb-6">
              Tracking Results
            </h2>

            <div className="bg-[#0f172a] p-6 rounded-xl border border-cyan-500/10">
              <p className="text-gray-300">✔ Ball Detection Complete</p>
              <p className="text-gray-300">✔ Trajectory Calculated</p>
              <p className="text-gray-300">✔ Impact Point Estimated</p>
            </div>

            <button
              onClick={() => {
                setScreen("intro");
                setBallColor(null);
                setVideoFile(null);
              }}
              className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-400
                         text-black font-semibold rounded-xl transition"
            >
              Start New Tracking
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
