import { renderHook, act } from "@testing-library/react";
import { useBooks } from "../hooks/useBooks";
import type { IFormValues } from "../types/interfaces";

const mockFormValues: IFormValues = {
  title: "Harry Potter",
  author: "JK Rowling",
  isbn: "123456",
  publishDate: "1997-06-26",
  genre: "Fantasy",
  type: "Printed",
  extra: "223",
};

const mockEBookValues: IFormValues = {
  title: "Digital Book",
  author: "Some Author",
  isbn: "789012",
  publishDate: "2020-01-01",
  genre: "Fiction",
  type: "EBook",
  extra: "5",
};

describe("useBooks", () => {
  it("starts with empty books array", () => {
    const { result } = renderHook(() => useBooks());
    expect(result.current.books).toHaveLength(0);
  });

  it("adds a printed book correctly", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.addBook(mockFormValues);
    });
    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe("Harry Potter");
    expect(result.current.books[0].type).toBe("Printed");
    expect(result.current.books[0].pageCount).toBe(223);
    expect(result.current.books[0].fileSize).toBeUndefined();
  });

  it("adds an ebook correctly", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.addBook(mockEBookValues);
    });
    expect(result.current.books[0].type).toBe("EBook");
    expect(result.current.books[0].fileSize).toBe("5");
    expect(result.current.books[0].pageCount).toBeUndefined();
  });

  it("gives each book a unique id", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.addBook(mockFormValues);
      result.current.addBook(mockEBookValues);
    });
    const ids = result.current.books.map(b => b.id);
    expect(new Set(ids).size).toBe(2);
  });

  it("deletes a book by id", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.addBook(mockFormValues);
    });
    const id = result.current.books[0].id;
    act(() => {
      result.current.deleteBook(id);
    });
    expect(result.current.books).toHaveLength(0);
  });

  it("updates a book correctly", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.addBook(mockFormValues);
    });
    const book = result.current.books[0];
    act(() => {
      result.current.startEdit(book);
    });
    act(() => {
      result.current.updateBook({ ...mockFormValues, title: "Updated Title" });
    });
    expect(result.current.books[0].title).toBe("Updated Title");
    expect(result.current.books[0].id).toBe(book.id);
  });

  it("filters books by search term", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.addBook(mockFormValues);
      result.current.addBook(mockEBookValues);
    });
    act(() => {
      result.current.setSearchTerm("harry");
    });
    expect(result.current.filteredBooks).toHaveLength(1);
    expect(result.current.filteredBooks[0].title).toBe("Harry Potter");
  });

  it("detects duplicate isbn", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.addBook(mockFormValues);
    });
    expect(result.current.isbnExists("123456")).toBe(true);
    expect(result.current.isbnExists("999999")).toBe(false);
  });

  it("excludes current book from isbn check when editing", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.addBook(mockFormValues);
    });
    const book = result.current.books[0];
    expect(result.current.isbnExists("123456", book.id)).toBe(false);
  });

  it("cancelEdit resets editingBook to null", () => {
    const { result } = renderHook(() => useBooks());
    act(() => {
      result.current.addBook(mockFormValues);
    });
    act(() => {
      result.current.startEdit(result.current.books[0]);
    });
    expect(result.current.editingBook).not.toBeNull();
    act(() => {
      result.current.cancelEdit();
    });
    expect(result.current.editingBook).toBeNull();
  });
});