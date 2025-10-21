import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScannerInput from '../Components/BarcodeScannerInput';
import Quagga from "@ericblade/quagga2";

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

    // Handle barcode scanner input change
    const handleBarcodeChange = (code) => {
        setFormData({
            ...formData,
            qrCode: code,
        });
    };

    // Submit logic
    // const submitDataLogic = async (code) => {
    //     if (isSubmittingRef.current) return;

    //     if (!formData.qrCode) {
    //         message.error('Kit ID is required');
    //         return;
    //     }

    //     isSubmittingRef.current = true;
    //     setLoading(true);

    //     try {
    //         const myHeaders = new Headers();
    //         myHeaders.append("Content-Type", "application/json");

    //         const requestOptions = {
    //             method: 'POST',
    //             headers: myHeaders,
    //             body: JSON.stringify({ qrCode: code }), // ✅ consistent key
    //             redirect: 'follow',
    //         };

    //         const apiUrl2 = `${process.env.REACT_APP_API_URL}/t4kitsrec`; // ✅ fixed
    //         const response = await fetch(apiUrl2, requestOptions);
    //         const result = await response.json().catch(() => ({}));

    //         if (response.ok) {
    //             message.success(result.message || 'Kit scanned successfully!');
    //             // navigate("/thank-you");
    //         } else {
    //             message.error(result.message || 'Something went wrong!');
    //         }
    //     } catch (error) {
    //         message.error('An error occurred while submitting the form');
    //         console.error(error);
    //     } finally {
    //         setFormData({ qrCode: '' });
    //         setLoading(false);
    //         isSubmittingRef.current = false;
    //     }
    // };



const submitDataLogic = async (code) => {
    if (isSubmittingRef.current) return;

    if (!formData.qrCode) {
        message.error('Kit ID is required');
        return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',  // Change method to GET as you're using a GET API
            headers: myHeaders,
            redirect: 'follow',
        };

        // Add the qrCode as a query parameter to the API URL
        const apiUrl2 = `${process.env.REACT_APP_API_URL}/scankit?kitID=${code}`;

        // Call the API with the GET request
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
                        {/* Barcode Scanner */}
                        <div style={{ marginBottom: 16 }}>
                            <BarcodeScannerInput
                                onDetected={handleBarcodeChange}  // When a barcode is detected, update the form data
                                singleScan={true}  // Stop after the first scan
                                barcodeTypes={["code_128"]}  // Define which barcode types you want to scan
                                placeholder="Type Kit ID"  // Updated placeholder
                                value={formData.qrCode}  // Controlled input value
                                autoFocusInput={true}  // Auto-focus the input field
                                className="barcode-input"
                            />
                        </div>
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
