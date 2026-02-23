import { useState } from "react";

export default function BallTrackingApp() {
  const [step, setStep] = useState("intro");
  const [ballColor, setBallColor] = useState("white");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState(null);

  const startTracking = async () => {
    if (!selectedFile) {
      alert("Upload video first");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("ballColor", ballColor);

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

      if (!response.ok) throw new Error();

      const data = await response.json();
      setVerdict(data.verdict);
    } catch (error) {
      alert("Backend connection failed");
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setStep("intro");
    setVerdict(null);
    setSelectedFile(null);
  };

  return (
    <div className="app-container">

      {/* INTRO SCREEN */}
      {step === "intro" && (
        <div className="screen">
          <h1>Free Ball Tracking System</h1>
          <button onClick={() => setStep("colour")}>
            Start
          </button>
        </div>
      )}

      {/* COLOUR SCREEN */}
      {step === "colour" && (
        <div className="screen">
          <h2>Select Ball Colour</h2>

          <div className="color-buttons">
            <button onClick={() => setBallColor("white")}>
              White Ball
            </button>

            <button onClick={() => setBallColor("red")}>
              Red Ball
            </button>
          </div>

          <button onClick={() => setStep("upload")}>
            Continue
          </button>
        </div>
      )}

      {/* UPLOAD SCREEN */}
      {step === "upload" && (
        <div className="screen">
          <h2>Upload Video</h2>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          {selectedFile && <p>{selectedFile.name}</p>}

          <button onClick={startTracking}>
            Analyze Delivery
          </button>
        </div>
      )}

      {/* RESULTS SCREEN */}
      {step === "results" && (
        <div className="screen">

          {loading ? (
            <h2>Processing Delivery...</h2>
          ) : (
            <>
              <h2>Hawk-Eye Verdict</h2>
              <div className="verdict-box">
                {verdict || "No Result"}
              </div>

              <button onClick={resetSession}>
                Clear Session / Reset
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
