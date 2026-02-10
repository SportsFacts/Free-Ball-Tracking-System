# main.py
import cv2
import tempfile
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse

from balltracking import detect_ball
from decision import lbw_decision
from renderer import draw_trajectory, draw_lbw_overlay

app = FastAPI()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    temp_input.write(await file.read())
    temp_input.close()

    cap = cv2.VideoCapture(temp_input.name)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    output_path = "ball_tracking_output.mp4"
    out = cv2.VideoWriter(
        output_path,
        cv2.VideoWriter_fourcc(*"mp4v"),
        fps,
        (w, h)
    )

    trajectory = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        pos = detect_ball(frame)
        if pos:
            trajectory.append(pos)
            cv2.circle(frame, pos, 6, (0, 0, 255), -1)

        if len(trajectory) > 2:
            draw_trajectory(frame, trajectory)
            decision = lbw_decision(trajectory, w)
            frame = draw_lbw_overlay(frame, decision)

        out.write(frame)

    cap.release()
    out.release()

    return FileResponse(
        output_path,
        media_type="video/mp4",
        filename="ball_tracking_output.mp4"
    )
