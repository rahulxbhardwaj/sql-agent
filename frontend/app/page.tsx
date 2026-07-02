'use client';

import { useState } from "react";

import { ApiResponse } from "../src/types/api";

import Header from "../components/header";
import QueryInput from "../components/QueryInput";
import ResultTable from "../components/ResultTable";
import ExecutionTimeline from "../components/ExecutionTimeline";

export default function Home() {

  const [query, setQuery] = useState("");

  const [response, setResponse] = useState<ApiResponse | null>(null);

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
    setResponse(data);
  }

  return (

    <main className="min-h-screen bg-gray-950 text-white p-10">

      <Header />

      <div className="max-w-4xl mx-auto">

        <QueryInput
          query={query}
          setQuery={setQuery}
          askAI={askAI}
        />

        {response && (

          <>

            <ExecutionTimeline
              trace={response.trace}
            />

            <div className="mt-10 space-y-6">

              {/* Question */}

              <div className="rounded-lg bg-gray-900 p-5">

                <h2 className="text-xl font-bold">
                  ❓ Question
                </h2>

                <p className="mt-3">
                  {response.question}
                </p>

              </div>

              {/* SQL */}

              <div className="rounded-lg bg-gray-900 p-5">

                <h2 className="text-xl font-bold">
                  📝 SQL Generated
                </h2>

                <pre className="mt-3 whitespace-pre-wrap text-green-400">
                  {response.sql}
                </pre>

              </div>

              {/* Reasoning */}

              <div className="rounded-lg bg-gray-900 p-5">

                <h2 className="text-xl font-bold">
                  🧠 Agent Reasoning
                </h2>

                <p className="mt-3">
                  {response.reasoning}
                </p>

              </div>

              {/* Results */}

              <div className="rounded-lg bg-gray-900 p-5">

                <h2 className="text-xl font-bold">
                  📊 Results
                </h2>

                <ResultTable
                  data={response.answer}
                />

              </div>

              {/* Error */}

              {response.error && (

                <div className="rounded-lg bg-red-900 p-5">

                  <h2 className="font-bold">
                    ❌ Error
                  </h2>

                  <p className="mt-3">
                    {response.error}
                  </p>

                </div>

              )}

            </div>

          </>

        )}

      </div>

    </main>

  );
}