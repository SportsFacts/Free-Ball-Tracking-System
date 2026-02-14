# renderer.py
import cv2

def draw_trajectory(frame, trajectory):
    for i in range(1, len(trajectory)):
        cv2.line(frame, trajectory[i-1], trajectory[i], (0, 255, 0), 2)

def draw_lbw_overlay(frame, decision):
    if not decision:
        return frame

    x, y = 40, 50
    for key, value in decision.items():
        cv2.rectangle(frame, (x - 10, y - 30), (x + 320, y), (0, 0, 0), -1)
        cv2.putText(
            frame,
            f"{key}: {value}",
            (x, y - 8),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 255),
            2
        )
        y += 40

    return frame
