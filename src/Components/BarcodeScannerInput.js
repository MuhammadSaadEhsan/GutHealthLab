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
      BarcodeFormat.CODE_93,
      BarcodeFormat.CODABAR,
    ];
  }
  return barcodeTypes.map((t) => map[t]).filter(Boolean);
}

// BarcodeScannerInput Component
const BarcodeScannerInput = ({
  onDetected,
  singleScan = false,
  barcodeTypes = ["code_128", "code_39", "code_93", "codabar"],
  placeholder = "Scan barcode...",
  autoFocusInput = true,
  className = "",
}) => {
  const [codeValue, setCodeValue] = useState("");
  const [scannedCodes, setScannedCodes] = useState([]); 
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
      if (stopFuncRef.current) stopFuncRef.current();
      if (readerRef.current) readerRef.current.reset();
      if (videoRef.current) {
        const mediaStream = videoRef.current.srcObject;
        if (mediaStream && typeof mediaStream.getTracks === "function") {
          mediaStream.getTracks().forEach((t) => t.stop());
        }
        // Detach stream from element
        videoRef.current.srcObject = null;
      }
    } catch (_) {}
    setIsScanning(false);
    setShowModal(false);
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
      setScannedCodes((prevCodes) => [...prevCodes, detectedCode]); 

      if (typeof onDetected === "function") {
        onDetected(detectedCode, rawResult);  
      }

      // Auto-stop camera only when singleScan is true
      if (singleScan) {
        setTimeout(() => stopScanner(), 500);
      }
    },
    [onDetected, singleScan, stopScanner]
  );

  // Start scanner only when modal is open
  useEffect(() => {
    if (showModal && previewRef.current && videoRef.current) {
     
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

      
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 1.777 },
        },
        audio: false,
      };

      
      const videoEl = videoRef.current;
      videoEl.setAttribute("playsinline", "true");

      reader
        .decodeFromVideoDevice(
          undefined,
          videoEl,
          (result, err, controls) => {
            if (result) {
              onDetectedHandler(result.getText(), result);
            }
          },
          constraints
        )
        .then((stop) => {
          stopFuncRef.current = stop;
          setIsScanning(true);
        })
        .catch((e) => {
          console.error("ZXing init error:", e);
          setIsScanning(false);
        });
    }
    
    if (!showModal) {
      stopScanner();
    }
    
  }, [showModal]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
    
  }, []);

  useEffect(() => {
    if (autoFocusInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocusInput]);

  // Handle "Add More" scanning
  const handleAddMore = () => {
    setShowModal(true); 
    setCodeValue("");  
  };

  return (
    <div className={className}>
      <div style={{ fontWeight: 600, color: "#0B233A", marginBottom: 6 }}>
        Kit ID
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
          onClick={() => setShowModal(true)}
          aria-label="Start Scan"
          style={{
            background: "#0B233A",
            color: "#fff",
            border: "none",
            padding: "10px 14px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            marginLeft: 20,
          }}
        >
          Start Scan
        </button>
      </div>

      <div style={{ marginBottom: 12, color: "#555" }}>
        Allow camera access and point at the barcode.
      </div>

      {/* Display scanned codes */}
      {scannedCodes.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <h3>Scanned Barcodes:</h3>
          <ul>
            {scannedCodes.map((code, index) => (
              <li key={index}>{code}</li>
            ))}
          </ul>
          <button onClick={handleAddMore} style={{ padding: "8px 16px", backgroundColor: "#0B233A", color: "#fff", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            Add More
          </button>
        </div>
      )}

      {/* Modal for scanner */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#222",
              borderRadius: 12,
              padding: 16,
              maxWidth: "95vw",
              width: 360,
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ color: "#fff", fontWeight: 600, marginBottom: 8 }}>
              Scan Barcode
            </div>
            <div
              ref={previewRef}
              style={{
                width: "100%",
                maxWidth: 340,
                aspectRatio: "4 / 3",
                background: "#000",
                position: "relative",
                overflow: "hidden",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <video
                ref={videoRef}
                muted
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </div>
            <button
              type="button"
              onClick={stopScanner}
              style={{
                background: "#fff",
                color: "#222",
                border: "none",
                padding: "8px 18px",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
                marginTop: 6,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerInput;
