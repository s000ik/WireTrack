import pandas as pd
import numpy as np
from pathlib import Path
from scipy.stats import zscore
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

class PreprocessingMini:
    def __init__(self):
        # Set up paths
        self.current_dir = Path.cwd()
        self.raw_data_path = self.current_dir / 'data' / 'processed' / 'uploaded_files' /'desired_values.csv'
        self.processed_data_path = self.current_dir / 'data' / 'processed' / 'uploaded_files'
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
        print("Checking for missing values...")
        missing_values = self.df.isnull().sum()
        print(missing_values)

    # Drop rows with missing values if any
        self.df.dropna(inplace=True)
        print("Missing values dropped (if any).")

    # Remove rows with Z-score > 3 for outlier removal
        print("Removing outliers...")
        z_scores = np.abs(zscore(self.df.select_dtypes(include=[np.number])))
        self.df = self.df[(z_scores < 3).all(axis=1)]
        print("Outliers removed.")


    def scale_features(self):
        """Scale the features using StandardScaler."""
        print("Scaling features...")
        scaler = StandardScaler()

        # Separate the features and target column
        features = self.df

        # Scale features
        scaled_features = scaler.fit_transform(features)
        self.df_scaled = pd.DataFrame(scaled_features, columns=features.columns)

        print("Features scaled successfully.")

    def split_data(self):
        X = self.df_scaled

        X.to_csv(self.processed_data_path/ 'scaled_reverse_data.csv',index=False)
        print("Processed files saved to the 'data/processed' directory.")

    def run_preprocessing(self):
        """Run all preprocessing steps."""
        self.load_data()
        self.clean_data()
        self.scale_features()
        self.split_data()

if __name__ == "__main__":
    # Instantiate and run the preprocessing pipeline
    preprocess = PreprocessingMini()
    preprocess.run_preprocessing()