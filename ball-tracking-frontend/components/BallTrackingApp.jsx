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

  const resetSession = () => {
    setScreen("intro");
    setBallColor(null);
    setVideoFile(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">

      {/* INTRO SCREEN */}
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

      {/* BALL COLOR SELECTION */}
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
                    : "border-gray-600 hover:border-cyan-400"
                  }
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
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }
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
            onClick={() => setScreen("results")}
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

      {/* RESULTS SCREEN */}
      {screen === "results" && (
        <div className="w-[1100px] bg-black/40 border border-cyan-400/20
                        rounded-2xl p-10">

          <h1 className="text-cyan-400 text-3xl mb-8">
            ANALYSIS RESULTS
          </h1>

          <div className="flex justify-center mb-10">
            <div className="border border-cyan-400/30 rounded-xl
                            px-24 py-10 text-center bg-[#020617]">

              <p className="text-cyan-400 tracking-widest text-sm mb-3">
                HAWK-EYE VERDICT
              </p>

              <h2 className="text-6xl text-emerald-400 font-bold">
                OUT
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button className="py-4 border border-cyan-400/30 rounded-xl hover:bg-cyan-500/10">
              PREVIEW ORIGINAL
            </button>

            <button className="py-4 border border-cyan-400/30 rounded-xl hover:bg-cyan-500/10">
              PREVIEW PROCESSED
            </button>

            <button className="py-4 border border-cyan-400/30 rounded-xl hover:bg-cyan-500/10">
              DOWNLOAD VIDEO
            </button>

            <button
              onClick={resetSession}
              className="py-4 bg-red-400 text-black font-semibold rounded-xl hover:bg-red-300"
            >
              CLEAR SESSION / RESET
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
