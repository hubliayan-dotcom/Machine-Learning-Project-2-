from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="Student Performance API")

# Load model (simulated)
MODEL_PATH = "models/student_model.pkl"
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None

class StudentData(BaseModel):
    prior_gpa: float
    attendance_pct: float
    quiz_avg: float
    assign_avg: float
    midterm: float
    study_hours_wk: float
    on_time_submit_pct: float
    lms_logins_wk: float
    forum_posts: float
    commute_min: float
    gender: str
    school_type: str
    parent_edu: str

@app.get("/")
def home():
    return {"message": "Student Performance Prediction API is running"}

@app.post("/predict")
def predict(data: StudentData):
    if not model:
        # Mock logic if model file doesn't actually exist in the container
        prob = (100 - data.attendance_pct) * 0.005 + (100 - data.quiz_avg) * 0.005
        prob = max(0, min(1, 1 - prob))
        risk_level = "HIGH" if prob < 0.3 else "MEDIUM" if prob < 0.6 else "LOW"
        return {
            "risk_prob": round(1 - prob, 4),
            "at_risk": prob < 0.5,
            "risk_level": risk_level
        }
    
    df = pd.DataFrame([data.dict()])
    proba = model.predict_proba(df)[0, 1]
    return {
        "risk_prob": float(proba),
        "at_risk": proba >= 0.5,
        "risk_level": "HIGH" if proba >= 0.7 else "MEDIUM" if proba >= 0.4 else "LOW"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
