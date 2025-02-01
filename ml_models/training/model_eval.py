import xgboost as xgb
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import joblib
from pathlib import Path

class Predict:
    def __init__(self, feature_csv):
        """
        Initialize the Predict class and load pre-trained models.
        """
        self.feature_csv = feature_csv
        self.feature_scaler = MinMaxScaler()
        
        # Load the pre-trained models
        self.model_E = joblib.load(Path.cwd() / 'ml_models' / 'models'/'forward' / 'xgboost_model_Elongation.joblib')
        self.model_UTS = joblib.load(Path.cwd() / 'ml_models' / 'models'/'forward' / 'xgboost_model_UTS.joblib')
        self.model_C = joblib.load(Path.cwd() / 'ml_models' / 'models'/'forward' / 'xgboost_model_Conductivity.joblib')
        
        # Load the scalers for each target variable
        self.target_scaler_y = joblib.load(Path.cwd() / 'ml_models' / 'models'/'forward' / 'target_scaler_y.joblib')
        self.target_scaler_b = joblib.load(Path.cwd() / 'ml_models' / 'models'/'forward' / 'target_scaler_b.joblib')
        self.target_scaler_s = joblib.load(Path.cwd() / 'ml_models' / 'models'/'forward' / 'target_scaler_s.joblib')
    
    def load_features(self):
        """
        Load the features from the CSV file and extract the last 10 rows.
        """
        df_features = pd.read_csv(self.feature_csv)
        # Get the last 10 rows as the input features for prediction
        self.features = df_features.iloc[-10:].values
        return self.features

    def scale_features(self):
        """
        Scale the input features using the feature scaler.
        """
        self.features_scaled = self.feature_scaler.fit_transform(self.features)
    
    def make_predictions(self):
        """
        Make predictions using the pre-trained models.
        """
        print("Making predictions...")
        
        # Predict Elongation
        yhat_scaled = self.model_E.predict(self.features_scaled)
        elongation_predictions = self.target_scaler_y.inverse_transform(yhat_scaled.reshape(-1, 1)).flatten()
        
        # Predict UTS
        bhat_scaled = self.model_UTS.predict(self.features_scaled)
        uts_predictions = self.target_scaler_b.inverse_transform(bhat_scaled.reshape(-1, 1)).flatten()
        
        # Predict Conductivity
        shat_scaled = self.model_C.predict(self.features_scaled)
        conductivity_predictions = self.target_scaler_s.inverse_transform(shat_scaled.reshape(-1, 1)).flatten()
        
        print("Predictions completed.")
        return elongation_predictions, uts_predictions, conductivity_predictions

    def run_prediction(self):
        """
        Run the complete prediction pipeline.
        """
        self.load_features()
        self.scale_features()
        elongation, uts, conductivity = self.make_predictions()
        
        # Print predictions for the last 10 rows
        for i in range(len(elongation)):
            print(f"Row {i+1}: Elongation={elongation[i]:.3f}, UTS={uts[i]:.3f}, Conductivity={conductivity[i]:.3f}")
        return elongation, uts, conductivity

if __name__ == "__main__":
    # Path to the feature CSV file
    feature_csv_path = 'data/processed/forward/X_test_Conductivity.csv'
    
    # Create an instance of the Predict class
    predictor = Predict(feature_csv=feature_csv_path)
    
    # Run the prediction
    elongation, uts, conductivity = predictor.run_prediction()

