import { useEffect } from "react";

type OnKeyPressedProps = {
  keyCode: string,
  onKeyFunction: () => void
}

export default function useKeyPressed({ keyCode, onKeyFunction}: OnKeyPressedProps) {
  useEffect(() => {
    console.log("Running event with", keyCode, " and", onKeyFunction)
    const keyPressHandler = (e: KeyboardEvent) => {
      console.log(e)
      if (e.key === keyCode) {
        console.log("Pressed", e.key)
        onKeyFunction()
      }
    }

    window.addEventListener("keypress", (e) => keyPressHandler(e));

    return (
      window.removeEventListener("keypress", keyPressHandler)
    )
  },
  [keyCode, onKeyFunction])
}