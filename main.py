from app.llm.llm_client import LLMClient
from app.database.db_manager import DatabaseManager
from app.database.schema_reader import SchemaReader
from app.prompts.prompt_builder import PromptBuilder
from app.agents.sql_agent import SQLAgent
from app.utils.sql_cleaner import clean_sql
from app.database.data_profiler import DataProfiler
from app.graph.sql_graph import SQLGraph

from app.utils.sql_cleaner import clean_sql
from app.prompts.repair_prompt_builder import RepairPromptBuilder
from app.prompts.schema_formatter import SchemaFormatter
from app.prompts.planner_prompt_builder import PlannerPromptBuilder

#Tracer for Time
from app.tracing.execution_tracer import ExecutionTracer
tracer = ExecutionTracer()

#CLI UI
from app.ui.cli_renderer import CLIRenderer
renderer = CLIRenderer()



llm = LLMClient()
db = DatabaseManager()
schema_reader = SchemaReader(db)
prompt_builder = PromptBuilder()
sql_graph = SQLGraph(llm, db, schema_reader, prompt_builder, clean_sql, RepairPromptBuilder, SchemaFormatter, PlannerPromptBuilder,tracer)
data_profiler = DataProfiler(db)

response = sql_graph.ask("How many orders got vegetables in category ?")
renderer.render(response,tracer.get_trace())


#agent = SQLAgent(llm , db , schema_reader , prompt_builder)
#question = "How many order got vegetables in category ?"
#response = agent.ask(question)
#print(response)
#print("Execution Result : ", db.execute_query(clean_sql(response["sql_query"])))
db.close()


