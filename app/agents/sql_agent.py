
from app.utils.sql_cleaner import clean_sql
class SQLAgent:

    def __init__(
            self,
            llm,
            db,
            schema_reader,
            prompt_builder
    ):
        self.llm = llm
        self.db = db
        self.schema_reader = schema_reader
        self.prompt_builder = prompt_builder

    def ask(self, question):
        schema = {"orders" : self.schema_reader.get_columns('orders')}
        prompt = self.prompt_builder.build_sql_prompt(question, schema)
        sql_query = self.llm.generate(prompt)
        cleaned_sql_query = clean_sql(sql_query)
        result = {
            "question": question,
            "sql_query": cleaned_sql_query,
            "result": self.db.execute_query(cleaned_sql_query)
        }
        return result
