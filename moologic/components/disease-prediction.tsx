"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"
import { motion } from "framer-motion"
import { Upload, Camera, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch } from "react-redux"
import { setPrediction } from "@/redux/features/disease/diseaseSlice"
import { useSession } from "next-auth/react"
import { getAIInsights } from "@/lib/service/ai-service"

interface PredictionResultType {
  disease: string;
  confidence: number;
  description: string;
  treatment: string;
  prevention: string;
}

// Sample disease symptoms data
const diseaseSymptoms = [
   { id: "anorexia", label: "anorexia" },
   { id: "abdominal_pain", label: "abdominal Pain" },
   { id: "anaemia", label: "anaemia" },
   { id: "abortions", label: "abortions" },
   { id: "acetone", label: "acetone" },
   { id: "aggression", label: "aggression" },
   { id: "arthrogyposis", label: "arthrogyposis" },
   { id: "anxiety", label: "anxiety" },
   { id: "bellowing", label: "bellowing" },
   { id: "blood_loss", label: "blood_loss" },
   { id: "blood_poisoning", label: "blood_poisoning" },
   { id: " blisters", label: "blisters" },
   { id: "colic", label: "colic" },
   { id: "Condemnation_of_livers", label: "condemnation_of_livers" },
   { id: "conjunctivae", label: "conjunctivae" },
   { id: "coughing", label: "coughing" },
   { id: "depression", label: "depression" },
   { id: "discomfort	", label: "discomfort	" },
   { id: "dyspnea", label: "dyspnea" },
   { id: "	dysentery", label: "dysentery" },
   { id: "diarrhoea", label: "diarrhoea" },
   { id: "dehydration", label: "dehydration" },
   { id: "drooling", label: "drooling" },
   { id: "decreased_fertility", label: "decreased_fertility" },
   { id: "diffculty_breath", label: "diffculty_breath" },
   { id: "emaciation", label: "emaciation" },
   { id: "encephalitis", label: "encephalitis" },
   { id: "fever", label: "Fever" },
   { id: "facial_paralysis", label: "facial_paralysis" },
   { id: "frothing_of_mouth", label: "frothing_of_mouth" },
   { id: "gaseous_stomach", label: "gaseous_stomach" },
   { id: "highly_diarrhoea", label: "highly_diarrhoea" },
   { id: "high_pulse_rate", label: "high_pulse_rate" },
   { id: "high_temp", label: "high_temp" },
   { id: "high_proportion", label: "high_proportion" },
   { id: "hyperaemia", label: "	hyperaemia" },
   { id: "hydrocephalus", label: "hydrocephalus" },
   { id: "isolation_from_herd", label: "isolation_from_herd" },
   { id: "infertility", label: "infertility" },
   { id: "intermittent_fever", label: "intermittent_fever" },
   { id: "jaundice", label: "jaundice" },
   { id: "ketosis", label: "ketosis" },
   { id: "loss_of_appetite", label: "loss_of_appetite" },
   { id: "lameness", label: "lameness" },
   { id: "lack_of-coordination", label: "lack_of-coordination" },
   { id: "lethargy", label: "lethargy" },
   { id: "lacrimation", label: "lacrimation" },
   { id: "milk_flakes", label: "milk_flakes" },
   { id: "milk_watery", label: "milk_watery" },
   { id: "milk_clots", label: "milk_clots" },
   { id: "mild_diarrhoea	", label: "mild_diarrhoea	" },
   { id: "moaning", label: "moaning" },
   { id: "mucosal_lesions", label: "mucosal_lesions" },
   { id: "milk_fever", label: "milk_fever" },
   { id: "nausea", label: "nausea" },
   { id: "nasel_discharges", label: "nasel_discharges" },
   { id: "oedema", label: "oedema" },
   { id: "pain", label: "pain" },
   { id: "painful_tongue", label: "painful_tongue" },
   { id: "pneumonia", label: "pneumonia" },
   { id: "photo_sensitization", label: "photo_sensitization" },
   { id: "quivering_lips", label: "quivering_lips" },
   { id: "reduction_milk_vields", label: " reduction_milk_vields" },
   { id: "rapid_breathing", label: "	rapid_breathing" },
   { id: "rumenstasis	", label: "rumenstasis	" },
   { id: "reduced_rumination", label: "reduced_rumination" },
   { id: "reduced_fertility", label: "reduced_fertility" },
   { id: "reduced_fat", label: "reduced_fat" },
   { id: "reduces_feed_intake", label: "reduces_feed_intake" },
   { id: "raised_breathing", label: "raised_breathing" },
   { id: "stomach_pain", label: "stomach_pain" },
   { id: "salivation", label: "salivation" },
   { id: "stillbirths", label: "stillbirths" },
   { id: "shallow_breathing", label: "shallow_breathing" },
   { id: "swollen_pharyngeal", label: "swollen_pharyngeal" },
   { id: "	swelling", label: "	swelling" },
   { id: "saliva", label: "saliva" },
   { id: "swollen_tongue", label: "swollen_tongue" },
   { id: "tachycardia", label: "tachycardia" },
   { id: "torticollis", label: "torticollis" },
   { id: "udder_swelling", label: "udder_swelling" },
   { id: "udder_heat", label: "udder_heat" },
   { id: "udder_hardeness", label: "udder_hardeness" },
   { id: "udder_redness", label: "udder_redness" },
   { id: "udder_pain", label: "udder_pain" },
   { id: "unwillingness_to_move", label: "unwillingness_to_move" },
   { id: "ulcers", label: "ulcers" },
   { id: "vomiting", label: "vomiting" },
   { id: "weight_loss", label: "weight_loss" },
   { id: "weakness", label: "weakness" },
  
]
// Sample disease prediction results
const diseasePredictions = {
  "fever,coughing,nasal_discharge,difficulty_breathing": {
    disease: "Bovine Respiratory Disease (BRD)",
    confidence: 92,
    description:
      "BRD is a complex of diseases characterized by inflammation of the respiratory tract. It's one of the most common and economically significant diseases in cattle.",
    treatment:
      "Antibiotics (e.g., florfenicol, tulathromycin), anti-inflammatory drugs, and supportive care. Isolation of affected animals is recommended.",
    prevention: "Vaccination, proper ventilation, stress reduction, and good management practices.",
  },
  "diarrhea,reduced_appetite,weight_loss": {
    disease: "Bovine Viral Diarrhea (BVD)",
    confidence: 85,
    description:
      "BVD is a viral disease that affects the digestive and reproductive systems of cattle. It can cause a range of symptoms from mild to severe.",
    treatment:
      "Supportive care, fluid therapy, and antibiotics for secondary bacterial infections. No specific antiviral treatment exists.",
    prevention: "Vaccination, testing and removal of persistently infected animals, and biosecurity measures.",
  },
  "udder_heat,udder_pain": {
    disease: "Mastitis",
    confidence: 95,
    description:
      "Mastitis is an inflammation of the mammary gland and udder tissue, usually caused by bacterial infection. It's one of the most common diseases in dairy cattle.",
    treatment:
      "Intramammary antibiotics, systemic antibiotics for severe cases, frequent milking of affected quarters, and anti-inflammatory drugs.",
    prevention: "Proper milking hygiene, regular teat dipping, dry cow therapy, and maintaining clean housing.",
  },
  "lameness,swollen_joints,fever": {
    disease: "Foot and Mouth Disease",
    confidence: 88,
    description:
      "Foot and mouth disease is a highly contagious viral disease affecting cloven-hoofed animals. It causes fever and blisters on the mouth, feet, and teats.",
    treatment: "No specific treatment. Supportive care and pain management.",
    prevention: "Strict biosecurity, vaccination in endemic areas, and immediate reporting to authorities.",
  },
  "skin_lesions,fever,reduced_appetite": {
    disease: "lumpy",
    confidence: 90,
    description:
      "Lumpy skin disease is a viral disease characterized by fever and nodules on the skin. It's transmitted by biting insects.",
    treatment: "Supportive care, antibiotics for secondary infections, and anti-inflammatory drugs.",
    prevention: "Vaccination, insect control, and quarantine of affected animals.",
  },
  default: {
    disease: "Unknown Condition",
    confidence: 100,
    description:
      "Based on the symptoms provided, we cannot make a confident prediction. The combination of symptoms doesn't match our known disease patterns.",
    treatment: "Consult with a veterinarian for proper diagnosis and treatment.",
    prevention: "Regular health monitoring and good management practices.",
  },
}

export function DiseasePrediction() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { toast } = useToast()
  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState("symptoms")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null)

  // Handle symptom selection
  const handleSymptomChange = (symptomId: string) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptomId)) {
        return prev.filter((id) => id !== symptomId)
      } else {
        return [...prev, symptomId]
      }
    })
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle camera capture
  const handleCameraCapture = () => {
    // In a real implementation, this would access the device camera
    toast({
      title: "Camera Access",
      description: "Camera functionality would be implemented here in a production environment.",
    })
  }
  
  // Handle prediction result with AI insights
  const handlePredictionResult = async (prediction: PredictionResultType) => {
    setIsAnalyzing(false)
    setIsLoadingAI(true)

    try {
      const aiInsights = await getAIInsights(prediction.disease)
      
      const enhancedPrediction = {
        ...prediction,
        description: aiInsights.description,
        treatment: aiInsights.treatment,
        prevention: aiInsights.prevention,
      }

      setPredictionResult(enhancedPrediction)
      dispatch(setPrediction(enhancedPrediction))
    } catch (error) {
      console.error("Error getting AI insights:", error)
      setPredictionResult(prediction)
      dispatch(setPrediction(prediction))
      toast({
        title: "AI Insights Error",
        description: "Could not get AI-generated insights. Showing default information.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAI(false)
    }
  }

  // Update predictDiseaseFromSymptoms
const predictDiseaseFromSymptoms = async () => {
  if (selectedSymptoms.length === 0) {
    toast({
      title: "No Symptoms Selected",
      description: "Please select at least one symptom to make a prediction.",
      variant: "destructive",
    });
    return;
  }

  setIsAnalyzing(true);

  try {
    // First, get the disease prediction from your trained model
    const response = await fetch('http://127.0.0.1:8000/api/prompt_prediction/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms: selectedSymptoms }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const predictedDiseaseName = result.predicted_disease;

    // Find the full prediction details from the frontend's static data
    const matchedPrediction = Object.values(diseasePredictions).find(
      (p) => p.disease.toLowerCase() === predictedDiseaseName.toLowerCase()
    ) as PredictionResultType | undefined;

    let finalPrediction = matchedPrediction || {
      ...diseasePredictions.default,
      disease: predictedDiseaseName,
      description: "The AI model identified this disease, but detailed information is not available in the frontend's static data.",
    };

    // Now get detailed information from Gemini AI
    try {
      const aiInsights = await getAIInsights(predictedDiseaseName);
      
      // Update the prediction with AI-generated content
      finalPrediction = {
        ...finalPrediction,
        description: aiInsights.description,
        treatment: aiInsights.treatment,
        prevention: aiInsights.prevention,
      };
    } catch (aiError) {
      console.error("Gemini AI Error:", aiError);
      // If AI fails, we'll still use the basic prediction but show a warning
      toast({
        title: "AI Enhancement Limited",
        description: "Basic prediction available, but detailed AI insights could not be generated.",
        variant: "default"
      });
    }

    setPredictionResult(finalPrediction);
    dispatch(setPrediction(finalPrediction));

  } catch (error) {
    console.error("Symptom Prediction API Error:", error);
    let errorMessage = "An error occurred while analyzing the symptoms.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast({
      title: "Analysis Failed",
      description: errorMessage,
      variant: "destructive",
    });

    setPredictionResult({
      ...diseasePredictions.default,
      disease: "Analysis Error",
      description: "Could not get a prediction from the server. Please check your connection and try again.",
    });
  } finally {
    setIsAnalyzing(false);
  }
};

  // Update predictDiseaseFromImage
const predictDiseaseFromImage = async () => {
  if (!imageFile) {
    toast({
      title: "No Image Selected",
      description: "Please upload an image to make a prediction.",
      variant: "destructive",
    });
    return;
  }

  setIsAnalyzing(true);

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch('http://127.0.0.1:8000/api/predictor/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    let finalPrediction: PredictionResultType = diseasePredictions.default;
    if (result.diseases && result.diseases.length > 0) {
      const predictedDiseaseName = result.diseases[0];
      const matchedPrediction = Object.values(diseasePredictions).find(
        (p) => p.disease === predictedDiseaseName
      ) as PredictionResultType | undefined;

      if (matchedPrediction) {
        finalPrediction = matchedPrediction;
      } else {
        finalPrediction = {
          ...diseasePredictions.default,
          disease: predictedDiseaseName,
          description: "The AI model identified this disease, but detailed information is not available in the frontend.",
        };
      }

      // Get detailed information from Gemini AI
      try {
        const aiInsights = await getAIInsights(predictedDiseaseName);
        
        // Update the prediction with AI-generated content
        finalPrediction = {
          ...finalPrediction,
          description: aiInsights.description,
          treatment: aiInsights.treatment,
          prevention: aiInsights.prevention,
        };
      } catch (aiError) {
        console.error("Gemini AI Error:", aiError);
        toast({
          title: "AI Enhancement Limited",
          description: "Basic prediction available, but detailed AI insights could not be generated.",
          variant: "default"
        });
      }
    }

    setPredictionResult(finalPrediction);
    dispatch(setPrediction(finalPrediction));

  } catch (error) {
    console.error("Image Prediction API Error:", error);
    let errorMessage = "An error occurred while analyzing the image.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast({
      title: "Analysis Failed",
      description: errorMessage,
      variant: "destructive",
    });

    setPredictionResult({
      ...diseasePredictions.default,
      disease: "Analysis Error",
      description: "Could not get a prediction from the server. Please check your connection and try again.",
    });
  } finally {
    setIsAnalyzing(false);
  }
};

  // Reset prediction
  const resetPrediction = () => {
    setPredictionResult(null)
    setSelectedSymptoms([])
    setImageFile(null)
    setImagePreview(null)
    dispatch(setPrediction(null))
  }

  return (
    <main className="flex-1">
      <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t("Disease Prediction")}</h1>
        <div className="text-lg font-medium text-gray-800 dark:text-gray-100">Anan Dairy Farm</div>
      </header>

      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t("AI-Powered Disease Prediction")}</CardTitle>
              <CardDescription>
                {t("Identify potential cattle diseases using symptoms or image analysis")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="symptoms" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="symptoms">{t("Symptom-Based")}</TabsTrigger>
                  <TabsTrigger value="image">{t("Image-Based")}</TabsTrigger>
                </TabsList>

                <TabsContent value="symptoms">
                  {!predictionResult ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">{t("Select Observed Symptoms")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {diseaseSymptoms.map((symptom) => (
                            <div key={symptom.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={symptom.id}
                                checked={selectedSymptoms.includes(symptom.id)}
                                onCheckedChange={() => handleSymptomChange(symptom.id)}
                              />
                              <Label htmlFor={symptom.id}>{t(symptom.label)}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={predictDiseaseFromSymptoms}
                        disabled={isAnalyzing || selectedSymptoms.length === 0}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("Analyzing Symptoms...")}
                          </>
                        ) : (
                          t("Predict Disease")
                        )}
                      </Button>
                    </div>
                  ) : (
                    <PredictionResult
                      result={predictionResult}
                      onReset={() => {
                        setPredictionResult(null)
                        setSelectedSymptoms([])
                        setImageFile(null)
                        setImagePreview(null)
                        setActiveTab("symptoms")
                      }}
                      isLoadingAI={isLoadingAI}
                    />
                  )}
                </TabsContent>

                <TabsContent value="image">
                  {!predictionResult ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">{t("Upload or Capture Image")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center">
                              {imagePreview ? (
                                <div className="relative w-full">
                                  <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-md"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="absolute top-2 right-2 bg-white dark:bg-gray-800"
                                    onClick={() => {
                                      setImageFile(null)
                                      setImagePreview(null)
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                                    {t("Drag and drop an image, or click to browse")}
                                  </p>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="image-upload"
                                onChange={handleImageUpload}
                              />
                              {!imagePreview && (
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const uploadInput = document.getElementById("image-upload");
                                    if (uploadInput) {
                                      uploadInput.click();
                                    }
                                  }}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  {t("Browse Files")}
                                </Button>
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center h-full">
                              <Camera className="h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                                {t("Take a photo using your device camera")}
                              </p>
                              <Button variant="outline" onClick={handleCameraCapture}>
                                <Camera className="h-4 w-4 mr-2" />
                                {t("Capture Photo")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-300">{t("Image Guidelines")}</h4>
                          <ul className="text-sm text-yellow-700 dark:text-yellow-400 mt-1 list-disc list-inside space-y-1">
                            <li>{t("Ensure good lighting for clear visibility")}</li>
                            <li>{t("Focus on the affected area")}</li>
                            <li>{t("Include multiple angles if possible")}</li>
                            <li>{t("Avoid blurry images")}</li>
                          </ul>
                        </div>
                      </div>

                      <Button
                        onClick={predictDiseaseFromImage}
                        disabled={isAnalyzing || !imageFile}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("Analyzing Image...")}
                          </>
                        ) : (
                          t("Analyze Image")
                        )}
                      </Button>
                    </div>
                  ) : (
                    <PredictionResult
                      result={predictionResult}
                      onReset={() => {
                        setPredictionResult(null)
                        setSelectedSymptoms([])
                        setImageFile(null)
                        setImagePreview(null)
                        setActiveTab("symptoms")
                      }}
                      isLoadingAI={isLoadingAI}
                    />
                  )}
                </TabsContent>

                <TabsContent value="result">
                  {predictionResult && (
                    <PredictionResult
                      result={predictionResult}
                      onReset={() => {
                        setPredictionResult(null)
                        setSelectedSymptoms([])
                        setImageFile(null)
                        setImagePreview(null)
                        setActiveTab("symptoms")
                      }}
                      isLoadingAI={isLoadingAI}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("How It Works")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-8 h-8 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-3 mt-0.5 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">{t("Input Data")}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("Select observed symptoms or upload clear images of the affected animal")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-8 h-8 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-3 mt-0.5 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">{t("AI Analysis")}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("Our AI model analyzes the data against thousands of disease patterns")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-8 h-8 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-3 mt-0.5 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">{t("Prediction Results")}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                          "Receive disease predictions with confidence scores, descriptions, and treatment recommendations",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-8 h-8 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-3 mt-0.5 flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">{t("Veterinary Consultation")}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("Always consult with a veterinarian for proper diagnosis and treatment")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Important Notice")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-red-800 dark:text-red-300 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {t("Disclaimer")}
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    {t(
                      "This tool is designed to assist in preliminary disease identification only. It is not a substitute for professional veterinary diagnosis and care.",
                    )}
                  </p>
                </div>

                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    {t(
                      "The AI prediction system provides potential matches based on the information provided, but many diseases share similar symptoms and may require laboratory tests for accurate diagnosis.",
                    )}
                  </p>

                  <p>
                    {t(
                      "Always consult with a qualified veterinarian before initiating any treatment. Early intervention is critical for many cattle diseases.",
                    )}
                  </p>

                  <p className="font-medium">
                    {t(
                      "In case of emergency or severe symptoms, contact your veterinarian immediately rather than waiting for AI analysis.",
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

interface PredictionResultProps {
  result: PredictionResultType;
  onReset: () => void;
  isLoadingAI: boolean;
}

function PredictionResult({ result, onReset, isLoadingAI }: PredictionResultProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight">{result.disease}</h3>
        </div>
        <span style={{ color: '#42b0f5' }}>
        <Button onClick={onReset} variant="outline">
          {t("Start Over")}
        </Button></span>
      </div>

      {isLoadingAI ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3">Getting AI insights...</span>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle><span style={{ color: '#42b0f5' }}>{t("Description")}</span></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground whitespace-pre-line">{result.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><span style={{ color: '#42b0f5' }}>{t("Treatment Recommendations")}</span></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground whitespace-pre-line">{result.treatment}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><span style={{ color: '#42b0f5' }}>{t("Prevention Measures")}</span></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground whitespace-pre-line">{result.prevention}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
