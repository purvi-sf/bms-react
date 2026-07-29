import { render, screen } from "@testing-library/react";
import BookList from "../components/BookList";
import type { IBook } from "../types/interfaces";

const mockBooks: IBook[] = [
  {
    id: "1",
    title: "Harry Potter",
    author: "JK Rowling",
    isbn: "123456",
    publishDate: "1997-06-26",
    genre: "Fantasy",
    type: "Printed",
    pageCount: 223,
  },
  {
    id: "2",
    title: "Dune",
    author: "Frank Herbert",
    isbn: "789012",
    publishDate: "1965-01-01",
    genre: "Science Fiction",
    type: "EBook",
    fileSize: "5",
  },
];

describe("BookList", () => {
  it("shows empty message when no books", () => {
    render(<BookList books={[]} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText("No books found.")).toBeInTheDocument();
  });

  it("renders all books", () => {
    render(<BookList books={mockBooks} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getAllByText("Harry Potter").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Dune").length).toBeGreaterThan(0);
  });

  it("renders correct number of books", () => {
  render(<BookList books={mockBooks} onEdit={() => {}} onDelete={() => {}} />);
  const editButtons = screen.getAllByText("Edit");
  expect(editButtons).toHaveLength(4); // 2 books × 2 views (desktop + mobile)
});

});