import pandas as pd
import os

class DataIngestion:
    def __init__(self, url: str, save_path: str):
        """
        Initialize the DataIngestion class with the data source URL and save path.

        Parameters:
            url (str): The URL of the CSV file to be ingested.
            save_path (str): The path where the ingested file will be saved.
        """
        self.url = url
        self.save_path = save_path

    def ingest_data(self):
        """
        Reads the CSV data from the provided URL and saves it to the specified path.
        """
        try:
            # Ensure the directory for save_path exists
            os.makedirs(os.path.dirname(self.save_path), exist_ok=True)
            
            # Read data from the URL
            df = pd.read_csv(self.url)
            
            # Save data to the specified path
            df.to_csv(self.save_path, index=False)
            print(f"Data successfully saved to {self.save_path}")
        except Exception as e:
            print(f"An error occurred during data ingestion: {e}")

# Example usage
url = "https://docs.google.com/spreadsheets/d/1i5SKBS7lr6nBPC2OTOF8Bj6sXiWAcKEj58Vg7ssdaKQ/edit?usp=sharing"
save_path = "data/processed/uploaded_files/input_data.csv"

data_ingestion = DataIngestion(url, save_path)
data_ingestion.ingest_data()
