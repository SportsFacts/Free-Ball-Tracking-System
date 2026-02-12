# decision.py
def lbw_decision(trajectory, frame_width):
    if len(trajectory) < 8:
        return None

    cx = frame_width // 2
    off_stump = cx - 35
    leg_stump = cx + 35

    pitch = trajectory[2]
    impact = trajectory[len(trajectory)//2]
    wicket = trajectory[-1]

    # Pitching
    if pitch[0] < off_stump:
        pitching = "Outside Off"
    elif pitch[0] > leg_stump:
        pitching = "Outside Leg"
    else:
        pitching = "In Line"

    # Impact
    if off_stump <= impact[0] <= leg_stump:
        impact_result = "In Line"
    else:
        impact_result = "Outside"

    # Wickets
    if off_stump <= wicket[0] <= leg_stump:
        wickets = "Hitting"
    else:
        wickets = "Missing"

    return {
        "Pitching": pitching,
        "Impact": impact_result,
        "Wickets": wickets
    }
