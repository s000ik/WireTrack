import pandas as pd
import numpy as np
from pathlib import Path
from scipy.stats import zscore
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

class Preprocessing:
    def __init__(self, file_name):
        """Initialize paths and file name."""
        self.file_name = file_name
        self.current_dir = Path.cwd()
        self.raw_data_path = self.current_dir / 'data' / 'raw' / self.file_name
        self.processed_data_path = self.current_dir / 'data' / 'processed' /'forward'
        self.processed_data_path.mkdir(parents=True, exist_ok=True)

    def load_data(self):
        """Load the CSV data."""
        try:
            self.df = pd.read_csv(self.raw_data_path)
            print("Data loaded successfully.")
        except FileNotFoundError as e:
            print(f"Error: File not found at path {self.raw_data_path}.")
            raise e

    def clean_data(self):
        """Handle missing values and remove outliers."""
        print("Checking and handling missing values...")
        self.df.dropna(inplace=True)  # Drop rows with missing values
        print("Missing values handled.")

        print("Removing outliers...")
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        self.df = self.df[(np.abs(zscore(self.df[numeric_cols])) < 3).all(axis=1)]
        self.df.reset_index(drop=True, inplace=True)
        print("Outliers removed.")

    def scale_features(self):
        """Scale the features using StandardScaler."""
        print("Scaling features...")
        scaler = StandardScaler()

        # Target columns
        target_columns = ['Elongation', 'UTS', 'Conductivity']
        features = self.df.drop(columns=target_columns)

        # Scale features
        scaled_features = scaler.fit_transform(features)
        self.df_scaled = pd.DataFrame(scaled_features, columns=features.columns)

        # Add target columns back to the scaled DataFrame
        for col in target_columns:
            self.df_scaled[col] = self.df[col].values

        print("Features scaled successfully.")

    def split_and_save_data(self):
        """Split the data into training and testing sets and save them."""
        print("Splitting and saving data...")
        target_columns = ['Elongation', 'UTS', 'Conductivity']

        for target in target_columns:
            X = self.df_scaled.drop(columns=target_columns)
            y = self.df_scaled[target]

            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

            # Save the splits
            base_name = target.split()[0]  # e.g., Elongation -> 'Elongation'
            X_train.to_csv(self.processed_data_path / f'X_train_{base_name}.csv', index=False)
            X_test.to_csv(self.processed_data_path / f'X_test_{base_name}.csv', index=False)
            pd.DataFrame(y_train).to_csv(self.processed_data_path / f'y_train_{base_name}.csv', index=False)
            pd.DataFrame(y_test).to_csv(self.processed_data_path / f'y_test_{base_name}.csv', index=False)

        print("Processed data saved successfully.")

    def run(self):
        """Run all preprocessing steps."""
        self.load_data()
        self.clean_data()
        self.scale_features()
        self.split_and_save_data()

if __name__ == "__main__":
    # Instantiate with the file name and run the preprocessing pipeline
    file_name = '/home/nitin/Downloads/SIH-1723/data/raw/to_predict.csv'
    preprocess = Preprocessing(file_name)
    preprocess.run()
