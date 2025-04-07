#!/bin/bash
echo "Setting up environment..."
source .venv/bin/activate
echo "Environment setup completed."


echo "Starting Scraping..."
node script.js
echo "__________________________________"

echo "Scraping completed."
echo "Starting Data Processing..."
python3 transform.py
echo "Data Processing completed."
echo "__________________________________"

echo "Uploading to BigQuery..."
python3 bigquery_upload.py
echo "Pipeline finished."

