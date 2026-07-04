import { TraceStep } from "../src/types/api";
import {
  Database,
  BrainCircuit,
  Search,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";

interface TimelineProps {
  trace: TraceStep[];
}

const stageConfig: Record<
  string,
  {
    title: string;
    icon: React.ReactNode;
  }
> = {
  load_context: {
    title: "Load Context",
    icon: <Database size={18} />,
  },

  planner: {
    title: "Planner",
    icon: <BrainCircuit size={18} />,
  },

  execute_exploration: {
    title: "Explore",
    icon: <Search size={18} />,
  },

  execute_final: {
    title: "Execute",
    icon: <PlayCircle size={18} />,
  },
};

export default function ExecutionTimeline({
  trace,
}: TimelineProps) {

  if (!trace.length) return null;

  return (

    <div
      className="
      rounded-[28px]
      border
      border-white/70
      bg-white/55
      backdrop-blur-2xl
      p-7
      shadow-lg
    "
    >

      {/* Header */}

      <div className="flex items-center gap-3 mb-8">

        <div
          className="
          h-10
          w-10
          rounded-full
          bg-violet-100
          flex
          items-center
          justify-center
          text-violet-600
        "
        >
          <CheckCircle2 size={20} />
        </div>

        <div>

          <h2 className="font-semibold text-slate-800 text-lg">

            Execution Timeline

          </h2>

          <p className="text-sm text-slate-500">

            AI execution pipeline

          </p>

        </div>

      </div>

      {/* Timeline */}

      <div className="relative">

        {/* Gradient Line */}

        <div
          className="
          absolute
          left-0
          right-0
          top-5
          h-[3px]
          rounded-full
          bg-gradient-to-r
          from-blue-400
          via-violet-400
          to-pink-400
        "
        />

        <div className="relative grid grid-cols-4 gap-4">

          {trace.map((step, index) => {

            const config = stageConfig[step.name];

            return (

              <div
                key={index}
                className="flex flex-col items-center"
              >

                {/* Circle */}

                <div
                  className="
                  relative
                  z-10
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  border
                  border-blue-200
                  shadow-lg
                  text-blue-600
                "
                >
                  {config?.icon}
                </div>

                {/* Name */}

                <p className="mt-4 text-sm font-semibold text-slate-700 text-center">

                  {config?.title ?? step.name}

                </p>

                {/* Time */}

                <p className="mt-1 text-xs text-slate-500">

                  {step.duration.toFixed(2)}s

                </p>

                {/* Status */}

                <span
                  className="
                  mt-3
                  rounded-full
                  bg-green-100
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-green-700
                "
                >

                  {step.status}

                </span>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}