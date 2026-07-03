import { Message } from "../../src/types/chat";
import ExecutionTimeline from "../ExecutionTimeline";
import ResultTable from "../ResultTable";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="bg-blue-600 text-white rounded-2xl px-5 py-4 max-w-3xl">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6">
      <div className="bg-gray-800 rounded-2xl p-5 max-w-4xl w-full">
        
        {message.content === "Thinking..." && (
    <div className="flex items-center gap-3">

        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />

        <p className="text-gray-300">
            Thinking...
        </p>

    </div>
)}

        {message.reasoning && (
          <>
            <h3 className="font-bold text-lg mb-2">
              🧠 Reasoning
            </h3>

            <p className="text-gray-300 whitespace-pre-wrap">
              {message.reasoning}
            </p>
          </>
        )}

        {message.trace && (
          <div className="mt-6">
            <ExecutionTimeline
              trace={message.trace}
            />
          </div>
        )}

        {message.sql && (
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-2">
              📝 Generated SQL
            </h3>

            <pre className="bg-gray-900 p-4 rounded text-green-400 overflow-auto">
              {message.sql}
            </pre>
          </div>
        )}

        {message.answer && message.answer.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-2">
              📊 Results
            </h3>

            <ResultTable
              data={message.answer}
            />
          </div>
        )}

        {message.error && (
          <div className="mt-6 bg-red-900 p-4 rounded">
            {message.error}
          </div>
        )}

      </div>
    </div>
  );
}