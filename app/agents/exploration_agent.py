import json

from app.prompts.planner_prompt import planner_prompt
from app.graph.state import SQLAgentState


class ExplorationAgent:

    def __init__(self, llm, db, schema):

        self.llm = llm
        self.db = db
        self.schema = schema

    def run(self, state: SQLAgentState):

        print("\n========== Planner ==========\n")

        planner_result = self._think(state)

        print(planner_result)

        return {
            "need_exploration": planner_result["need_exploration"],
            "sql_query": planner_result["exploration_query"],
            "final_query": planner_result["final_query"],
            "thought_process": planner_result["thought_process"],
        }

    def _think(self, state: SQLAgentState):

        prompt = planner_prompt(
            question=state["question"],
            schema=self.schema,
            history=state["history"],
        )

        response = self.llm.generate(prompt)

        print(response)

        response = response.strip()

        if response.startswith("```"):
            response = response.replace("```json", "")
            response = response.replace("```", "")
            response = response.strip()

        return json.loads(response)