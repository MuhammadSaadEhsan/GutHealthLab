import React, { useCallback, useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";

function getReaderNamesFromTypes(barcodeTypes) {
	if (!Array.isArray(barcodeTypes) || barcodeTypes.length === 0) {
		return [
			"code_128_reader",
			"ean_reader",
			"ean_8_reader",
			"upc_reader",
			"upc_e_reader",
			"code_39_reader",
			"code_39_vin_reader",
			"codabar_reader",
			"i2of5_reader",
			"2of5_reader",
			"code_93_reader",
		];
	}

	const map = {
		code_128: "code_128_reader",
		ean: "ean_reader",
		ean_8: "ean_8_reader",
		upc: "upc_reader",
		upc_e: "upc_e_reader",
		code_39: "code_39_reader",
		code_39_vin: "code_39_vin_reader",
		codabar: "codabar_reader",
		i2of5: "i2of5_reader",
		"2of5": "2of5_reader",
		code_93: "code_93_reader",
	};

	return barcodeTypes
		.map((t) => map[t])
		.filter(Boolean);
}

/**
 * BarcodeScannerInput
 *
 * Props:
 * - onDetected?: (code: string) => void
 * - singleScan?: boolean (default: true)
 * - barcodeTypes?: string[] (e.g., ["code_128", "ean", "upc"]) - defaults to common types
 * - placeholder?: string
 * - autoFocusInput?: boolean (default: true)
 * - className?: string
 */
const BarcodeScannerInput = ({
	onDetected,
	singleScan = true,
	barcodeTypes,
	placeholder = "Scan barcode...",
	autoFocusInput = true,
	className = "",
}) => {
	const [codeValue, setCodeValue] = useState("");
	const [isScanning, setIsScanning] = useState(false);
	const previewRef = useRef(null);
	const inputRef = useRef(null);
	const detectedOnceRef = useRef(false);

	const stopScanner = useCallback(() => {
		try {
			Quagga.stop();
		} catch (_) {
			// no-op
		}
		Quagga.offDetected(onDetectedHandler);
		setIsScanning(false);
	}, []);

	const onDetectedHandler = useCallback(
		(result) => {
			const detectedCode = result?.codeResult?.code;
			if (!detectedCode) return;

			// Debounce multiple callbacks fired rapidly
			if (singleScan && detectedOnceRef.current) return;
			detectedOnceRef.current = true;

			setCodeValue(detectedCode);
			if (typeof onDetected === "function") {
				onDetected(detectedCode);
			}

			if (singleScan) {
				stopScanner();
			} else {
				// Allow next detection after a brief delay to avoid rapid duplicates
				setTimeout(() => {
					detectedOnceRef.current = false;
				}, 500);
			}
		},
		[onDetected, singleScan, stopScanner]
	);

	const startScanner = useCallback(async () => {
		if (!previewRef.current) return;

		const readers = getReaderNamesFromTypes(barcodeTypes);

		await Quagga.init(
			{
				inputStream: {
					type: "LiveStream",
					target: previewRef.current,
					constraints: {
						facingMode: "environment",
						aspectRatio: { min: 1, max: 100 },
					},
				},
				decoder: { readers },
				locate: true,
				locator: { patchSize: "medium", halfSample: true },
			},
			(err) => {
				if (err) {
					console.error("Quagga init error:", err);
					return;
				}
				Quagga.start();
				setIsScanning(true);
				Quagga.onDetected(onDetectedHandler);
			}
		);
	}, [barcodeTypes, onDetectedHandler]);

	useEffect(() => {
		return () => {
			stopScanner();
		};
	}, [stopScanner]);

	useEffect(() => {
		if (autoFocusInput && inputRef.current) {
			inputRef.current.focus();
		}
	}, [autoFocusInput]);

	return (
		<div className={className}>
			<div style={{ fontWeight: 600, color: "#0B233A", marginBottom: 6 }}>Barcode Scanner</div>
			<div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
				<input
					ref={inputRef}
					type="text"
					value={codeValue}
					onChange={(e) => setCodeValue(e.target.value)}
					placeholder={placeholder}
					style={{ flex: 1, padding: "8px 10px" }}
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
					}}
				>
					{isScanning ? "Stop" : "Start"} Scan
				</button>
			</div>

			<div
				ref={previewRef}
				style={{
					width: "100%",
					maxWidth: 640,
					aspectRatio: "4 / 3",
					background: "#000",
					position: "relative",
					overflow: "hidden",
					borderRadius: 8,
				}}
			/>
		</div>
	);
};

export default BarcodeScannerInput;


