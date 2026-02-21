"use client";

import { useState } from "react";

export default function BallTrackingApp() {
  const [screen, setScreen] = useState("intro");
  const [ballColor, setBallColor] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [verdict, setVerdict] = useState(null);

  const API_URL = "https://sportsfacts-freeballtrackingsystem.hf.space/track";

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
    if (!videoFile || !ballColor) {
      alert("Select ball colour and upload video");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("ballColor", ballColor);

    setScreen("processing");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

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
      <div className="w-full max-w-3xl p-10 rounded-2xl bg-gradient-to-br from-[#020617] to-[#0f172a] border border-cyan-500/10">

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
              className="block w-full text-sm text-gray-400 mb-6
                         file:mr-4 file:py-3 file:px-6
                         file:rounded-xl file:border-0
                         file:bg-cyan-500 file:text-black
                         hover:file:bg-cyan-400"
            />

            {videoFile && (
              <p className="text-green-400 mb-4">
                ✔ {videoFile.name}
              </p>
            )}

            <button
              onClick={startTracking}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400
                         text-black font-semibold rounded-xl transition"
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
              Hawk-Eye Verdict
            </h2>

            <div className="bg-[#0f172a] p-10 rounded-xl border border-cyan-500/10 mb-6">
              <p className="text-6xl font-bold text-cyan-400">
                {verdict}
              </p>
            </div>

            <button
              onClick={() => {
                setScreen("intro");
                setBallColor(null);
                setVideoFile(null);
                setVerdict(null);
              }}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400
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
