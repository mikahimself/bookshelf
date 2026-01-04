"use client";
import { createPortal } from "react-dom";
import { findBookByAuthorAndTitle } from "@/actions/findBookByAuthorAndTitle";
import { findBookByISBN } from "@/actions/findBookByISBN";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { GoogleBookSearchItem } from "@/lib/validations";
import BarcodeScanner from "./BarcodeScanner";
import useKeyPressed from "./useKeyPressed";
import IconButton from "./IconButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "./Button";
import SearchResults from "./SearchResults";
import { ArrowLeftIcon, BackwardIcon } from "@heroicons/react/20/solid";

type ModalProps = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  children?: React.ReactNode;
};

type ActiveTab = "SCAN" | "ENTER" | "RESULTS";

export default function Modal({
  children,
  showModal,
  setShowModal,
}: ModalProps) {
  const portalRoot = document.getElementById("modal-root");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [foundBooks, setFoundBooks] = useState<GoogleBookSearchItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("ENTER");
  const [scrollHeight, setScrollHeight] = useState(110);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [previousTab, setPreviousTab] = useState<ActiveTab>("ENTER");

  useEffect(() => {
    setScrollHeight(foundBooks.length * 110);
  }, [foundBooks.length]);

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
    <>
      {createPortal(
        <div
          id="modal"
          className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-xs"
        >
          <div className="fixed top-[15%] bottom-[15%] left-1/2 flex w-[90%] max-w-3xl -translate-x-1/2 flex-col overflow-hidden rounded-lg bg-gray-100 text-black">
            <div
              id="modal-header"
              className="flex flex-row justify-between p-3"
            >
              <div className="content-center font-semibold">Lisää kirja</div>
              <IconButton
                icon={XMarkIcon}
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className="flex flex-row border-b border-gray-300">
              {activeTab !== "RESULTS" && (
                <>
                  <div
                    role="button"
                    className={`${activeTab === "SCAN" ? "border-b-3 border-b-blue-500 font-semibold" : ""} flex-1 cursor-pointer rounded-t-sm p-1 pt-3 text-center hover:bg-gray-200 active:bg-gray-300`}
                    onClick={() => setActiveTab("SCAN")}
                  >
                    Lue viivakoodi
                  </div>
                  <div
                    role="button"
                    className={`${activeTab === "ENTER" ? "border-b-3 border-b-blue-500 font-semibold" : ""} flex-1 cursor-pointer rounded-t-sm p-1 pt-3 text-center hover:bg-gray-200 active:bg-gray-300`}
                    onClick={() => setActiveTab("ENTER")}
                  >
                    Syötä
                  </div>
                </>
              )}
              {activeTab === "RESULTS" && (
                <div className="pb-1 pl-2">
                  <Button
                    icon={ArrowLeftIcon}
                    onClick={() => setActiveTab(previousTab)}
                  >
                    Takaisin hakuun
                  </Button>
                </div>
              )}
            </div>

            <div id="modal-content" className="flex-1 overflow-y-auto p-3">
              {activeTab === "ENTER" && (
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
              )}

              {activeTab === "SCAN" && (
                <div className="flex flex-col items-center p-3.5">
                  <BarcodeScanner onScanSuccess={onScanSuccess} />
                </div>
              )}

              {activeTab === "RESULTS" && (
                <SearchResults results={foundBooks} />
              )}
            </div>
          </div>
        </div>,
        portalRoot!
      )}
    </>
  );
}
