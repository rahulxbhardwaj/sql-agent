import {
  ArrowUp,
  Sparkles,
  Paperclip,
  Database,
} from "lucide-react";

interface QueryInputProps {
  query: string;
  setQuery: (value: string) => void;
  askAI: () => void;
}

export default function QueryInput({
  query,
  setQuery,
  askAI,
}: QueryInputProps) {

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      askAI();
    }
  }

  return (

    <div
      className="
      rounded-[34px]
      border
      border-white/70
      bg-white/60
      backdrop-blur-3xl
      shadow-[0_15px_40px_rgba(120,130,255,.12)]
      px-6
      py-5
    "
    >

      {/* Input */}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about your database..."
        className="
          w-full
          bg-transparent
          text-lg
          font-medium
          tracking-[-0.02em]
          leading-7
          text-slate-700
          placeholder:text-slate-400
          outline-none
          "
      />

      {/* Bottom Toolbar */}

      <div className="mt-5 flex items-center justify-between">

        

        {/* Send Button */}

        <button
          onClick={askAI}
          className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br
          from-violet-500
          via-blue-500
          to-cyan-500
          text-white
          shadow-xl
          transition-all
          duration-300
          hover:scale-110
          hover:rotate-6
          active:scale-95
        "
        >
          <ArrowUp size={22} />
        </button>

      </div>

    </div>

  );

}