import type { IBook } from "../types/interfaces";
import BookCard, { BookCardMobile } from "./BookCard";

interface BookListProps {
  books: IBook[];
  onEdit: (book: IBook) => void;
  onDelete: (id: string) => void;
}

const TABLE_HEADERS = [
  "#", "Title", "Author", "ISBN", "Published",
  "Age", "Genre", "Era", "Type", "Info", "Discount", "Actions"
];

export default function BookList({ books, onEdit, onDelete }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No books found.</p>
        <p className="text-sm mt-1">Add a book using the form above.</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-blue-600">
              {TABLE_HEADERS.map(h => (
                <th key={h} className="p-2 text-left text-blue-300 text-xs font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {books.map((book, i) => (
          <BookCardMobile key={book.id} book={book} index={i} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </>
  );
}