"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Sparkles,
  BarChart3,
} from "lucide-react";

import ChartRenderer from "../charts/ChartRenderer";

interface VisualizationData {
  chart: string;
  title: string;
  x: string;
  y: string;
  reason: string;
  insight: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  visualization: VisualizationData | null;
  data: any[];
}

export default function VisualizationModal({
  open,
  onClose,
  visualization,
  data,
}: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!visualization) return null;

  const downloadChart = async () => {
    if (!chartRef.current) return;

    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = `${visualization.title}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-xl p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              y: 20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              relative
              flex
              flex-col
              w-full
              max-w-7xl
              h-[90vh]
              overflow-hidden
              rounded-[34px]
              border
              border-white/50
              bg-white/70
              backdrop-blur-3xl
              shadow-[0_30px_90px_rgba(0,0,0,0.18)]
            "
          >
            {/* Header */}

            <div
              className="
              flex
              items-center
              justify-between
              border-b
              border-slate-200/60
              bg-white/60
              backdrop-blur-xl
              px-8
              py-6
            "
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {visualization.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI Generated Visualization
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={downloadChart}
                  className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  bg-blue-600
                  px-5
                  py-3
                  text-white
                  transition
                  hover:bg-blue-700
                "
                >
                  <Download size={18} />
                  Download
                </button>

                <button
                  onClick={onClose}
                  className="
                  rounded-full
                  bg-white
                  p-3
                  shadow
                  transition
                  hover:scale-110
                "
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Body */}

            <div className="flex-1 overflow-y-auto p-8">
              <div
                ref={chartRef}
                className="
                rounded-[28px]
                border
                border-slate-200
                bg-gradient-to-br
                from-white
                via-slate-50
                to-blue-50
                p-8
                shadow-inner
              "
              >
                <ChartRenderer
                  type={visualization.chart as any}
                  data={data}
                />
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div
                  className="
                  rounded-3xl
                  border
                  border-blue-100
                  bg-gradient-to-br
                  from-blue-50
                  to-white
                  p-7
                  shadow-sm
                "
                >
                  <div className="mb-4 flex items-center gap-3">
                    <Sparkles className="text-blue-600" size={22} />

                    <h3 className="text-xl font-semibold text-slate-900">
                      AI Insight
                    </h3>
                  </div>

                  <p className="leading-8 text-slate-600">
                    {visualization.insight}
                  </p>
                </div>

                <div
                  className="
                  rounded-3xl
                  border
                  border-slate-200
                  bg-gradient-to-br
                  from-slate-50
                  to-white
                  p-7
                  shadow-sm
                "
                >
                  <div className="mb-4 flex items-center gap-3">
                    <BarChart3
                      className="text-indigo-600"
                      size={22}
                    />

                    <h3 className="text-xl font-semibold text-slate-900">
                      Why this visualization?
                    </h3>
                  </div>

                  <p className="leading-8 text-slate-600">
                    {visualization.reason}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}