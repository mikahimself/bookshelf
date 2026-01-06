import { ChangeEvent } from "react";
import Button from "./ui/Button";

type SearchBookFormProps = {
  author: string | undefined;
  title: string | undefined;
  isbn: string | undefined;
  getBooks: () => void;
  onChangeAuthor: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeIsbn: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchBookForm({
  author,
  title,
  isbn,
  onChangeAuthor,
  onChangeIsbn,
  onChangeTitle,
  getBooks,
}: SearchBookFormProps) {
  return (
    <div>
      <div className="flex flex-col text-sm">
        <label htmlFor="author" className="mt-2 mb-0.5 font-bold">
          Kirjailija
        </label>
        <input
          type="search"
          name="author"
          placeholder="author"
          id="author"
          value={author}
          onChange={onChangeAuthor}
          className="rounded-sm border border-solid bg-white p-0.5 pl-1.5"
        />
        <label htmlFor="title" className="mt-2 mb-0.5 font-bold">
          Kirjan nimi
        </label>
        <input
          name="title"
          type="search"
          placeholder="title"
          id="title"
          value={title}
          onChange={onChangeTitle}
          className="rounded-sm border border-solid bg-white p-0.5 pl-1.5"
        />
        <label htmlFor="isbn" className="mt-2 mb-0.5 font-bold">
          ISBN
        </label>
        <input
          type="search"
          name="isbn"
          placeholder="isbn"
          id="isbn"
          value={isbn}
          onChange={onChangeIsbn}
          className="rounded-sm border border-solid bg-white p-0.5 pl-1.5"
        />
      </div>
      <div className="pt-2">
        <Button onClick={getBooks} variant="primary">
          Hae
        </Button>
      </div>
    </div>
  );
}
