from urllib import response

from langgraph.graph import StateGraph, START, END

from app.agents.exploration_agent import ExplorationAgent
from app.graph.state import SQLAgentState


class SQLGraph:

    def __init__(
        self,
        llm,
        db,
        schema_reader,
        prompt_builder,
        clean_sql,
        SchemaFormatter,
        tracer,
    ):

        self.llm = llm
        self.db = db
        self.schema_reader = schema_reader
        self.prompt_builder = prompt_builder
        self.clean_sql = clean_sql
        self.schema_formatter = SchemaFormatter()
        self.tracer = tracer

        builder = StateGraph(SQLAgentState)

        builder.add_node("load_context", self.load_context)
        builder.add_node("planner", self.sql_agent)
        builder.add_node("execute_exploration", self.execute_exploration)
        builder.add_node("update_history", self.update_history)
        builder.add_node("execute_final", self.execute_final)

        builder.add_edge(START, "load_context")
        builder.add_edge("load_context", "planner")

        builder.add_conditional_edges(
            "planner",
            self.route_after_planner,
            {
                "explore": "execute_exploration",
                "final": "execute_final",
            },
        )

        builder.add_edge("execute_exploration", "update_history")

        builder.add_conditional_edges(
            "update_history",
            self.route_after_history,
            {
                "planner": "planner",
                "final": "execute_final",
            },
        )

        builder.add_edge("execute_final", END)

        self.graph = builder.compile()

    def ask(self, question):

        self.tracer.clear()

        return self.graph.invoke(
            {
                "question": question,
                "history": [],
                "sql_query": "",
                "results": [],
                "final_query": "",
                "need_exploration": False,
                "remaining_attempts": 3,
                "error": "",
                "context": "",
                "thought_process": "",
            }
        )

    def load_context(self, state):

        self.tracer.start_step("load_context")

        schema = self.schema_reader.get_schema()
        formatted_schema = self.schema_formatter.format_schema(schema)

        self.tracer.finish_step("load_context")

        return {
            "context": formatted_schema
        }

    def sql_agent(self, state):

        self.tracer.start_step("planner")

        agent = ExplorationAgent(
            self.llm,
            self.db,
            state["context"],
        )

        result = agent.run(state)
        print("\n========== RAW LLM RESPONSE ==========")
        print(result)
        print("=====================================\n")

        self.tracer.finish_step("planner")

        return result

    def execute_exploration(self, state):

        self.tracer.start_step("execute_exploration")

        try:

            sql = self.clean_sql(state["sql_query"])

            print("Executing:", sql)

            result = self.db.execute_query(sql)

            self.tracer.finish_step("execute_exploration")

            return {
                "results": result,
                "error": "",
            }

        except Exception as e:

            self.tracer.finish_step("execute_exploration")

            return {
                "results": [],
                "error": str(e),
            }

    def update_history(self, state):

        history = list(state["history"])

        history.append(
            {
                "thought_process": state["thought_process"],
                "exploration_query": state["sql_query"],
                "observation": state["results"],
            }
        )

        return {
            "history": history,
            "remaining_attempts": state["remaining_attempts"] - 1,
        }

    def execute_final(self, state):

        self.tracer.start_step("execute_final")

        try:

            sql = self.clean_sql(state["final_query"])

            result = self.db.execute_query(sql)

            self.tracer.finish_step("execute_final")

            return {
                "results": result,
                "error": "",
            }

        except Exception as e:

            self.tracer.finish_step("execute_final")

            return {
                "results": [],
                "error": str(e),
            }

    def route_after_planner(self, state):

        if state["need_exploration"]:
            return "explore"

        return "final"

    def route_after_history(self, state):

        if state["remaining_attempts"] <= 0:
            return "final"

        return "planner"