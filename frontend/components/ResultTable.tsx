interface ResultTableProps {
  data: Record<string, any>[];
}

export default function ResultTable({
  data,
}: ResultTableProps) {

  if (!data.length) {
    return (
      <div
        className="
        rounded-[24px]
        border
        border-white/70
        bg-white/70
        backdrop-blur-xl
        p-8
        text-center
        text-slate-500
        "
      >
        No rows returned.
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (

    <div
      className="
      overflow-hidden
      rounded-[28px]
      border
      border-white/70
      bg-white/70
      backdrop-blur-2xl
      shadow-lg
      "
    >

      <div className="overflow-auto">

        <table className="min-w-full">

          <thead>

            <tr className="border-b border-slate-200/60 bg-white/60">

              {columns.map((column) => (

                <th
                  key={column}
                  className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-600
                  "
                >
                  {column}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {data.map((row, index) => (

              <tr
                key={index}
                className="
                border-b
                border-slate-100
                transition-all
                duration-200
                hover:bg-blue-50/50
                "
              >

                {columns.map((column) => (

                  <td
                    key={column}
                    className="
                    px-6
                    py-4
                    text-[15px]
                    text-slate-700
                    "
                  >

                    {String(row[column])}

                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}