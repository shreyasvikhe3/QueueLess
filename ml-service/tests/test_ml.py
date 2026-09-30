import os
import sys
import unittest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data.synthetic_generator import generate_synthetic_queue_data
from training.train_models import train_and_evaluate_models
from prediction.predict_engine import PredictEngine

class TestQueueLessMLService(unittest.TestCase):
    def test_01_synthetic_generator(self):
        df = generate_synthetic_queue_data(num_samples=100)
        self.assertEqual(len(df), 100)
        self.assertIn('actual_wait_minutes', df.columns)
        self.assertTrue((df['actual_wait_minutes'] >= 0).all())

    def test_02_model_training_and_evaluation(self):
        best_model, results = train_and_evaluate_models()
        self.assertIn(best_model, ['LinearRegression', 'RandomForest', 'GradientBoosting'])
        self.assertIn('MAE', results[best_model])
        self.assertLess(results[best_model]['MAE'], 10.0)
        self.assertGreater(results[best_model]['R2_Score'], 0.90)

    def test_03_prediction_engine_inference(self):
        payload = {
            'people_ahead': 8,
            'active_counters': 2,
            'average_service_time': 5.0,
            'queue_length': 15,
            'hour': 14,
            'day_of_week': 2,
            'service_type': 'consultation'
        }
        res = PredictEngine.predict_wait_time(payload)
        self.assertIn('predicted_waiting_time', res)
        self.assertIn('confidence_range', res)
        self.assertGreaterEqual(res['predicted_waiting_time'], 0)

if __name__ == '__main__':
    unittest.main()
