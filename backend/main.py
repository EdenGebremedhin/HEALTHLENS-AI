
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

app = FastAPI(title="HealthLens AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)



class SymptomRequest(BaseModel):
    symptoms: list[str] = Field(min_length=1, max_length=20)
    duration: str = Field(min_length=1, max_length=50)
    age_group: str

    @field_validator("symptoms")
    @classmethod
    def validate_symptoms(cls, symptoms: list[str]) -> list[str]:
        cleaned_symptoms = []

        for symptom in symptoms:
            symptom = symptom.strip()

            if not symptom:
                raise ValueError("Symptoms cannot be empty.")

            if len(symptom) > 100:
                raise ValueError(
                    "Each symptom must be 100 characters or fewer."
                )

            cleaned_symptoms.append(symptom)

        return cleaned_symptoms

    @field_validator("duration")
    @classmethod
    def validate_duration(cls, duration: str) -> str:
        duration = duration.strip()

        if not duration:
            raise ValueError("Duration cannot be empty.")

        return duration



@app.get("/")
def home():
    return {"message": "Welcome to HealthLens AI"}


@app.get("/health")
def health_check():
    return {"status": "ok"}



@app.post("/assess")
def assess_symptoms(request: SymptomRequest):
    symptoms = [s.strip().lower() for s in request.symptoms]

    # Basic warning-sign screening, not a complete triage system.
   
    emergency_signs = {
        "chest pain",
        "chest pressure",
        "difficulty breathing",
        "trouble breathing",
        "shortness of breath",
        "can't breathe",
        "cannot breathe",
        "severe bleeding",
        "uncontrolled bleeding",
        "loss of consciousness",
        "passed out",
        "fainting",
        "sudden confusion",
        "sudden weakness",
        "face drooping",
        "stroke symptoms",
        "severe allergic reaction",
        "anaphylaxis",
        "seizure",
    }


    if any(
        sign in symptom
        for symptom in symptoms
        for sign in emergency_signs
    ):
        return {
            "message": (
                "One or more symptoms may indicate a medical emergency."
            ),
            "symptoms_received": request.symptoms,
            "duration": request.duration,
            "next_steps": [
                "Seek emergency medical care now.",
                "Do not delay care while using this application.",
            ],
            "urgency": "urgent",
            "disclaimer": (
                "This screening is incomplete and cannot rule out "
                "an emergency. It is not a medical diagnosis."
            ),
        }

    return {
        "message": (
            "HealthLens AI provides general health information, "
            "not a diagnosis. Symptoms can have many causes."
        ),
        "symptoms_received": request.symptoms,
        "duration": request.duration,
        "next_steps": [
            "Consider consulting a qualified healthcare professional "
            "if symptoms persist or concern you.",
            "Seek urgent care if symptoms are severe or worsening.",
        ],
        "urgency": "general",
        "disclaimer": (
            "This tool cannot diagnose conditions or rule out "
            "serious illness. It does not replace professional care."
        ),
    }
