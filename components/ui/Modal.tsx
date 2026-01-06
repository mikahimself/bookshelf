"use client";
import { useRef } from "react";
import useKeyPressed from "../useKeyPressed";
import IconButton from "./IconButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

type ModalProps = {
  children?: React.ReactNode;
};

type ActiveTab = "SCAN" | "ENTER" | "RESULTS";

export default function Modal({ children }: ModalProps) {
  const dialogOpenRef = useRef(true);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const onClose = () => {
    if (dialogOpenRef.current) {
      dialogOpenRef.current = false;
      router.back();
    }
  };

  useKeyPressed({
    keyCode: "Escape",
    onKeyFunction: () => onClose(),
  });

  return (
    <>
      <div
        id="modal"
        className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-xs"
      >
        <div
          ref={modalRef}
          autoFocus
          className="fixed top-[15%] bottom-[15%] left-1/2 flex w-[90%] max-w-3xl -translate-x-1/2 flex-col overflow-hidden rounded-lg bg-gray-100 text-black"
        >
          <div
            id="modal-header"
            className="flex flex-row justify-between p-3 pl-5"
          >
            <div className="content-center font-semibold">Lisää kirja</div>
            <IconButton icon={XMarkIcon} onClick={() => onClose()} />
          </div>

          <div id="modal-content" className="flex-1 overflow-y-auto p-5">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
