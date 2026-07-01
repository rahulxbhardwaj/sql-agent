from datetime import datetime


class Color:
    RESET = "\033[0m"
    BOLD = "\033[1m"

    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    MAGENTA = "\033[95m"
    BLUE = "\033[94m"


class CLIRenderer:

    def __init__(self):
        self.width = 90

    def line(self):
        print("═" * self.width)

    def separator(self):
        print("─" * self.width)

    def title(self):
        self.line()
        print(
            f"{Color.BOLD}{Color.CYAN}"
            f"{'🤖 AUTONOMOUS SQL AGENT':^{self.width}}"
            f"{Color.RESET}"
        )
        print(datetime.now().strftime("%d-%m-%Y %H:%M:%S").center(self.width))
        self.line()

    def render(self, state: dict, trace: list):

        self.title()

        self.render_question(state)
        self.render_reasoning(state)
        self.render_history(state)
        self.render_sql(state)
        self.render_results(state)
        self.render_error(state)
        self.render_statistics(state, trace)
        self.render_trace(trace)

        self.line()

    # ---------------------------------------------------------

    def render_question(self, state):

        print(f"\n{Color.BOLD}❓ USER QUESTION{Color.RESET}")
        self.separator()

        print(state.get("question", "N/A"))

    # ---------------------------------------------------------

    def render_reasoning(self, state):

        print(f"\n{Color.BOLD}{Color.MAGENTA}🧠 AGENT REASONING{Color.RESET}")
        self.separator()

        thought = state.get("thought_process", "")

        if thought:
            print(thought)
        else:
            print("No reasoning available.")

    # ---------------------------------------------------------

    def render_history(self, state):

        history = state.get("history", [])

        if not history:
            return

        print(f"\n{Color.BOLD}{Color.BLUE}🔍 EXPLORATION HISTORY{Color.RESET}")
        self.separator()

        for i, step in enumerate(history, start=1):

            print(f"\nExploration #{i}")

            print("\nReason:")
            print(step.get("thought_process", ""))

            print("\nSQL:")
            print(step.get("exploration_query", ""))

            print("\nObservation:")

            observation = step.get("observation", [])

            if not observation:
                print("No rows.")
            else:
                for row in observation[:10]:
                    print(row)

                if len(observation) > 10:
                    print(f"... ({len(observation)-10} more rows)")

            self.separator()

    # ---------------------------------------------------------

    def render_sql(self, state):

        print(f"\n{Color.BOLD}{Color.GREEN}📝 FINAL SQL{Color.RESET}")
        self.separator()

        sql = state.get("final_query")

        if not sql:
            sql = state.get("sql_query")

        if sql:
            print(sql)
        else:
            print("No SQL generated.")

    # ---------------------------------------------------------

    def render_results(self, state):

        print(f"\n{Color.BOLD}{Color.GREEN}📊 RESULTS{Color.RESET}")
        self.separator()

        results = state.get("results", [])

        if not results:
            print("No rows returned.")
            return

        if isinstance(results[0], dict):

            headers = list(results[0].keys())

            widths = {}

            for h in headers:
                widths[h] = max(
                    len(str(h)),
                    max(len(str(row[h])) for row in results)
                )

            border = "+"
            for h in headers:
                border += "-" * (widths[h] + 2) + "+"

            print(border)

            row = "|"
            for h in headers:
                row += f" {str(h):<{widths[h]}} |"

            print(row)
            print(border)

            for r in results:

                row = "|"

                for h in headers:
                    row += f" {str(r[h]):<{widths[h]}} |"

                print(row)

            print(border)

        else:

            for row in results:
                print(row)

    # ---------------------------------------------------------

    def render_error(self, state):

        print(f"\n{Color.BOLD}{Color.RED}⚠ ERROR{Color.RESET}")
        self.separator()

        error = state.get("error", "")

        if error:
            print(error)
        else:
            print("None")

    # ---------------------------------------------------------

    def render_statistics(self, state, trace):

        planner_calls = 0

        for step in trace:
            if step["name"] == "planner":
                planner_calls += 1

        print(f"\n{Color.BOLD}📈 AGENT STATISTICS{Color.RESET}")
        self.separator()

        print(f"Planner Calls      : {planner_calls}")
        print(f"Exploration Steps  : {len(state.get('history', []))}")
        print(f"Retries Remaining  : {state.get('remaining_attempts', 0)}")

    # ---------------------------------------------------------

    def render_trace(self, trace):

        print(f"\n{Color.BOLD}⚡ EXECUTION TRACE{Color.RESET}")
        self.separator()

        if not trace:
            print("No trace available.")
            return

        total = 0

        for step in trace:

            duration = step.get("duration", 0)

            total += duration

            print(
                f"✔ {step['name']:<30}"
                f"{duration*1000:>10.2f} ms"
            )

        self.separator()

        print(
            f"{'TOTAL TIME':<30}"
            f"{total*1000:>10.2f} ms"
        )