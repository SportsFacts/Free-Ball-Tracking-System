import cv2
import numpy as np

class BallKalman:
    def __init__(self):
        self.kf = cv2.KalmanFilter(4, 2)

        self.kf.transitionMatrix = np.array([
            [1,0,1,0],
            [0,1,0,1],
            [0,0,1,0],
            [0,0,0,1]
        ], np.float32)

        self.kf.measurementMatrix = np.array([
            [1,0,0,0],
            [0,1,0,0]
        ], np.float32)

        self.kf.processNoiseCov = np.eye(4, dtype=np.float32) * 0.03
        self.kf.measurementNoiseCov = np.eye(2, dtype=np.float32) * 0.8

        self.lost = 0

    def update(self, measurement):
        pred = self.kf.predict()
        px, py = int(pred[0]), int(pred[1])

        if measurement:
            x, y, _ = measurement
            self.kf.correct(np.array([[x],[y]], np.float32))
            self.lost = 0
            return x, y

        self.lost += 1
        return px, py

    def reset(self, x, y):
        self.kf.statePre = np.array([[x],[y],[0],[0]], np.float32)
        self.lost = 0

    def lost_too_long(self):
        return self.lost > 25

