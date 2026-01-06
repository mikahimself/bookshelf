import { useEffect } from "react";

type OnKeyPressedProps = {
  keyCode: string;
  onKeyFunction: () => void;
};

export default function useKeyPressed({
  keyCode,
  onKeyFunction,
}: OnKeyPressedProps) {
  useEffect(() => {
    const keyPressHandler = (e: KeyboardEvent) => {
      if (e.key === keyCode) {
        e.preventDefault();
        onKeyFunction();
      }
    };

    window.addEventListener("keyup", (e) => keyPressHandler(e));

    return window.removeEventListener("keyup", (e) => keyPressHandler(e));
  }, [keyCode, onKeyFunction]);
}
