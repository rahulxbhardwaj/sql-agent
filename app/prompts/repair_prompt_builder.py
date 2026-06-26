class RepairPromptBuilder:

    def __init__(self):
        pass

    def build_repair_prompt(
            self,
            question,
            sql_query,
            error,
            schema
    ):
        print("SQL Query to Repair : ", sql_query)
        print("Database Error : ", error)
        
        prompt = f"""
        You are an expert SQLite SQL repair assistant.

        User Question:
        {question}

        Generated SQL:
        {sql_query}

        Database Error:
        {error}

        Available Database Schema:
        {schema}

        Rules:

        1. Fix the SQL query.
        2. Use only available tables.
        3. Use only available columns.
        4. Return ONLY SQL.
        5. No markdown.
        6. No explanation.
        """

        return prompt