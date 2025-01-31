import xgboost as xgb
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler
from pathlib import Path
import joblib

class Training:
    def __init__(self, X_train, X_test, y_train, y_test, A_train, A_test, b_train, b_test, R_train, R_test, s_train, s_test):
        """
        Initialize the Training class with train and test data.
        """
        self.X_train = X_train
        self.X_test = X_test
        self.y_train = y_train
        self.y_test = y_test
        self.A_train = A_train
        self.A_test = A_test
        self.b_train = b_train
        self.b_test = b_test
        self.R_train = R_train
        self.R_test = R_test
        self.s_train = s_train
        self.s_test = s_test
        
        # Define separate scalers for each target
        self.feature_scaler = MinMaxScaler()
        self.target_scaler_y = MinMaxScaler()
        self.target_scaler_b = MinMaxScaler()
        self.target_scaler_s = MinMaxScaler()
        
        # Paths to save results and models
        self.results_path = Path.cwd() / 'results'
        self.model_path = Path.cwd() / 'ml_models' / 'models' /'forward'
        
        # Create directories if they don't exist
        self.results_path.mkdir(parents=True, exist_ok=True)
        self.model_path.mkdir(parents=True, exist_ok=True)

    def scale_data(self):
        """
        Scale the features and target variables using MinMaxScaler.
        """
        print("Scaling features and target variables...")
        # Scale the features
        self.X_train_scaled = self.feature_scaler.fit_transform(self.X_train)
        self.X_test_scaled = self.feature_scaler.transform(self.X_test)
        self.A_train_scaled = self.feature_scaler.fit_transform(self.A_train)
        self.A_test_scaled = self.feature_scaler.transform(self.A_test)
        self.R_train_scaled = self.feature_scaler.fit_transform(self.R_train)
        self.R_test_scaled = self.feature_scaler.transform(self.R_test)

        # Convert target variables to numpy arrays
        self.y_train = self.y_train.values if isinstance(self.y_train, pd.Series) else self.y_train
        self.y_test = self.y_test.values if isinstance(self.y_test, pd.Series) else self.y_test
        self.b_train = self.b_train.values if isinstance(self.b_train, pd.Series) else self.b_train
        self.b_test = self.b_test.values if isinstance(self.b_test, pd.Series) else self.b_test
        self.s_train = self.s_train.values if isinstance(self.s_train, pd.Series) else self.s_train
        self.s_test = self.s_test.values if isinstance(self.s_test, pd.Series) else self.s_test

        # Scale the target values with separate scalers
        self.y_train_scaled = self.target_scaler_y.fit_transform(self.y_train.reshape(-1, 1)).flatten()
        self.y_test_scaled = self.target_scaler_y.transform(self.y_test.reshape(-1, 1)).flatten()
        self.b_train_scaled = self.target_scaler_b.fit_transform(self.b_train.reshape(-1, 1)).flatten()
        self.b_test_scaled = self.target_scaler_b.transform(self.b_test.reshape(-1, 1)).flatten()
        self.s_train_scaled = self.target_scaler_s.fit_transform(self.s_train.reshape(-1, 1)).flatten()
        self.s_test_scaled = self.target_scaler_s.transform(self.s_test.reshape(-1, 1)).flatten()
        print("Scaling completed.")

    def train_model(self):
        """
        Train the XGBoost models.
        """
        print("Training XGBoost models...")
        self.model_E = xgb.XGBRegressor(n_estimators=2000, learning_rate=0.5, max_depth=15, subsample=0.9, colsample_bytree=0.8, random_state=42)
        self.model_UTS = xgb.XGBRegressor(n_estimators=2000, learning_rate=0.5, max_depth=15, subsample=0.9, colsample_bytree=0.8, random_state=42)
        self.model_C = xgb.XGBRegressor(n_estimators=2000, learning_rate=0.5, max_depth=15, subsample=0.9, colsample_bytree=0.8, random_state=42)

        # Train models
        self.model_E.fit(self.X_train_scaled, self.y_train_scaled)
        self.model_UTS.fit(self.A_train_scaled, self.b_train_scaled)
        self.model_C.fit(self.R_train_scaled, self.s_train_scaled)
        print("Model training completed.")

    def predict(self):
        """
        Make predictions on the test set and inverse transform.
        """
        print("Making predictions...")
        yhat_scaled = self.model_E.predict(self.X_test_scaled)
        self.inv_yhat = self.target_scaler_y.inverse_transform(yhat_scaled.reshape(-1, 1)).flatten()
        self.inv_y = self.target_scaler_y.inverse_transform(self.y_test_scaled.reshape(-1, 1)).flatten()

        bhat_scaled = self.model_UTS.predict(self.A_test_scaled)
        self.inv_bhat = self.target_scaler_b.inverse_transform(bhat_scaled.reshape(-1, 1)).flatten()
        self.inv_b = self.target_scaler_b.inverse_transform(self.b_test_scaled.reshape(-1, 1)).flatten()

        shat_scaled = self.model_C.predict(self.R_test_scaled)
        self.inv_shat = self.target_scaler_s.inverse_transform(shat_scaled.reshape(-1, 1)).flatten()
        self.inv_s = self.target_scaler_s.inverse_transform(self.s_test_scaled.reshape(-1, 1)).flatten()
        print("Predictions completed.")

    def evaluate_model(self):
        """
        Evaluate and plot results.
        """
        print("Evaluating model...")
        rmse1 = np.sqrt(mean_squared_error(self.inv_y, self.inv_yhat))
        print(f'RMSE Elongation: {rmse1:.3f}')

        rmse2 = np.sqrt(mean_squared_error(self.inv_b, self.inv_bhat))
        print(f'RMSE UTS: {rmse2:.3f}')

        rmse3 = np.sqrt(mean_squared_error(self.inv_s, self.inv_shat))
        print(f'RMSE Conductivity: {rmse3:.3f}')

        results_df_1 = pd.DataFrame({
            'Actual': self.inv_y,
            'Predicted': self.inv_yhat
        })
        results_file_1 = self.results_path / 'test_results_xgboost_Elongation.csv'
        results_df_1.to_csv(results_file_1, index=False)
        print(f"Results saved to '{results_file_1}'")

        results_df_2 = pd.DataFrame({
            'Actual': self.inv_b,
            'Predicted': self.inv_bhat
        })
        results_file_2 = self.results_path / 'test_results_xgboost_UTS.csv'
        results_df_2.to_csv(results_file_2, index=False)
        print(f"Results saved to '{results_file_2}'")

        results_df_3 = pd.DataFrame({
            'Actual': self.inv_s,
            'Predicted': self.inv_shat
        })
        results_file_3 = self.results_path / 'test_results_xgboost_Conductivity.csv'
        results_df_3.to_csv(results_file_3, index=False)
        print(f"Results saved to '{results_file_3}'")

    def save_model(self):
        """
        Save the trained model to the specified directory.
        """
        print("Saving the model...")
        model_file_1 = self.model_path / 'xgboost_model_Elongation.joblib'
        joblib.dump(self.model_E, model_file_1)
        print(f"Model saved to '{model_file_1}'")

        model_file_2 = self.model_path / 'xgboost_model_UTS.joblib'
        joblib.dump(self.model_UTS, model_file_2)
        print(f"Model saved to '{model_file_2}'")

        model_file_3 = self.model_path / 'xgboost_model_Conductivity.joblib'
        joblib.dump(self.model_C, model_file_3)
        print(f"Model saved to '{model_file_3}'")

        # Save scalers
        scaler_file_y = self.model_path / 'target_scaler_y.joblib'
        joblib.dump(self.target_scaler_y, scaler_file_y)
        print(f"Target scaler for Elongation saved to '{scaler_file_y}'")

        scaler_file_b = self.model_path / 'target_scaler_b.joblib'
        joblib.dump(self.target_scaler_b, scaler_file_b)
        print(f"Target scaler for UTS saved to '{scaler_file_b}'")

        scaler_file_s = self.model_path / 'target_scaler_s.joblib'
        joblib.dump(self.target_scaler_s, scaler_file_s)
        print(f"Target scaler for Conductivity saved to '{scaler_file_s}'")
        
        
    def run_training(self):
        """
        Complete pipeline.
        """
        self.scale_data()
        self.train_model()
        self.predict()
        self.evaluate_model()
        self.save_model()

if __name__ == "__main__":
    # Load data
    X_train = pd.read_csv('data/processed/forward/X_train_Elongation.csv')
    X_test = pd.read_csv('data/processed/forward/X_test_Elongation.csv')
    y_train = pd.read_csv('data/processed/forward/y_train_Elongation.csv').squeeze()
    y_test = pd.read_csv('data/processed/forward/y_test_Elongation.csv').squeeze()
    A_train = pd.read_csv('data/processed/forward/X_train_UTS.csv')
    A_test = pd.read_csv('data/processed/forward/X_test_UTS.csv')
    b_train = pd.read_csv('data/processed/forward/y_train_UTS.csv').squeeze()
    b_test = pd.read_csv('data/processed/forward/y_test_UTS.csv').squeeze()
    R_train = pd.read_csv('data/processed/forward/X_train_Conductivity.csv')
    R_test = pd.read_csv('data/processed/forward/X_test_Conductivity.csv')
    s_train = pd.read_csv('data/processed/forward/y_train_Conductivity.csv').squeeze()
    s_test = pd.read_csv('data/processed/forward/y_test_Conductivity.csv').squeeze()

    training = Training(X_train, X_test, y_train, y_test, A_train, A_test, b_train, b_test, R_train, R_test, s_train, s_test)
    training.run_training()
