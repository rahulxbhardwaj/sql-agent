import json
from json import tool
import re
from unittest import result


class ExplorationAgent:

    MAX_STEPS = 3

    def __init__(self, llm, db_manager):
        self.llm = llm
        self.db = db_manager

    # -------------------------------------------------------
    # PUBLIC METHOD
    # -------------------------------------------------------

    def run(self, question: str):

        history = []

        print("\n========== EXPLORATION AGENT ==========")

        for step in range(self.MAX_STEPS):

            print(f"\n----- Thinking Step {step + 1} -----")

            decision = self._think(question, history)

            print(decision)

            if not decision["need_exploration"]:

                print("\nAgent has enough information.\n")

                return {
                    "execution_plan": decision["execution_plan"],
                    "history": history,
                    "exploration_steps": len(history),
                    "confidence": decision["confidence"]
                }

            print("\nExploration Required.")

            result = self._explore(decision)

            history.append({
                "tool": decision["tool"],
                "table": decision["table"],
                "column": decision["column"],
                "result": result
            })

            continue

        return {
            "execution_plan": "Unable to create execution plan.",
            "history": history,
            "exploration_steps": len(history),
            "confidence": 0.0
        }

    # -------------------------------------------------------
    # THINK
    # -------------------------------------------------------

    def _think(self, question, history):

        prompt = self._build_prompt(question, history)

        response = self.llm.generate(prompt)

        print("\n========== RAW LLM RESPONSE ==========")
        print(response)
        print("======================================")

        return self._parse_json(response)

    # -------------------------------------------------------
    # PROMPT
    # -------------------------------------------------------

    def _build_prompt(self, question, history):

        return f"""
You are an expert SQL Planning Agent.

Your task is NOT to generate SQL.

Your task is to decide whether additional database exploration is required.

Database Schema is already available.

Question:
{question}

Exploration History

{json.dumps(history, indent=2)}
If Exploration History is empty,
choose ONE exploration tool.

If Exploration History already contains observations,
use them before deciding.

Only return FINISH after you have enough information.
If enough information is available:

Return

{{
    "need_exploration": false,
    "execution_plan": "...",
    "tool": "",
    "table": "",
    "column": "",
    "confidence": 0.95
}}

Otherwise return

{{
    "need_exploration": true,
    "execution_plan": "",
    "tool": "SAMPLE_ROWS",
    "table": "orders",
    "column": "",
    "confidence": 0.70
}}

Allowed tools are

SAMPLE_ROWS

DISTINCT_VALUES

COUNT_ROWS

MIN_MAX

Return ONLY JSON.
"""

    # -------------------------------------------------------
    # JSON PARSER
    # -------------------------------------------------------

    def _parse_json(self, response):

        match = re.search(r"\{.*\}", response, re.DOTALL)

        if not match:

            raise Exception("LLM did not return JSON.")

        return json.loads(match.group())
    
    
    # -------------------------------------------------------
    # EXPLORING DATABASE
    # -------------------------------------------------------


    def _explore(self, decision):

        tool = decision["tool"]

        table = decision["table"]

        column = decision["column"]


        if tool == "SAMPLE_ROWS":

            query = f"""
            SELECT *
            FROM {table}
            LIMIT 5;
            """

            print(query)

            return self.db.execute_query(query)


        elif tool == "COUNT_ROWS":

            query = f"""
            SELECT COUNT(*) AS total_rows
            FROM {table};
            """

            print(query)

            return self.db.execute_query(query)


        elif tool == "DISTINCT_VALUES":

            query = f"""
            SELECT DISTINCT {column}
            FROM {table}
            LIMIT 10;
            """

            print(query)

            return self.db.execute_query(query)


        elif tool == "MIN_MAX":

            query = f"""
            SELECT
                MIN({column}) AS minimum,
                MAX({column}) AS maximum
            FROM {table};
            """

            print(query)

            return self.db.execute_query(query)


        return "Unknown Tool"