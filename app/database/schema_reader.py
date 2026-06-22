class SchemaReader:
    def __init__(self,db):
        self.db = db

    def get_tables(self):
        query = "SELECT name from sqlite_master where type='table';"
        results = self.db.execute_query(query)
        return [row['name'] for row in results]

    def get_columns(self , table_name):
        query = f"PRAGMA table_info({table_name});"
        results = self.db.execute_query(query)
        return [row['name'] for row in results]