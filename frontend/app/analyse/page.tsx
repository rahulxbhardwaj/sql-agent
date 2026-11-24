"use client";

import { useEffect, useState } from "react";
import ChartRenderer from "@/components/charts/ChartRenderer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AnalysePage() {
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("visualization-data");

    if (raw) {
      setPayload(JSON.parse(raw));
    }
  }, []);

  if (!payload)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-medium text-slate-500">
        <div className="rounded-2xl bg-white/50 px-8 py-4 shadow-sm backdrop-blur-md">
          No visualization available.
        </div>
      </div>
    );

  const { visualization, data, sql, question } = payload;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 p-6 text-slate-800 lg:p-10">
      {/* Liquid Crystal Background Elements */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-purple-300/40 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[60vw] w-[60vw] rounded-full bg-cyan-300/40 blur-[120px]" />
        <div className="absolute left-[40%] top-[30%] h-[40vw] w-[40vw] rounded-full bg-blue-300/30 blur-[120px]" />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-5 py-2.5 text-sm font-medium shadow-[0_4px_16px_0_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all hover:bg-white/60 hover:shadow-md"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Main Chart Card */}
        <div className="rounded-3xl border border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] backdrop-blur-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {visualization.title}
          </h1>
          <p className="mt-2 text-lg text-slate-600 font-medium">
            {question}
          </p>

          <div className="mt-8 h-[600px] rounded-2xl bg-white/50 p-4 shadow-inner ring-1 ring-black/5">
            <ChartRenderer type={visualization.chart} data={data} />
          </div>
        </div>

        {/* Insights & Reasoning Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* AI Insight Card */}
          <div className="rounded-3xl border border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-transform hover:-translate-y-1">
            <div className="mb-4 inline-flex items-center rounded-full bg-purple-100/80 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200/50">
              AI Insight
            </div>
            <p className="text-lg leading-relaxed text-slate-700">
              {visualization.insight}
            </p>
          </div>

          {/* Why this chart Card */}
          <div className="rounded-3xl border border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-transform hover:-translate-y-1">
            <div className="mb-4 inline-flex items-center rounded-full bg-cyan-100/80 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200/50">
              Methodology
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              Why this chart?
            </h2>
            <p className="leading-relaxed text-slate-700">
              {visualization.reason}
            </p>
          </div>
        </div>

        {/* SQL Code Block */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Generated SQL
            </h2>
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
            </div>
          </div>
          <div className="rounded-xl bg-black/40 p-5 ring-1 ring-white/10">
            <pre className="overflow-x-auto text-sm font-medium leading-relaxed text-emerald-300">
              <code>{sql}</code>
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}