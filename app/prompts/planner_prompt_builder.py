class PlannerPromptBuilder:

    def build_plan_prompt(
            self,
            question,
            formatted_schema
    ):
        prompt = f"""
You are an expert Database Planning Assistant.

Your job is NOT to write SQL.

Your job is to understand the user's request and create an execution plan.

Available Database Schema:

{formatted_schema}

User Question:
{question}

Rules:

1. Understand what information the user wants.
2. Identify which table(s) will be needed.
3. Identify important filters.
4. Identify required aggregations (COUNT, SUM, AVG, etc.).
5. Identify sorting or grouping if required.
6. Do NOT write SQL.
7. Keep the plan concise.
"""
        return prompt