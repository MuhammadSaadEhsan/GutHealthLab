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

const BarcodeScannerInput2 = ({
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
  
  // New state for table data and form management
  const [kitEntries, setKitEntries] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  // Practitioner names data - you can replace this with API call
  const [practitionerNames] = useState([
    "Dr. John Smith",
    "Dr. Mac Smith",
   
  ]);

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

  // Validate form function
  const validateForm = useCallback(() => {
    return (
      codeValue.trim() !== "" &&
      kitType.trim() !== "" &&
      practitionerName.trim() !== "" &&
      kitPrice.trim() !== "" &&
      paymentStatus.trim() !== ""
    );
  }, [codeValue, kitType, practitionerName, kitPrice, paymentStatus]);

  // Add entry to table
  const addEntryToTable = () => {
    if (!validateForm()) {
      message.error("Please fill all fields before adding to table");
      return;
    }

    const newEntry = {
      id: Date.now(), // unique ID
      kitId: codeValue,
      kitType: kitType,
      practitionerName: practitionerName,
      kitPrice: `€ ${kitPrice}`,
      paymentStatus: paymentStatus,
    };

    setKitEntries(prev => [...prev, newEntry]);
    resetForm();
    message.success("Kit added to table successfully!");
  };

  // Remove entry from table
  const removeEntry = (id) => {
    setKitEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Reset form fields
  const resetForm = () => {
    setCodeValue("");
    setKitType("");
    setPractitionerName("");
    setKitPrice("");
    setPaymentStatus("Unpaid");
  };

  // Send all data
  const sendAllData = () => {
    if (kitEntries.length === 0) {
      message.error("No kit entries to send");
      return;
    }

    // Here you can implement your API call or data submission logic
    console.log("Sending all kit data:", kitEntries);
    message.success(`${kitEntries.length} kit(s) sent successfully!`);
    
    // Clear table after sending
    setKitEntries([]);
  };

  // Update form validation when fields change
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm]);

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

        {/* Practitioner Name - Changed to Dropdown */}
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
          <select
            value={practitionerName}
            onChange={(e) => setPractitionerName(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          >
            <option value="">Select Practitioner</option>
            {practitionerNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
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

      {/* Add to Table Button */}
      <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={addEntryToTable}
          disabled={!isFormValid}
          style={{
            background: isFormValid ? "#28a745" : "#ccc",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            cursor: isFormValid ? "pointer" : "not-allowed",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          Add to Table
        </button>
        
        {kitEntries.length > 0 && (
          <button
            type="button"
            onClick={sendAllData}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            Send All ({kitEntries.length})
          </button>
        )}
      </div>

      {/* Kit Entries Table */}
      {kitEntries.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#0B233A", marginBottom: "15px" }}>
            Kit Entries ({kitEntries.length})
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#fff",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#0B233A", color: "#fff" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "14px" }}>
                    Kit ID
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "14px" }}>
                    Kit Type
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "14px" }}>
                    Practitioner Name
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "14px" }}>
                    Kit Price
                  </th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "14px" }}>
                    Payment Status
                  </th>
                  <th style={{ padding: "12px", textAlign: "center", fontSize: "14px" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {kitEntries.map((entry, index) => (
                  <tr 
                    key={entry.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#fff",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    <td style={{ padding: "12px", fontSize: "14px" }}>{entry.kitId}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{entry.kitType}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{entry.practitionerName}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>{entry.kitPrice}</td>
                    <td style={{ padding: "12px", fontSize: "14px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor:
                            entry.paymentStatus === "Paid"
                              ? "#d4edda"
                              : entry.paymentStatus === "Pending"
                              ? "#fff3cd"
                              : "#f8d7da",
                          color:
                            entry.paymentStatus === "Paid"
                              ? "#155724"
                              : entry.paymentStatus === "Pending"
                              ? "#856404"
                              : "#721c24",
                        }}
                      >
                        {entry.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => removeEntry(entry.id)}
                        style={{
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

export default BarcodeScannerInput2;