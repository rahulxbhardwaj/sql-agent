import { Message } from "../../src/types/chat";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef } from "react";
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
    <div className="bg-gray-900 rounded-xl p-6 h-[70vh]
overflow-y-auto mb-8">

      {messages.length === 0 ? (

        <div className="text-center text-gray-400 mt-40">
          Ask me anything about your database.
        </div>

      ) : (

        messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))

      )}
    <div ref={bottomRef} />
    </div>
  );
}