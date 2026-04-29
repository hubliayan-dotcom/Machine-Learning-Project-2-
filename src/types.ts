export interface StudentData {
  student_id: string;
  name: string;
  gender: 'M' | 'F';
  school_type: 'Govt' | 'Private';
  prior_gpa: number;
  attendance_pct: number;
  quiz_avg: number;
  assign_avg: number;
  midterm: number;
  study_hours_wk: number;
  on_time_submit_pct: number;
  lms_logins_wk: number;
  forum_posts: number;
  parent_edu: string;
  commute_min: number;
}

export interface PredictionResult {
  risk_prob: number;
  at_risk: boolean;
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FactorExplanation {
  feature: string;
  value: number;
  alert: boolean;
  tip: string;
}

export interface ExplainResult {
  top_factors: FactorExplanation[];
}
