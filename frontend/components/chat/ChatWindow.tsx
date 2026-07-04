import { Message } from "../../src/types/chat";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
}

export default function ChatWindow({
  messages,
}: ChatWindowProps) {

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      className="
      relative
      h-[68vh]
      overflow-y-auto
      rounded-[34px]
      border
      border-white/70
      bg-white/45
      backdrop-blur-3xl
      shadow-[0_20px_60px_rgba(120,130,255,0.12)]
      p-10
      "
    >

      {/* Decorative Liquid Glow */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[34px]">

        <div className="absolute -top-20 -left-24 h-64 w-64 rounded-full bg-violet-300/20 blur-[90px]" />

        <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-cyan-300/20 blur-[100px]" />

      </div>

      {/* Empty State */}

      {messages.length === 0 ? (

        <div className="flex h-full flex-col items-center justify-center">

          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/70 shadow-xl backdrop-blur-xl">

            <Sparkles
              size={38}
              className="text-violet-600"
            />

          </div>

          <h2 className="text-3xl font-semibold text-slate-800">

            SQL Agent

          </h2>

          <p className="mt-3 max-w-md text-center text-slate-500 leading-7">

            Ask anything about your database.

            I can explore tables, generate SQL, execute queries,
            and explain the results.

          </p>

        </div>

      ) : (

        <div className="relative z-10 space-y-8">

          {messages.map((message) => (

            <ChatMessage
              key={message.id}
              message={message}
            />

          ))}

        </div>

      )}

      <div ref={bottomRef} />

    </div>
  );
}