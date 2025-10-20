import React, { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { message } from "antd";

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
    return Object.values(map);
  }
  return barcodeTypes.map((t) => map[t]).filter(Boolean);
}

const BarcodeScannerInput = ({
  onDetected,
  singleScan = false,
  barcodeTypes = ["code_128", "code_39", "code_93"],
  placeholder = "Enter Kit ID or Scan...",
  autoFocusInput = true,
  className = "",
  value = "",
}) => {
  const [codeValue, setCodeValue] = useState(value);
  const [showModal, setShowModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [kitType, setKitType] = useState("");
  const [practitionerName, setPractitionerName] = useState("");
  const [kitPrice, setKitPrice] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");

  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const stopFuncRef = useRef(null);
  const lastCodeRef = useRef("");
  const detectedOnceRef = useRef(false);

  const stopScanner = useCallback(() => {
    try {
      if (stopFuncRef.current) stopFuncRef.current();
      if (readerRef.current) readerRef.current.reset();
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    } catch (_) {}
    setIsScanning(false);
    setShowModal(false);
  }, []);

  const onDetectedHandler = useCallback(
    (text, rawResult) => {
      const detectedCode = text?.trim();
      if (!detectedCode) return;
      if (detectedCode === lastCodeRef.current) return;
      lastCodeRef.current = detectedCode;

      if (singleScan && detectedOnceRef.current) return;
      detectedOnceRef.current = true;

      setCodeValue(detectedCode);
      if (typeof onDetected === "function") {
        onDetected(detectedCode, rawResult);
      }
      if (singleScan) setTimeout(stopScanner, 600);
    },
    [onDetected, singleScan, stopScanner]
  );

  useEffect(() => {
    if (!showModal || !videoRef.current) return;

    const formats = getFormatsFromTypes(barcodeTypes);
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    const reader = new BrowserMultiFormatReader(hints, 10);
    readerRef.current = reader;

    reader
      .decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, err) => {
          if (result) onDetectedHandler(result.getText(), result);
        },
        {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        }
      )
      .then((stop) => {
        stopFuncRef.current = stop;
        setIsScanning(true);
      })
      .catch((e) => {
        message.error("Unable to access camera");
        console.error(e);
      });

    return () => stopScanner();
  }, [showModal, barcodeTypes, onDetectedHandler, stopScanner]);

  useEffect(() => {
    setCodeValue(value);
  }, [value]);

  return (
    <div className={className}>
      {/* Kit ID */}
      <div style={{ fontWeight: 600, color: "#0B233A", marginBottom: 6 }}>
        Kit ID
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <input
          type="text"
          value={codeValue}
          onChange={(e) => {
            setCodeValue(e.target.value);
            if (typeof onDetected === "function") onDetected(e.target.value);
          }}
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
          style={{
            background: "#0B233A",
            color: "#fff",
            border: "none",
            padding: "10px 14px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {isScanning ? "Scanning..." : "Scan"}
        </button>
      </div>

      {/* Extra Fields */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {/* Kit Type */}
        <div
          style={{
            flex: "1 1 200px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label
            style={{
              fontWeight: 600,
              color: "#0B233A",
              marginBottom: "4px",
              fontSize: "15px",
            }}
          >
            Kit Type
          </label>
          <select
            value={kitType}
            onChange={(e) => setKitType(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          >
            <option value="">Select Kit Type</option>
            <option value="Prepaid">Prepaid</option>
            <option value="PrepaidInvoice">Prepaid Invoice</option>
            <option value="RepaidRetail">Repaid Retail</option>
          </select>
        </div>

        {/* Practitioner Name */}
        <div
          style={{
            flex: "1 1 200px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label
            style={{
              fontWeight: 600,
              color: "#0B233A",
              marginBottom: "4px",
              fontSize: "15px",
            }}
          >
            Practitioner Name
          </label>
          <input
            type="text"
            placeholder="Practitioner Name"
            value={practitionerName}
            onChange={(e) => setPractitionerName(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Kit Price */}
        <div
          style={{
            flex: "1 1 120px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label
            style={{
              fontWeight: 600,
              color: "#0B233A",
              marginBottom: "4px",
              fontSize: "15px",
            }}
          >
            Kit Price
          </label>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
                fontSize: "15px",
              }}
            >
              €
            </span>
            <input
              type="number"
              placeholder="Kit Price"
              value={kitPrice}
              onChange={(e) => setKitPrice(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 28px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "15px",
              }}
            />
          </div>
        </div>

        {/* Payment Status */}
        <div
          style={{
            flex: "1 1 150px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label
            style={{
              fontWeight: 600,
              color: "#0B233A",
              marginBottom: "4px",
              fontSize: "15px",
            }}
          >
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          >
            <option value="">Select Status</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Camera Modal */}
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
              width: 360,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ color: "#fff", fontWeight: 600, marginBottom: 8 }}>
              Scan Barcode
            </div>
            <div
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                background: "#000",
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              <video
                ref={videoRef}
                muted
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
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
