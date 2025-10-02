import React, { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

// Map prop barcode types to ZXing formats
function getFormatsFromTypes(barcodeTypes) {
  const map = {
    code_128: BarcodeFormat.CODE_128,
    ean: BarcodeFormat.EAN_13,
    ean_8: BarcodeFormat.EAN_8,
    upc: BarcodeFormat.UPC_A,
    upc_e: BarcodeFormat.UPC_E,
    code_39: BarcodeFormat.CODE_39,
    code_93: BarcodeFormat.CODE_93,
    itf: BarcodeFormat.ITF,
    codabar: BarcodeFormat.CODABAR,
  };
  if (!Array.isArray(barcodeTypes) || barcodeTypes.length === 0) {
    return [
      BarcodeFormat.CODE_128,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_39,
    ];
  }
  return barcodeTypes.map((t) => map[t]).filter(Boolean);
}

// BarcodeScannerInput Component
const BarcodeScannerInput = ({
  onDetected,
  singleScan = true,
  barcodeTypes = ["code_128"],
  placeholder = "Scan barcode...",
  autoFocusInput = true,
  className = "",
}) => {
  const [codeValue, setCodeValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const previewRef = useRef(null);
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const detectedOnceRef = useRef(false);
  const readerRef = useRef(null);
  const stopFuncRef = useRef(null);
  const lastCodeRef = useRef("");

  // Stop scanner function (defined early so it can be referenced below)
  const stopScanner = useCallback(() => {
    try {
      if (stopFuncRef.current) {
        stopFuncRef.current();
      }
      if (readerRef.current) {
        readerRef.current.reset();
      }
      if (videoRef.current) {
        try {
          const mediaStream = videoRef.current.srcObject;
          if (mediaStream && typeof mediaStream.getTracks === "function") {
            mediaStream.getTracks().forEach((t) => t.stop());
          }
          // Detach stream from element
          videoRef.current.srcObject = null;
        } catch (_) {}
      }
    } catch (_) {}
    setIsScanning(false);
  }, []);

  // Handle barcode detection
  const onDetectedHandler = useCallback(
    (text, rawResult) => {
      const detectedCode = text;
      if (!detectedCode) return;

      // Debounce duplicate consecutive frames
      if (detectedCode === lastCodeRef.current) return;
      lastCodeRef.current = detectedCode;

      if (singleScan && detectedOnceRef.current) return;
      detectedOnceRef.current = true;

      setCodeValue(detectedCode);
      if (typeof onDetected === "function") {
        onDetected(detectedCode, rawResult);
      }

      // Auto-stop camera only when singleScan is true
      if (singleScan) {
        setTimeout(() => stopScanner(), 0);
      }
    },
    [onDetected, singleScan, stopScanner]
  );

  // Initialize ZXing scanner
  const startScanner = useCallback(async () => {
    if (isScanning || !previewRef.current || !videoRef.current) return;

    // Ensure any prior session is fully stopped and element is clean
    try {
      if (stopFuncRef.current) stopFuncRef.current();
      if (readerRef.current) readerRef.current.reset();
      if (videoRef.current) {
        const prev = videoRef.current.srcObject;
        if (prev && typeof prev.getTracks === "function") {
          prev.getTracks().forEach((t) => t.stop());
        }
        videoRef.current.srcObject = null;
      }
    } catch (_) {}

    detectedOnceRef.current = false;
    lastCodeRef.current = "";

    const formats = getFormatsFromTypes(barcodeTypes);
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    const reader = new BrowserMultiFormatReader(hints, 10);
    readerRef.current = reader;

    try {
      // Prefer environment camera; provide reasonable HD constraints
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 1.777 },
        },
        audio: false,
      };

      // Prepare video element
      const videoEl = videoRef.current;
      videoEl.setAttribute("playsinline", "true");

      const stop = await reader.decodeFromVideoDevice(
        undefined,
        videoEl,
        (result, err, controls) => {
          if (result) {
            onDetectedHandler(result.getText(), result);
          }
        },
        constraints
      );
      stopFuncRef.current = stop;
      setIsScanning(true);
      if (autoFocusInput && inputRef.current) inputRef.current.focus();
    } catch (e) {
      console.error("ZXing init error:", e);
      try {
        // Fallback without custom constraints
        const stop = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (result) onDetectedHandler(result.getText(), result);
          }
        );
        stopFuncRef.current = stop;
        setIsScanning(true);
      } catch (e2) {
        console.error("ZXing fallback error:", e2);
        setIsScanning(false);
      }
    }
  }, [barcodeTypes, isScanning, onDetectedHandler, autoFocusInput]);

  useEffect(() => {
    return () => {
      try {
        if (stopFuncRef.current) stopFuncRef.current();
        if (readerRef.current) readerRef.current.reset();
      } catch (_) {}
    };
  }, []);

  return (
    <div className={className}>
      <div style={{ fontWeight: 600, color: "#0B233A", marginBottom: 6 }}>
        Barcode Scanner
      </div>

      {/* Input + Start Scan */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginBottom: "12px",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={codeValue}
          onChange={(e) => setCodeValue(e.target.value)}
          placeholder={placeholder}
          required
          style={{
            flex: 1,
            padding: "10px 14px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            outline: "none",
          }}
        />
        <button
          type="button"
          onClick={isScanning ? stopScanner : startScanner}
          aria-label={isScanning ? "Stop Scan" : "Start Scan"}
          style={{
            background: "#0B233A",
            color: "#fff",
            border: "none",
            padding: "10px 14px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {isScanning ? "Stop" : "Start"} Scan
        </button>
      </div>

      <div style={{ marginBottom: 12, color: "#555" }}>
        Allow camera access and point at the barcode. Use HTTPS on mobile.
      </div>

      {/* Camera Preview */}
      <div
        ref={previewRef}
        style={{
          width: "100%",
          maxWidth: 400,
          aspectRatio: "4 / 3",
          background: "#000",
          position: "relative",
          overflow: "hidden",
          borderRadius: 8,
        }}
      >
        <video
          ref={videoRef}
          muted
          autoPlay
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default BarcodeScannerInput;