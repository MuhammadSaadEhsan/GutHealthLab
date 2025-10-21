import React, { useEffect, useState } from "react";
import "./NewMicrobiomeForm.full.css";
import axios from "axios";
import ThankYouModal from "../component/thankYouModal";

export default function NewMicrobiomeForm() {
  // State for all fields

  const [selected, setSelected] = useState([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [kitTypes, setKitTypes] = useState([]);

  const fetchKittypes = async () => {
    const response = await getkittypes();
    await setKitTypes(response.data.kitTypes);
    console.log(response.data.kitTypes);
  };
const oldkittypes = [
  'Microbiome',
  'MicrobiomePlus',
  'MicrobiomeAdvanced',
  'Parasitology Test',
  'Food Sensitivtiy 100',
  'Food Sensitivtiy 210'
]
  useEffect(() => {
    if (showThankYou) {
      setTimeout(() => {
        setShowThankYou(false);
      }, 5000);
    }
  }, [showThankYou]);

  useEffect(() => {
    fetchKittypes();
  }, []);

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

  const getkittypes = async (image) => {
    const portalid = "67c17d743394a458c944eec2";
    try {
      const config = configMaker("get", "getallkittypes", { portalid }, {});
      const response = await axios.request(config);
      return response;
    } catch (error) {
      console.error("Error submitting ticket:", error);
      throw error;
    }
  };

  const submitKitForm = async (data) => {
    const portalId = "67c17d743394a458c944eec2";
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

  const [healthConditions, setHealthConditions] = useState([
    {
      label: "Irritable Bowel Syndrome",
      icon: "/image53.svg",
      value: "irritable_bowel_syndrome",
      selected: false,
    },
    {
      label: "Inflammatory Bowel Disease",
      icon: "/image53.svg",
      value: "inflammatory_bowel_disease",
      selected: false,
    },
    {
      label: "Bloating / Gas issues",
      icon: "/image53.svg",
      value: "bloating_gas",
      selected: false,
    },
    {
      label: "I would like to lose weight",
      icon: "/image53.svg",
      value: "lose_weight",
      selected: false,
    },
    {
      label: "I would like to gain weight",
      icon: "/image53.svg",
      value: "gain_weight",
      selected: false,
    },
    {
      label: "Thyroid Conditions",
      icon: "/image53.svg",
      value: "thyroid",
      selected: false,
    },
    {
      label: "Heart / Cardiovascular problems",
      icon: "/image53.svg",
      value: "heart_problems",
      selected: false,
    },
    {
      label: "Skin Conditions",
      icon: "/image53.svg",
      value: "skin_conditions",
      selected: false,
    },
    {
      label: "Headaches / Migraines",
      icon: "/image53.svg",
      value: "migraines",
      selected: false,
    },
    {
      label: "Food Intolerances",
      icon: "/image53.svg",
      value: "food_intolerances",
      selected: false,
    },
    {
      label: "Arthritis",
      icon: "/image53.svg",
      value: "arthritis",
      selected: false,
    },
    {
      label: "Sleep Problems",
      icon: "/image53.svg",
      value: "sleep_problems",
      selected: false,
    },
    {
      label: "Diabetes",
      icon: "/image53.svg",
      value: "diabetes",
      selected: false,
    },
  ]);

  const [dietType, setDietType] = useState([
    {
      label: "Omnivore",
      icon: "/image53.svg",
      value: "omnivore",
      selected: false,
    },
    {
      label: "Vegetarian",
      icon: "/image53.svg",
      value: "vegetarian",
      selected: false,
    },
    { label: "Vegan", icon: "/image53.svg", value: "vegan", selected: false },
    {
      label: "Pescetarian",
      icon: "/image53.svg",
      value: "pescatarian",
      selected: false,
    },
  ]);
  const [eatingHabits, setEatingHabits] = useState([
    {
      label: "Intermittent Fasting",
      icon: "/image53.svg",
      value: "intermittent_fasting",
      selected: false,
    },
    {
      label: "High Protein",
      icon: "/image53.svg",
      value: "high_protein",
      selected: false,
    },
    {
      label: "Low Protein",
      icon: "/image53.svg",
      value: "low_protein",
      selected: false,
    },
    {
      label: "Ketogenic",
      icon: "/image53.svg",
      value: "ketogenic",
      selected: false,
    },
    {
      label: "High Carbohydrate",
      icon: "/image53.svg",
      value: "high_carb",
      selected: false,
    },
    {
      label: "Low Carbohydrate",
      icon: "/image53.svg",
      value: "low_carb",
      selected: false,
    },
  ]);
  const [antibioticTaken, setAntibioticTaken] = useState("yes");
  const kitTypeOptions = [
    "Microbiome",
    "Oral Microbiome",
    "Candida",
    "DNA",
    "FoodSensitivityMap",
    "PRA",
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
    health: [],
    diet: "",
    eatingHabits: [],
    antibiotics: false,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheck = (name, value) => {
    setFormData((prev) => {
      const arr = prev[name];
      return arr.includes(value)
        ? { ...prev, [name]: arr.filter((v) => v !== value) }
        : { ...prev, [name]: [...arr, value] };
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleRadio = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

    const nextErrors = {
      health:
        formData.health.length === 0
          ? "Please select at least one option."
          : "",
      diet: formData.diet ? "" : "Please select your diet type.",
      eatingHabits:
        formData.eatingHabits.length === 0
          ? "Please select at least one eating habit."
          : "",
    };
    let kitIdValue = formData.kitId;
    if (formData.kitType === "FoodSensitivityMap") {
      kitIdValue = `T4-${formData.kitId}-YGM`;
    }

    const payload = {
      ...formData,
      kitId: kitIdValue, // yahan modified value bhejein
      antibioticTaken,
      healthConditions: healthConditions
        .filter((h) => h.selected)
        .map((h) => h.value),
      dietType: dietType.filter((d) => d.selected).map((d) => d.value),
      eatingHabits: eatingHabits.filter((e) => e.selected).map((e) => e.value),
    };

    try {
      setShowThankYou(true); // Show success modal
      const response = await submitKitForm(payload);
      // console.log(payload); // ab yahan sahi value dikhegi
      setFormData(initialFormState);

      setHealthConditions([
        {
          label: "Irritable Bowel Syndrome",
          icon: "/image53.svg",
          value: "irritable_bowel_syndrome",
          selected: false,
        },
        {
          label: "Inflammatory Bowel Disease",
          icon: "/image53.svg",
          value: "inflammatory_bowel_disease",
          selected: false,
        },
        {
          label: "Bloating / Gas issues",
          icon: "/image53.svg",
          value: "bloating_gas",
          selected: false,
        },
        {
          label: "I would like to lose weight",
          icon: "/image53.svg",
          value: "lose_weight",
          selected: false,
        },
        {
          label: "I would like to gain weight",
          icon: "/image53.svg",
          value: "gain_weight",
          selected: false,
        },
        {
          label: "Thyroid Conditions",
          icon: "/image53.svg",
          value: "thyroid",
          selected: false,
        },
        {
          label: "Heart / Cardiovascular problems",
          icon: "/image53.svg",
          value: "heart_problems",
          selected: false,
        },
        {
          label: "Skin Conditions",
          icon: "/image53.svg",
          value: "skin_conditions",
          selected: false,
        },
        {
          label: "Headaches / Migraines",
          icon: "/image53.svg",
          value: "migraines",
          selected: false,
        },
        {
          label: "Food Intolerances",
          icon: "/image53.svg",
          value: "food_intolerances",
          selected: false,
        },
        {
          label: "Arthritis",
          icon: "/image53.svg",
          value: "arthritis",
          selected: false,
        },
        {
          label: "Sleep Problems",
          icon: "/image53.svg",
          value: "sleep_problems",
          selected: false,
        },
        {
          label: "Diabetes",
          icon: "/image53.svg",
          value: "diabetes",
          selected: false,
        },
      ]);
      setDietType([
        {
          label: "Omnivore",
          icon: "/image53.svg",
          value: "omnivore",
          selected: false,
        },
        {
          label: "Vegetarian",
          icon: "/image53.svg",
          value: "vegetarian",
          selected: false,
        },
        {
          label: "Vegan",
          icon: "/image53.svg",
          value: "vegan",
          selected: false,
        },
        {
          label: "Pescetarian",
          icon: "/image53.svg",
          value: "pescatarian",
          selected: false,
        },
      ]);
      setEatingHabits([
        {
          label: "Intermittent Fasting",
          icon: "/image53.svg",
          value: "intermittent_fasting",
          selected: false,
        },
        {
          label: "High Protein",
          icon: "/image53.svg",
          value: "high_protein",
          selected: false,
        },
        {
          label: "Low Protein",
          icon: "/image53.svg",
          value: "low_protein",
          selected: false,
        },
        {
          label: "Ketogenic",
          icon: "/image53.svg",
          value: "ketogenic",
          selected: false,
        },
        {
          label: "High Carbohydrate",
          icon: "/image53.svg",
          value: "high_carb",
          selected: false,
        },
        {
          label: "Low Carbohydrate",
          icon: "/image53.svg",
          value: "low_carb",
          selected: false,
        },
      ]);
    } catch (err) {
      console.error("Form submit failed", err);
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

          <div className="form-group weight-group">
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
          </div>
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
          <div className="form-group country-group">
            <label>Country of Residence</label>
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="country"
              required
            />
          </div>
          <div className="form-group kittype-group">
            <label>Kit Type</label>
            <select
              name="kitType"
              value={formData.kitType}
              onChange={handleChange}
              required
            >
              {/* <option value="" disabled hidden>
                Please Select KIT Type
              </option>
              {kitTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))} */}
              <option value="" selected disabled >Please Select KIT Type</option>
               {
                kitTypes?.map((value,index)=>{
                 if (oldkittypes.includes(value)) return null;
                  return (<option key={index} value={value}>{value}</option>)
                })
               }
            </select>
          </div>
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
        {formData.kitType !== "DNAMap Genetic Test" && (
          <>
            <div className="section">
              <label>
                Do you have any of the below health conditions or concerns?
              </label>
              {errors.health && (
                <div className="error-text">{errors.health}</div>
              )}
              <div className="checkbox-grid">
                {healthConditions.map((opt) => (
                  <PillToggle
                    key={opt.value}
                    checked={formData.health.includes(opt.value)}
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
                {dietType.map((opt) => (
                  <PillToggle
                    key={opt.value}
                    checked={formData.diet === opt.value}
                    onChange={() => handleRadio("diet", opt.value)}
                  >
                    {opt.label}
                  </PillToggle>
                ))}
              </div>
            </div>
            <div className="section">
              <label>Do you follow any of these eating habits?</label>
              {errors.eatingHabits && (
                <div className="error-text">{errors.eatingHabits}</div>
              )}
              <div className="button-group">
                {eatingHabits.map((opt) => (
                  <PillToggle
                    key={opt.value}
                    checked={formData.eatingHabits.includes(opt.value)}
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
                    className={
                      formData.antibiotics === true
                        ? "antibiotic-pill selected"
                        : "antibiotic-pill"
                    }
                    onClick={() => handleRadio("antibiotics", true)}
                    aria-pressed={formData.antibiotics === true}
                  >
                    <span>✅</span>
                    <span>Yes</span>
                  </button>
                  <button
                    type="button"
                    className={
                      formData.antibiotics === false
                        ? "antibiotic-pill selected no"
                        : "antibiotic-pill no"
                    }
                    onClick={() => handleRadio("antibiotics", false)}
                    aria-pressed={formData.antibiotics === false}
                  >
                    <span>❌</span>
                    <span>No</span>
                  </button>
                </div>
                <button type="submit" className="inline-submit">
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
        {formData.kitType === "DNAMap Genetic Test" && (
          <div
            className="submit-section full-width "
            style={{ marginTop: "60px", width: "auto" }}
          >
            <button
              type="submit"
              className="submit-btn inline-submit"
              style={{ width: "100%" }}
            >
              Submit
            </button>
          </div>
        )}
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
