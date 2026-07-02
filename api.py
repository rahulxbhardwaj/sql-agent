from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ===== Project Imports =====
from app.llm.llm_client import LLMClient
from app.database.db_manager import DatabaseManager
from app.database.schema_reader import SchemaReader
from app.prompts.prompt_builder import PromptBuilder
from app.graph.sql_graph import SQLGraph
from app.prompts.schema_formatter import SchemaFormatter
from app.utils.sql_cleaner import clean_sql
from app.tracing.execution_tracer import ExecutionTracer

# ===========================
# FastAPI App
# ===========================

app = FastAPI(title="AI Database Operator API")

# Allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================
# Initialize Agent (Only Once)
# ===========================

tracer = ExecutionTracer()

llm = LLMClient()
db = DatabaseManager()
schema_reader = SchemaReader(db)
prompt_builder = PromptBuilder()

sql_graph = SQLGraph(
    llm,
    db,
    schema_reader,
    prompt_builder,
    clean_sql,
    SchemaFormatter,
    tracer,
)

# ===========================
# Request Model
# ===========================

class QuestionRequest(BaseModel):
    question: str


# ===========================
# Routes
# ===========================

@app.get("/")
def home():
    return {
        "message": "AI Database Operator Backend Running 🚀"
    }


@app.post("/ask")
def ask_ai(request: QuestionRequest):

    state = sql_graph.ask(request.question)

    # Optional: Print complete graph state for debugging
    print(state)

    return {
        "question": state["question"],
        "answer": state["results"],
        "sql": state["final_query"],
        "reasoning": state["thought_process"],
        "error": state["error"],
        "trace": tracer.get_trace()
    }