import os
import pandas as pd
import numpy as np

def generate_synthetic_queue_data(num_samples=2500, output_path=None):
    np.random.seed(42)

    service_types = ['consultation', 'certificate', 'blood_lab', 'inquiry', 'registration']
    service_avg_times = {
        'consultation': 6.0,
        'certificate': 8.5,
        'blood_lab': 4.0,
        'inquiry': 3.0,
        'registration': 10.0
    }

    data = []

    for _ in range(num_samples):
        service = np.random.choice(service_types)
        base_service_time = service_avg_times[service]

        people_ahead = np.random.randint(0, 35)
        active_counters = np.random.randint(1, 5)
        queue_length = people_ahead + np.random.randint(1, 15)

        hour = np.random.randint(8, 18) # 8 AM to 6 PM
        day_of_week = np.random.randint(0, 7)
        recent_skipped_count = np.random.randint(0, 4)

        # Domain physics calculation for true wait time
        # Base wait = (people_ahead * base_service_time) / active_counters
        base_wait = (people_ahead * base_service_time) / active_counters

        # Peak hours surge multiplier (11 AM to 2 PM)
        peak_multiplier = 1.25 if 11 <= hour <= 14 else 1.0

        # Monday / Friday surge multiplier
        day_multiplier = 1.15 if day_of_week in [0, 4] else 1.0

        # Skipped users reduce wait time slightly
        skip_discount = recent_skipped_count * 1.5

        # Gaussian noise (+/- 10%)
        noise = np.random.normal(0, 1.8)

        actual_wait = max(0.5, (base_wait * peak_multiplier * day_multiplier) - skip_discount + noise)

        data.append({
            'people_ahead': people_ahead,
            'active_counters': active_counters,
            'average_service_time': base_service_time,
            'queue_length': queue_length,
            'hour': hour,
            'day_of_week': day_of_week,
            'service_type': service,
            'recent_skipped_count': recent_skipped_count,
            'actual_wait_minutes': round(actual_wait, 2)
        })

    df = pd.DataFrame(data)

    if output_path:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        df.to_csv(output_path, index=False)
        print(f"[DATASET GENERATOR] Generated {len(df)} synthetic samples at {output_path}")

    return df

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_file = os.path.join(current_dir, 'queue_dataset.csv')
    generate_synthetic_queue_data(num_samples=10000, output_path=csv_file)
