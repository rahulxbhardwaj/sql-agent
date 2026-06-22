class DataProfiler:

        def __init__(self, db):
            self.db = db

        def get_distinct_values(self,
                                table_name,
                                column_name,
                                limit = 10):
            query = f"SELECT DISTINCT {column_name} FROM {table_name} LIMIT {limit}"
            output =  self.db.execute_query(query)
            return [row[column_name] for row in output]
        
