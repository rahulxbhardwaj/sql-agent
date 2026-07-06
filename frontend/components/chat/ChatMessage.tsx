import { Message } from "../../src/types/chat";
import ExecutionTimeline from "../ExecutionTimeline";
import VisualizeButton from "../visualization/VisualizeButton";
import ResultTable from "../ResultTable";
import TypingTimeline from "@/components/TypingTimeline";
import { motion } from "framer-motion";
import { useState } from "react";

import {
  Bot,
  User,
  Brain,
  Database,
  Table2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface ChatMessageProps {
  message: Message;
  thinkingSteps: string[];
}

export default function ChatMessage({
  message, thinkingSteps 
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copySQL = async () => {
  if (!message.sql) return;

  await navigator.clipboard.writeText(message.sql);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
  /* ---------------- USER MESSAGE ---------------- */

  if (isUser) {
    return (

      <motion.div
        initial={{
          opacity: 0,
          y: 35,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: .45,
        }}
        className="flex justify-end"
      >

        <div className="flex items-end gap-3">

          <div
            className="
            max-w-2xl
            rounded-[28px]
            border
            border-blue-200/60
            bg-gradient-to-br
            from-white/90
            to-blue-50/80
            backdrop-blur-2xl
            px-7
            py-5
            shadow-xl
            "
          >

            <p className="text-[15px] leading-7 text-slate-700">

              {message.content}

            </p>

          </div>

          <div
            className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-violet-500
            to-blue-500
            text-white
            shadow-lg
            "
          >
            <User size={18} />
          </div>

        </div>

      </motion.div>

    );
  }

  /* ---------------- ASSISTANT ---------------- */

  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: .5,
      }}
      className="flex gap-4"
    >

      {/* Avatar */}

      <div
        className="
        mt-2
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        border
        border-white/70
        bg-white/70
        backdrop-blur-xl
        shadow-lg
        "
      >

        <Bot
          className="text-violet-600"
          size={24}
        />

      </div>

      {/* Main Card */}

      <div
        className="
        flex-1
        rounded-[30px]
        border
        border-white/70
        bg-white/65
        p-8
        backdrop-blur-3xl
        shadow-[0_15px_45px_rgba(120,130,255,.12)]
        "
      >

        {/* Thinking */}

        {message.content === "Thinking..." && (

          <div className="flex items-center gap-4">

            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [.4, 1, .4],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.1,
              }}
              className="h-3 w-3 rounded-full bg-violet-500"
            />

            <p className="text-slate-600 font-medium">

             <TypingTimeline steps={thinkingSteps} />

            </p>

          </div>

        )}

        {/* Reasoning */}

        {message.reasoning && (

          <div className="mb-8">

            <div className="mb-4 flex items-center gap-3">

              <Brain
                size={20}
                className="text-violet-600"
              />

              <h2 className="font-semibold text-slate-800">

                Reasoning

              </h2>

            </div>

            <p className="leading-8 text-slate-600 whitespace-pre-wrap">

              {message.reasoning}

            </p>

          </div>

        )}

        {/* Timeline */}

        {message.trace && (

          <div className="mb-8">

            <ExecutionTimeline
              trace={message.trace}
            />

          </div>

        )}

        {/* SQL */}

      {message.sql && (

        <div
          className="
            mb-8
            rounded-3xl
            border
            border-white/70
            bg-gradient-to-br
            from-white
            to-slate-50
            p-6
            shadow-md
          "
        >

          <div className="mb-4 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <Database
                size={20}
                className="text-blue-600"
              />

              <h3 className="font-semibold text-slate-800">
                Generated SQL
              </h3>

            </div>

            <button
              onClick={copySQL}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-sm
                text-slate-600
                transition
                hover:bg-slate-100
                active:scale-95
                shrink-0
              "
            >

              {copied ? (
                <>
                  <Check
                    size={16}
                    className="text-green-600"
                  />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16}/>
                  Copy
                </>
              )}

            </button>

          </div>

          <pre
            className="
              overflow-x-auto
              whitespace-pre-wrap
              break-all
              rounded-2xl
              bg-slate-900
              p-5
              text-sm
              text-green-400
            "
          >
            {message.sql}
          </pre>

        </div>

      )}

        {/* Results */}

        {message.answer && message.answer.length > 0 && (

          <div className="mb-8">

            <div className="mb-4 flex items-center gap-3">

              <Table2
                size={20}
                className="text-violet-600"
              />

              <h3 className="font-semibold text-slate-800">

                Results

              </h3>

            </div>

            <ResultTable
              data={message.answer}
            />
            
            {message.answer && message.sql && (

                <VisualizeButton

                question={message.content}

                sql={message.sql}

                answer={message.answer}

                  />

              )}

          </div>

        )}

        {/* Error */}

        {message.error && (

          <div
            className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-5
            "
          >

            <div className="flex items-center gap-3">

              <AlertCircle
                size={20}
                className="text-red-500"
              />

              <p className="text-red-700">

                {message.error}

              </p>

            </div>

          </div>

        )}

      </div>

    </motion.div>

  );

}