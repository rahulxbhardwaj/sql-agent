from app.llm.llm_client import LLMClient
from app.database.db_manager import DatabaseManager
from app.database.schema_reader import SchemaReader
from app.prompts.prompt_builder import PromptBuilder
from app.agents.sql_agent import SQLAgent
from app.utils.sql_cleaner import clean_sql
from app.database.data_profiler import DataProfiler


llm = LLMClient()
db = DatabaseManager()
schema_reader = SchemaReader(db)
prompt_builder = PromptBuilder()
data_profiler = DataProfiler(db)

print(data_profiler.get_distinct_values("orders", "category"))

#agent = SQLAgent(llm , db , schema_reader , prompt_builder)
#question = "How many order got vegetables in category ?"
#response = agent.ask(question)
#print(response)
#print("Execution Result : ", db.execute_query(clean_sql(response["sql_query"])))
db.close()


