import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Home from '../Components/home';
import Thankyou from './thankyou';
function Dnaform() {
const [submitted, setSubmitted] = useState(false);
    useEffect(() => {
        document.title = 'GutHealthlab DNA Form';
      }, []);

    const navigate = useNavigate()

    const [formData, setFormData] = useState({

        name: '',
        date: '',
        barcode: '',
        gender: '',
        email: '',
        dob: '',
    });


    // Handle input changes
    const handleInputChange2 = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    // const submintdata = async (e) => {
    //     e.preventDefault()
    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    //     const urlencoded = new URLSearchParams();
    //     urlencoded.append("name", formData.name);
    //     urlencoded.append("date", formData.date);
    //     urlencoded.append("email", formData.email);
    //     urlencoded.append("gender", formData.gender);
    //     urlencoded.append("barcode", formData.barcode);

    //     const requestOptions = {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: urlencoded,
    //         redirect: "follow"
    //     };

    //     await fetch("https://yourgutmap-food-sensitivity-423a2af84621.herokuapp.com/dnaformformdata", requestOptions)
    //         .then((response) => response.text())
    //         .then((result) => message.success(result))
    //         .catch((error) => console.error(error));


    //     navigate("/thank-you")
    // }
    
        const submitData = async (e) => {
            e.preventDefault();
            setSubmitted(true)
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        
            const urlencoded = new URLSearchParams();
            urlencoded.append("name", formData.name);
            urlencoded.append("email", formData.email);
            urlencoded.append("sampledate", formData.date);  // Changed `date` to `sampledate`
            urlencoded.append("KitCode", formData.barcode);  // Changed `barcode` to `KitCode`
            urlencoded.append("DOB", formData.dob);  // Added Date of Birth field
            urlencoded.append("type", 'DNAMap Genetic Test');  // Dynamic test type selection
            urlencoded.append("formtype", "White-label");  // Fixed formtype value
        
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow"
            };
        
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/submitformdata`, requestOptions);
                const result = await response.text();
                message.success(result);
                navigate("/thank-you");
            } catch (error) {
                console.error("Error submitting data:", error);
            }
        };

    return (
        <Home>
<div className="myform">
{!submitted ? <div className='mainformdiv' style={{ flexDirection: 'column' }}>

            <h1 style={{ color: '#0B233A' }}>DNAMap Genetic Test</h1>
            <form onSubmit={submitData} >
                <div className='flexxx' style={{ display: 'flex', width: '100%', justifyContent: "space-between" }}>
                    <div className='widhtttt'>
                        <label>Your Name <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type='text'
                            name='name'
                            required
                            value={formData.name}
                            onChange={handleInputChange2}
                        />
                    </div>
                    <div className='widhtttt'>
                        <label>Your E-mail <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type='text'
                            name='email'
                            required
                            value={formData.email}
                            onChange={handleInputChange2}
                        />
                    </div>


                </div>


                <div className='flexxx' style={{ display: 'flex', width: '100%', justifyContent: "space-between" }}>
                    <div className='widhtttt'>
                        <label>Sample date <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type='date'
                            name='date'
                            required
                            value={formData.date}
                            onChange={handleInputChange2}
                        />
                    </div>
                    <div className='widhtttt'>
                        <label> Barcode Number  <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type='text'
                            name='barcode'
                            required
                            value={formData.barcode}
                            onChange={handleInputChange2}
                        />
                    </div>


                </div>

                <div className='flexxx' style={{ display: 'flex', width: '100%', justifyContent: "space-between" }}>
                    <div className='widhtttt'>
                        <label>Date Of Birth <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type='date'
                            name='dob'
                            required
                            value={formData.dob}
                            onChange={handleInputChange2}
                        />
                    </div>

                </div>


                <div >
                    <label> Gender  <span style={{ color: 'red' }}>*</span></label>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', width: 'fit-content', gap: "10px", alignItems: 'center' }}>
                            <input
                                type='radio'
                                name='gender'
                                required
                                style={{ width: '30px', height: '30px' }}
                                value="Male"
                                onChange={handleInputChange2}
                            /><label>Male</label></div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: "10px", alignItems: 'center' }}>
                            <input
                                type='radio'
                                name='gender'
                                required
                                style={{ width: '30px', height: '30px' }}
                                value="Female"
                                onChange={handleInputChange2}
                            /><label>Female</label></div>
                    </div>
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: "10px" }}>
                    <input
                        type='checkbox'
                        // name='barcode'
                        required
                        style={{ width: '30px', height: '30px' }}
                        value={formData.namel}
                    // onChange={handleInputChange2}
                    />
                    <label> I give consent for my sample to be analysed, all data will be completely anonymous and stored securely.</label>

                </div>

                <div>
                    <button className='button2' type='submit'>SEND</button>
                </div>
            </form>
        </div> : <Thankyou/>}
        </div>
        </Home>
        
    )
}

export default Dnaform
