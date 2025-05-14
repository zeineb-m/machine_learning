from flask import Flask, jsonify
import os
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import IsolationForest

app = Flask(__name__)

@app.route('/api/detect-anomalies', methods=['GET'])
def detect_anomalies():
    try:
        # Construct the CSV file path
        base_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(base_dir, '..', 'files', 'cleaned_data.csv')

        # Check if the file exists
        if not os.path.exists(csv_path):
            error_msg = f"CSV file not found at path: {csv_path}"
            print(error_msg)
            return jsonify({"error": error_msg}), 404

        # Load the CSV file
        df = pd.read_csv(csv_path)

        # Identify categorical columns
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

        # Apply Label Encoding to categorical features
        label_encoders = {}
        for col in categorical_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            label_encoders[col] = le

        # Identify numerical columns
        numerical_cols = df.select_dtypes(include=['number']).columns.tolist()

        # Scale numerical features using StandardScaler
        scaler = StandardScaler()
        df[numerical_cols] = scaler.fit_transform(df[numerical_cols])

        # Initialize IsolationForest model
        model = IsolationForest(contamination='auto', random_state=42)
        model.fit(df)

        # Predict anomaly scores
        df['anomaly_score'] = model.decision_function(df)

        # Determine anomalies based on a threshold
        threshold = df['anomaly_score'].quantile(0.1)
        anomalies = df[df['anomaly_score'] < threshold]

        # Prepare the response
        response = {
            "anomalies": anomalies.to_dict(orient='records'),
            "threshold": threshold
        }

        return jsonify(response)

    except Exception as e:
        # Log the exception details
        print(f"Error during anomaly detection: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
