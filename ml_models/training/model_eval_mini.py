import xgboost as xgb
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import joblib
from pathlib import Path

class Predict:
    def __init__(self, feature_csv, model_dir="ml_models/models/backward"):
        """
        Initialize the Predict class and load pre-trained models and scalers.
        """
        self.feature_csv = feature_csv
        self.feature_scaler = MinMaxScaler()
        self.model_dir = Path.cwd() / model_dir

        # Load models and scalers dynamically
        self.models = {}
        self.scalers = {}
        self._load_models_and_scalers()

    def _load_models_and_scalers(self):
        """
        Load pre-trained models and scalers dynamically from the specified directory.
        """
        print("Loading models and scalers...")

        for model_file in self.model_dir.glob("xgboost_model_*.joblib"):
            target_name = model_file.stem.split("_", 2)[-1]
            self.models[target_name] = joblib.load(model_file)
            print(f"Loaded model: {target_name}")

        for scaler_file in self.model_dir.glob("target_scaler_*.joblib"):
            target_name = scaler_file.stem.split("_", 2)[-1]
            self.scalers[target_name] = joblib.load(scaler_file)
            print(f"Loaded scaler: {target_name}")

    def load_features(self):
        """
        Load the features from the CSV file and extract the last 10 rows.
        """
        print("Loading features...")
        df_features = pd.read_csv(self.feature_csv)
        self.features = df_features.iloc[-10:].values
        return self.features

    def scale_features(self):
        """
        Scale the input features using the feature scaler.
        """
        print("Scaling features...")
        self.features_scaled = self.feature_scaler.fit_transform(self.features)

    def make_predictions(self):
        """
        Make predictions for the last 10 rows using the pre-trained models.
        """
        print("Making predictions...")
        all_predictions = {}

        for target, model in self.models.items():
            # Generate scaled predictions for all 10 rows
            scaled_predictions = model.predict(self.features_scaled)
            # Unscale predictions
            unscaled_predictions = self.scalers[target].inverse_transform(scaled_predictions.reshape(-1, 1)).flatten()
            all_predictions[target] = unscaled_predictions
            print(f"Predictions for {target}: {unscaled_predictions}")

        return all_predictions

    def run_pipeline(self):
        """
        Run the entire prediction pipeline: load features, scale them, and make predictions.
        """
        print("Running prediction pipeline...")
        self.load_features()
        self.scale_features()
        all_predictions = self.make_predictions()

        # Display predictions for all 10 rows and extract the last row's predictions
        last_row_predictions = {target: predictions[-1] for target, predictions in all_predictions.items()}
        return all_predictions, last_row_predictions

# Example usage:
if __name__ == "__main__":
    feature_csv_path = "data/processed/backward/BAR_TEMP_VAL0_X_test.csv"
    predictor = Predict(feature_csv=feature_csv_path)
    all_results, last_result = predictor.run_pipeline()
    print("All Predictions (last 10 rows):", all_results)
    print("Last Row Predictions:", last_result)