# GPU Performance & Pricing ETL Pipeline

This project demonstrates a complete **ETL (Extract, Transform, Load)** pipeline for analyzing GPU prices and performance characteristics using publicly available data on [morele.net]("https://www.morele.net/"). Gathered insights can be found in the dashboard on Looker Studio.


##  Live Dashboard

 [View Looker Studio Report](https://lookerstudio.google.com/reporting/d1665484-99d1-43cb-bcf7-d049b0d0bd99)
 
![image](https://github.com/user-attachments/assets/a82263b8-7f3f-409b-aa00-a78300c306bd)



---

##  Technologies Used

| Stage        | Tools/Tech                             |
|--------------|-----------------------------------------|
| **Extract**  | Node.js, Axios, Cheerio (Web scraping), Regex |
| **Transform**| Python, Pandas                  |
| **Load**     | Google BigQuery, `google-cloud-bigquery` lib |
| **Orchestration** | Bash Script (for local runs)       |
| **Visualization** | Looker Studio (GCP)               |


---

##  Pipeline Overview

1. **Scrape** data from an e-commerce site using Cheerio for scraping and regex for cleansing data (`script.js`) 
   - Scraping data from the e-commerce store
   - Extracting necessary infromation from the html, e.g. Value, unit using regex 
2. **Clean and transform** the data with Python (`transform.py`)
   - Exploratory data analysis
   - Adequately transforming columns e.g. MB converted to GB
   - Dropping any null columns
   - Adding new columns e.g. Price per 1GB RAM
3. **Load** the cleaned dataset to Google BigQuery in Python (`bigquery_upload.py`) 
4. **Visualize** insights interactively in Looker Studio
