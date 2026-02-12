import numpy as np

def compute_trajectory(points):
    if len(points) < 3:
        return None

    x = np.array([p["x"] for p in points])
    y = np.array([p["y"] for p in points])

    coeffs = np.polyfit(x, y, 2)

    return {
        "a": float(coeffs[0]),
        "b": float(coeffs[1]),
        "c": float(coeffs[2])
    }
