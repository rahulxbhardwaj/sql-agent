import os
import pandas as pd
import sqlite3

from app.config import DATABASE_PATH

DATASET_FOLDER = "sample_dataset"

print("Loading data from CSV files...")

# Connect to SQLite
con = sqlite3.connect(DATABASE_PATH)

# Load every CSV in the folder
for file in os.listdir(DATASET_FOLDER):
    if file.endswith(".csv"):
        csv_path = os.path.join(DATASET_FOLDER, file)

        print(f"\nLoading {file}...")

        df = pd.read_csv(csv_path)

        # Table name = file name without .csv
        table_name = os.path.splitext(file)[0]

        df.to_sql(
            table_name,
            con,
            if_exists="replace",
            index=False
        )

        print(f"Created table: {table_name}")
        print(f"Rows inserted: {len(df)}")

con.close()

print("\nDatabase setup complete.")