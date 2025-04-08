import { message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Home from "../Components/home";
import Thankyou from "./thankyou";

function OralMicrobiome() {
  useEffect(() => {
    document.title = "GutHealthlab Oral Microbiome Form";
  }, []);

  const navigate = useNavigate();
const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    sampledate: "",
    barcode: "",
    gender: "",
    email: "",
    dob: "",
  });

  // Handle input changes
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const submintdata = async (e) => {
  //     const hide = message.loading("Action in progress", 0);

  //     e.preventDefault()
  //     const myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  //     const urlencoded = new URLSearchParams();
  //     urlencoded.append("name", formData.firstname+" "+formData.lastname);
  //     // urlencoded.append("lastname", formData.lastname);
  //     urlencoded.append("email", formData.email);
  //     urlencoded.append("sampledate", formData.sampledate);
  //     // urlencoded.append("gender", formData.gender);
  //     urlencoded.append("KitCode", formData.barcode);
  //     urlencoded.append("DOB", formData.dob);

  //     const requestOptions = {
  //         method: "POST",
  //         headers: myHeaders,
  //         body: urlencoded,
  //         redirect: "follow"
  //     };

  //     await fetch("https://yourgutmap-food-sensitivity-423a2af84621.herokuapp.com/whitelabelfsform", requestOptions)
  //     .then((response) => response.text())
  //     // .then((result) => message.success(result))
  //     .catch((error) => console.error(error));

  //     hide(); // Call hide to stop the loading message
  //     message.success("Form submitted successfully");
  //     navigate("/thank-you")
  // }

  const submitData = async (e) => {
    e.preventDefault();
setSubmitted(true)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("name", formData.firstname+" "+formData.lastname);
    urlencoded.append("email", formData.email);
    urlencoded.append("sampledate", formData.sampledate); // Changed `date` to `sampledate`
    urlencoded.append("KitCode", formData.barcode); // Changed `barcode` to `KitCode`
    urlencoded.append("DOB", formData.dob); // Added Date of Birth field
    urlencoded.append("type", "OralMicrobiome"); // Dynamic test type selection
    urlencoded.append("formtype", "White-label"); // Fixed formtype value

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    try {
      console.log(formData)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/submitformdata`,
        requestOptions
      );
      const result = await response.text();
      message.success("Form Submitted Successfully");
      // navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Home>
      <div className="myform fsform">
        {!submitted ? <div
          className="mainformdiv"
          style={{ flexDirection: "column", marginTop: "-30px" }}
        >
          <img src="" alt="" />
          <h1 style={{ color: "#0B233A" }}>Oral Microbiome</h1>
          <form onSubmit={submitData}>
            <div
              className="flexxx"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div className="widhtttt">
                <label>
                  Your First Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  required
                  value={formData.firstname}
                  onChange={handleInputChange2}
                />
              </div>
              <div className="widhtttt">
                <label>
                  Your Last Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  required
                  value={formData.lastname}
                  onChange={handleInputChange2}
                />
              </div>
            </div>

            <div
              className="flexxx"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div className="widhtttt">
                <label>
                  Your E-mail <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange2}
                />
              </div>
              <div className="widhtttt">
                <label>
                  Sample date <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  name="sampledate"
                  required
                  value={formData.sampledate}
                  onChange={handleInputChange2}
                />
              </div>
            </div>
            <div
              className="flexxx"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div className="widhtttt">
                <label>
                  {" "}
                  Barcode Number <span style={{ color: "red" }}>*</span>
                </label>
                <div className="fsdiv">
                    {/* <p>T4-</p> */}
                  <input
                    type="text"
                    name="barcode"
                    required
                    style={{ outline:"none",width:"100%" }}
                    value={formData.barcode}
                    onChange={handleInputChange2}
                  />
                </div>
              </div>
              <div className="widhtttt">
                <label>
                  Date Of Birth <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleInputChange2}
                />
              </div>
            </div>

            {/* <div >
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
                </div> */}

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                // name='barcode'
                required
                style={{ width: "30px", height: "30px" }}
                value={formData.namel}
                // onChange={handleInputChange2}
              />
              <label>
                {" "}
                I give consent for my sample to be analysed, all data will be
                completely anonymous and stored securely.
              </label>
            </div>

            <div>
              <button className="button2" type="submit">
                SEND
              </button>
            </div>
          </form>
        </div> : <Thankyou/>}
      </div>
    </Home>
  );
}

export default OralMicrobiome;
