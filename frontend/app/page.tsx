'use client';

import { useState } from "react";

import Header from "../components/header";
import QueryInput from "../components/QueryInput";
import ChatWindow from "../components/chat/ChatWindow";

import { Message } from "../src/types/chat";

export default function Home() {

  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  async function askAI() {

    if (!query.trim()) return;

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

    setMessages(prev => [
      ...prev,
      userMessage,
      thinkingMessage,
    ]);

    const currentQuery = query;
    setQuery("");

    try {

      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuery,
        }),
      });

      const data = await res.json();

      setMessages(prev =>
        prev.map(msg =>
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

    } catch {

      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantId
            ? {
                ...msg,
                content: "Something went wrong.",
                error: "Unable to connect to backend.",
              }
            : msg
        )
      );

    }
  }

  return (

    <main className="relative h-screen w-screen overflow-hidden bg-[#f7f8ff]">

      {/* Background */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl" />

        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />

      </div>

      {/* App */}

      <div className="h-full p-6">

        <div
          className="
          mx-auto
          flex
          h-full
          max-w-[1650px]
          overflow-hidden
          rounded-[38px]
          border
          border-white/60
          bg-white/55
          shadow-[0_20px_60px_rgba(170,180,255,0.18)]
          backdrop-blur-xl
        "
        >

          {/* Sidebar */}

          <aside
            className="
            hidden
            w-[300px]
            border-r
            border-white/50
            bg-white/30
            backdrop-blur-xl
            lg:block
          "
          >

            <Header />

          </aside>

          {/* Main */}

          <section className="flex flex-1 flex-col overflow-hidden">

            <div className="flex-1 overflow-hidden p-8">

              <ChatWindow
                messages={messages}
              />

            </div>

            <div className="px-8 pb-8">

              <QueryInput
                query={query}
                setQuery={setQuery}
                askAI={askAI}
              />

            </div>

          </section>

        </div>

      </div>

    </main>

  );

}