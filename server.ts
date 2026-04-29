import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Real-world Model Pipeline Logic Simulation
  // In production, this would call model.predict_proba()
  app.post("/api/predict", (req, res) => {
    const data = req.body;
    
    // Feature weight simulation (similar to XGBoost coefficients)
    const weights = {
      attendance: 0.45,
      prior_gpa: 0.25,
      midterm: 0.15,
      quiz_avg: 0.10,
      study_hours: 0.05
    };

    let risk_score = 0;
    risk_score += (100 - (data.attendance_pct || 0)) * weights.attendance;
    risk_score += (4.0 - (data.prior_gpa || 0)) * 25 * weights.prior_gpa;
    risk_score += (100 - (data.midterm || 0)) * weights.midterm;
    risk_score += (100 - (data.quiz_avg || 0)) * weights.quiz_avg;
    
    const prob = Math.max(0, Math.min(100, risk_score)) / 100;
    const pass_prob = 1 - prob;

    res.json({
      risk_prob: parseFloat(pass_prob.toFixed(4)),
      at_risk: pass_prob < 0.5,
      risk_level: pass_prob < 0.3 ? 'HIGH' : pass_prob < 0.6 ? 'MEDIUM' : 'LOW'
    });
  });

  // Intelligent Intervention Engine
  app.post("/api/explain", (req, res) => {
    const data = req.body;
    const interventions = [];
    
    if (data.attendance_pct < 80) {
      interventions.push({
        feature: "Attendance Gap",
        value: `${data.attendance_pct}%`,
        alert: true,
        tip: "CRITICAL: Attendance dropped below 80%. Assigning 'Peer Support Buddy' and scheduling a 1-on-1 advisor meeting."
      });
    }

    if (data.quiz_avg < 65) {
      interventions.push({
        feature: "Academic Warning",
        value: `${data.quiz_avg}%`,
        alert: true,
        tip: "Quiz average indicates core concept gap. Recommendation: Mandatory 'Problem Solving Workshop' sessions."
      });
    }

    if (data.study_hours_wk < 6) {
      interventions.push({
        feature: "Behavioral Risk",
        value: `${data.study_hours_wk} hrs`,
        alert: true,
        tip: "Low engagement detected. Enrolling student in 'Time Management & Focus' micro-course."
      });
    }

    if (data.on_time_submit_pct < 90) {
      interventions.push({
        feature: "Submission Lag",
        value: `${data.on_time_submit_pct}%`,
        alert: false,
        tip: "Late submissions detected. Activating automated SMS deadline reminders."
      });
    }
    
    res.json({ top_factors: interventions });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
