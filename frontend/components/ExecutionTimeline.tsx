import { TraceStep } from "../src/types/api";

interface TimelineProps {
  trace: TraceStep[];
}

const stageNames: Record<string, string> = {
  load_context: "📚 Loading Database Context",
  planner: "🧠 AI Planner Thinking",
  execute_exploration: "🔍 Exploring Database",
  execute_final: "⚡ Executing SQL",
};

export default function ExecutionTimeline({ trace }: TimelineProps) {

  if (trace.length === 0) return null;

  return (

    <div className="rounded-lg bg-gray-900 p-5">

      <h2 className="text-xl font-bold mb-5">
        ⚡ Execution Timeline
      </h2>

      <div className="space-y-3">

        {trace.map((step, index) => (

          <div
            key={index}
            className="rounded-lg border border-gray-700 bg-gray-800 p-4"
          >

            <div className="flex justify-between">

              <div className="font-semibold">

                {stageNames[step.name] ?? step.name}

              </div>

              <div className="text-green-400">

                ✔ {step.status}

              </div>

            </div>

            <div className="mt-2 text-sm text-gray-400">

              {step.duration.toFixed(2)} sec

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}