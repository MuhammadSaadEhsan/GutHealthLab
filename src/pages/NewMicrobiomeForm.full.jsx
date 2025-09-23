import React, { useState } from "react";
import "./NewMicrobiomeForm.full.css";

const healthOptions = [
  { label: "Irritable Bowel Syndrome", value: "irritable_bowel_syndrome" },
  { label: "Inflammatory Bowel Disease", value: "inflammatory_bowel_disease" },
  { label: "Bloating / Gas issues", value: "bloating_gas" },
  { label: "I would like to lose weight", value: "lose_weight" },
  { label: "I would like to gain weight", value: "gain_weight" },
  { label: "Thyroid Conditions", value: "thyroid" },
  { label: "Heart / Cardiovascular problems", value: "heart_problems" },
  { label: "Skin Conditions", value: "skin_conditions" },
  { label: "Headaches / Migraines", value: "migraines" },
  { label: "Food Intolerances", value: "food_intolerances" },
  { label: "Arthritis", value: "arthritis" },
  { label: "Sleep Problems", value: "sleep_problems" },
  { label: "Diabetes", value: "diabetes" },
];
const dietOptions = [
  { label: "Omnivore", value: "omnivore" },
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Pescatarian", value: "pescatarian" },
];
const eatingOptions = [
  { label: "Intermittent Fasting", value: "intermittent_fasting" },
  { label: "High Protein", value: "high_protein" },
  { label: "Low Protein", value: "low_protein" },
  { label: "Ketogenic", value: "ketogenic" },
  { label: "High Carbohydrate", value: "high_carb" },
  { label: "Low Carbohydrate", value: "low_carb" },
];
const kitTypeOptions = [
  "CandidaProfile",
  "DNAmap ADHD",
  "DNAMap Genetic Test",
  "Food Sensitivity Junior Panel",
  "FoodSensitivityMap",
  "GI Axis",
  "GI Axis Advanced",
  "GI Axis Microbial Screen",
  "Orla Microbiome",
];

const initialFormState = {
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
};

export default function NewMicrobiomeForm() {
  const [form, setForm] = useState(initialFormState);
  const [health, setHealth] = useState(healthOptions.map(opt => ({ ...opt, selected: false })));
  const [diet, setDiet] = useState(dietOptions.map(opt => ({ ...opt, selected: false })));
  const [eatingHabits, setEatingHabits] = useState(eatingOptions.map(opt => ({ ...opt, selected: false })));
  const [antibioticTaken, setAntibioticTaken] = useState("no");
  const [errors, setErrors] = useState({});

  const handleCheck = (type, value) => {
    if (type === "health") {
      setHealth(prev => prev.map(opt => opt.value === value ? { ...opt, selected: !opt.selected } : opt));
    } else if (type === "eatingHabits") {
      setEatingHabits(prev => prev.map(opt => opt.value === value ? { ...opt, selected: !opt.selected } : opt));
    }
  };
  const handleRadio = (type, value) => {
    if (type === "diet") {
      setDiet(prev => prev.map(opt => ({ ...opt, selected: opt.value === value })));
    } else if (type === "antibioticTaken") {
      setAntibioticTaken(value);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.kitId || !form.name || !form.email) {
      setErrors(prev => ({ ...prev, form: "Kit ID, Name, and Email are required." }));
      return;
    }
    // Kit ID formatting for FoodSensitivityMap
    let kitId = form.kitId;
    if (form.kitType === "FoodSensitivityMap") {
      kitId = `T4-${form.kitId.replace(/^T4-/, '').replace(/-YGM$/, '')}-YGM`;
    }
    const payload = {
      ...form,
      kitId: kitId.toUpperCase().trim(),
      healthConditions: health.filter(h => h.selected).map(h => h.value),
      dietType: diet.filter(d => d.selected).map(d => d.value),
      eatingHabits: eatingHabits.filter(e => e.selected).map(e => e.value),
      antibioticTaken,
    };
    console.log("Submitting payload:", payload);
    try {
      const response = await fetch("https://api.yourgutmap.co.uk/submitkitform?portalId=67c17d743394a458c944eec2&id=6548f3f51f9aca26d81e0aea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        alert(data.message || "Submission failed.");
      }
    } catch (error) {
      alert("Error submitting form: " + error.message);
    }
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
                type="text"
                value={form.kitId.replace(/^T4-/, '').replace(/-YGM$/, '')}
                onChange={e => setForm(prev => ({ ...prev, kitId: e.target.value }))}
                placeholder="Kit-Code"
                required
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
            {health.map((opt) => (
              <PillToggle
                key={opt.value}
                checked={opt.selected}
                onChange={() => handleCheck("health", opt.value)}
              >
                {opt.label}
              </PillToggle>
            ))}
          </div>
        </div>
        <div className="section">
          <label>What best describes your diet type?</label>
          {errors.diet && <div className="error-text">{errors.diet}</div>}
          <div className="button-group">
            {diet.map((opt) => (
              <PillToggle
                key={opt.value}
                checked={opt.selected}
                onChange={() => handleRadio("diet", opt.value)}
              >
                {opt.label}
              </PillToggle>
            ))}
          </div>
        </div>
        <div className="section">
          <label>Do you follow any of these eating habits?</label>
          {errors.eatingHabits && <div className="error-text">{errors.eatingHabits}</div>}
          <div className="button-group">
            {eatingHabits.map((opt) => (
              <PillToggle
                key={opt.value}
                checked={opt.selected}
                onChange={() => handleCheck("eatingHabits", opt.value)}
              >
                {opt.label}
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
                className={antibioticTaken === "yes" ? "antibiotic-pill selected" : "antibiotic-pill"}
                onClick={() => handleRadio("antibioticTaken", "yes")}
                aria-pressed={antibioticTaken === "yes"}
              >
                <span>✅</span>
                <span>Yes</span>
              </button>
              <button
                type="button"
                className={antibioticTaken === "no" ? "antibiotic-pill selected no" : "antibiotic-pill no"}
                onClick={() => handleRadio("antibioticTaken", "no")}
                aria-pressed={antibioticTaken === "no"}
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
