from app.llm.llm_client import LLMClient
from app.database.db_manager import DatabaseManager
from app.database.schema_reader import SchemaReader
from app.prompts.prompt_builder import PromptBuilder
from app.agents.sql_agent import SQLAgent
from app.utils.sql_cleaner import clean_sql
from app.database.data_profiler import DataProfiler
from app.graph.sql_graph import SQLGraph

from app.utils.sql_cleaner import clean_sql
from app.prompts.schema_formatter import SchemaFormatter


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
sql_graph = SQLGraph(llm, db, schema_reader, prompt_builder, clean_sql,SchemaFormatter,tracer)
data_profiler = DataProfiler(db)

response = sql_graph.ask("What shares does Rahul hold ? ")

renderer.render(response,tracer.get_trace())

db.close()


