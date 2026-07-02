interface ResultTableProps {
  data: Record<string, any>[];
}

export default function ResultTable({ data }: ResultTableProps) {

  // No data
  if (data.length === 0) {
    return (
      <div className="rounded-lg bg-gray-900 p-5">
        

        <p className="mt-3 text-gray-400">
          No rows returned.
        </p>
      </div>
    );
  }

  // Extract column names dynamically
  const columns = Object.keys(data[0]);

  return (
    <div className="rounded-lg bg-gray-900 p-5">

      <h2 className="text-xl font-bold mb-4">
        📊 Results
      </h2>

      <div className="overflow-x-auto">

        <table className="min-w-full border border-gray-700">

          <thead>

            <tr>

              {columns.map((column) => (

                <th
                  key={column}
                  className="border border-gray-700 bg-gray-800 px-4 py-2 text-left"
                >
                  {column}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {data.map((row, index) => (

              <tr key={index}>

                {columns.map((column) => (

                  <td
                    key={column}
                    className="border border-gray-700 px-4 py-2"
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