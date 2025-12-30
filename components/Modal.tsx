"use client";
import { createPortal } from "react-dom";
import { findBookByISBN } from "@/actions/findBookByISBN";
import { ChangeEvent, useState } from "react";
import Image from 'next/image'
import { GoogleBookSearchItem } from "@/lib/validations";

type ActiveTab = "SCAN" | "ENTER";

export default function Modal({ children }: { children: React.ReactNode}) {
  const portalRoot = document.getElementById("modal-root");
  const [author, setAuthor] = useState("")
  const [title, setTitle] = useState("")
  const [foundBooks, setFoundBooks] = useState<GoogleBookSearchItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("ENTER");

  const onChangeAuthor = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value)
  }
  
  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const getBooks = async () => {
    const bookArray = await findBookByISBN(title, author)
    console.log(bookArray)
    setFoundBooks(bookArray)
  }

  return (
    <>
    {createPortal(
      <div className="fixed inset-0 z-50 w-screen h-screen bg-black/50">
        <div className="fixed inset-x-1/4 inset-y-1/6 bg-gray-100 rounded-lg p-3.5 text-black overflow-y-hidden">
          {/* {children} */}

          {activeTab === "ENTER" && (
          <>
          <div className="flex flex-col text-sm">
            <label htmlFor="author" className="mt-2 mb-0.5 font-bold">Kirjailija</label>
            <input name="author" placeholder="author" id="author" value={author} onChange={onChangeAuthor} className="bg-white p-0.5 pl-1.5 border rounded-sm border-solid" />
            <label htmlFor="title" className="mt-2 mb-0.5 font-bold">Kirjan nimi</label>
            <input name="title" placeholder="title" id="title" value={title} onChange={onChangeTitle} className="bg-white p-0.5 pl-1.5 border rounded-sm border-solid" />
          </div>
          
          <button onClick={getBooks} className="bg-blue-400 border-none p-1 pl-3 pr-3 rounded-lg mt-3 mb-3">Submit</button>
          
          <div className="overflow-y-auto flex-1 h-72 pb-4">

          {foundBooks.length > 0 && (
            foundBooks.map((book: GoogleBookSearchItem) => (
              <div key={book.id} className="flex flex-row mt-2.5 mb-2.5 hover:bg-gray-200 rounded-lg p-2 transition-colors">
                <div className="mr-2.5">
                  <Image src={book.coverUrl} alt="book cover" width={60} height={90} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">{book.title}</span>
                  <span>{...book.authors}</span>
                </div>
              </div>
            ))
          )}
          </div>
          </>    
        )}
        {activeTab === "ENTER" && (
          <>
            <div>
              
            </div>
          </>
        )}
        </div>
      </div>, portalRoot!)}
    </>
  )
}