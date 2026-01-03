"use client";
import { createPortal } from "react-dom";
import { findBookByAuthorAndTitle } from "@/actions/findBookByAuthorAndTitle";
import { findBookByISBN } from "@/actions/findBookByISBN";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from 'next/image'
import { GoogleBookSearchItem } from "@/lib/validations";
import {Html5QrcodeScanner, Html5QrcodeSupportedFormats} from "html5-qrcode";
import BarcodeScanner from "./BarcodeScanner";
import useKeyPressed from "./useKeyPressed";
import IconButton from "./RoundButton";

type ModalProps = {
  showModal: boolean,
  setShowModal: (showModal: boolean) => void,
  children?: React.ReactNode
}


type ActiveTab = "SCAN" | "ENTER";

export default function Modal({ children, showModal, setShowModal }: ModalProps) {
  const portalRoot = document.getElementById("modal-root");
  const [author, setAuthor] = useState("")
  const [title, setTitle] = useState("")
  const [isbn, setIsbn] = useState("")
  const [foundBooks, setFoundBooks] = useState<GoogleBookSearchItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("ENTER");
  const readerRef = useRef<HTMLDivElement | null>(null)
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null)
  const [scrollHeight, setScrollHeight] = useState(110)
  const [scanSuccess, setScanSuccess] = useState(false)

  useEffect(() => {
    setScrollHeight(foundBooks.length * 110)
  }, [foundBooks.length])

  const onChangeAuthor = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value)
  }
  
  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const onChangeIsbn = (event: ChangeEvent<HTMLInputElement>) => {
    setIsbn(event.target.value)
  }

  const getBooks = async () => {
    const bookArray = await findBookByAuthorAndTitle({title, author, isbn})
    console.log(bookArray)
    setFoundBooks(bookArray)
  }

  async function onScanSuccess(decodedText: string, decodedResult: unknown) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    const kirja = await findBookByISBN(decodedText)
    setFoundBooks(kirja)
    console.log(kirja)
    setScanSuccess(true)
  }


  return (
    <>
    {createPortal(
      <div id="modal" className="fixed inset-0 z-50 w-screen h-screen bg-black/50 backdrop-blur-xs">
        <div className="fixed inset-x-1/4 inset-y-1/6 bg-gray-100 rounded-lg text-black overflow-y-hidden">
          <div id="modal-header" className="p-2.5 pl-3.5 pr-3.5 flex flex-row justify-between">
            <div className="font-semibold content-center">Lisää kirja</div>
            <IconButton onClick={() => setShowModal(false)} />
          </div>
          {/* {children} */}

          <div className="flex flex-row border-b border-gray-300">
            <div className={`${activeTab === "SCAN" ? "font-bold border-b-blue-500 border-b-3" : ""} flex-1 text-center p-1`} onClick={() => setActiveTab("SCAN")}>
              Lue viivakoodi
            </div>
            <div className={`${activeTab === "ENTER" ? "font-bold border-b-blue-500 border-b-3" : ""} flex-1 text-center p-1`} onClick={() => setActiveTab("ENTER")}>
              Syötä
            </div>
          </div>

          {activeTab === "ENTER" && (
            <div className="pl-4 pr-4 pt-2">
            <div className="flex flex-col text-sm">
              <label htmlFor="author" className="mt-2 mb-0.5 font-bold">Kirjailija</label>
              <input name="author" placeholder="author" id="author" value={author} onChange={onChangeAuthor} className="bg-white p-0.5 pl-1.5 border rounded-sm border-solid" />
              <label htmlFor="title" className="mt-2 mb-0.5 font-bold">Kirjan nimi</label>
              <input name="title" placeholder="title" id="title" value={title} onChange={onChangeTitle} className="bg-white p-0.5 pl-1.5 border rounded-sm border-solid" />
              <label htmlFor="isbn" className="mt-2 mb-0.5 font-bold">ISBN</label>
              <input name="isbn" placeholder="isbn" id="isbn" value={isbn} onChange={onChangeIsbn} className="bg-white p-0.5 pl-1.5 border rounded-sm border-solid" />
            </div>
          
            <button onClick={getBooks} className="bg-blue-600 border-none p-1 pl-3 pr-3 rounded-lg mt-3 mb-1 text-white">Hae</button>
          
            <div className="overflow-y-auto flex-1 pb-4" style={{ height: `200px`}}>

            {foundBooks.length > 0 && (
              foundBooks.map((book: GoogleBookSearchItem) => (
                <div key={book.id} className="flex flex-row mt-2.5 mb-2.5 hover:bg-gray-200 rounded-lg p-2 transition-colors">
                  <div className="mr-2.5">
                    <Image src={book.coverUrl} alt="book cover" width={55} height={80} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">{book.title}</span>
                    <span>{...book.authors}</span>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>    
        )}

        {activeTab === "SCAN" && (
            <>
            <div className="flex flex-col items-center p-3.5">
              <h3>Skannaa viivakoodi</h3>
              <BarcodeScanner onScanSuccess={onScanSuccess}/>
            </div>          
            {scanSuccess && (
              <>
              {foundBooks.map((book: GoogleBookSearchItem) => (
                <div key={book.id}>
                  {book.title} - {...book.authors}
                </div>
              ))}
              </>
            )}
            </>
        )}
        </div>
      </div>, portalRoot!)}
    </>
  )
}