"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { motion } from "framer-motion";

type ChartType = "bar" | "line" | "pie";

interface ChartRendererProps {
  type: ChartType;
  data: any[];
}

const COLORS = [
  "#4F8CFF",
  "#60A5FA",
  "#38BDF8",
  "#818CF8",
  "#A78BFA",
  "#22D3EE",
  "#06B6D4",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
        {label}
      </p>

      {payload.map((entry: any, index: number) => (
        <div
          key={index}
          className="flex items-center justify-between gap-6 text-sm"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: entry.color,
              }}
            />
            <span className="text-slate-600 capitalize">
              {entry.name}
            </span>
          </div>

          <span className="font-semibold text-slate-900">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ChartRenderer({
  type,
  data,
}: ChartRendererProps) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);

  const xKey = keys[0];
  const yKey = keys[1];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
      }}
      className="
      w-full
      h-[420px]
      rounded-3xl
      border
      border-white/60
      bg-gradient-to-br
      from-white
      via-slate-50
      to-blue-50
      shadow-[0_20px_60px_rgba(0,0,0,0.08)]
      backdrop-blur-xl
      p-6
      "
    >
      <ResponsiveContainer width="100%" height="100%">
        <>
          {type === "bar" && (
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient
                  id="barGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#60A5FA"
                  />

                  <stop
                    offset="100%"
                    stopColor="#2563EB"
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 6"
                stroke="#E5E7EB"
                vertical={false}
              />

              <XAxis
                dataKey={xKey}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(96,165,250,0.08)",
                }}
                content={<CustomTooltip />}
              />

              <Bar
                dataKey={yKey}
                fill="url(#barGradient)"
                radius={[10, 10, 0, 0]}
                animationDuration={1200}
              />
            </BarChart>
          )}

          {type === "line" && (
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="#60A5FA"
                  />

                  <stop
                    offset="100%"
                    stopColor="#2563EB"
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 6"
                stroke="#E5E7EB"
                vertical={false}
              />

              <XAxis
                dataKey={xKey}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey={yKey}
                stroke="url(#lineGradient)"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#2563EB",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 8,
                }}
                animationDuration={1400}
              />
            </LineChart>
          )}

          {type === "pie" && (
            <PieChart>
              <Tooltip content={<CustomTooltip />} />

              <Pie
                data={data}
                dataKey={yKey}
                nameKey={xKey}
                innerRadius={80}
                outerRadius={130}
                paddingAngle={4}
                animationDuration={1200}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          )}
        </>
      </ResponsiveContainer>
    </motion.div>
  );
}