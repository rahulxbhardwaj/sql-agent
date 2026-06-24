from langgraph.graph import (StateGraph , START , END)
from app.utils.sql_cleaner import clean_sql

from app.graph.state import SQLAgentState

class SQLGraph:
    def __init__(self,llm,db,schema_reader,prompt_builder):
       
       self.llm = llm
       self.db = db
       self.schema_reader = schema_reader
       self.prompt_builder = prompt_builder


       builder = StateGraph(SQLAgentState)
       builder.add_node("generate_sql" , self.generate_sql)
       builder.add_node("execute_sql" , self.execute_sql)
       builder.add_node("repair_sql" , self.repair_sql)

       builder.add_edge(START , "generate_sql")
       builder.add_edge("generate_sql" , "execute_sql")
       builder.add_conditional_edges("execute_sql" , self.route_after_execution , { "repair_sql" : "repair_sql" , "end" : END })
       builder.add_edge("repair_sql" , "execute_sql")

       self.graph = builder.compile()
       



    def generate_sql(self,state:SQLAgentState):
        """Generate SQL query from the question."""

        schema =  self.schema_reader.get_schema()
        
        prompt = self.prompt_builder.build_sql_prompt(state["question"],schema)

        sql_query = self.llm.generate(prompt)

        return {
            "sql_query" : clean_sql(sql_query)
        }

    def ask(self , question):
        return self.graph.invoke(
            {
                "question" : question,
                "retry_count" : 0
            }
        )
    
    def execute_sql(self , state : SQLAgentState):
        """Execute the Sql Query and return the result."""
        try:
            result = self.db.execute_query(clean_sql(state["sql_query"]))

            if len(result) == 0:
                return {"results" : result , "error" : "Query returned no rows."}

            return {"results" : result , "error" : ""}
        except Exception as e:
            return {"error" : str(e)}
        
        
    def route_after_execution(self , state : SQLAgentState):
        """Route the state after execution based on the result."""
        
        if state.get("error"):

            if state.get("retry_count" , 0) >= 2:
                return "end"
            
            return "repair_sql"
        else:
            return "end"


    
    def repair_sql(self , state : SQLAgentState):
        """Repair the SQL Query if it is invalid."""
        print("Repairing SQL Query...")
        schema =  self.schema_reader.get_schema()

        repair_prompt = f"""You are an expert SQLITE SQL repair assistane.
                            Question: {state['question']}

                            genrated SQL Query: {state['sql_query']}

                            Database error : {state['error']}

                            Available Schema : {schema}
                            Please provide a corrected SQL query that will execute successfully and return the correct result for the question.
                            Please provide only the SQL query and nothing else."""

        repaired_sql = self.llm.generate(repair_prompt)

        return {
            "sql_query" : clean_sql(repaired_sql),
            "error" : "",
            "retry_count" : state.get("retry_count", 0) + 1
        }
