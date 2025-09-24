
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SampleReturnForm.css";
import Select from "react-select";

const initialFormState = {
  Name: "",
  lName: "",
  KitCodes: "",
  Email: "",
  Phone: "",
  Country: "",
  address: "",
  StreetAddress: "",
  Postal: "",
  countryOptions: [],
};

export default function SampleReturnForm() {
  const [form, setForm] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [btn, setBtn] = useState(true);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name');
        const sortedCountries = response.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setCountryOptions(
          sortedCountries.map((item) => ({ value: item.name.common, label: item.name.common }))
        );
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.Name.trim()) newErrors.Name = "First Name is required";
    if (!form.lName.trim()) newErrors.lName = "Last Name is required";
    if (!form.KitCodes.trim()) newErrors.KitCodes = "Kit Codes are required";
    if (!form.Email.trim()) newErrors.Email = "Email is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.Country.trim()) newErrors.Country = "Country is required";
    if (!form.Country || form.Country.trim() === "") newErrors.Country = "Country is required";
    if (!form.Phone.trim()) newErrors.Phone = "Phone is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (form.Country === "") {
      alert("Please Enter your Country");
      return;
    }

    setBtn(false);
    // If using antd: const hide = message.loading("Action in progress", 0);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded2 = new URLSearchParams();
    urlencoded2.append("Name", form.Name);
    urlencoded2.append("lName", form.lName);
    urlencoded2.append("KitCodes", form.KitCodes);
    urlencoded2.append("Email", form.Email);
    urlencoded2.append("Phone", form.Phone);
  urlencoded2.append("Country", form.Country);
    urlencoded2.append("StreetAddress", form.StreetAddress);
    urlencoded2.append("Postal", form.Postal);

    var requestOptions2 = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded2,
      redirect: 'follow'
    };
    
    await fetch("https://yourgutmap-food-sensitivity-423a2af84621.herokuapp.com/samplereturn-form", requestOptions2)
      .then(response => response.text())
      .then(result => {
        setForm(initialFormState);
        setTimeout(() => {
          // If using antd: hide(); message.success(result);
          alert(result);
        }, 2000);
        setSubmitted(true);
      })
      .catch(error => console.log('error', error));
    setBtn(true);
  };

  return (
    <div className="sample-return-form-wrapper">
      <form className="sample-return-form" onSubmit={handleSubmit}>
        <h2>International Sample Return Form</h2>
        <label>
          First Name<span className="required"></span>
          <input type="text" name="Name" value={form.Name} onChange={handleChange} placeholder="First Name" />
          {errors.Name && <div className="error">{errors.Name}</div>}
        </label>
        <label>
          Last Name<span className="required"></span>
          <input type="text" name="lName" value={form.lName} onChange={handleChange} placeholder="Last Name" />
          {errors.lName && <div className="error">{errors.lName}</div>}
        </label>
        <label>
          Kit Code(s)<span className="required"></span>
          <textarea name="KitCodes" value={form.KitCodes} onChange={handleChange} placeholder="Kit Codes" rows={2} />
          {errors.KitCodes && <div className="error">{errors.KitCodes}</div>}
        </label>
        <label>
          Your Email<span className="required"></span>
          <input type="email" name="Email" value={form.Email} onChange={handleChange} placeholder="Email" />
          {errors.Email && <div className="error">{errors.Email}</div>}
        </label>
        <label>
          Your Address<span className="required"></span>
          <textarea name="address" value={form.address} onChange={handleChange} placeholder="Address" rows={2} />
          {errors.address && <div className="error">{errors.address}</div>}
        </label>
        <label>
          Street Address
          <input type="text" name="StreetAddress" value={form.StreetAddress} onChange={handleChange} placeholder="Street Address" />
        </label>
        <label>
          Country<span className="required"></span>
          <input
            type="text"
            name="Country"
            value={form.Country}
            onChange={handleChange}
            list="country-list"
            placeholder="Type country"
            autoComplete="off"
          />
          <datalist id="country-list">
            {countries.map((item, idx) => (
              <option key={idx} value={item.name.common} />
            ))}
          </datalist>
          {errors.Country && <div className="error">{errors.Country}</div>}
        </label>
        <label>
          Postal / ZIP code<span className="required"></span>
          <input type="text" name="Postal" value={form.Postal} onChange={handleChange} placeholder="Postal / ZIP code" />
          {errors.Postal && <div className="error">{errors.Postal}</div>}
        </label>
        <label>
          Contact telephone number<span className="required"></span> (include international dialing code)
          <input type="text" name="Phone" value={form.Phone} onChange={handleChange} placeholder="Phone" />
          {errors.Phone && <div className="error">{errors.Phone}</div>}
        </label>
        <div className="info-note">
          Once the form has been completed, we will email you to arrange the pick up at a convenient time and location
        </div>
        <button type="submit">SEND</button>
        {submitted && <div className="success">Sample return submitted successfully!</div>}
      </form>
    </div>
  );
}
