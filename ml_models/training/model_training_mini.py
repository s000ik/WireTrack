import xgboost as xgb
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler
from pathlib import Path
import joblib
from tqdm import tqdm

class Training:
    def __init__(self, X_train_data, X_test_data, y_train_data, y_test_data):
        """
        Initialize the Training class with train and test data for all targets.
        """
        # Save the training and testing data for features and targets
        self.X_train_data = X_train_data
        self.X_test_data = X_test_data
        self.y_train_data = y_train_data
        self.y_test_data = y_test_data

        # Initialize a feature scaler and a scaler for each target
        self.feature_scaler = MinMaxScaler()
        self.target_scalers = {target: MinMaxScaler() for target in y_train_data.keys()}

        # Paths to save results and models
        self.results_path = Path.cwd() / 'results'
        self.model_path = Path.cwd() / 'ml_models' / 'models'

        # Create directories if they don't exist
        self.results_path.mkdir(parents=True, exist_ok=True)
        self.model_path.mkdir(parents=True, exist_ok=True)

    def scale_data(self):
        """
        Scale the features and target variables using MinMaxScaler.
        """
        print("Scaling features and target variables...")

        # Scale features
        self.X_train_scaled = {}
        self.X_test_scaled = {}
        for target, X_train in self.X_train_data.items():
            self.X_train_scaled[target] = self.feature_scaler.fit_transform(X_train)
            self.X_test_scaled[target] = self.feature_scaler.transform(self.X_test_data[target])

        # Scale targets
        self.y_train_scaled = {}
        self.y_test_scaled = {}
        for target, y_train in self.y_train_data.items():
            y_train = y_train.values if isinstance(y_train, pd.Series) else y_train
            y_test = self.y_test_data[target].values if isinstance(self.y_test_data[target], pd.Series) else self.y_test_data[target]
            self.y_train_scaled[target] = self.target_scalers[target].fit_transform(y_train.reshape(-1, 1)).flatten()
            self.y_test_scaled[target] = self.target_scalers[target].transform(y_test.reshape(-1, 1)).flatten()

        print("Scaling complete.")

    def train_model(self):
    
        print("Training XGBoost models...")

    # Initialize a dictionary to store models for each target
        self.models = {}

    # Define the common parameters for the XGBoost regressor
        xgb_params = {
            "n_estimators": 2000,
            "learning_rate": 0.5,
            "max_depth": 15,
            "subsample": 0.9,
            "colsample_bytree": 0.8,
            "random_state": 42
        }

    # Use tqdm for the progress bar
        for target, X_train_scaled in tqdm(self.X_train_scaled.items(), desc="Training Models", unit="target"):
            model = xgb.XGBRegressor(**xgb_params)
            model.fit(X_train_scaled, self.y_train_scaled[target])
            self.models[target] = model  # Save the trained model

        print("Model training completed.")

    def predict(self):
        """
        Make predictions on the test set and inverse transform.
        """
        print("Making predictions...")

        # Initialize dictionaries to store predictions and inverse-transformed values
        self.predictions_scaled = {}
        self.predictions_inverse = {}
        self.actuals_inverse = {}

        # Make predictions for each feature-target pair
        for target, model in self.models.items():
            # Predict scaled values
            yhat_scaled = model.predict(self.X_test_scaled[target])

            # Inverse transform predictions and actuals
            self.predictions_scaled[target] = yhat_scaled
            self.predictions_inverse[target] = self.target_scalers[target].inverse_transform(yhat_scaled.reshape(-1, 1)).flatten()
            self.actuals_inverse[target] = self.target_scalers[target].inverse_transform(self.y_test_scaled[target].reshape(-1, 1)).flatten()

        print("Predictions completed.")

    def evaluate_model(self):
        """
        Evaluate and save results dynamically for each target.
        """
        print("Evaluating models...")

        self.rmse_scores = {}  # To store RMSE scores for each target

        for target in self.models.keys():
            # Calculate RMSE
            rmse = np.sqrt(mean_squared_error(self.actuals_inverse[target], self.predictions_inverse[target]))
            self.rmse_scores[target] = rmse
            print(f"RMSE for {target}: {rmse:.3f}")

            # Save results to CSV
            results_df = pd.DataFrame({
                'Actual': self.actuals_inverse[target],
                'Predicted': self.predictions_inverse[target]
            })
            results_file = self.results_path / f'test_results_xgboost_{target}.csv'
            results_df.to_csv(results_file, index=False)
            print(f"Results saved to '{results_file}'")

    def save_model(self):
        """
        Save the trained models and scalers dynamically for each target.
        """
        print("Saving models and scalers...")

        for target, model in self.models.items():
            # Save the model
            model_file = self.model_path / f'xgboost_model_{target}.joblib'
            joblib.dump(model, model_file)
            print(f"Model for {target} saved to '{model_file}'")

            # Save the corresponding scaler
            scaler_file = self.model_path / f'target_scaler_{target}.joblib'
            joblib.dump(self.target_scalers[target], scaler_file)
            print(f"Target scaler for {target} saved to '{scaler_file}'")

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
    # Define targets to match the saving function
    targets = [
        'EMUL_OIL_L_TEMP_PV_VAL0', 'STAND_OIL_L_TEMP_PV_REAL_VAL0',
        'GEAR_OIL_L_TEMP_PV_REAL_VAL0', 'EMUL_OIL_L_PR_VAL0',
        'QUENCH_CW_FLOW_EXIT_VAL0', 'CAST_WHEEL_RPM_VAL0',
        'BAR_TEMP_VAL0', 'QUENCH_CW_FLOW_ENTRY_VAL0',
        'GEAR_OIL_L_PR_VAL0', 'STANDS_OIL_L_PR_VAL0',
        'TUNDISH_TEMP_VAL0', 'BATH_TEMP_F7_VAL0',
        'BATH_TEMP_F8_VAL0', 'RM_MOTOR_COOL_WATER__VAL0',
        'ROLL_MILL_AMPS_VAL0', 'RM_COOL_WATER_FLOW_VAL0',
        'EMULSION_LEVEL_ANALO_VAL0', '%AL'
    ]

    # Initialize dictionaries to store training and testing data
    X_train_data = {}
    X_test_data = {}
    y_train_data = {}
    y_test_data = {}

    # Load data for each target
    for target in targets:
        # Replace special characters in target names
        target_name = target.replace('/', '_').replace('%', 'pct')
        
        # Construct file paths
        X_train_path = f'data/processed/backward/{target_name}_X_train.csv'
        X_test_path = f'data/processed/backward/{target_name}_X_test.csv'
        y_train_path = f'data/processed/backward/{target_name}_y_train.csv'
        y_test_path = f'data/processed/backward/{target_name}_y_test.csv'

        # Load data
        X_train_data[target_name] = pd.read_csv(X_train_path)
        X_test_data[target_name] = pd.read_csv(X_test_path)
        y_train_data[target_name] = pd.read_csv(y_train_path).squeeze()
        y_test_data[target_name] = pd.read_csv(y_test_path).squeeze()

    # Example: Access data for specific target
    example_target = targets[0].replace('/', '_').replace('%', 'pct')
    print(f"Example target: {example_target}")
    print(X_train_data[example_target].head())
    print(y_train_data[example_target].head())

    # Pass data to Training
    training = Training(
        X_train_data, X_test_data, y_train_data, y_test_data
    )
    training.run_training()