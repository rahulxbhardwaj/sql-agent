from typing import TypedDict


class Plan(TypedDict):
    execution_plan: str
    history: str
    exploration_steps: int
    confidence: float

class SQLAgentState(TypedDict):
    """State of the SQL Agent."""
    
    question: str
    sql_query: str
    results: list
    error: str
    retry_count : int
    context : str
    plan : Plan