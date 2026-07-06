import json

from typing import TypedDict, List, Dict, Any

from langgraph.graph import StateGraph, START, END

from app.prompts.visualization_prompt import visualization_prompt


class VisualizationState(TypedDict):
    question: str
    sql: str
    result: List[Dict[str, Any]]

    chart: str
    title: str
    x: str
    y: str
    reason: str
    insight: str


class VisualizationGraph:

    def __init__(self, llm):

        self.llm = llm

        builder = StateGraph(VisualizationState)

        builder.add_node("visualize", self.visualize)

        builder.add_edge(START, "visualize")
        builder.add_edge("visualize", END)

        self.graph = builder.compile()

    def run(self, question, sql, result):

        state = self.graph.invoke(
            {
                "question": question,
                "sql": sql,
                "result": result,
                "chart": "",
                "title": "",
                "x": "",
                "y": "",
                "reason": "",
                "insight": "",
            }
        )

        return {
            "chart": state["chart"],
            "title": state["title"],
            "x": state["x"],
            "y": state["y"],
            "reason": state["reason"],
            "insight": state["insight"],
        }

    def visualize(self, state):

        prompt = visualization_prompt.format(
            question=state["question"],
            sql=state["sql"],
            result=json.dumps(state["result"], indent=2),
        )

        response = self.llm.generate(prompt)

        print("\n========== VISUALIZATION LLM ==========")
        print(response)
        print("=======================================\n")

        try:

            parsed = json.loads(response)

            return {
                "chart": parsed.get("chart", "table"),
                "title": parsed.get("title", "Visualization"),
                "x": parsed.get("x", ""),
                "y": parsed.get("y", ""),
                "reason": parsed.get("reason", ""),
                "insight": parsed.get("insight", ""),
            }

        except Exception as e:

            print("Visualization Parsing Error:", e)

            return {
                "chart": "table",
                "title": "Visualization",
                "x": "",
                "y": "",
                "reason": "Failed to parse LLM response.",
                "insight": "",
            }