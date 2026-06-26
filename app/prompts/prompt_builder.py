class PromptBuilder:

    def build_sql_prompt(
            self,
            question,
            execution_plan,
            schema
    ):
        prompt = f"""
                    You are a SQL Expert . You need to understand the question and genertae a SQL query based on the provided database schema.

                    Rules:
                    1. Use only tables provided.
                    2. Use only columns provided.
                    3. Generate valid SQLite SQL.
                    4. Return ONLY SQL.
                    5. No markdown.
                    6. No explanation.
                    7. Try to use like operator for string matching.

                    QUESTION : {question} 
                    SCHEMA : {schema}

                    EXECUTION PLAN : {execution_plan}
                    """
    
        return prompt
    
