import pandas as pd
import numpy as np
from pathlib import Path
from scipy.stats import zscore
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

class Preprocessing:
    def __init__(self):
        # Set up paths
        self.current_dir = Path.cwd()
        self.raw_data_path = self.current_dir / 'data' / 'raw' / 'to_predict.csv'
        self.processed_data_path = self.current_dir / 'data' / 'processed' / 'backward'
        self.processed_data_path.mkdir(parents=True, exist_ok=True)

    def load_data(self):
        """Load the CSV data."""
        try:
            self.df = pd.read_csv(self.raw_data_path)
            print("Data loaded successfully.")
        except FileNotFoundError:
            print(f"File not found at path: {self.raw_data_path}")
            raise

    def clean_data(self):
        """Handle missing values and remove outliers using Z-score."""
        # Check for missing values
        print("Checking for missing values...")
        missing_values = self.df.isnull().sum()
        print(missing_values)

        # Drop rows with missing values if any
        self.df.dropna(inplace=True)
        print("Missing values dropped (if any).")

        # Remove rows with Z-score > 3 for outlier removal
        print("Removing outliers...")
        self.df = self.df[(np.abs(zscore(self.df)) < 3).all(axis=1)]
        print("Outliers removed.")

    def scale_features(self):
        """Scale the features using StandardScaler."""
        print("Scaling features...")
        scaler = StandardScaler()

        # Separate the features and target column
        features = self.df[['Elongation', 'UTS', 'Conductivity']]
        target_column_1 = self.df['EMUL_OIL_L_TEMP_PV_VAL0']
        target_column_2 = self.df['STAND_OIL_L_TEMP_PV_REAL_VAL0']
        target_column_3 = self.df['GEAR_OIL_L_TEMP_PV_REAL_VAL0']
        target_column_4 = self.df['EMUL_OIL_L_PR_VAL0']
        target_column_5 = self.df['QUENCH_CW_FLOW_EXIT_VAL0']
        target_column_6 = self.df['CAST_WHEEL_RPM_VAL0']
        target_column_7 = self.df['BAR_TEMP_VAL0']
        target_column_8 = self.df['QUENCH_CW_FLOW_ENTRY_VAL0']
        target_column_9 = self.df['GEAR_OIL_L_PR_VAL0']
        target_column_10 = self.df['STANDS_OIL_L_PR_VAL0']
        target_column_11 = self.df['TUNDISH_TEMP_VAL0']
        target_column_12 = self.df['BATH_TEMP_F7_VAL0']
        target_column_13 = self.df['BATH_TEMP_F8_VAL0']
        target_column_14 = self.df['RM_MOTOR_COOL_WATER__VAL0']
        target_column_15 = self.df['ROLL_MILL_AMPS_VAL0']
        target_column_16 = self.df['RM_COOL_WATER_FLOW_VAL0']
        target_column_17 = self.df['EMULSION_LEVEL_ANALO_VAL0']
        target_column_18 = self.df['%AL']

        # Scale features
        scaled_features = scaler.fit_transform(features)
        self.df_scaled = pd.DataFrame(scaled_features, columns=features.columns)

        # Add the target column back to the DataFrame
        self.df_scaled['EMUL_OIL_L_TEMP_PV_VAL0'] = target_column_1.values
        self.df_scaled['STAND_OIL_L_TEMP_PV_REAL_VAL0'] = target_column_2.values
        self.df_scaled['GEAR_OIL_L_TEMP_PV_REAL_VAL0'] = target_column_3.values
        self.df_scaled['EMUL_OIL_L_PR_VAL0'] = target_column_4.values
        self.df_scaled['QUENCH_CW_FLOW_EXIT_VAL0'] = target_column_5.values
        self.df_scaled['CAST_WHEEL_RPM_VAL0'] = target_column_6.values
        self.df_scaled['BAR_TEMP_VAL0'] = target_column_7.values
        self.df_scaled['QUENCH_CW_FLOW_ENTRY_VAL0'] = target_column_8.values
        self.df_scaled['GEAR_OIL_L_PR_VAL0'] = target_column_9.values
        self.df_scaled['STANDS_OIL_L_PR_VAL0'] = target_column_10.values
        self.df_scaled['TUNDISH_TEMP_VAL0'] = target_column_11.values
        self.df_scaled['BATH_TEMP_F7_VAL0'] = target_column_12.values
        self.df_scaled['BATH_TEMP_F8_VAL0'] = target_column_13.values
        self.df_scaled['RM_MOTOR_COOL_WATER__VAL0'] = target_column_14.values
        self.df_scaled['ROLL_MILL_AMPS_VAL0'] = target_column_15.values
        self.df_scaled['RM_COOL_WATER_FLOW_VAL0'] = target_column_16.values
        self.df_scaled['EMULSION_LEVEL_ANALO_VAL0'] = target_column_17.values
        self.df_scaled['%AL'] = target_column_18.values
        print("Features scaled successfully.")

    def split_data(self):
        print("Splitting data into training and testing sets...")
    
    # Define features and targets
        features = ['Elongation', 'UTS', 'Conductivity']
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

        for target in targets:
            X = self.df_scaled.drop(columns=targets)  # Features excluding all targets
            y = self.df_scaled[target]               # Current target
        
        # Split into training and testing sets
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Save to CSV
            target_name = target.replace('/', '_').replace('%', 'pct')
            pd.DataFrame(X_train).to_csv(self.processed_data_path / f'{target_name}_X_train.csv', index=False)
            pd.DataFrame(X_test).to_csv(self.processed_data_path / f'{target_name}_X_test.csv', index=False)
            pd.DataFrame(y_train).to_csv(self.processed_data_path / f'{target_name}_y_train.csv', index=False)
            pd.DataFrame(y_test).to_csv(self.processed_data_path / f'{target_name}_y_test.csv', index=False)

        print("Data split and saved successfully.")

    def run_preprocessing(self):
        """Run all preprocessing steps."""
        self.load_data()
        self.clean_data()
        self.scale_features()
        self.split_data()

if __name__ == "__main__":
    # Instantiate and run the preprocessing pipeline
    preprocess = Preprocessing()
    preprocess.run_preprocessing()
