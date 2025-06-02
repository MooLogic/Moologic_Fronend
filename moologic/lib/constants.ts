// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/'

// Health Record Constants
export const VACCINATION_TYPES = [
  { value: "fmd", label: "Foot and Mouth Disease (FMD)" },
  { value: "anthrax", label: "Anthrax" },
  { value: "blackleg", label: "Blackleg" },
  { value: "brucellosis", label: "Brucellosis" },
  { value: "cbpp", label: "Contagious Bovine Pleuropneumonia (CBPP)" },
  { value: "lsd", label: "Lumpy Skin Disease (LSD)" },
  { value: "pasteurellosis", label: "Pasteurellosis" },
  { value: "bvd", label: "Bovine Viral Diarrhea (BVD)" },
  { value: "other", label: "Other" },
]

export const TREATMENT_TYPES = [
  { value: "mastitis_prevention", label: "Mastitis Prevention" },
  { value: "hoof_care", label: "Hoof Care" },
  { value: "parasite_control", label: "Parasite Control" },
  { value: "vitamin_supplement", label: "Vitamin Supplement" },
  { value: "mineral_supplement", label: "Mineral Supplement" },
  { value: "reproductive_health", label: "Reproductive Health" },
  { value: "antibiotics", label: "Antibiotics" },
  { value: "anti_inflammatory", label: "Anti-inflammatory" },
  { value: "wound_treatment", label: "Wound Treatment" },
  { value: "other", label: "Other" },
]

// Treatment Intervals
export const TREATMENT_INTERVALS = {
  MONTHLY: 30,
  QUARTERLY: 90,
  SEMI_ANNUALLY: 180,
  ANNUALLY: 365,
}

// Gestation Stages
export const GESTATION_STAGES = [
  { value: "not_pregnant", label: "Not Pregnant" },
  { value: "first_trimester", label: "First Trimester" },
  { value: "second_trimester", label: "Second Trimester" },
  { value: "third_trimester", label: "Third Trimester" },
  { value: "calving", label: "Calving" },
]

// Health Status
export const HEALTH_STATUS = {
  HEALTHY: "healthy",
  SICK: "sick",
}

// Alert Priorities
export const ALERT_PRIORITIES = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  EMERGENCY: "Emergency",
} 