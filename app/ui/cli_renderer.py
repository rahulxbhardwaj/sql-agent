from datetime import datetime


class CLIRenderer:

    def __init__(self):
        self.width = 70

    def line(self):
        print("=" * self.width)

    def separator(self):
        print("-" * self.width)

    def title(self):
        self.line()
        print("🤖 SQL AGENT".center(self.width))
        print(datetime.now().strftime("%d-%m-%Y %H:%M:%S").center(self.width))
        self.line()

    def render(self, state: dict, trace: list):
        self.title()

        # Question
        print("\n📌 Question")
        self.separator()
        print(state.get("question", "N/A"))

        # Execution Plan
        print("\n🧠 Execution Plan")
        self.separator()
        print(state.get("plan", "N/A"))

        # SQL Query
        print("\n📝 Generated SQL")
        self.separator()
        print(state.get("sql_query", "N/A"))

        # Results
        print("\n📊 Result")
        self.separator()

        results = state.get("results", [])

        if results:
            for row in results:
                print(row)
        else:
            print("No rows returned.")

        # Error
        print("\n⚠️ Error")
        self.separator()

        error = state.get("error", "")

        if error:
            print(error)
        else:
            print("None")

        # Retry Count
        print("\n🔄 Retry Count")
        self.separator()
        print(state.get("retry_count", 0))

        # Execution Trace
        self.render_trace(trace)

        self.line()

    def render_trace(self, trace: list):
        print("\n📈 Execution Trace")
        self.separator()

        if not trace:
            print("No execution trace available.")
            return

        total_time = 0

        for step in trace:

            duration = step.get("duration", 0)

            total_time += duration

            print(
                f"✔ {step['name']:<25} {duration * 1000:.2f} ms"
            )

        self.separator()

        print(
            f"{'Total Time':<25} {total_time * 1000:.2f} ms"
        )