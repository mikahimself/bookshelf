import { GoogleBookSearchItem } from "@/lib/validations";
import { ChangeEvent, useState } from "react";
import useKeyPressed from "./useKeyPressed";
import { findBookByAuthorAndTitle } from "@/actions/findBookByAuthorAndTitle";
import { findBookByISBN } from "@/actions/findBookByISBN";
import Modal from "./ui/Modal";
import AddBookTabs from "./AddBookTabs";
import SearchBookForm from "./SearchBookForm";
import BarcodeScanner from "./BarcodeScanner";
import SearchResults from "./SearchResults";

export type ActiveTab = "SCAN" | "ENTER" | "RESULTS";

export default function AddBookModal() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [foundBooks, setFoundBooks] = useState<GoogleBookSearchItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("ENTER");
  const [previousTab, setPreviousTab] = useState<ActiveTab>("ENTER");

  useKeyPressed({ keyCode: "Enter", onKeyFunction: () => getBooks() });

  const onChangeAuthor = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeIsbn = (event: ChangeEvent<HTMLInputElement>) => {
    setIsbn(event.target.value);
  };

  const getBooks = async () => {
    const bookArray = await findBookByAuthorAndTitle({ title, author, isbn });
    setFoundBooks(bookArray);
    setPreviousTab(activeTab);
    setActiveTab("RESULTS");
  };

  async function onScanSuccess(decodedText: string, decodedResult: unknown) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    const kirja = await findBookByISBN(decodedText);
    setFoundBooks(kirja);
    setPreviousTab(activeTab);
    setActiveTab("RESULTS");
  }
  return (
    <Modal>
      <AddBookTabs
        activeTab={activeTab}
        previousTab={previousTab}
        setActiveTab={setActiveTab}
      />

      <div id="modal-content" className="flex-1 overflow-y-auto p-5">
        {activeTab === "ENTER" && (
          <SearchBookForm
            author={author}
            title={title}
            isbn={isbn}
            getBooks={getBooks}
            onChangeAuthor={onChangeAuthor}
            onChangeIsbn={onChangeIsbn}
            onChangeTitle={onChangeTitle}
          />
        )}

        {activeTab === "SCAN" && (
          <div className="flex flex-col items-center p-3.5">
            <BarcodeScanner onScanSuccess={onScanSuccess} />
          </div>
        )}

        {activeTab === "RESULTS" && <SearchResults results={foundBooks} />}
      </div>
    </Modal>
  );
}
