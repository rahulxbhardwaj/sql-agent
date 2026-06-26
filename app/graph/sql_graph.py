from langgraph.graph import (StateGraph , START , END)
from app.agents.exploration_agent import ExplorationAgent


from app.graph.state import SQLAgentState

class SQLGraph:
    def __init__(self,llm,db,schema_reader,
                 prompt_builder,clean_sql,RepairPromptBuilder,SchemaFormatter,PlannerPromptBuilder,tracer):
       
       self.llm = llm
       self.db = db
       self.schema_reader = schema_reader
       self.prompt_builder = prompt_builder
       self.clean_sql = clean_sql
       self.repair_prompt_builder = RepairPromptBuilder()
       self.schema_formatter = SchemaFormatter()
       self.planner_prompt_builder = PlannerPromptBuilder()
       self.tracer = tracer


       

       builder = StateGraph(SQLAgentState)
       builder.add_node("plan_query" , self.plan_query)
       builder.add_node("generate_sql" , self.generate_sql)
       builder.add_node("execute_sql" , self.execute_sql)
       builder.add_node("repair_sql" , self.repair_sql)
       builder.add_node("load_context" , self.load_context)

       builder.add_edge(START , "load_context")
       builder.add_edge("load_context" , "plan_query")
       builder.add_edge("plan_query" , "generate_sql")
       builder.add_edge("generate_sql" , "execute_sql")
       builder.add_conditional_edges("execute_sql" , self.route_after_execution , { "repair_sql" : "repair_sql" , "end" : END })
       builder.add_edge("repair_sql" , "execute_sql")

       self.graph = builder.compile()
       



    def generate_sql(self,state:SQLAgentState):
        """Generate SQL query from the question."""
        self.tracer.start_step("generate_sql")
        prompt = self.prompt_builder.build_sql_prompt(state["question"], state["plan"]["execution_plan"], state["context"])

        sql_query = self.llm.generate(prompt)
        self.tracer.finish_step("generate_sql")
        return {
            "sql_query" : self.clean_sql(sql_query)
        }

    def ask(self , question):
        self.tracer.clear()
        return self.graph.invoke(
            {
                "question" : question,
                "retry_count" : 0
            }
        )
    
    def execute_sql(self , state : SQLAgentState):
        """Execute the Sql Query and return the result."""
        self.tracer.start_step("execute_sql")
        try:
            result = self.db.execute_query(self.clean_sql(state["sql_query"]))

            self.tracer.finish_step("execute_sql")
            return {"results" : result , "error" : ""}
        except Exception as e:
            self.tracer.finish_step("execute_sql")
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
        self.tracer.start_step("repair_sql")
        print("Repairing SQL Query...")

        repair_prompt = (self.repair_prompt_builder.build_repair_prompt(
            state["question"],
            state["sql_query"],
            state["error"],
            state["context"]
        ))

        repaired_sql = self.llm.generate(repair_prompt)
        print("Repaired SQL Query : ", repaired_sql)
        self.tracer.finish_step("repair_sql")
        return {
            "sql_query" : self.clean_sql(repaired_sql),
            "error" : "",
            "retry_count" : state.get("retry_count", 0) + 1
        }
    
    def plan_query(self , state: SQLAgentState):

        """Plan the SQL Query execution."""
        self.tracer.start_step("plan_query")

        #prompt = self.planner_prompt_builder.build_plan_prompt(state["question"],state["context"])
        #plan = self.llm.generate(prompt)
        agent = ExplorationAgent(self.llm , self.db)
        plan = agent.run(state["question"])

        self.tracer.finish_step("plan_query")
        return { "plan" : plan }

    def load_context(self , state : SQLAgentState):
        self.tracer.start_step("load_context")
        schema = self.schema_reader.get_schema()
        formatted_schema = self.schema_formatter.format_schema(schema)
        self.tracer.finish_step("load_context")
        return { "context" : formatted_schema }