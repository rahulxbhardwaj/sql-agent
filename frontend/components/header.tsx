import {
  Database,
  Sparkles,
  MessageSquarePlus,
  Clock3,
  Settings,
  Circle,
} from "lucide-react";

export default function Header() {
  return (
    <div className="flex h-full flex-col justify-between p-8">

      {/* Logo */}

      <div>

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 shadow-lg backdrop-blur-xl border border-white/60">

            <Database className="h-7 w-7 text-sky-600" />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-slate-800">
              SQL Agent
            </h1>

            <p className="text-sm text-slate-500">
              AI Database Assistant
            </p>

          </div>

        </div>

        {/* New Chat */}

        <button
          className="
          mt-10
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl
          border
          border-white/70
          bg-white/60
          py-4
          font-semibold
          text-slate-700
          backdrop-blur-xl
          transition
          duration-300
          hover:scale-[1.02]
          hover:bg-white/80
          hover:shadow-xl
        "
        >
          <MessageSquarePlus size={20} />

          New Conversation
        </button>

        {/* Navigation */}

        <div className="mt-12 space-y-3">

          <button className="flex w-full items-center gap-3 rounded-2xl bg-white/50 px-5 py-4 text-slate-700 backdrop-blur-lg transition hover:bg-white/70">

            <Sparkles size={18} />

            AI Workspace

          </button>

          <button className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-slate-600 transition hover:bg-white/50">

            <Clock3 size={18} />

            Recent Queries

          </button>

          <button className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-slate-600 transition hover:bg-white/50">

            <Settings size={18} />

            Settings

          </button>

        </div>

      </div>

      {/* Status Card */}

      <div
        className="
        rounded-3xl
        border
        border-white/70
        bg-white/60
        p-5
        backdrop-blur-2xl
        shadow-xl
      "
      >

        <div className="flex items-center justify-between">

          <div>

            <p className="font-semibold text-slate-700">

              Local LLM

            </p>

            <p className="text-sm text-slate-500">

              Connected

            </p>

          </div>

          <Circle
            size={14}
            className="fill-green-500 text-green-500"
          />

        </div>

      </div>

    </div>
  );
}