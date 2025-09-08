import React, { useState } from "react";
import "./NewMicrobiomeForm.full.css";

export default function NewMicrobiomeForm() {
  // State for all fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    weight: "",
    weightUnit: "KG",
    height: "",
    heightUnit: "FT",
    gender: "Male",
    country: "",
    kitId: "",
    sampleDate: "",
    health: [],
    diet: "",
    eatingHabits: [],
    antibiotics: null,
  });

  // Options
  const healthOptions = [
    "Irritable Bowel Syndrome",
    "Inflammatory Bowel Disease",
    "Bloating / Gas issues",
    "I would like to lose weight",
    "I would like to gain weight",
    "Thyroid Conditions",
    "Heart / Cardiovascular problems",
    "Skin Conditions",
    "Headaches / Migraines",
    "Food Intolerances",
    "Arthritis",
    "Sleep Problems",
    "Diabetes",
  ];
  const dietOptions = [
    "Omnivore",
    "Vegetarian",
    "Vegan",
    "Pescatarian",
  ];
  const eatingOptions = [
    "Intermittent Fasting",
    "High Protein",
    "Low Protein",
    "Ketogenic",
    "High Carbohydrate",
    "Low Carbohydrate",
  ];

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheck = (name, value) => {
    setForm((prev) => {
      const arr = prev[name];
      return arr.includes(value)
        ? { ...prev, [name]: arr.filter((v) => v !== value) }
        : { ...prev, [name]: [...arr, value] };
    });
  };
  const handleRadio = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted!");
  };

  const PillToggle = ({ checked, onChange, children }) => (
    <button
      type="button"
      className={checked ? "pill-toggle selected" : "pill-toggle"}
      onClick={onChange}
      aria-pressed={checked}
    >
      <span className="pill-label">{children}</span>
      <span className={checked ? "switch on" : "switch"} />
    </button>
  );

  return (
    <div className="new-microbiome-form-wrapper">
      <form className="new-microbiome-form" onSubmit={handleSubmit}>
        <div className="form-header-row">
          <h2>Register your kit</h2>
          {/* <img src="/logo512.png" alt="GutMapDx" className="logo-img" /> */}
        </div>
        <div className="form-grid">
          <div className="form-group name-group"><label>Name</label><input name="name" value={form.name} onChange={handleChange} /></div>
          <div className="form-group email-group"><label>Email</label><input name="email" value={form.email} onChange={handleChange} /></div>
          <div className="form-group dob-group"><label>Date of Birth</label><input name="dob" type="date" value={form.dob} onChange={handleChange} /></div>

          <div className="form-group weight-group"><label>Weight</label><div className="row-flex"><select name="weightUnit" value={form.weightUnit} onChange={handleChange}><option>KG</option><option>LB</option></select><input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight" /></div></div>
          <div className="form-group height-group"><label>Height</label><div className="row-flex"><select name="heightUnit" value={form.heightUnit} onChange={handleChange}><option>FT</option><option>CM</option></select><input name="height" value={form.height} onChange={handleChange} placeholder="Height" /></div></div>
          <div className="form-group gender-group"><label>Gender at Birth</label><select name="gender" value={form.gender} onChange={handleChange}><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div className="form-group country-group"><label>Country of Residence</label><input name="country" value={form.country} onChange={handleChange} placeholder="country" /></div>
          <div className="form-group kitid-group"><label>Kit ID</label><input name="kitId" value={form.kitId} onChange={handleChange} /></div>
          <div className="form-group sampledate-group"><label>Sample Date</label><input name="sampleDate" type="date" value={form.sampleDate} onChange={handleChange} /></div>
        </div>
        <div className="section">
          <label>Do you have any of the below health conditions or concerns?</label>
          <div className="checkbox-grid">
            {healthOptions.map((opt) => (
              <PillToggle
                key={opt}
                checked={form.health.includes(opt)}
                onChange={() => handleCheck("health", opt)}
              >
                {opt}
              </PillToggle>
            ))}
          </div>
        </div>
        <div className="section">
          <label>What best describes your diet type?</label>
          <div className="button-group">
            {dietOptions.map((opt) => (
              <PillToggle
                key={opt}
                checked={form.diet === opt}
                onChange={() => handleRadio("diet", opt)}
              >
                {opt}
              </PillToggle>
            ))}
          </div>
        </div>
        <div className="section">
          <label>Do you follow any of these eating habits?</label>
          <div className="button-group">
            {eatingOptions.map((opt) => (
              <PillToggle
                key={opt}
                checked={form.eatingHabits.includes(opt)}
                onChange={() => handleCheck("eatingHabits", opt)}
              >
                {opt}
              </PillToggle>
            ))}
          </div>
        </div>
        <div className="section">
          <label>Have you taken antibiotics in the last 12 months?</label>
          <div className="antibiotic-row">
            <div className="antibiotic-toggle">
              <button
                type="button"
                className={form.antibiotics === true ? "antibiotic-pill selected" : "antibiotic-pill"}
                onClick={() => handleRadio("antibiotics", true)}
                aria-pressed={form.antibiotics === true}
              >
                <span>✅</span>
                <span>Yes</span>
              </button>
              <button
                type="button"
                className={form.antibiotics === false ? "antibiotic-pill selected no" : "antibiotic-pill no"}
                onClick={() => handleRadio("antibiotics", false)}
                aria-pressed={form.antibiotics === false}
              >
                <span>❌</span>
                <span>No</span>
              </button>
            </div>
            <button type="submit" className="inline-submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}
