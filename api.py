from fastapi import FastAPI , Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

from fastapi.responses import StreamingResponse
import asyncio

# ===== Project Imports =====
from app.llm.llm_client import LLMClient
from app.database.db_manager import DatabaseManager
from app.database.schema_reader import SchemaReader
from app.prompts.prompt_builder import PromptBuilder
from app.graph.sql_graph import SQLGraph
from app.prompts.schema_formatter import SchemaFormatter
from app.utils.sql_cleaner import clean_sql
from app.tracing.execution_tracer import ExecutionTracer


# ===========Visualization Agent===========
from app.agents.visualization_agent import VisualizationGraph
   
# ===========================
# FastAPI App
# ===========================

app = FastAPI(title="AI Database Operator API")
clients = []

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
visualization_graph = VisualizationGraph(llm)

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

@app.post("/event")
async def event(request: Request):
    data = await request.json()
    print(f"Received Event: {data}")
    for client in clients:
        await client.put(data)
    return {"success" : True}


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


@app.get("/events")
async def events():

    queue = asyncio.Queue()
    clients.append(queue)

    async def event_stream():
        while True:
            data = await queue.get()
            yield f"data: {json.dumps(data)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream"
    )


class VisualizationRequest(BaseModel):
    question: str
    sql: str
    result: list

@app.post("/visualize")
def visualize(request: VisualizationRequest):

    visualization = visualization_graph.run(
        question=request.question,
        sql=request.sql,
        result=request.result,
    )

    return {
        "success": True,
        "visualization": visualization,
    }