import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScannerInput from '../Components/BarcodeScannerInput';
import Quagga from "@ericblade/quagga2";
import { hover } from "framer-motion"; 

function LabReceived() {
    useEffect(() => {
        document.title = 'GutHealthlab Lab Received Form';
    }, []);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        qrCode: '', // field name consistent with backend
    });

    const [loading, setLoading] = useState(false);
    const isSubmittingRef = useRef(false);

    // Handle manual input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Submit logic
    const submitDataLogic = async (code) => {
        if (isSubmittingRef.current) return;

        if (!code) {
            message.error('QR Code is required');
            return;
        }

        isSubmittingRef.current = true;
        setLoading(true);

        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({ qrCode: code }), // ✅ consistent key
                redirect: 'follow',
            };

            const apiUrl2 = `${process.env.REACT_APP_API_URL}/t4kitsrec`; // ✅ fixed
            const response = await fetch(apiUrl2, requestOptions);
            const result = await response.json().catch(() => ({}));

            if (response.ok) {
                message.success(result.message || 'Kit scanned successfully!');
                // navigate("/thank-you");
            } else {
                message.error(result.message || 'Something went wrong!');
            }
        } catch (error) {
            message.error('An error occurred while submitting the form');
            console.error(error);
        } finally {
            setFormData({ qrCode: '' });
            setLoading(false);
            isSubmittingRef.current = false;
        }
    };

    // Form submit handler
    const submitData = async (e) => {
        e.preventDefault();
        await submitDataLogic(formData.qrCode);
    };

    return (
        <div className="kitrecieved" style={{ flexDirection: 'column' }}>
            <h1 style={{ color: '#0B233A', fontWeight: 700, marginBottom: 12 }}>
                Kit Received Form
            </h1>

            <form onSubmit={submitData}>
                <div
                    className="flexxx"
                    style={{ display: 'flex', width: '100%', justifyContent: "space-between" }}
                >
                    <div className="widhtttt" style={{ width: '100%' }}>
                        {/* Scanner */}
                        <div style={{ marginBottom: 16 }}>
                            <BarcodeScannerInput
                                onDetected={(code) => {
                                    if (loading || isSubmittingRef.current) return;
                                    setFormData((prev) => ({ ...prev, qrCode: code }));
                                    // NOTE: if you want auto-submit on scan:
                                    // submitDataLogic(code);
                                }}
                                singleScan={true}
                                barcodeTypes={["code_128"]}
                                placeholder="Scan barcode or type manually..."
                            />
                        </div>

                        {/* Manual Input */}
                        <label style={{ fontWeight: 600, color: '#0B233A' }}>
                            Kit ID<span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="qrCode"
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: '1px solid #ccc',
                                borderRadius: 6,
                                marginTop: 6,
                            }}
                            required
                            value={formData.qrCode}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div style={{ marginTop: 16 }}>
                    <button
                        className="button2"
                        type="submit"
                        disabled={loading}
                        style={{ minWidth: 120 }}
                    >
                        {loading ? 'Sending...' : 'SEND'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LabReceived;
