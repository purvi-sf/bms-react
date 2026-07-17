import { useState, useEffect } from "react";

//useState : helps store data that can change and when it changes, it gets updated on the screen
//useEffect : runs the code when something specific changes for ex. when the user edits a book

import type { IBook, IFormValues } from "../types/interfaces"; //type is used to tell TS that they r used for typechecking and dont exist at runtime
import { GENRES } from "../types/interfaces.ts"; //real runtime data so no type 

//Props are basically the parent component passing the data and instructions to child component
//BookForm is child and App is parent here 
interface BookFormProps {
  editingBook: IBook | null; //either edit or dont(add)
  isbnExists: (isbn: string, excludeId?: string) => boolean; //duplicate isbn check
  onSubmit: (values: IFormValues) => void;
  onCancel: () => void;
}

type FieldKey = keyof IFormValues; //keyof is to create union of all property names of IFormValues as string literals

interface FieldConfig {
  key: FieldKey; //which property of IFormValues to map for ex "title"
  label: string;
  type: "text" | "date" | "select" | "dynamic"; //text : regular text input, date : publish date, select: dropdown, dynamic: pagecount/filesize
  placeholder?: string;
  options?: { value: string; label: string }[]; //array of objects with value(what is stored) and label(what user sees)
}

const EMPTY_FORM: IFormValues = { //clearForm basically
  title: "", author: "", isbn: "",
  publishDate: "", genre: "", type: "", extra: "",
};

const FIELDS: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", placeholder: "Book title" },
  { key: "author", label: "Author", type: "text", placeholder: "Author name" },
  { key: "isbn", label: "ISBN", type: "text", placeholder: "Numbers only" },
  { key: "publishDate", label: "Publish Date", type: "date" },
  {
    key: "genre", label: "Genre", type: "select",
    options: [
      { value: "", label: "-- Select Genre --" },
      ...GENRES.map(g => ({ value: g, label: g })),
    ],
  },
  {
    key: "type", label: "Book Type", type: "select",
    options: [
      { value: "", label: "-- Select Type --" },
      { value: "Printed", label: "Printed" },
      { value: "EBook", label: "EBook" },
    ],
  },
  { key: "extra", label: "", type: "dynamic" },
];

const REQUIRED_FIELDS: FieldKey[] = ["title", "author", "isbn", "publishDate", "genre", "type", "extra"];

const inputClass = (hasError: boolean) =>
  `w-full p-2.5 rounded border bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasError ? "border-red-500" : "border-gray-600"}`;

const labelClass = "block text-sm font-bold text-blue-300 mb-1";
const errorClass = "text-red-400 text-xs mt-1";

export default function BookForm({ editingBook, isbnExists, onSubmit, onCancel }: BookFormProps) {
  const [values, setValues] = useState<IFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  useEffect(() => {
    setValues(editingBook ? {
      title: editingBook.title,
      author: editingBook.author,
      isbn: editingBook.isbn,
      publishDate: editingBook.publishDate,
      genre: editingBook.genre,
      type: editingBook.type,
      extra: editingBook.type === "Printed"
        ? String(editingBook.pageCount ?? "")
        : editingBook.fileSize ?? "",
    } : EMPTY_FORM);
    setErrors({});
  }, [editingBook]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<FieldKey, string>> = {};
    REQUIRED_FIELDS.forEach(field => {
      if (!values[field]?.toString().trim()) {
        newErrors[field] = `${FIELDS.find(f => f.key === field)?.label || "This field"} is required`;
      }
    });
    if (values.isbn && isbnExists(values.isbn, editingBook?.id)) {
      newErrors.isbn = "ISBN already exists";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: name === "isbn" ? value.replace(/[^0-9]/g, "") : value,
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(values);
    setValues(EMPTY_FORM);
    setErrors({});
  };

  const renderField = (field: FieldConfig) => {
    if (field.type === "dynamic") {
      if (!values.type) return null;
      const isEBook = values.type === "EBook";
      return (
        <div key="extra">
          <label className={labelClass}>
            {isEBook ? "File Size (MB)" : "Page Count"}
          </label>
          <input
            name="extra"
            value={values.extra}
            onChange={handleChange}
            placeholder={isEBook ? "e.g. 5" : "e.g. 350"}
            className={inputClass(!!errors.extra)}
          />
          {errors.extra && <p className={errorClass}>{errors.extra}</p>}
        </div>
      );
    }

    return (
      <div key={field.key}>
        <label className={labelClass}>{field.label}</label>
        {field.type === "select" ? (
          <select name={field.key} value={values[field.key]} onChange={handleChange} className={inputClass(!!errors[field.key])}>
            {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : (
          <input
            type={field.type}
            name={field.key}
            value={values[field.key]}
            onChange={handleChange}
            placeholder={field.placeholder}
            className={inputClass(!!errors[field.key])}
          />
        )}
        {errors[field.key] && <p className={errorClass}>{errors[field.key]}</p>}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-blue-400 mb-4">
        {editingBook ? "Edit Book" : "Add a New Book"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(renderField)}
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-sm">
          {editingBook ? "Update Book" : "Add Book"}
        </button>
        {editingBook && (
          <button onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}