interface QueryInputProps {
    query: string;
    setQuery: (value: string) => void;
    askAI: () => void;
}

export default function QueryInput({query, setQuery, askAI}: QueryInputProps) {
    return (
         <>
      <input
        className="mt-10 w-full rounded-lg bg-gray-800 p-4 text-white outline-none"
        placeholder="Ask anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={askAI}
        className="mt-5 rounded-lg bg-blue-600 px-8 py-3 hover:bg-blue-700"
      >
        Ask AI
      </button>
    </>
  );
}