import React, { useEffect, useState } from "react";
import "./NewMicrobiomeForm.full.css";
import axios from "axios";
import ThankYouModal from "../component/thankYouModal";

export default function RegisterYourFST() {
  // State for all fields


  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);



  useEffect(() => {
    if (showThankYou) {
      setTimeout(() => {
        setShowThankYou(false);
      }, 5000);
    }
  }, [showThankYou]);


  const configMaker = (method, url, params = null, body = {}) => {
    return {
      method,
      maxBodyLength: Infinity,
      url: `${"https://api.yourgutmap.co.uk"}/${url}`,
      headers: {
        "Content-Type": "application/json",
        // "Access-Token": accessTokens,
        // Authorization: `Bearer ${Tokens}`,
      },
      ...(params && { params }), // only adds if not null
      data: body,
    };
  };


  const submitKitForm = async (data) => {
    // const portalId = "67c17d743394a458c944eec2";
        const  portalId="67ef8f3a291b7c6b9f6752cf"
    const config = configMaker("post", "submitkitform", {
      portalId,
    });
    config.data = data;
    const response = await axios.request(config);
    return response;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "Male",
    kitId: "",
    sampleDate: "",
  });

  const [errors, setErrors] = useState({
    health: "",
    diet: "",
    eatingHabits: "",
    antibiotics: "",
  });



 
  const initialFormState = {
    name: "",
    email: "",
    dob: "",
    gender: "Male",
    kitId: "",
    sampleDate: "",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // const nextErrors = {
  //   //   health: form.health.length === 0 ? "Please select at least one option." : "",
  //   //   diet: form.diet ? "" : "Please select your diet type.",
  //   //   eatingHabits: form.eatingHabits.length === 0 ? "Please select at least one eating habit." : "",
  //   // };
  //   // setErrors(nextErrors);
  //   // const hasError = Object.values(nextErrors).some((m) => m);
  //   // if (hasError) return;
  //   // Log full form data to console
  //   // Using JSON stringify for easy readability
  //   // eslint-disable-next-line no-console
  //   let kitIdValue = form.kitId;
  //   if (form.kitType === "FoodSensitivityMap") {
  //     kitIdValue = `T4-${form.kitId}-YGM`;
  //   }
  //   const formToLog = { ...form, kitId: kitIdValue };
  //   console.log("Form data:", JSON.parse(JSON.stringify(formToLog)));
  //   alert("Form submitted!");
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    let kitIdValue = formData.kitId;

    const payload = {
      ...formData,
      kitId: kitIdValue, // yahan modified value bhejein
    };

    try {
      setShowThankYou(true); // Show success modal
      const response = await submitKitForm(payload);
      // console.log(payload); // ab yahan sahi value dikhegi
      setFormData(initialFormState);

   
    } catch (err) {
      console.error("Form submit failed", err);
    }
  };



  return (
    <div className="new-microbiome-form-wrapper">
      <form className="new-microbiome-form" onSubmit={handleSubmit}>
        <div className="form-header-row">
          <h2>Register your kit</h2>
          <p className="main-heading">
            GutHealth<span>Lab</span>
          </p>
          {/* <img src="/logo512.png" alt="GutMapDx" className="logo-img" /> */}
        </div>
        <div className="fst-from">
          <div className="form-group name-group">
            <label>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group email-group">
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
            />
          </div>
          <div className="form-group dob-group">
            <label>Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="form-group weight-group">
            <label>Weight</label>
            <div className="row-flex">
              <select
                name="weightUnit"
                value={formData.weightUnit}
                onChange={handleChange}
                required
              >
                <option>KG</option>
                <option>LB</option>
              </select>
              <input
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight"
                required
              />
            </div>
          </div>
          <div className="form-group height-group">
            <label>Height</label>
            <div className="row-flex">
              <select
                name="heightUnit"
                value={formData.heightUnit}
                onChange={handleChange}
                required
              >
                <option>FT</option>
                <option>CM</option>
              </select>
              <input
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height"
                required
              />
            </div>
          </div> */}
          <div className="form-group gender-group">
            <label>Gender at Birth</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          {/* <div className="form-group country-group">
            <label>Country of Residence</label>
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="country"
              required
            />
          </div> */}
          {/* <div className="form-group kittype-group">
            <label>Kit Type</label>
            <select
              name="kitType"
              value={formData.kitType}
              onChange={handleChange}
              required
            >
           
              <option value="" selected disabled >Please Select KIT Type</option>
               {
                kitTypes?.map((value,index)=>{
                 if (oldkittypes.includes(value)) return null;
                  return (<option key={index} value={value}>{value}</option>)
                })
               }
            </select>
          </div> */}
          <div className="form-group kitid-group">
            <label>Kit ID</label>
            {formData.kitType === "FoodSensitivityMap" ? (
              <div className="kitid-composite">
                <span className="segment prefix">T4-</span>
                <input
                  name="kitId"
                  type="number"
                  value={formData.kitId}
                  onChange={handleChange}
                  placeholder="Kit-Code"
                  required
                  inputMode="numeric"
                />
                <span className="segment suffix">-YGM</span>
              </div>
            ) : (
              <input
                name="kitId"
                value={formData.kitId}
                onChange={handleChange}
                required
              />
            )}
          </div>
          <div className="form-group sampledate-group">
            <label>Sample Date</label>
            <input
              name="sampleDate"
              type="date"
              value={formData.sampleDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
       
    <button
              type="submit"
              className="submit-btn inline-submit"
              style={{ width: "100%" }}
            >
              Submit
            </button>
      </form>
      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Thank you for registering your kit!"
        message="You can now send your sample back to our laboratory following the directions in the instructions for use."
      />
  
    </div>
  );
}
