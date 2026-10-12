
import { useState } from "react";
import "./App.css";


const symptomOptions = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Nausea",
  "Fatigue",
  "Runny nose",
  "Body aches",
  "Chest pain",
  "Difficulty breathing",
  "Severe bleeding",
  "Loss of consciousness",
  "Sudden confusion",
  "Sudden weakness",
];


function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [duration, setDuration] = useState("1 day");
  const [ageGroup, setAgeGroup] = useState("adult");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleSymptom(symptom) {
    setSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    );
  }


  function handleReset() {
    setSymptoms([]);
    setCustomSymptom("");
    setDuration("1 day");
    setAgeGroup("adult");
    setResult(null);
    setError("");
    setLoading(false);
  }


  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (symptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          duration,
          age_group: ageGroup,
        }),
      });

      if (!response.ok) {
        throw new Error("The request could not be completed.");
      }

      const data = await response.json();
      setResult(data);
    } catch {
      setError(
        "We couldn't connect to HealthLens AI. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">✚</span>
          HealthLens <span className="brand-ai">AI</span>
        </a>
        <span className="privacy-note">Your health matters</span>
      </header>

      <main id="home">
        <section className="hero">
          <span className="eyebrow">YOUR PERSONAL HEALTH INFORMATION GUIDE</span>
          <h1>Understand your symptoms</h1>
          <p>
            Share what you're experiencing to receive general health
            information and guidance on possible next steps.
          </p>
        </section>

        <div className="notice">
          <strong>Important:</strong> HealthLens AI does not diagnose
          conditions or replace a healthcare professional. If you have
          severe or rapidly worsening symptoms, seek urgent medical care.
        </div>

        <div className="content-grid">
          <section className="panel">
            <div className="panel-heading">
              {/* <span className="step-number">01</span> */}
              <div>
                <h2>How are you feeling?</h2>
                <p>Select all symptoms that apply.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="symptom-grid">
                {symptomOptions.map((symptom) => (
                  <button
                    type="button"
                    key={symptom}
                    className={`symptom ${
                      symptoms.includes(symptom) ? "selected" : ""
                    }`}
                    aria-pressed={symptoms.includes(symptom)}
                    onClick={() => toggleSymptom(symptom)}
                  >
                    <span>{symptoms.includes(symptom) ? "✓" : "+"}</span>
                    {symptom}
                  </button>
                ))}
              </div>

<div className="custom-symptom">
  <label htmlFor="customSymptom">
    Other symptoms (optional)
  </label>
  <div className="custom-symptom-row">
    <input
      id="customSymptom"
      type="text"
      value={customSymptom}
      onChange={(event) => setCustomSymptom(event.target.value)}
      placeholder="e.g. stomach pain"
      maxLength={100}
    />
    <button
      type="button"
      className="add-symptom-button"
      
onClick={() => {
  const cleaned = customSymptom.trim();

  if (!cleaned) {
    setCustomSymptom("");
    return;
  }

  const alreadyAdded = symptoms.some(
    (item) => item.toLowerCase() === cleaned.toLowerCase()
  );

  if (alreadyAdded) {
    setError("That symptom has already been added.");
  } else if (symptoms.length >= 20) {
    setError("You can add a maximum of 20 symptoms.");
  } else {
    setSymptoms((current) => [...current, cleaned]);
    setError("");
  }

  setCustomSymptom("");
}}

    >
      Add
    </button>
  </div>
  <p className="input-hint">
    Type a symptom and select Add to include it in your assessment.
  </p>

{symptoms.some(
  (symptom) =>
    !symptomOptions.some(
      (option) => option.toLowerCase() === symptom.toLowerCase()
    )
) && (
  <div className="custom-symptom-tags">
    <p className="tags-heading">Your added symptoms</p>

    <div className="tags-list">
      {symptoms
        .filter(
          (symptom) =>
            !symptomOptions.some(
              (option) =>
                option.toLowerCase() === symptom.toLowerCase()
            )
        )
        .map((symptom) => (
          <span className="symptom-tag" key={symptom}>
            {symptom}

            <button
              type="button"
              className="remove-symptom"
              aria-label={`Remove ${symptom}`}
              onClick={() =>
                setSymptoms((current) =>
                  current.filter((item) => item !== symptom)
                )
              }
            >
              ×
            </button>
          </span>
        ))}
    </div>
  </div>
)}

</div>

                
              <label htmlFor="duration">How long have you felt this way?</label>
              <select
                id="duration"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              >
                <option>Today</option>
                <option>1 day</option>
                <option>2–3 days</option>
                <option>4–7 days</option>
                <option>More than a week</option>
              </select>

              <label htmlFor="ageGroup">Age group</label>
              <select
                id="ageGroup"
                value={ageGroup}
                onChange={(event) => setAgeGroup(event.target.value)}
              >
                <option value="child">Child (under 13)</option>
                <option value="teen">Teen (13–17)</option>
                <option value="adult">Adult (18–64)</option>
                <option value="older_adult">Older adult (65+)</option>
              </select>

              {error && <p className="error" role="alert">{error}</p>}

              
<div className="form-actions">

<button className="submit-button" type="submit" disabled={loading}>
  {loading ? (
    <span className="loading-content">
      <span className="loading-spinner" aria-hidden="true"></span>
      Checking your symptoms...
    </span>
  ) : (
    "Get health information →"
  )}
</button>


  <button
    className="clear-button"
    type="button"
    onClick={handleReset}
    disabled={loading}
  >
    Clear form
  </button>
</div>

            </form>
          </section>

          <section className="panel results-panel" aria-live="polite">
            {/* <span className="step-number">02</span> */}
            <h2>Your health information</h2>

            {!result ? (
              <div className="empty-state">
                <div className="empty-icon">♡</div>
                <h3>Your results will appear here</h3>
                <p>
                  Select your symptoms and submit the form to receive
                  general information and next steps.
                </p>
              </div>
            ) : (
             
<div className="result-content">
  <div
    className={`urgency-banner ${
      result.urgency === "urgent" ? "urgent" : "general"
    }`}
    role="alert"
  >
    <strong>
      {result.urgency === "urgent"
        ? "⚠️ Seek emergency medical care"
        : "General health information"}
    </strong>
    <p>
      {result.urgency === "urgent"
        ? "Your selected symptoms may indicate an emergency. Do not delay seeking medical care."
        : "This information is not a diagnosis. Seek care if symptoms are severe, worsening, or concerning."}
    </p>
  </div>

  <p>{result.message}</p>


<h3>Symptoms shared</h3>

<div className="result-symptom-tags">
  {result.symptoms_received.map((symptom, index) => {
    const isCustom = !symptomOptions.some(
      (option) =>
        option.toLowerCase() === symptom.toLowerCase()
    );

    return (
      <span
        className={`result-symptom-tag ${
          isCustom ? "custom" : ""
        }`}
        key={`${symptom}-${index}`}
      >
        {symptom}
        {isCustom && (
          <span className="custom-label">Custom</span>
        )}
      </span>
    );
  })}
</div>


  <h3>Suggested next steps</h3>
  <ul>
    {result.next_steps.map((step, index) => (
      <li key={index}>{step}</li>
    ))}
  </ul>

  <p className="disclaimer">{result.disclaimer}</p>
</div>

            )}
          </section>
        </div>
      </main>

      <footer>
        <p>HealthLens AI · Built to make health information more accessible.</p>
        <p> Not a medical diagnosis.</p>
      </footer>
    </div>
  );
}

export default App;
