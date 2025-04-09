from google.cloud import bigquery
import os
from dotenv import load_dotenv

load_dotenv()
if os.getenv("GOOGLE_APPLICATION_CREDENTIALS") is None:
    raise ValueError("Environmental variable GOOGLE_APPLICATION_CREDENTIALS is not set")

project_id = "gpu-morele-data-scraping"
dataset_id = "GPU_DATA_MORELE"
table_id = "GPU_DATA"
csv_file_path = "transformed.csv"

try:
    client = bigquery.Client(project=project_id)
except Exception as e:
    raise RuntimeError(f"Failed to connect to bigquery: {e}")

table_ref = f"{project_id}.{dataset_id}.{table_id}"

job_config = bigquery.LoadJobConfig(
    source_format = bigquery.SourceFormat.CSV,
    skip_leading_rows=1,
    autodetect=True,
    write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
)

with open(csv_file_path, "rb") as source_file:
    load_job = client.load_table_from_file(
        source_file,
        table_ref,
        job_config=job_config
    )

load_job.result()
print(f"Data uploaded successfully to bigquery {table_ref}")
