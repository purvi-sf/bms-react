interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearch }: SearchBarProps) {
  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={e => onSearch(e.target.value)}
        placeholder="Search by title or author..."
        className="flex-1 p-2.5 rounded border border-gray-600 bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searchTerm && (
        <button
          onClick={() => onSearch("")}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
        >
          Clear
        </button>
      )}
    </div>
  );
}