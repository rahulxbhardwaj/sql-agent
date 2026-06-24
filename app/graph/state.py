from typing import TypedDict

class SQLAgentState(TypedDict):
    """State of the SQL Agent."""
    
    question: str
    sql_query: str
    results: list
    error: str
    retry_count : int