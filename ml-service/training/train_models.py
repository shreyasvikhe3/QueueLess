import os
import sys

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if base_dir not in sys.path:
    sys.path.append(base_dir)

import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from data.synthetic_generator import generate_synthetic_queue_data

def train_and_evaluate_models():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, 'data', 'queue_dataset.csv')
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)

    if not os.path.exists(data_path):
        df = generate_synthetic_queue_data(num_samples=2500, output_path=data_path)
    else:
        df = pd.read_csv(data_path)

    X = df.drop(columns=['actual_wait_minutes'])
    y = df['actual_wait_minutes']

    categorical_cols = ['service_type']
    numeric_cols = ['people_ahead', 'active_counters', 'average_service_time', 'queue_length', 'hour', 'day_of_week', 'recent_skipped_count']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols)
        ]
    )

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    candidate_models = {
        'LinearRegression': LinearRegression(),
        'RandomForest': RandomForestRegressor(n_estimators=100, random_state=42),
        'GradientBoosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
    }

    best_score = float('inf')
    best_model_name = None
    best_pipeline = None
    results = {}

    print("=================================================================")
    print(" QueueLess ML Model Evaluation & Performance Benchmark")
    print("=================================================================")

    for name, model in candidate_models.items():
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', model)
        ])

        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = float(r2_score(y_test, y_pred))

        results[name] = {
            'MAE': round(mae, 3),
            'RMSE': round(rmse, 3),
            'R2_Score': round(r2, 4)
        }

        print(f"Model: {name:<20} | MAE: {mae:.3f} mins | RMSE: {rmse:.3f} mins | R²: {r2:.4f}")

        if mae < best_score:
            best_score = mae
            best_model_name = name
            best_pipeline = pipeline

    print("-----------------------------------------------------------------")
    print(f"Best Selected Model: {best_model_name} (Lowest MAE: {best_score:.3f} mins)")
    print("=================================================================")

    # Save best pipeline
    best_model_path = os.path.join(models_dir, 'best_model.pkl')
    joblib.dump(best_pipeline, best_model_path)

    # Save metadata metrics
    metrics_path = os.path.join(models_dir, 'metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump({
            'best_model': best_model_name,
            'evaluation_metrics': results,
            'features': list(X.columns),
            'last_trained': pd.Timestamp.now().isoformat()
        }, f, indent=2)

    return best_model_name, results

if __name__ == '__main__':
    train_and_evaluate_models()
