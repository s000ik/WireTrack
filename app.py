from flask import Flask, request, jsonify
import pandas as pd
import sqlite3
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.base import STATE_STOPPED
import logging
from ml_models.training.model_eval import Predict as ModelEvalPredict
from ml_models.training.model_eval_mini import Predict as ModelEvalMiniPredict
from scripts.ingest_data import DataIngestion
from scripts.preprocess_data import Preprocessing
from scripts.preprocess_data_mini import PreprocessingMini

app = Flask(__name__)
CORS(app)

DATABASE = 'features.db'
scheduler = BackgroundScheduler()
scheduler.start()

# Toggle state to control the scheduler
toggle_state = {"enabled": False}

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS features (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            elongation REAL,
            uts REAL,
            conductivity REAL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/save_features', methods=['POST'])
def save_features():
    try:
        data = request.json
        elongation_d = float(data['elongation'])
        uts_d = float(data['uts'])
        conductivity_d = float(data['conductivity'])

        # Connect to the SQLite database
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO features (elongation, uts, conductivity) VALUES (?, ?, ?)',
                       (elongation_d, uts_d, conductivity_d))
        conn.commit()
        conn.close()

        # Define the file path
        file_path = 'data/processed/uploaded_files/desired_values.csv'

        # Create a DataFrame for the new data
        new_data = pd.DataFrame({
            "Elongation": [elongation_d],
            "UTS": [uts_d],
            "Conductivity": [conductivity_d]
        })

        # Check if the file exists, append data if it does, otherwise create a new file
        try:
            existing_data = pd.read_csv(file_path)
            updated_data = pd.concat([existing_data, new_data], ignore_index=True)
        except FileNotFoundError:
            updated_data = new_data

        # Save the updated data back to the file
        updated_data.to_csv(file_path, index=False)

        return jsonify({"message": "Features saved successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    try:
        # Step 1: Ingest data
        data_ingestion = DataIngestion(
            url='https://docs.google.com/spreadsheets/d/19XwKp2ejQ98Rbs5W5trlxb_7CIXMPWnxT5n3lBcxYDc/export?format=csv', 
            save_path='data/processed/uploaded_files/input_data.csv'
        )
        data_ingestion.ingest_data()

        # Step 2: Preprocess data
        preprocessing = Preprocessing()
        preprocessing.run_preprocessing()

        # Step 3: Run model predictions
        input_csv_path = 'data/processed/uploaded_files/scaled_data.csv'
        model_eval = ModelEvalPredict(feature_csv=input_csv_path)
        predictions = model_eval.run_prediction()

        # Validate and extract predictions
        elongation = float(predictions[0][9]) if len(predictions[0]) > 9 else None
        uts = float(predictions[1][9]) if len(predictions[1]) > 9 else None
        conductivity = float(predictions[2][9]) if len(predictions[2]) > 9 else None

        # Ensure all predictions are valid
        if None in (elongation, uts, conductivity):
            return jsonify({"error": "Invalid prediction outputs"}), 500

        # Step 4: Construct and return the response
        response = {
            "predictions": {
                "elongation": elongation,
                "uts": uts,
                "conductivity": conductivity
            }
        }
        return jsonify(response)

    except Exception as e:
        # Catch and return any unexpected errors
        return jsonify({"error": str(e)}), 500

@app.route('/api/final_prediction', methods=['GET'])
def final_prediction():
    # Data ingestion and preprocessing
    ingest = DataIngestion(url='https://docs.google.com/spreadsheets/d/1i5SKBS7lr6nBPC2OTOF8Bj6sXiWAcKEj58Vg7ssdaKQ/export?format=csv', save_path='data/processed/uploaded_files/input_data.csv')
    ingest.ingest_data()

    preprocess = Preprocessing()
    preprocess.run_preprocessing()

    input_csv_path = 'data/processed/uploaded_files/scaled_data.csv'

    # Run predictions with model_eval.py
    model_eval = ModelEvalPredict(feature_csv=input_csv_path)
    elongation, uts, conductivity = model_eval.run_prediction()

    # Convert predictions to Python float
    elongation = float(elongation[9])
    uts = float(uts[9])
    conductivity = float(conductivity[9])

    intermediate_csv_path = 'data/processed/uploaded_files/intermediate_features.csv'

    output_data = {
        "Elongation": [elongation],
        "UTS": [uts],
        "Conductivity": [conductivity]
    }
    pd.DataFrame(output_data).to_csv(intermediate_csv_path, index=False)

    preprocessmini = PreprocessingMini()
    preprocessmini.run_preprocessing()

    desired_csv_path = 'data/processed/uploaded_files/scaled_reverse_data.csv'

    model_eval_mini = ModelEvalMiniPredict(feature_csv=desired_csv_path)
    all_results, last_result = model_eval_mini.run_pipeline()

    # Fetch original values
    original = pd.read_csv('data/processed/uploaded_files/input_data.csv').iloc[-1:]
    original_values = {
        key: float(original[key].values[0]) for key in [
            "EMUL_OIL_L_TEMP_PV_VAL0", "STAND_OIL_L_TEMP_PV_REAL_VAL0", "GEAR_OIL_L_TEMP_PV_REAL_VAL0",
            "EMUL_OIL_L_PR_VAL0", "QUENCH_CW_FLOW_EXIT_VAL0", "CAST_WHEEL_RPM_VAL0", "BAR_TEMP_VAL0",
            "QUENCH_CW_FLOW_ENTRY_VAL0", "GEAR_OIL_L_PR_VAL0", "STANDS_OIL_L_PR_VAL0", "TUNDISH_TEMP_VAL0",
            "BATH_TEMP_F7_VAL0", "BATH_TEMP_F8_VAL0", "RM_MOTOR_COOL_WATER__VAL0", "ROLL_MILL_AMPS_VAL0",
            "RM_COOL_WATER_FLOW_VAL0", "EMULSION_LEVEL_ANALO_VAL0", "pctAL"
        ]
    }

    # Calculate differences
    differences = {
        key: float(original_values[key] - last_result[key]) for key in last_result.keys()
    }

    response = {
        "predictions": {
            "elongation": elongation,
            "uts": uts,
            "conductivity": conductivity
        },
        "differences": differences,
        "original": original_values,
        "prediction": {key: float(value) for key, value in last_result.items()}
    }

    return jsonify(response)

@app.route('/api/toggle_automation', methods=['POST'])
def toggle_automation():
    try:
        global toggle_state
        data = request.json
        toggle_state["enabled"] = data.get("enabled", False)

        # Define a wrapper function to run final_prediction with Flask's application context
        def run_final_prediction():
            with app.app_context():
                final_prediction()

        if toggle_state["enabled"]:
            if scheduler.state == STATE_STOPPED:
                scheduler.start()
            scheduler.add_job(id='final_prediction_job',
                              func=run_final_prediction,  # Use the wrapper function
                              trigger='interval',
                              seconds=10,
                              replace_existing=True)
        else:
            scheduler.remove_job('final_prediction_job')

        return jsonify({"message": f"Automation {'enabled' if toggle_state['enabled'] else 'disabled'}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/get_toggle_state', methods=['GET'])
def get_toggle_state():
    return jsonify(toggle_state), 200


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
