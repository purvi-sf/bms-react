import type { IBook } from "../types/interfaces";

interface BookCardProps {
  book: IBook;
  index: number;
  onEdit: (book: IBook) => void;
  onDelete: (id: string) => void;
}

const calculateAge = (publishDate: string): number =>
  new Date().getFullYear() - new Date(publishDate).getFullYear();

const getDiscount = (publishDate: string): number => {
  const age = calculateAge(publishDate);
  if (age > 100) return 30;
  if (age > 50) return 20;
  if (age > 25) return 10;
  return 0;
};

const getEra = (publishDate: string): string => {
  const age = calculateAge(publishDate);
  if (age <= 26) return "Contemporary";
  if (age <= 126) return "Modernism";
  if (age <= 189) return "Victorian";
  if (age <= 228) return "Romanticism";
  if (age <= 426) return "Enlightenment";
  return "Classical";
};

const getExtraInfo = (book: IBook): string =>
  book.type === "Printed"
    ? `${Math.ceil((book.pageCount ?? 0) / 30)} hrs reading`
    : `${book.fileSize ?? "0"} MB`;

const btnClass = (color: string) =>
  `px-3 py-1 rounded text-white text-xs font-bold border-none cursor-pointer ${color}`;

const fieldRow = (label: string, value: string) => (
  <div className="flex justify-between py-1 border-b border-gray-700 text-xs">
    <span className="text-blue-300 font-bold">{label}</span>
    <span className="text-gray-300">{value}</span>
  </div>
);

export default function BookCard({ book, index, onEdit, onDelete }: BookCardProps) {
  const discount = getDiscount(book.publishDate);

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-750 text-xs text-gray-300">
      <td className="p-2">{index + 1}</td>
      <td className="p-2 font-bold text-white">{book.title}</td>
      <td className="p-2">{book.author}</td>
      <td className="p-2">{book.isbn}</td>
      <td className="p-2">{book.publishDate}</td>
      <td className="p-2">{calculateAge(book.publishDate)} yrs</td>
      <td className="p-2">{book.genre}</td>
      <td className="p-2">{getEra(book.publishDate)}</td>
      <td className="p-2">{book.type}</td>
      <td className="p-2">{getExtraInfo(book)}</td>
      <td className="p-2">
        {discount > 0
          ? <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded">{discount}% off</span>
          : "—"}
      </td>
      <td className="p-2 whitespace-nowrap">
        <button onClick={() => onEdit(book)} className={btnClass("bg-gray-600 hover:bg-gray-500 mr-1")}>Edit</button>
        <button onClick={() => onDelete(book.id)} className={btnClass("bg-red-700 hover:bg-red-600")}>Delete</button>
      </td>
    </tr>
  );
}

export function BookCardMobile({ book, index, onEdit, onDelete }: BookCardProps) {
  const discount = getDiscount(book.publishDate);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3">
      <h3 className="text-blue-300 font-bold text-base mb-3 pb-2 border-b-2 border-blue-600">
        {index + 1}. {book.title}
      </h3>
      {fieldRow("Author", book.author)}
      {fieldRow("ISBN", book.isbn)}
      {fieldRow("Published", book.publishDate)}
      {fieldRow("Age", calculateAge(book.publishDate) + " yrs")}
      {fieldRow("Genre", book.genre)}
      {fieldRow("Era", getEra(book.publishDate))}
      {fieldRow("Type", book.type)}
      {fieldRow("Info", getExtraInfo(book))}
      <div className="flex justify-between py-1 border-b border-gray-700 text-xs mb-3">
        <span className="text-blue-300 font-bold">Discount</span>
        {discount > 0
          ? <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded">{discount}% off</span>
          : <span className="text-gray-300">—</span>}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(book)} className="flex-1 py-2 rounded text-white text-xs bg-gray-600 hover:bg-gray-500">Edit</button>
        <button onClick={() => onDelete(book.id)} className="flex-1 py-2 rounded text-white text-xs bg-red-700 hover:bg-red-600">Delete</button>
      </div>
    </div>
  );
}