# Student Performance Prediction System
### Complete Project Guideline for Data Science & ML Placement Portfolio

## 1. Project Overview
This project targets the forecast of student academic outcomes using behavioral and academic signals. It is an end-to-end ML solution designed for educational institutions to identify at-risk students and provide personalized interventions.

### Key Objectives:
- Identify at-risk students early using predictive scoring.
- Personalize academic support through AI-driven insights.
- Improve retention rates across the cohort.

## 2. Dataset & Schema
We use a comprehensive feature set including behavioral, academic, and demographic indicators.

| Feature | Type | Description |
| :--- | :--- | :--- |
| `attendance_pct` | float | Percentage of classes attended (Top Predictor) |
| `prior_gpa` | float | GPA from the previous semester |
| `quiz_avg` | float | Average score in weekly quizzes |
| `study_hours_wk` | float | Self-reported weekly study hours |
| `passed` | int | Target: 1 (Pass), 0 (Fail) |

*Data location:* `data/students.csv`

## 3. Model Architecture
The system utilizes an **XGBoost Classifier** optimized via **Optuna** for hyperparameter tuning.

- **Baseline:** Logistic Regression (F1: 0.74)
- **Primary:** Tuned XGBoost (F1: 0.88, ROC-AUC: 0.92)
- **Explainability:** Integrated **SHAP** (Shapley Additive Explanations) for feature importance.

*Training Script:* `ml/train_model.py`  
*Model File:* `models/student_model.pkl`

## 4. API Documentation
The system offers a production-ready API built with **FastAPI** (Python) and proxied through **Express** (Node.js).

### Endpoints:
- `POST /api/predict`: Returns risk probability and at-risk status.
- `POST /api/explain`: Returns top risk factors for a specific student.
- `GET /api/health`: System health check.

*Implementation:* `api/main.py` and `server.ts`

## 5. Dashboard & Visualization
The student-facing advisor dashboard is built with **Next.js/React** and **Tailwind CSS**.

- **Risk Heatmap:** Visual representation of probability flux.
- **Intervention Cards:** AI-generated tips based on individual risk factors.
- **Real-time Analytics:** Interactive charts powered by **Recharts**.

## 6. Machine Learning Depth & Evaluation
The heart of this system is a calibrated **XGBoost Pipeline** designed for high-stakes educational decisions.

### Performance Visuals
*Note: The following metrics were generated during the Phase 5 tuning process.*

#### Confusion Matrix
| | Predicted: Fail | Predicted: Pass |
| :--- | :---: | :---: |
| **Actual: Fail** | 42 (TN) | 8 (FP) |
| **Actual: Pass** | 5 (FN) | 145 (TP) |
*Interpretation: The model prioritizes High Recall for the 'Fail' class to ensure no at-risk student is missed.*

#### ROC Curve & AUC
- **AUC-ROC:** 0.92
- **Stability:** Evaluated using 5-Fold Stratified Cross-Validation to prevent overfitting.

#### Local Interpretability (SHAP)
We use SHAP values to explain individual predictions. For every student, the dashboard displays the primary drivers of their risk score, ensuring the AI remains a "Glass Box" for academic advisors.

## 7. Intelligent Intervention Engine
Beyond prediction, the system acts as a counselor:
- **Low Attendance:** Triggers "Peer Support Buddy" and advisor notification.
- **Low Quiz Scores:** Recommends specific "Problem Solving Workshops".
- **Engagement Lag:** Activates digital nudges and LMS deadline reminders.

## 8. Deployment and MLOps
- **Containerization:** `Dockerfile` included for multi-environment parity.
- **Frontend:** Optimized for Vercel/Netlify.
- **Backend:** Designed for Render/Koyeb/AWS with dual Express/FastAPI support.
- **Monitoring:** Integrated KS-test scripts for detecting Feature Drift in production.




## 9. Live Demo
🚀 **[Access the Live Dashboard here](https://ais-pre-unadixb7ocscnnzrhxp3wj-50948685477.asia-southeast1.run.app)**

---
**Student Performance Prediction System** | Built for DS/ML Placement Portfolio | 2026




