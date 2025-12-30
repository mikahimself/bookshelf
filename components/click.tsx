"use client"
import { findBookByISBN } from "@/actions/findBookByISBN";
import { useState } from "react";
import Modal from "./Modal";
export default function ClickBait() {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <button onClick={() => setShowModal(!showModal)}>Button</button>
      {showModal && <Modal>
          <div></div>
        </Modal>}
    </>
  )
}