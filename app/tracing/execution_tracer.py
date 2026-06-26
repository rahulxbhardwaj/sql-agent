import time
class ExecutionTracer:

    def __init__(self):
        self.steps = []

    def start_step(self, name):

        self.steps.append(
            {
                "name": name,
                "status": "Running",
                "start_time": time.time()
            }
        )

    def finish_step(self, name):

        for step in reversed(self.steps):

            if (
                step["name"] == name
                and step["status"] == "Running"
            ):

                end = time.time()

                step["duration"] = end - step["start_time"]

                step["status"] = "Completed"

                return

    def get_trace(self):

        return self.steps
    
    def clear(self):
        """Clear all previously recorded execution steps."""
        self.steps.clear()