import { useBooks } from "./hooks/useBooks";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import SearchBar from "./components/SearchBar";

export default function App() {
  const {
    filteredBooks,
    editingBook,
    searchTerm,
    setSearchTerm,
    addBook,
    updateBook,
    deleteBook,
    startEdit,
    cancelEdit,
    isbnExists,
  } = useBooks();

  const handleSubmit = (values: Parameters<typeof addBook>[0]) => {
    if (editingBook) updateBook(values);
    else addBook(values);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      deleteBook(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-400">📚 Book Management System</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your book collection</p>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <BookForm
          editingBook={editingBook}
          isbnExists={isbnExists}
          onSubmit={handleSubmit}
          onCancel={cancelEdit}
        />
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-400">
              Book List
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({filteredBooks.length} books)
              </span>
            </h2>
          </div>
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          <BookList books={filteredBooks} onEdit={startEdit} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
}