import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
import joblib

# Load data
df = pd.read_csv('../data/students.csv')

# Define features and target
NUM = ['prior_gpa', 'attendance_pct', 'quiz_avg', 'assign_avg', 'midterm',
       'study_hours_wk', 'on_time_submit_pct', 'lms_logins_wk',
       'forum_posts', 'commute_min']
CAT = ['gender', 'school_type', 'parent_edu']
TARGET = 'passed'

# Split data
X = df[NUM + CAT]
y = df[TARGET]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Preprocessing
preprocessor = ColumnTransformer([
    ('num', StandardScaler(), NUM),
    ('cat', OneHotEncoder(handle_unknown='ignore'), CAT)
])

# Model
model = Pipeline([
    ('pre', preprocessor),
    ('clf', XGBClassifier(n_estimators=500, max_depth=5, learning_rate=0.05))
])

# Train
model.fit(X_train, y_train)

# Save
joblib.dump(model, '../models/student_model.pkl')
print("Model trained and saved to ../models/student_model.pkl")
