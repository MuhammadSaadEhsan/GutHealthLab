import React, { useEffect, useState } from "react";
import "../pages/CSS/microbiomeForm.css";
import "../component/CSS/kitTable.css";
import ThankYouModal from "../component/thankYouModal";
// import { submitKitForm } from "../API/api";

const MicrobiomeForm = () => {
  const [selected, setSelected] = useState([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
    if (showThankYou) {
      setTimeout(() => {
        setShowThankYou(false);
      }, 5000);
    }
  }, [showThankYou]);

  const [healthConditions, setHealthConditions] = useState([
    { label: "Irritable Bowel Syndrome", icon: "/image53.svg", value: "irritable_bowel_syndrome", selected: false },
    { label: "Inflammatory Bowel Disease", icon: "/image53.svg", value: "inflammatory_bowel_disease", selected: false },
    { label: "Bloating / Gas issues", icon: "/image53.svg", value: "bloating_gas", selected: false },
    { label: "I would like to lose weight", icon: "/image53.svg", value: "lose_weight", selected: false },
    { label: "I would like to gain weight", icon: "/image53.svg", value: "gain_weight", selected: false },
    { label: "Thyroid Conditions", icon: "/image53.svg", value: "thyroid", selected: false },
    { label: "Heart / Cardiovascular problems", icon: "/image53.svg", value: "heart_problems", selected: false },
    { label: "Skin Conditions", icon: "/image53.svg", value: "skin_conditions", selected: false },
    { label: "Headaches / Migraines", icon: "/image53.svg", value: "migraines", selected: false },
    { label: "Food Intolerances", icon: "/image53.svg", value: "food_intolerances", selected: false },
    { label: "Arthritis", icon: "/image53.svg", value: "arthritis", selected: false },
    { label: "Sleep Problems", icon: "/image53.svg", value: "sleep_problems", selected: false },
    { label: "Diabetes", icon: "/image53.svg", value: "diabetes", selected: false },
  ]);

  const [dietType, setDietType] = useState([
    { label: "Omnivore", icon: "/image53.svg", value: "omnivore", selected: false },
    { label: "Vegetarian", icon: "/image53.svg", value: "vegetarian", selected: false },
    { label: "Vegan", icon: "/image53.svg", value: "vegan", selected: false },
    { label: "Pescetarian", icon: "/image53.svg", value: "pescatarian", selected: false },
  ]);

  const [eatingHabits, setEatingHabits] = useState([
    { label: "Intermittent Fasting", icon: "/image53.svg", value: "intermittent_fasting", selected: false },
    { label: "High Protein", icon: "/image53.svg", value: "high_protein", selected: false },
    { label: "Low Protein", icon: "/image53.svg", value: "low_protein", selected: false },
    { label: "Ketogenic", icon: "/image53.svg", value: "ketogenic", selected: false },
    { label: "High Carbohydrate", icon: "/image53.svg", value: "high_carb", selected: false },
    { label: "Low Carbohydrate", icon: "/image53.svg", value: "low_carb", selected: false },
  ]);
  const [antibioticTaken, setAntibioticTaken] = useState("yes");

  const toggleSelect = (value) => {
    setHealthConditions((prev) =>
      prev.map((item) =>
        item.value === value ? { ...item, selected: !item.selected } : item
      )
    );
  };
  const toggleDiet = (value) => {
    setDietType((prev) =>
      prev.map((item) =>
        item.value === value ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleEatingHabit = (value) => {
    setEatingHabits(prev =>
      prev.map(item =>
        item.value === value ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const initialFormState = {
    name: "",
    email: "",
    dob: "",
    weight: "",
    weightUnit: "kg",
    height: "",
    heightUnit: "ft",
    gender: "male",
    country: "",
    kitId: "",
    sampleDate: "",
  }

  const [formData, setFormData] = useState(initialFormState);
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email.trim())) newErrors.email = "Enter a valid email";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.weight.trim()) newErrors.weight = "Weight is required";
    else if (Number.isNaN(Number(formData.weight))) newErrors.weight = "Weight must be a number";
    if (!formData.height.trim()) newErrors.height = "Height is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.kitId.trim()) newErrors.kitId = "Kit ID is required";
    if (!formData.sampleDate) newErrors.sampleDate = "Sample date is required";

    const selectedHealthConditions = healthConditions.filter(h => h.selected);
    const selectedDiet = dietType.filter(d => d.selected);
    const selectedEating = eatingHabits.filter(e => e.selected);
    if (selectedHealthConditions.length === 0) newErrors.healthConditions = "Select at least one health condition";
    if (selectedDiet.length === 0) newErrors.dietType = "Select at least one diet type";
    if (selectedEating.length === 0) newErrors.eatingHabits = "Select at least one eating habit";

    if (!["yes", "no"].includes(antibioticTaken)) newErrors.antibioticTaken = "Please choose Yes or No";

    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      ...formData,
      antibioticTaken,
      healthConditions: healthConditions.filter(h => h.selected).map(h => h.value),
      dietType: dietType.filter(d => d.selected).map(d => d.value),
      eatingHabits: eatingHabits.filter(e => e.selected).map(e => e.value),
    };

    try {
      setShowThankYou(true);  // Show success modal
      const response = await submitKitForm(payload);  // Call your API function
   setFormData(initialFormState)
   setHealthConditions([
    { label: "Irritable Bowel Syndrome", icon: "/image53.svg", value: "irritable_bowel_syndrome", selected: false },
    { label: "Inflammatory Bowel Disease", icon: "/image53.svg", value: "inflammatory_bowel_disease", selected: false },
    { label: "Bloating / Gas issues", icon: "/image53.svg", value: "bloating_gas", selected: false },
    { label: "I would like to lose weight", icon: "/image53.svg", value: "lose_weight", selected: false },
    { label: "I would like to gain weight", icon: "/image53.svg", value: "gain_weight", selected: false },
    { label: "Thyroid Conditions", icon: "/image53.svg", value: "thyroid", selected: false },
    { label: "Heart / Cardiovascular problems", icon: "/image53.svg", value: "heart_problems", selected: false },
    { label: "Skin Conditions", icon: "/image53.svg", value: "skin_conditions", selected: false },
    { label: "Headaches / Migraines", icon: "/image53.svg", value: "migraines", selected: false },
    { label: "Food Intolerances", icon: "/image53.svg", value: "food_intolerances", selected: false },
    { label: "Arthritis", icon: "/image53.svg", value: "arthritis", selected: false },
    { label: "Sleep Problems", icon: "/image53.svg", value: "sleep_problems", selected: false },
    { label: "Diabetes", icon: "/image53.svg", value: "diabetes", selected: false },
  ])
  setDietType([
    { label: "Omnivore", icon: "/image53.svg", value: "omnivore", selected: false },
    { label: "Vegetarian", icon: "/image53.svg", value: "vegetarian", selected: false },
    { label: "Vegan", icon: "/image53.svg", value: "vegan", selected: false },
    { label: "Pescetarian", icon: "/image53.svg", value: "pescatarian", selected: false },
  ])
  setEatingHabits([
    { label: "Intermittent Fasting", icon: "/image53.svg", value: "intermittent_fasting", selected: false },
    { label: "High Protein", icon: "/image53.svg", value: "high_protein", selected: false },
    { label: "Low Protein", icon: "/image53.svg", value: "low_protein", selected: false },
    { label: "Ketogenic", icon: "/image53.svg", value: "ketogenic", selected: false },
    { label: "High Carbohydrate", icon: "/image53.svg", value: "high_carb", selected: false },
    { label: "Low Carbohydrate", icon: "/image53.svg", value: "low_carb", selected: false },
  ])
    } catch (err) {
      console.error("Form submit failed", err);
    }
  };


  return (
    <div className="microbiome-form-wrapper">
      <div className="microbiome-form">
        <div className="form-header">
          <div className="form-header-item extra"></div>
          <div className="form-header-item form-heading">
            {/* <h2 className="heading">GI Axis Form</h2> */}
            <h2 className="heading">Register your kit</h2>
          </div>
          <div className="form-header-item logo-item">
            <img src="/GutMapDxLogo.png" alt="GutMapDx Logo" />
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {/* First Row */}
          <label className="mylabel">
            Name
            <input type="text" name="name" className="myInput" placeholder=""
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {isSubmitted && errors.name && (
              <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.name}</div>
            )}
          </label>

          <label className="mylabel">
            Email
            <input type="email" name="email" placeholder=""
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            {isSubmitted && errors.email && (
              <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.email}</div>
            )}
          </label>

          <label className="mylabel">
            Date of Birth
            <input type="date" name="dob"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
            {isSubmitted && errors.dob && (
              <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.dob}</div>
            )}
          </label>

          {/* Second Row */}
          <div className="input-container height-weight">
            <label className="mylabel second-row-label">
              Weight
              <div className="input-select-wrapper">
                <select name="weightUnit" value={formData.weightUnit} onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}>
                  <option value="kg">KG</option>
                  <option value="g">Gram</option>{" "}
                  
                </select>

                <input
                  className="second-row-input"
                  type="text"
                  name="weight"
                  placeholder="Weight"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              {isSubmitted && errors.weight && (
                <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.weight}</div>
              )}
            </label>
            <label className="mylabel">
              Height
              <div className="input-select-wrapper">
                <select name="heightUnit" value={formData.heightUnit} onChange={(e) => setFormData({ ...formData, heightUnit: e.target.value })}>
                  <option value="ft">FT</option>
                  <option value="inch">inch</option>
                </select>
                <input
                  className="second-row-input"
                  type="text"
                  name="height"
                  placeholder="Height"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              {isSubmitted && errors.height && (
                <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.height}</div>
              )}
            </label>
          </div>

          <div className="input-container">
            <label className="mylabel short-label">
              Gender at Birth
              <select name="gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                {/* <option value="" disabled>Select</option> */}
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>

            {/* Third Row */}
            {/* <label className='mylabel'>
            Country of Residence
            <input type="text" name="country" placeholder="e.g. Germany" />
          </label> */}
            <label className="mylabel short-label">
              Country of Residence
              <input list="countries" name="country" placeholder="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              <datalist id="countries">
                <option value="Germany" />
                <option value="United Kingdom" />
                <option value="United States" />
                <option value="Canada" />
                <option value="Australia" />
                <option value="Pakistan" />
                <option value="India" />
                <option value="France" />
                <option value="Netherlands" />
                <option value="Other" />
              </datalist>
              {isSubmitted && errors.country && (
                <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.country}</div>
              )}
            </label>
          </div>

          <div className="input-container">
            <label className="mylabel short-label">
              Kit ID
              <input type="text" name="kitId" placeholder=""
                value={formData.kitId}
                onChange={(e) => setFormData({ ...formData, kitId: e.target.value })} />
              {isSubmitted && errors.kitId && (
                <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.kitId}</div>
              )}
            </label>

            <label className="mylabel short-label">
              Sample Date
              <input type="date" name="sampleDate" placeholder=""
                value={formData.sampleDate}
                onChange={(e) => setFormData({ ...formData, sampleDate: e.target.value })} />
              {isSubmitted && errors.sampleDate && (
                <div style={{ color: "#c62828", fontSize: "12px", marginTop: "4px" }}>{errors.sampleDate}</div>
              )}
            </label>
          </div>

          {/* Health Conditions */}
          <div className="section full-width">
            <label>
              Do you have any of the below health conditions or concerns?
            </label>

            <div className="checkbox-grid">

              {healthConditions.map((condition, index) => (
                <label
                  key={index}
                  className="checkbox-item custom-checkbox"
                  style={{
                    backgroundColor: condition.selected ? "#726BEA" : "#EEE4FF",
                    color: condition.selected ? "white" : "black",
                  }}
                >
                  <img
                    src={`/microbiomeFormIcons/${condition.label.replace(/\//g, "").trim()}${condition.selected ? 2 : 1}.svg`}
                    alt=""
                  />
                  <div className="checkbox-label-text">{condition.label}</div>

                  <input
                    type="checkbox"
                    className="checkinput2"
                    name="healthConditions"
                    value={condition.value}
                    checked={condition.selected}
                    onChange={() => toggleSelect(condition.value)}
                  />
                  <span className="checkmark"></span>
                </label>

              ))}
            </div>
            {isSubmitted && errors.healthConditions && (
              <div style={{ color: "#c62828", fontSize: "12px", marginTop: "6px" }}>{errors.healthConditions}</div>
            )}
          </div>

          {/* Diet Type */}
          <div className="section full-width">
            <label>What best describes your diet type?</label>
            <div className="button-group">
              {dietType.map((condition, index) => (
                <label
                  key={index}
                  className="checkbox-item custom-checkbox"
                  style={{
                    backgroundColor: condition.selected ? "#726BEA" : "#EEE4FF",
                    color: condition.selected ? "white" : "black",
                  }}
                >
                  <img src={`/microbiomeFormIcons/${condition.label}${condition.selected ? 2 : 1}.svg`} alt="" />
                  {condition.label}
                  <input
                    type="checkbox"
                    className="checkinput2"
                    name="healthConditions"
                    value={condition.value}
                    checked={condition.selected}
                    onChange={() => toggleDiet(condition.value)}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
            {isSubmitted && errors.dietType && (
              <div style={{ color: "#c62828", fontSize: "12px", marginTop: "6px" }}>{errors.dietType}</div>
            )}
          </div>
          {/* Eating Habits */}
          <div className="section full-width">
            <label>Do you follow any of these eating habits?</label>
            <div className="button-group">
              {eatingHabits.map((condition, index) => (
                <label
                  key={index}
                  className="checkbox-item custom-checkbox"
                  style={{
                    backgroundColor: condition.selected ? "#726BEA" : "#EEE4FF",
                    color: condition.selected ? "white" : "black",
                  }}
                >
                  <img width={condition.label.includes('Ketogenic') || condition.label.includes('Low Carbohydrate') ? '20px' : ""} src={`/microbiomeFormIcons/${condition.label}${condition.selected ? 2 : 1}.svg`} alt="" />
                  {condition.label}
                  <input
                    type="checkbox"
                    className="checkinput2"
                    name="healthConditions"
                    value={condition.value}
                    checked={condition.selected}
                    onChange={() => toggleEatingHabit(condition.value)}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
            {isSubmitted && errors.eatingHabits && (
              <div style={{ color: "#c62828", fontSize: "12px", marginTop: "6px" }}>{errors.eatingHabits}</div>
            )}
          </div>


          <div className="section full-width">
            <label>Have you taken antibiotics in the last 12 months?</label>
            <div className="last-row">
              <div className="antibiotic-toggle">
                <button
                  type="button"
                  className={antibioticTaken === "yes" ? "antibiotic-btn selected" : "antibiotic-btn"}
                  onClick={() => setAntibioticTaken("yes")}
                >
                  ✅ Yes
                </button>
                <button
                  type="button"
                  className={antibioticTaken === "no" ? "antibiotic-btn selected no" : "antibiotic-btn no"}
                  onClick={() => setAntibioticTaken("no")}
                >
                  ❌ No
                </button>
              </div>
              <div className="submit-section full-width">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </div>
            {isSubmitted && errors.antibioticTaken && (
              <div style={{ color: "#c62828", fontSize: "12px", marginTop: "6px" }}>{errors.antibioticTaken}</div>
            )}
          </div>


          {/* Submit */}
        </form>
        <ThankYouModal
          isOpen={showThankYou}
          onClose={() => setShowThankYou(false)}
          title="Thank you for registering your kit!"
          message="You can now send your sample back to our laboratory following the directions in the instructions for use."
        />
      </div>
    </div>
  );
};

export default MicrobiomeForm;
