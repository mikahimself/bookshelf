import { GoogleBookSearchItem } from "@/lib/validations";
import Image from "next/image";

type SearchResultsProps = {
  results: GoogleBookSearchItem[];
};

type SearchResultBookProps = {
  book: GoogleBookSearchItem;
};

const SearchResultBook = ({ book }: SearchResultBookProps) => {
  return (
    <div className="my-2 flex min-h-[110px] w-full flex-row items-start gap-4 rounded-lg p-2 transition-colors hover:bg-gray-200 hover:shadow-sm active:bg-gray-300 active:shadow-sm">
      <div className="relative h-[90px] w-[60px] flex-none overflow-hidden rounded bg-gray-100 shadow-sm">
        <Image
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span className="line-clamp-2 font-bold">{book.title}</span>
        <span>
          {book.authors.join(", ")} {book.publishedData}
        </span>
        <span className="line-clamp-2 text-sm">{book.description}</span>
      </div>
    </div>
  );
};

export default function SearchResults({ results }: SearchResultsProps) {
  return (
    <>
      {results.length > 0 &&
        results.map((book: GoogleBookSearchItem) => (
          <SearchResultBook key={book.id} book={book} />
        ))}
    </>
  );
}
