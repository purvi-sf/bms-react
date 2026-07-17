export const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
  "History",
  "Science",
  "Biography",
  "Other",
] as const;

export type Genre = typeof GENRES[number];

export type BookType = "Printed" | "EBook";

export interface IBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishDate: string;
  genre: Genre;
  type: BookType;
  pageCount?: number;
  fileSize?: string;
}

export interface IFormValues {
  title: string;
  author: string;
  isbn: string;
  publishDate: string;
  genre: Genre | "";
  type: BookType | "";
  extra: string;
}
