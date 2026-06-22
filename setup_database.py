import pandas as pd
import sqlite3

from app.config import DATABASE_PATH

print("Loading data from CSV files...")

df = pd.read_csv("blinkit_dataset.csv")
df.columns = [
    "order_id",
    "customer_id",
    "order_datetime",
    "product_name",
    "category",
    "quantity",
    "price",
    "city",
    "delivery_time_mins",
    "order_status"
]

con = sqlite3.connect(DATABASE_PATH)

df.to_sql(
    "orders", con, if_exists="replace", index=False
)

con.close()
print("Database setup complete. Data has been loaded into the SQLite database.")
print("Rows inserted:", len(df))