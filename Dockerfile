FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
# Note: You would normally create a requirements.txt for the Python side
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    pandas \
    scikit-learn \
    xgboost \
    joblib \
    pydantic

# Copy source code
COPY ./api /app/api
COPY ./models /app/models

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
