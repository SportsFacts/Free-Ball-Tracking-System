"use client";

import { useState } from "react";

export default function BallTrackingApp() {
  const [screen, setScreen] = useState("intro");
  const [ballColor, setBallColor] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [verdict, setVerdict] = useState(null);

  const handleColorSelect = (color) => {
    setBallColor(color);
    setScreen("upload");
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const startTracking = async () => {
    if (!videoFile || !ballColor) return;

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("ballColor", ballColor);

    try {
      setScreen("processing");

      const response = await fetch(
        "https://sportsfacts-freeballtrackingsystem.hf.space/track",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      setVerdict(data.verdict);
      setScreen("results");
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
      setScreen("upload");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
      <div className="w-full max-w-2xl p-10 rounded-2xl bg-gradient-to-br from-[#020617] to-[#0f172a] border border-cyan-500/10">

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

        {/* COLOR */}
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

        {/* UPLOAD */}
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

            {videoFile && (
              <p className="mt-4 text-green-400">
                ✔ {videoFile.name}
              </p>
            )}

            <button
              disabled={!videoFile}
              onClick={startTracking}
              className={`mt-6 w-full py-3 rounded-xl font-semibold transition
                ${videoFile
                  ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              Start Tracking
            </button>
          </div>
        )}

        {/* PROCESSING */}
        {screen === "processing" && (
          <div className="text-center">
            <h2 className="text-3xl text-cyan-400 mb-4">
              Processing Delivery...
            </h2>

            <p className="text-gray-400">
              Running ball tracking engine on cloud
            </p>
          </div>
        )}

        {/* RESULTS */}
        {screen === "results" && (
          <div className="text-center">
            <h2 className="text-4xl text-cyan-400 mb-6">
              HAWK-EYE VERDICT
            </h2>

            <div className="text-6xl font-bold text-green-400">
              {verdict}
            </div>

            <button
              onClick={() => {
                setVideoFile(null);
                setBallColor(null);
                setVerdict(null);
                setScreen("intro");
              }}
              className="mt-8 px-8 py-3 bg-red-500 text-white rounded-xl"
            >
              Clear Session / Reset
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
