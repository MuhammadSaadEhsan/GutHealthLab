import { message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Home from "../Components/home";
import Thankyou from "./thankyou";

function Form() {
  const link = useNavigate();
    const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    kitId: "",
    name: "",
    namel: "",
    email: "",
  });

  const [form, setform] = useState(false);

  const [formDatafield, setformDatafield] = useState([]);

  // Handle input changes
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const hide = message.loading("Action in progress", 0);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("KITID", formData.kitId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    // await fetch("https://yourgutmap-food-sensitivity-423a2af84621.herokuapp.com/pataintformdatasearch", requestOptions)
    await fetch(
      `${process.env.REACT_APP_API_URL}/pataintformdatasearch`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result === "Error") {
          setTimeout(() => {
            hide(); // Call hide to stop the loading message
            message.error("Please Enter the Correct KIT Code");
          }, 2000);
        } else {
          setformDatafield(result);
          // console.log(result)
          setform(true);

          setTimeout(() => {
            hide(); // Call hide to stop the loading message
            message.success("Action completed successfully");
          }, 2000);
        }
      })
      .catch((error) => console.error(error));
  };

  const [formValues, setFormValues] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true)
    const hide = message.loading("Action in progress", 0);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();

    urlencoded.append("kitID", formData.kitId);
    urlencoded.append("name", formData.name);
    urlencoded.append("namel", formData.namel);
    urlencoded.append("email", formData.email);

    urlencoded.append(
      "antibioticsUsageInTheLastSixMonths",
      formValues["antibiotics-usage-in-the-last-six-months"]
    );
    urlencoded.append(
      "artificialSweeteners",
      formValues["artificial-sweeteners"]
    );
    urlencoded.append("birthMode", formValues["birth-mode"]);
    urlencoded.append("birthdate", formValues["birthdate"]);
    urlencoded.append(
      "bowelActivityFrequencyOfGoingToTheToilet",
      formValues["bowel-activity-frequency-of-going-to-the-toilet"]
    );
    urlencoded.append(
      "chronicBowelProblem",
      formValues["chronic-bowel-problem"]
    );
    urlencoded.append("ciltProbleminiz", formValues["cilt-probleminiz"]);
    urlencoded.append("countryOfResidence", formValues["country-of-residence"]);
    urlencoded.append("diabetesType", formValues["diabetes-type"]);
    urlencoded.append(
      "diagnosedWithCancer",
      formValues["diagnosed-with-cancer"]
    );
    urlencoded.append("gender", formValues["gender"]);
    urlencoded.append(
      "haveYouBeenDiagnosedWithCeliac",
      formValues["have-you-been-diagnosed-with-celiac"]
    );
    urlencoded.append("havingDiabetes", formValues["having-diabetes"]);
    urlencoded.append(
      "havingGlutenSensitivity",
      formValues["having-gluten-sensitivity"]
    );
    urlencoded.append("havingHeartDisease", formValues["having-heart-disease"]);
    urlencoded.append(
      "havingKidneyDisease",
      formValues["having-kidney-disease"]
    );
    urlencoded.append(
      "havingLactoseIntolerance",
      formValues["having-lactose-intolerance"]
    );
    urlencoded.append("havingLiverDisease", formValues["having-liver-disease"]);
    urlencoded.append("havingLungDisease", formValues["having-lung-disease"]);
    urlencoded.append("havingMigraine", formValues["having-migraine"]);
    urlencoded.append(
      "havingThyroidDisease",
      formValues["having-thyroid-disease"]
    );
    urlencoded.append("height", formValues["height"]);
    urlencoded.append("heightUnit", formValues["height-unit"]);
    urlencoded.append(
      "hoursOfSleepPerDay",
      formValues["hours-of-sleep-per-day"]
    );
    urlencoded.append(
      "howManyTimesDoYouGoToTheToilet",
      formValues["how-many-times-do-you-go-to-the-toilet"]
    );
    urlencoded.append("ibdType", formValues["ibd-type"]);
    urlencoded.append(
      "inflammatoryBowelDiseaseIBD",
      formValues["inflammatory-bowel-disease-ibd"]
    );
    urlencoded.append(
      "irritableBowelSyndromeIBS",
      formValues["irritable-bowel-syndrome-ibs"]
    );
    urlencoded.append(
      "lactoseToleranceTestUsed",
      formValues["lactose-tolerance-test-used"]
    );
    urlencoded.append(
      "livingAloneInYourLivingSpaceResidence",
      formValues["living-alone-in-your-living-space-residence"]
    );
    urlencoded.append(
      "probioticSupplementsUsage",
      formValues["probiotic-supplements-usage"]
    );
    urlencoded.append("skinProblem", formValues["skin-problem"]);
    urlencoded.append("smoking", formValues["smoking"]);
    urlencoded.append("suitableDiet", formValues["suitable-diet"]);
    urlencoded.append(
      "typeOfBowelProblem",
      formValues["type-of-bowel-problem"]
    );
    urlencoded.append("usingAlcohol", formValues["using-alcohol"]);
    urlencoded.append(
      "vitaminMultivitaminSupplementsUsage",
      formValues["vitamin-multivitamin-supplements-usage"]
    );
    urlencoded.append("weight", formValues["weight"]);
    urlencoded.append("weightUnit", formValues["weight-unit"]);
    urlencoded.append(
      "whatTypeOfProbioticMicroorganismDoYouUse",
      formValues["what-type-of-probiotic-microorganism-do-you-use"]
    );
    urlencoded.append(
      "thetypeofcancerandthetreatmentyoureceived",
      formValues["the-type-of-cancer-and-the-treatment-you-received"]
    );
    urlencoded.append(
      "withhowmanypeopledoyoulive",
      formValues["with-how-many-people-do-you-live"]
    );

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    // await fetch("https://yourgutmap-food-sensitivity-423a2af84621.herokuapp.com/pataintformdataupload", requestOptions)
    await fetch(
      `${process.env.REACT_APP_API_URL}/pataintformdataupload`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // setformDatafield(result)
        // setform(true)
      })
      .catch((error) => console.error(error));
    // console.log(formValues)
    await link("/thankyou");
    setTimeout(() => {
      hide(); // Call hide to stop the loading message
      message.success("Action completed successfully");
    }, 2000);
  };

  return (
    <Home>
      <div className="myform microbiome">
        {!submitted ? <div className="mainformdiv newform" style={{ flexDirection: "column" }}>
          <h1 style={{ color: "#0B233A" }}>Microbiome Test Form</h1>

          {form ? (
            <>
              <form onSubmit={handleSubmit}>
                {formDatafield.map((field, index) => (
                  <div key={index}>
                    <label style={{ fontWeight: "bold" }}>
                      {index + 1} - {field.title}
                    </label>

                    {field.type === "radio" ? (
                      <>
                        {field.options.map((option, idx) => (
                          <div key={idx} className="radiobtn">
                            <input
                              type="radio"
                              name={field.slug}
                              value={option}
                              required={field.required}
                              onChange={handleInputChange}
                            />
                            <label>{option}</label>
                          </div>
                        ))}

                        {/* Render conditional questions if the selected value matches */}
                        {field.conditional_questions.map((condField, idx) =>
                          formValues[field.slug] &&
                          condField.active_when.includes(
                            formValues[field.slug]
                          ) ? (
                            <div key={idx} style={{ marginTop: "10px" }}>
                              <label>{condField.title}</label>
                              <input
                                type={condField.type}
                                name={condField.slug}
                                required={condField.required}
                                onChange={handleInputChange}
                              />
                            </div>
                          ) : null
                        )}
                      </>
                    ) : field.type === "select" ? (
                      <select
                        name={field.slug}
                        required={field.required}
                        onChange={handleInputChange}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select Country
                        </option>
                        {field.options.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.slug}
                        required={field.required}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                ))}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    className="button3"
                    style={{ width: "48%" }}
                    type="button"
                    onClick={()=>{setform(false)}}
                  >
                    Previous
                  </button>
                  <button
                    className="button2"
                    style={{ width: "48%" }}
                    type="submit"
                  >
                    SEND
                  </button>
                </div>
              </form>
              {/* <form onSubmit={handleSubmit}>

                    {formDatafield.map((value, index) => {
                        return (<>

                            <div>
                                <label style={{ fontWeight: 'bold' }}>{index + 1} - {value.title}</label>

                                {value.type === "radio" ? (<>
                                    {value.options.map((option, index) => (<>
                                        <div className='radiobtn'>
                                            <input
                                                type={value.type}
                                                name={value.slug}
                                                required

                                                value={option}
                                                onChange={handleInputChange}
                                            />
                                            <label>{option}</label>

                                        </div>


                                    </>
                                    ))}
                                    {value.conditional_questions.map((value2) => (<>
                                        <div style={{ marginTop: '10px' }}>
                                            <label>{value2.title}</label>
                                            <input />

                                        </div>
                                    </>))}
                                </>) : (<>


                                    {value.type === "select" ? (<>
                                        <select>
                                            <option selected disabled value="Select Country">Select Country</option>
                                            {value.options.map((option, index) => (<>

                                                <option value={option}>{option}</option>

                                            </>))}
                                        </select>

                                    </>) : (<>

                                        {value.conditional_questions.active_when === ""}
                                        <input
                                            type={value.type}
                                            name={value.slug}
                                            required />
                                    </>)}
                                </>)}
                            </div>
                        </>)
                    })}



                    <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}>
                        <button className='button3' style={{ width: '48%' }} type='submit'>Previous</button>

                        <button className='button2' style={{ width: '48%' }} type='submit'>SEND</button>
                    </div>

                </form> */}
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit2}>
                <div>
                  <label>KIT ID</label>
                  <input
                    type="text"
                    name="kitId"
                    required
                    value={formData.kitId}
                    onChange={handleInputChange2}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "49%" }}>
                    <label>First Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange2}
                    />
                  </div>
                  <div style={{ width: "49%" }}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="namel"
                      required
                      value={formData.namel}
                      onChange={handleInputChange2}
                    />
                  </div>
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange2}
                  />
                </div>

                <div>
                  <button className="button2" type="submit">
                    NEXT
                  </button>
                </div>
              </form>
            </>
          )}
        </div> : <Thankyou/>}
      </div>
    </Home>
  );
}

export default Form;
