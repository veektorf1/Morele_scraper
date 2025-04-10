#!/bin/bash
echo "Setting up environment..."
source .venv/bin/activate
echo "Environment setup completed."

SCRIPTS_DIR="app"

echo "Starting Scraping..."
node $SCRIPTS_DIR/script.js
echo "__________________________________"

echo "Scraping completed."
echo "Starting Data Processing..."
python3 $SCRIPTS_DIR/transform.py
echo "Data Processing completed."
echo "__________________________________"

echo "Uploading to BigQuery..."
python3 $SCRIPTS_DIR/bigquery_upload.py
echo "Pipeline finished."

