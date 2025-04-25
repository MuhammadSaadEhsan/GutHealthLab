// import { message } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function LabReceived() {

//     useEffect(() => {
//         document.title = 'GutHealthlab Lab Received Form';
//     }, []);

//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         qrCode: '', // Changed from kitid to qrCode to match the backend
//     });

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const submitData = async (e) => {
//         e.preventDefault();

//         // Validate input
//         if (!formData.qrCode) {
//             message.error('QR Code is required');
//             return;
//         }

//         // Prepare request payload
//         const myHeaders = new Headers();
//         myHeaders.append("Content-Type", "application/json"); // Set content type to JSON

//         const requestOptions = {
//             method: 'POST',
//             headers: myHeaders,
//             body: JSON.stringify({
//                 qrCode: formData.qrCode, // Send qrCode in request body
//             }),
//             redirect: 'follow',
//         };

//         try {
//             const response = await fetch("https://testforlife-a4b515517434.herokuapp.com/kitrecbyqr", requestOptions);
//             const result = await response.json();
//             if (response.ok) {
//                 message.success(result.message || 'Kit retrieved successfully!');
//                 navigate("/thank-you"); // Navigate to thank you page on success
//             } else {
//                 message.error(result.message || 'Something went wrong!');
//             }
//         } catch (error) {
//             message.error('An error occurred while submitting the form');
//             console.error(error);
//         }
//     };

//     return (
//         <div className='mainformdiv' style={{ flexDirection: 'column' }}>

//             <h1 style={{ color: '#0B233A' }}>Lab Received Form</h1>
//             <form onSubmit={submitData}>
//                 <div className='flexxx' style={{ display: 'flex', width: '100%', justifyContent: "space-between" }}>
//                     <div className='widhtttt'>
//                         <label>Your Kit ID<span style={{ color: 'red' }}>*</span></label>
//                         <input
//                             type='text'
//                             name='qrCode' // Ensure name is qrCode
//                             style={{ width: '198%' }}
//                             required
//                             value={formData.qrCode}
//                             onChange={handleInputChange}
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <button className='button2' type='submit'>SEND</button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default LabReceived;



import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LabReceived() {

    useEffect(() => {
        document.title = 'GutHealthlab Lab Received Form';
    }, []);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        qrCode: '', // Changed from kitid to qrCode to match the backend
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const [loading, setloading] = useState(false)
    const submitData = async (e) => {
        e.preventDefault();
      await  setloading(true)
        // Validate input
        if (!formData.qrCode) {
            message.error('QR Code is required');
            return;
        }

        // Prepare request payload
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json"); // Set content type to JSON

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                qrcode: formData.qrCode, // Send qrCode in request body
            }),
            redirect: 'follow',
        };

        // API URLs
        // const apiUrl1 = 'https://testforlife-a4b515517434.herokuapp.com/kitrecbyqr';
        // const apiUrl2 = `${process.env.REACT_APP_API_URL}/kitrecbyqr`;
        const apiUrl2 = `${process.env.REACT_APP_API_URL}/t4kitsrec`;

        // Make requests to both APIs
        try {
            const responses = await Promise.all([
                // fetch(apiUrl1, requestOptions),
                fetch(apiUrl2, requestOptions),
            ]);

            const results = await Promise.all(responses.map(res => res.json()));

            // Handle response from API 1
            // if (responses[0].ok) {
            //     message.success(results[0].message || 'API 1: Kit retrieved successfully!');
            // } else {
            //     message.error(results[0].message || 'API 1: Something went wrong!');
            // }

            // // Handle response from API 2
            // if (responses[1].ok) {
            //     message.success(results[1].message || 'API 2: Kit retrieved successfully!');
            // } else {
            //     message.error(results[1].message || 'API 2: Something went wrong!');
            // }

            // navigate("/thank-you"); // Navigate to thank you page on success
            message.success('Kit scanned successfully!');
        } catch (error) {
            message.error('An error occurred while submitting the form');
            console.error(error);
        }
       await setFormData({
            qrCode: '', // Changed from kitid to qrCode to match the backend
        });
      await  setloading(false)

    };

    return (
        <div className='kitrecieved' style={{ flexDirection: 'column' }}>

            {loading ? (<>
            
            <img src='loading.gif' width={"10%"}/>
            </>) : (<>
                <h1 style={{ color: '#0B233A' }}>Kit Received Form</h1>
                <form onSubmit={submitData}>
                    <div className='flexxx' style={{ display: 'flex', width: '100%', justifyContent: "space-between" }}>
                        <div className='widhtttt' style={{width:'100%'}}>
                            <label>Kit ID<span style={{ color: 'red' }}>*</span></label>
                            <input
                                type='text'
                                name='qrCode' // Ensure name is qrCode
                                style={{ width: '100%' }}
                                required
                                value={formData.qrCode}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button className='button2' type='submit'>SEND</button>
                    </div>
                </form>
            </>)}
        </div>
    );
}

export default LabReceived;
