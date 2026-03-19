"use client";

import { useState, useEffect } from "react";

export default function BallTrackingApp() {
  const [step, setStep] = useState("intro");
  const [ballColor, setBallColor] = useState("white");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null); // NEW: To store the processed video URL

  // Cleanup memory when component closes
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const startTracking = async () => {
    if (!selectedFile) {
      alert("Please upload a video first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // Backend expects "file"

    try {
      setLoading(true);
      setStep("results");

      const response = await fetch(
        "https://sportsfacts-freeballtrackingsystem.hf.space/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Processing failed");

      // --- NEW: Convert video stream to a Blob URL ---
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      
    } catch (error) {
      console.error(error);
      alert("Error connecting to AI Backend. Is the Space awake?");
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setStep("intro");
    setVideoUrl(null);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      
      {/* INTRO SCREEN */}
      {step === "intro" && (
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-yellow-500">Free Ball Tracking</h1>
          <p className="text-gray-400">Professional AI LBW analysis at your fingertips.</p>
          <button 
            className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-full font-bold transition"
            onClick={() => setStep("colour")}
          >
            Start Analysis
          </button>
        </div>
      )}

      {/* COLOUR SCREEN */}
      {step === "colour" && (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">Select Ball Colour</h2>
          <div className="flex gap-4">
            <button 
              className={`px-6 py-2 rounded-lg border-2 ${ballColor === 'white' ? 'border-yellow-500 bg-white text-black' : 'border-gray-600'}`}
              onClick={() => setBallColor("white")}
            >
              White Ball
            </button>
            <button 
              className={`px-6 py-2 rounded-lg border-2 ${ballColor === 'red' ? 'border-yellow-500 bg-red-600' : 'border-gray-600'}`}
              onClick={() => setBallColor("red")}
            >
              Red Ball
            </button>
          </div>
          <button className="text-yellow-500 underline block mx-auto" onClick={() => setStep("upload")}>
            Continue
          </button>
        </div>
      )}

      {/* UPLOAD SCREEN */}
      {step === "upload" && (
        <div className="text-center space-y-6 max-w-md w-full border-2 border-dashed border-gray-700 p-10 rounded-xl">
          <h2 className="text-2xl font-semibold">Upload Delivery</h2>
          <input
            type="file"
            accept="video/*"
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-500 cursor-pointer"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          {selectedFile && <p className="text-green-500 text-sm">Selected: {selectedFile.name}</p>}
          <button 
            className="w-full py-3 bg-yellow-600 rounded-lg font-bold disabled:opacity-50"
            onClick={startTracking}
            disabled={!selectedFile}
          >
            Run AI Tracking
          </button>
        </div>
      )}

      {/* RESULTS SCREEN */}
      {step === "results" && (
        <div className="text-center space-y-6 w-full max-w-3xl">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <h2 className="text-2xl text-yellow-500 font-bold">AI is Tracking the Ball...</h2>
              <div className="h-64 bg-gray-900 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 italic">Computing trajectory, impact, and stumps...</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold">Hawk-Eye Verdict</h2>
              <div className="relative rounded-xl overflow-hidden border-4 border-yellow-600 shadow-2xl">
                {videoUrl ? (
                  <video src={videoUrl} controls autoPlay className="w-full h-auto" />
                ) : (
                  <div className="p-10 bg-red-900/20 text-red-500">Failed to load video result.</div>
                )}
              </div>
              <button 
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                onClick={resetSession}
              >
                New Analysis
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
