import sys
import json
import pandas as pd
from prophet import Prophet
import traceback

def main():
    try:
        # Get input JSON from Node (sys.argv[1])
        input_json = sys.argv[1]
        # Print to stderr for debugging (won't affect stdout for JSON)
        print(f"Received input: {input_json}", file=sys.stderr)
        
        input_data = json.loads(input_json)
        
        if not input_data or len(input_data) < 2:
            raise ValueError(f"Not enough data points. Received {len(input_data)} data points, need at least 2.")

        print(f"Parsed {len(input_data)} data points", file=sys.stderr)
        
        # Convert to DataFrame
        df = pd.DataFrame(input_data)  
        print(f"DataFrame head: {df.head().to_string()}", file=sys.stderr)
        
        # Ensure date format
        df['ds'] = pd.to_datetime(df['ds'])
        
        # Check for valid numbers in 'y' column
        df['y'] = pd.to_numeric(df['y'], errors='coerce')
        valid_rows = df.dropna()
        
        if len(valid_rows) < 2:
            raise ValueError(f"Dataframe has only {len(valid_rows)} valid rows out of {len(df)}. Need at least 2.")
            
        print(f"After cleaning: {valid_rows.head().to_string()}", file=sys.stderr)
        
        # Use the cleaned data
        model = Prophet()
        model.fit(valid_rows)

        # Predict next 3 months
        future = model.make_future_dataframe(periods=3, freq='ME')  # Using ME instead of M as per warning
        forecast = model.predict(future)

        # Extract only the predictions (last 3 months)
        result = forecast[['ds', 'yhat']].tail(3).to_dict(orient='records')
        
        # Convert datetime objects to strings
        for item in result:
            item['ds'] = item['ds'].strftime('%Y-%m-%d')

        # Only print the JSON result to stdout - this is what Node.js will parse
        print(json.dumps(result))

    except Exception as e:
        error_msg = {
            "error": str(e),
            "trace": traceback.format_exc()
        }
        # Only print the JSON error to stdout
        print(json.dumps(error_msg))

if __name__ == "__main__":
    main()