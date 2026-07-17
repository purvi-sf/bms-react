import { useState } from "react";
import type { IBook, IFormValues } from "../types/interfaces";

export function useBooks() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [editingBook, setEditingBook] = useState<IBook | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addBook = (values: IFormValues) => {
    const newBook: IBook = {
      id: crypto.randomUUID(),
      title: values.title,
      author: values.author,
      isbn: values.isbn,
      publishDate: values.publishDate,
      genre: values.genre as IBook["genre"],
      type: values.type as "Printed" | "EBook",
      pageCount: values.type === "Printed" ? Number(values.extra) : undefined,
      fileSize: values.type === "EBook" ? values.extra : undefined,
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (values: IFormValues) => {
    if (!editingBook) return;
    const updated: IBook = {
      ...editingBook,
      title: values.title,
      author: values.author,
      isbn: values.isbn,
      publishDate: values.publishDate,
      genre: values.genre as IBook["genre"],
      type: values.type as "Printed" | "EBook",
      pageCount: values.type === "Printed" ? Number(values.extra) : undefined,
      fileSize: values.type === "EBook" ? values.extra : undefined,
    };
    setBooks(prev => prev.map(b => b.id === editingBook.id ? updated : b));
    setEditingBook(null);
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const startEdit = (book: IBook) => {
    setEditingBook(book);
  };

  const cancelEdit = () => {
    setEditingBook(null);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isbnExists = (isbn: string, excludeId?: string) => {
    return books.some(b => b.isbn === isbn && b.id !== excludeId);
  };

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