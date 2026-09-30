import os
import joblib
import pandas as pd
import numpy as np
from training.train_models import train_and_evaluate_models

class PredictEngine:
  _pipeline = None

  @classmethod
  def get_pipeline(cls):
      if cls._pipeline is None:
          base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
          model_path = os.path.join(base_dir, 'models', 'best_model.pkl')

          if not os.path.exists(model_path):
              print("[PREDICT ENGINE] Trained model file not found. Auto-triggering training...")
              train_and_evaluate_models()

          cls._pipeline = joblib.load(model_path)
      return cls._pipeline

  @classmethod
  def predict_wait_time(cls, features_dict):
      pipeline = cls.get_pipeline()

      input_df = pd.DataFrame([{
          'people_ahead': features_dict.get('people_ahead', 0),
          'active_counters': max(1, features_dict.get('active_counters', 1)),
          'average_service_time': features_dict.get('average_service_time', 5.0),
          'queue_length': features_dict.get('queue_length', 1),
          'hour': features_dict.get('hour', 12),
          'day_of_week': features_dict.get('day_of_week', 1),
          'service_type': str(features_dict.get('service_type', 'consultation')).lower(),
          'recent_skipped_count': features_dict.get('recent_skipped_count', 0)
      }])

      raw_pred = pipeline.predict(input_df)[0]
      predicted_mins = max(0, int(round(raw_pred)))

      # Calculate confidence range (+/- 20% margin with minimum 2-3 mins width)
      margin = max(2, int(round(predicted_mins * 0.2)))
      min_wait = max(0, predicted_mins - margin)
      max_wait = predicted_mins + margin + 1

      confidence_range = f"{min_wait}-{max_wait} minutes"

      return {
          'predicted_waiting_time': predicted_mins,
          'confidence_range': confidence_range,
          'model_used': 'RandomForest'
      }
