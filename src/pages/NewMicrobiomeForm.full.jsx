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
    kitType: "",
    kitId: "",
    sampleDate: "",
    health: [],
    diet: "",
    eatingHabits: [],
    antibiotics: false, 
  });

 
  const [errors, setErrors] = useState({
    health: "",
    diet: "",
    eatingHabits: "",
    antibiotics: "",
  });


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
  const kitTypeOptions = [
    "Microbiome",
    "Oral Microbiome",
    "Candida",
    "DNA",
    "FoodSensitivityMap",
    "PRA",
  ];


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
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleRadio = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // const nextErrors = {
    //   health: form.health.length === 0 ? "Please select at least one option." : "",
    //   diet: form.diet ? "" : "Please select your diet type.",
    //   eatingHabits: form.eatingHabits.length === 0 ? "Please select at least one eating habit." : "",
    // };
    // setErrors(nextErrors);
    // const hasError = Object.values(nextErrors).some((m) => m);
    // if (hasError) return;
    // Log full form data to console
    // Using JSON stringify for easy readability
    // eslint-disable-next-line no-console
    let kitIdValue = form.kitId;
    if (form.kitType === "FoodSensitivityMap") {
      kitIdValue = `T4-${form.kitId}-YGM`;
    }
    const formToLog = { ...form, kitId: kitIdValue };
    console.log("Form data:", JSON.parse(JSON.stringify(formToLog)));
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
          <p className="main-heading">
          GutHealth<span>Lab</span>
        </p>
          {/* <img src="/logo512.png" alt="GutMapDx" className="logo-img" /> */}

        </div>
        <div className="form-grid">
          <div className="form-group name-group"><label>Name</label><input name="name" value={form.name} onChange={handleChange} required /></div>
          <div className="form-group email-group"><label>Email</label><input name="email" value={form.email} onChange={handleChange} type="email" required /></div>
          <div className="form-group dob-group"><label>Date of Birth</label><input name="dob" type="date" value={form.dob} onChange={handleChange} required /></div>
          

          <div className="form-group weight-group"><label>Weight</label><div className="row-flex"><select name="weightUnit" value={form.weightUnit} onChange={handleChange} required><option>KG</option><option>LB</option></select><input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight" required /></div></div>
          <div className="form-group height-group"><label>Height</label><div className="row-flex"><select name="heightUnit" value={form.heightUnit} onChange={handleChange} required><option>FT</option><option>CM</option></select><input name="height" value={form.height} onChange={handleChange} placeholder="Height" required /></div></div>
          <div className="form-group gender-group"><label>Gender at Birth</label><select name="gender" value={form.gender} onChange={handleChange} required><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div className="form-group country-group"><label>Country of Residence</label><input name="country" value={form.country} onChange={handleChange} placeholder="country" required /></div>
          <div className="form-group kittype-group"><label>Kit Type</label><select name="kitType" value={form.kitType} onChange={handleChange} required><option value="" disabled hidden>Please Select KIT Type</option>{kitTypeOptions.map((opt)=> (<option key={opt} value={opt}>{opt}</option>))}</select></div>
          <div className="form-group kitid-group"><label>Kit ID</label>{form.kitType === "FoodSensitivityMap" ? (
            <div className="kitid-composite">
              <span className="segment prefix">T4-</span>
            <input
              name="kitId"
              type="number"
              value={form.kitId}
              onChange={handleChange}
              placeholder="Kit-Code"
              required
             
              inputMode="numeric"
            />
              <span className="segment suffix">-YGM</span>
            </div>
          ) : (
            <input name="kitId" value={form.kitId} onChange={handleChange} required />
          )}</div>
          <div className="form-group sampledate-group"><label>Sample Date</label><input name="sampleDate" type="date" value={form.sampleDate} onChange={handleChange} required /></div>
        </div>
        <div className="section">
          <label>Do you have any of the below health conditions or concerns?</label>
          {errors.health && <div className="error-text">{errors.health}</div>}
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
          {errors.diet && <div className="error-text">{errors.diet}</div>}
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
          {errors.eatingHabits && <div className="error-text">{errors.eatingHabits}</div>}
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
