"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Loader2 } from "lucide-react";

interface Props {
  question?: string;
  sql?: string;
  answer?: any[];
}

export default function VisualizeButton({
  question,
  sql,
  answer,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

      if (data.success) {
        sessionStorage.setItem(
          "visualization-data",
          JSON.stringify({
            visualization: data.visualization,
            data: answer,
            question,
            sql,
          })
        );

        router.push("/analyse");
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={visualize}
      disabled={loading}
      className="
      mt-6
      flex
      items-center
      gap-3
      rounded-xl
      bg-gradient-to-r
      from-violet-600
      to-indigo-600
      px-5
      py-3
      text-white
      shadow-lg
      transition
      hover:scale-[1.03]
      active:scale-95
    "
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          Visualizing...
        </>
      ) : (
        <>
          <BarChart3 size={18} />
          Analyse Data
        </>
      )}
    </button>
  );
}