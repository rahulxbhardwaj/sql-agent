import sqlite3

from app.config import DATABASE_PATH

class DatabaseManager:

    def __init__(self):

        self.db_path = DATABASE_PATH

        self.connection = sqlite3.connect(self.db_path, check_same_thread=False)

        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()
        print("Database connection established.")

    def execute_query(self, query):

        self.cursor.execute(query)
        rows = self.cursor.fetchall()

        result = [dict(row) for row in rows]
        return result
    
    def close(self):
        self.connection.close()
        print("Database connection closed.")