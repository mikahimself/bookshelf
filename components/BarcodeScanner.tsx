"use client";
import {
  CameraDevice,
  Html5Qrcode,
  Html5QrcodeCameraScanConfig,
  Html5QrcodeFullConfig,
  Html5QrcodeResult,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";

const scannerContainerId = "barcode-scanner-container";
const formatsToSupport = [Html5QrcodeSupportedFormats.EAN_13];
const scannerFullConfig: Html5QrcodeFullConfig = {
  verbose: false,
  formatsToSupport,
};
const scannerCameraScanConfig: Html5QrcodeCameraScanConfig = {
  fps: 10,
  qrbox: {
    width: 300,
    height: 140,
  },
  aspectRatio: 1.333,
};

type BarcodeScannerProps = {
  onScanSuccess: (
    decodedISBN: string,
    decodedResult: Html5QrcodeResult
  ) => Promise<void>;
  onScanFailure?: (errorMesssage: string) => Promise<void>;
};

export default function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scannerUp, setScannerUp] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[] | null>(null);

  // Get list of cameras & clean cameras on unmount
  useEffect(() => {
    Html5Qrcode.getCameras().then((cameras) => {
      setCameras(cameras);
    });
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning)
        scannerRef.current.stop().then(() => console.log("Camera stopped"));
    };
  }, []);

  const startCamera = async (id: string) => {
    const camera = new Html5Qrcode(scannerContainerId, scannerFullConfig);
    scannerRef.current = camera;
    setScannerUp(true);
    await camera.start(
      id,
      scannerCameraScanConfig,
      (decodedText, _) => {
        onScanSuccess(decodedText, _);
        scannerRef.current?.stop().then(() => {});
      },
      () => {}
    );
  };

  return (
    <div className="flex flex-col">
      {!scannerUp && (
        <div className="flex h-75 w-100 items-center justify-center rounded-sm bg-gray-300 align-middle">
          {cameras?.length && (
            <Button
              variant="primary"
              onClick={() => startCamera(cameras[0].id)}
            >
              Kuvaa viivakoodi
            </Button>
          )}
        </div>
      )}
      <div id={scannerContainerId} className="w-100" />
    </div>
  );
}
