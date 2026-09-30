import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from prediction.predict_engine import PredictEngine
from training.train_models import train_and_evaluate_models

app = FastAPI(
    title="QueueLess AI Waiting-Time Prediction Service",
    description="Microservice providing ML-powered queue wait-time prediction and model retraining.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueuePredictionInput(BaseModel):
    people_ahead: int = Field(..., ge=0, description="Number of people unserved ahead in queue")
    active_counters: int = Field(1, ge=1, description="Number of currently active service counters")
    average_service_time: float = Field(5.0, gt=0, description="Average service time per person in minutes")
    queue_length: int = Field(1, ge=0, description="Total active queue length")
    hour: Optional[int] = Field(12, ge=0, le=23, description="Hour of day (0-23)")
    day_of_week: Optional[int] = Field(1, ge=0, le=6, description="Day of week (0=Mon, 6=Sun)")
    service_type: Optional[str] = Field("consultation", description="Name/category of requested service")
    recent_skipped_count: Optional[int] = Field(0, ge=0, description="Count of recently skipped tokens")

@app.get("/")
def read_root():
    return {
        "service": "QueueLess Python FastAPI ML Service",
        "status": "ONLINE",
        "endpoints": ["/predict-waiting-time", "/train", "/metrics", "/health"]
    }

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "service": "FastAPI ML Service"}

@app.post("/predict-waiting-time")
def predict_waiting_time(payload: QueuePredictionInput):
    try:
        features = payload.model_dump()
        result = PredictEngine.predict_wait_time(features)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/train")
def trigger_retraining():
    try:
        best_model, metrics = train_and_evaluate_models()
        return {
            "status": "SUCCESS",
            "message": "Models retrained successfully",
            "best_selected_model": best_model,
            "evaluation_metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model retraining failed: {str(e)}")

@app.get("/metrics")
def get_metrics():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    metrics_path = os.path.join(base_dir, 'models', 'metrics.json')

    if not os.path.exists(metrics_path):
        train_and_evaluate_models()

    with open(metrics_path, 'r') as f:
        data = json.load(f)
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
