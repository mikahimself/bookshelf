"use client"
import { useState } from "react";
import Modal from "./Modal";
import useKeyPressed from "./useKeyPressed";
export default function ClickBait() {
  const [showModal, setShowModal] = useState(false)
    useKeyPressed({ keyCode: "Escape", onKeyFunction: () => setShowModal(false)})

  return (
    <>
      <button onClick={() => setShowModal(!showModal)}>Button</button>
      {showModal && <Modal showModal={showModal} setShowModal={setShowModal}>
          <div></div>
        </Modal>}
    </>
  )
}