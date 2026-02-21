"use client";

import { useState } from "react";

export default function BallTrackingApp() {
  const [screen, setScreen] = useState("intro");
  const [ballColor, setBallColor] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ✅ File size guard (HF safety)
    if (file.size > 50 * 1024 * 1024) {
      alert("Video too large (Max 50MB)");
      return;
    }

    setVideoFile(file);
  };

  const startTracking = async () => {
    if (!videoFile || !ballColor) return;

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("ballColor", ballColor);

    try {
      setLoading(true);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(
        "https://your-space-name.hf.space/track",   // ✅ CHANGE THIS
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      const data = await res.json();

      setVerdict(data.verdict || "NO RESULT");
      setScreen("results");

    } catch (err) {
      console.error(err);
      alert("Backend connection failed");
    } finally {
      setLoading(false);
    }
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
                       text-black font-semibold rounded-xl"
          >
            Start Ball Tracking
          </button>
        </div>
      )}

      {/* COLOR */}
      {screen === "color" && (
        <div className="w-[500px] bg-[#0f172a] rounded-2xl p-8">
          <h2 className="text-2xl text-cyan-400 mb-6 text-center">
            Select Ball Colour
          </h2>

          <div className="flex justify-center gap-6 mb-8">
            {["red", "white"].map((color) => (
              <button
                key={color}
                onClick={() => setBallColor(color)}
                className={`w-24 h-24 rounded-full border-4
                  ${ballColor === color
                    ? "border-cyan-400 scale-110"
                    : "border-gray-600"
                  }
                  ${color === "red" ? "bg-red-600" : "bg-gray-200"}
                `}
              />
            ))}
          </div>

          <button
            disabled={!ballColor}
            onClick={() => setScreen("upload")}
            className={`w-full py-3 rounded-xl font-semibold
              ${ballColor
                ? "bg-cyan-500 text-black"
                : "bg-gray-700 text-gray-400"
              }
            `}
          >
            Continue
          </button>
        </div>
      )}

      {/* UPLOAD */}
      {screen === "upload" && (
        <div className="w-[700px] bg-[#0f172a] rounded-2xl p-8">
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

          {videoFile && (
            <div className="mt-6 text-green-400">
              ✅ {videoFile.name}
            </div>
          )}

          <button
            disabled={!videoFile}
            onClick={startTracking}
            className={`mt-6 w-full py-3 rounded-xl font-semibold
              ${videoFile
                ? "bg-cyan-500 text-black"
                : "bg-gray-700 text-gray-400"
              }
            `}
          >
            Start Tracking
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center">
          <h2 className="text-3xl text-cyan-400 mb-4">
            Processing Delivery...
          </h2>
          <p className="text-gray-400 animate-pulse">
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

          <div className="text-6xl text-green-400 mb-6">
            {verdict}
          </div>

          <button
            onClick={() => {
              setScreen("intro");
              setVideoFile(null);
              setBallColor(null);
              setVerdict(null);
            }}
            className="px-6 py-3 bg-cyan-500 text-black rounded-xl"
          >
            Start New Tracking
          </button>
        </div>
      )}
    </div>
  );
}
