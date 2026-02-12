"use client";

import { useState } from "react";

const HF_BACKEND_URL =
  "https://sportsfacts-freeballtrackingsystem.hf.space/process";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  const submitVideo = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("video", file);

    const res = await fetch(HF_BACKEND_URL, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setVideoUrl(data.video_url);
    setResult(data.lbw_result);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 40 }}>
      <h1>🏏 Free Ball Tracking System</h1>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={submitVideo} disabled={loading}>
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>

      {videoUrl && (
        <>
          <h2>Processed Video</h2>
          <video src={videoUrl} controls width="100%" />
        </>
      )}

      {result && (
        <>
          <h2>LBW Decision</h2>
          <ul>
            <li>Pitching: {result.pitching}</li>
            <li>Impact: {result.impact}</li>
            <li>Wickets: {result.wickets}</li>
            <li><b>Final:</b> {result.decision}</li>
          </ul>
        </>
      )}
    </div>
  );
}
