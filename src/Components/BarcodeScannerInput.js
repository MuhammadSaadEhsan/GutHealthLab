import React, { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";

// Helper functions
function toHex(str) {
  return Array.from(str)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
}

function toBinaryString(str) {
  return Array.from(str)
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

const BarcodeScannerInput = ({ placeholder = "Scan barcode or type manually", onDetected }) => {
  const scannerRef = useRef(null);
  const [codeValue, setCodeValue] = useState("");
  const [formatValue, setFormatValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const startScanner = () => {
    setShowModal(true);

    setTimeout(() => {
      if (scannerRef.current) {
        Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              target: scannerRef.current,
              constraints: {
                facingMode: "environment",
                width: { min: 1280 },
                height: { min: 720 },
              },
            },
            locator: {
              // Larger patch size improves stability on high-contrast labels like Code39
              patchSize: "medium",
              halfSample: true,
            },
            numOfWorkers: 0, // mobile safe
            decoder: {
              // Focus on formats that support letters and hyphens
              readers: [
                {
                  format: "code_39_reader",
                  config: {
                    useCode39Extended: true, // allow full ASCII for Code 39 (includes '-','/','+' etc.)
                  },
                },
                {
                  format: "code_128_reader",
                  config: {},
                },
                {
                  format: "code_93_reader",
                  config: {},
                },
              ],
            },
            locate: true,
          },
          (err) => {
            if (err) {
              console.error("Quagga init error:", err);
              return;
            }
            Quagga.start();
          }
        );

        // 🔴🟢 Debug overlay
        Quagga.onProcessed((result) => {
          const ctx = Quagga.canvas.ctx.overlay;
          const canvas = Quagga.canvas.dom.overlay;

          if (result) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (result.boxes) {
              result.boxes
                .filter((box) => box !== result.box)
                .forEach((box) => {
                  Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, ctx, {
                    color: "green",
                    lineWidth: 2,
                  });
                });
            }
            if (result.box) {
              Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, ctx, {
                color: "red",
                lineWidth: 3,
              });
            }
          }
        });

        // ✅ On detection with quality + pattern filters to avoid numeric-only false positives
        Quagga.onDetected((data) => {
          const code = data?.codeResult?.code;
          if (!code) return;

          // Calculate average error from decoded codes (lower is better)
          const errors = (data.codeResult.decodedCodes || [])
            .filter((d) => d.error !== undefined)
            .map((d) => d.error);
          const avgError = errors.length
            ? errors.reduce((a, b) => a + b, 0) / errors.length
            : 0.0;

          // Accept only reasonably confident reads
          if (avgError > 0.15) return; // keep scanning

          // If your kits follow patterns like "T4-0123456-", prefer those
          const expectedLike = /^[A-Z][0-9]-?[0-9A-Z]+-?$/; // allows letters + hyphens
          if (!expectedLike.test(code)) {
            // If it is purely numeric and we expected alpha/hyphen, ignore
            if (/^\d+$/.test(code)) return;
          }

          const detectedCode = code;
          const format = (data.codeResult.format || "unknown").toUpperCase();

          setCodeValue(detectedCode);
          setFormatValue(format);

          console.log("✅ Detected:", { format, value: detectedCode, avgError });

          const payload = { format, value: detectedCode };
          fetch("/api/save-scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }).catch((err) => console.error("Backend error:", err));

          if (typeof onDetected === "function") onDetected(payload);

          Quagga.stop();
          setShowModal(false);
        });
      }
    }, 500);
  };

  const stopScanner = () => {
    try {
      Quagga.stop();
    } catch (e) {
      console.warn("Scanner already stopped");
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <label style={{ fontWeight: "600", marginBottom: "6px" }}>
        Kit ID <span style={{ color: "red" }}>*</span>
      </label>

      <div style={{ display: "flex", marginBottom: "12px" }}>
        <input
          type="text"
          value={codeValue}
          onChange={(e) => setCodeValue(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#e6f3ff",
          }}
        />
        <button
          type="button"
          onClick={startScanner}
          style={{
            marginLeft: "12px",
            background: "#0B233A",
            color: "#fff",
            borderRadius: "6px",
            padding: "0 16px",
          }}
        >
          Start Scan
        </button>
      </div>

      {/* ✅ Display Format + Raw + HEX + Binary under input */}
      {codeValue && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px",
            background: "#f1f1f1",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          <div><strong>Format:</strong> {formatValue}</div>
          <div><strong>Raw:</strong> {codeValue}</div>
          <div><strong>HEX:</strong> {toHex(codeValue)}</div>
          <div><strong>Binary:</strong> {toBinaryString(codeValue)}</div>
        </div>
      )}

      <button
        type="submit"
        disabled={!codeValue}
        style={{
          background: !codeValue ? "#ccc" : "#0B233A",
          color: "#fff",
          borderRadius: "6px",
          padding: "12px",
          width: "100%",
          marginTop: "12px",
        }}
      >
        SEND
      </button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "16px",
              width: "90%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              ref={scannerRef}
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "8px",
                overflow: "hidden",
                background: "#000",
              }}
            />
            <button
              type="button"
              onClick={() => {
                stopScanner();
                setShowModal(false);
              }}
              style={{
                marginTop: "12px",
                background: "#0B233A",
                color: "#fff",
                borderRadius: "6px",
                padding: "6px 16px",
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
