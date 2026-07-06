"use client";

import { useState } from "react";
import { BarChart3, Loader2 } from "lucide-react";

import VisualizationModal from "./VisualizationModal";

interface Props {
  question?: string;
  sql?: string;
  answer?: any[];
}

interface VisualizationResponse {
  chart: string;
  title: string;
  x: string;
  y: string;
  reason: string;
  insight: string;
}

export default function VisualizeButton({
  question,
  sql,
  answer,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [visualization, setVisualization] =
    useState<VisualizationResponse | null>(null);

  const visualize = async () => {
    if (!answer || answer.length === 0) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/visualize", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question,
          sql,
          result: answer,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        setVisualization(data.visualization);

        setOpen(true);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={visualize}
        disabled={loading}
        className="
          mt-6
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-violet-200
          bg-gradient-to-r
          from-violet-500
          to-indigo-500
          px-5
          py-3
          text-white
          shadow-lg
          transition
          hover:scale-[1.03]
          hover:shadow-xl
          active:scale-95
          disabled:opacity-70
        "
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />

            Visualizing...
          </>
        ) : (
          <>
            <BarChart3 size={18} />

            Visualize Data
          </>
        )}
      </button>

      <VisualizationModal
        open={open}
        onClose={() => setOpen(false)}
        visualization={visualization}
        data={answer || []}
      />
    </>
  );
}