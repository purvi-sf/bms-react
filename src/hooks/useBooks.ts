import { useState } from "react";
// useState: React hook that stores data — when updated, React automatically re-renders the UI
import type { IBook, IFormValues } from "../types/interfaces";
// type-only import — exists only at compile time for TypeScript checking, stripped at runtime

const buildBook = (values: IFormValues, existingBook?: IBook): IBook => ({
  // existingBook?.id: optional chaining — safely accesses id only if existingBook exists
  // ?? crypto.randomUUID(): nullish coalescing — falls back to a new unique id if no existing one
  id: existingBook?.id ?? crypto.randomUUID(),
  title: values.title,
  author: values.author,
  isbn: values.isbn,
  publishDate: values.publishDate,
  // IBook["genre"]: indexed access type — gets the exact type of the genre property from IBook
  genre: values.genre as IBook["genre"],
  type: values.type as IBook["type"],
  pageCount: values.type === "Printed" ? Number(values.extra) : undefined,
  fileSize: values.type === "EBook" ? values.extra : undefined,
});

export function useBooks() {
  // three pieces of state where each one triggers a re-render when updated via their setter
  const [books, setBooks] = useState<IBook[]>([]); // the main books array which starts empty
  const [editingBook, setEditingBook] = useState<IBook | null>(null); // null = add mode, book = edit mode
  const [searchTerm, setSearchTerm] = useState(""); // what the user typed in the search box

  // immutable update pattern — never mutate state directly
  // spread operator creates a brand new array so React detects the change and re-renders
  const addBook = (values: IFormValues) => {
    setBooks(prev => [...prev, buildBook(values)]);
    // prev: functional update which guarantees taht we r working with the latest state and not a stale copy
  };

  const updateBook = (values: IFormValues) => {
    if (!editingBook) return;
    setBooks(prev => prev.map(b =>
      b.id === editingBook.id ? buildBook(values, editingBook) : b
      // buildBook reuses editingBook.id so the book keeps its identity after updating
    ));
    setEditingBook(null); //mode reset
  };

  // Array.filter returns a new array excluding the deleted book. id used instead of index
  // index shifts when items are deleted but stable unique id always points to the right book
  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  // sets editingBook that triggers useEffect in BookForm which fills the form with this book's data
  const startEdit = (book: IBook) => setEditingBook(book);
  // resets editingBook to null that triggers useEffect in BookForm which clears the form
  const cancelEdit = () => setEditingBook(null);
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Array.some: returns true the moment any book matches — short circuits, doesn't check the rest
  // excludeId: optional — when editing, skips the current book so its own ISBN isn't flagged as duplicate
  const isbnExists = (isbn: string, excludeId?: string) =>
    books.some(b => b.isbn === isbn && b.id !== excludeId);
  return {
    books,
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
  };
}