# balltracking.py
import cv2
import numpy as np

kalman = cv2.KalmanFilter(4, 2)
kalman.measurementMatrix = np.array([[1, 0, 0, 0],
                                      [0, 1, 0, 0]], np.float32)
kalman.transitionMatrix = np.array([[1, 0, 1, 0],
                                     [0, 1, 0, 1],
                                     [0, 0, 1, 0],
                                     [0, 0, 0, 1]], np.float32)
kalman.processNoiseCov = np.eye(4, dtype=np.float32) * 0.03

def detect_ball(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    lower1 = np.array([0, 120, 70])
    upper1 = np.array([10, 255, 255])
    lower2 = np.array([170, 120, 70])
    upper2 = np.array([180, 255, 255])

    mask = cv2.inRange(hsv, lower1, upper1) + cv2.inRange(hsv, lower2, upper2)
    mask = cv2.GaussianBlur(mask, (9, 9), 0)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None

    c = max(contours, key=cv2.contourArea)
    if cv2.contourArea(c) < 120:
        return None

    (x, y), _ = cv2.minEnclosingCircle(c)

    measurement = np.array([[np.float32(x)], [np.float32(y)]])
    kalman.correct(measurement)
    prediction = kalman.predict()

    return int(prediction[0]), int(prediction[1])
