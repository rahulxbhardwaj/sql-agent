'use client';

import { useState } from "react";

import { ApiResponse } from "../src/types/api";
import { Message } from "../src/types/chat";
import ChatWindow from "../components/chat/ChatWindow";

import Header from "../components/header";
import QueryInput from "../components/QueryInput";
import ResultTable from "../components/ResultTable";
import ExecutionTimeline from "../components/ExecutionTimeline";

export default function Home() {

  const [query, setQuery] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  async function askAI() {

    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question: query,
      }),
    });

    const data = await res.json();

    console.log(data);
    console.log("Trace:", data.trace);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
    };

    const assistantId = crypto.randomUUID();

    const thinkingMessage: Message = {
      id: assistantId,
      role: "assistant",
     content: "Thinking...",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      thinkingMessage,
    ]);
    
    setMessages((prev) =>
    prev.map((msg) =>
      msg.id === assistantId
        ? {
            id: assistantId,
            role: "assistant",
            content: data.reasoning,
            reasoning: data.reasoning,
            sql: data.sql,
            answer: data.answer,
            trace: data.trace,
            error: data.error,
          }
        : msg
    )
  );
  }

  return (

    <main className="min-h-screen bg-gray-950 text-white p-10">

      <Header />

      <div className="max-w-4xl mx-auto">

        <ChatWindow messages={messages} />

        <QueryInput
          query={query}
          setQuery={setQuery}
          askAI={askAI}
        />
      
    
       
  
      </div>

    </main>

  );
}