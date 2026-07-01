from typing import TypedDict, List


class HistoryItem(TypedDict):
    thought_process: str
    exploration_query: str
    observation: list


class SQLAgentState(TypedDict):
    question: str

    history: List[HistoryItem]

    sql_query: str

    results: list

    final_query: str

    need_exploration: bool

    remaining_attempts: int

    error: str

    context: str

    thought_process: str