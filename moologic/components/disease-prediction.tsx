"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import axios from "axios"
import { useSession } from "next-auth/react"

// Updated disease symptoms data from the provided list
const diseaseSymptoms = [
  { id: "anorexia", label: "Anorexia" },
  { id: "abdominal_pain", label: "Abdominal Pain" },
  { id: "anaemia", label: "Anaemia" },
  { id: "abortions", label: "Abortions" },
  { id: "acetone", label: "Acetone" },
  { id: "aggression", label: "Aggression" },
  { id: "arthrogyposis", label: "Arthrogyposis" },
  { id: "ankylosis", label: "Ankylosis" },
  { id: "anxiety", label: "Anxiety" },
  { id: "bellowing", label: "Bellowing" },
  { id: "blood_loss", label: "Blood Loss" },
  { id: "blood_poisoning", label: "Blood Poisoning" },
  { id: "blisters", label: "Blisters" },
  { id: "colic", label: "Colic" },
  { id: "condemnation_of_livers", label: "Condemnation of Livers" },
  { id: "conjunctivae", label: "Conjunctivae Issues" },
  { id: "coughing", label: "Coughing" },
  { id: "depression", label: "Depression" },
  { id: "discomfort", label: "Discomfort" },
  { id: "dyspnea", label: "Dyspnea" },
  { id: "dysentery", label: "Dysentery" },
  { id: "diarrhoea", label: "Diarrhoea" },
  { id: "dehydration", label: "Dehydration" },
  { id: "drooling", label: "Drooling" },
  { id: "dull", label: "Dullness" },
  { id: "decreased_fertility", label: "Decreased Fertility" },
  { id: "diffculty_breath", label: "Difficulty Breathing" },
  { id: "emaciation", label: "Emaciation" },
  { id: "encephalitis", label: "Encephalitis" },
  { id: "fever", label: "Fever" },
  { id: "facial_paralysis", label: "Facial Paralysis" },
  { id: "frothing_of_mouth", label: "Frothing of Mouth" },
  { id: "frothing", label: "Frothing" },
  { id: "gaseous_stomach", label: "Gaseous Stomach" },
  { id: "highly_diarrhoea", label: "Highly Severe Diarrhoea" },
  { id: "high_pulse_rate", label: "High Pulse Rate" },
  { id: "high_temp", label: "High Temperature" },
  { id: "high_proportion", label: "High Proportion" },
  { id: "hyperaemia", label: "Hyperaemia" },
  { id: "hydrocephalus", label: "Hydrocephalus" },
  { id: "isolation_from_herd", label: "Isolation from Herd" },
  { id: "infertility", label: "Infertility" },
  { id: "intermittent_fever", label: "Intermittent Fever" },
  { id: "jaundice", label: "Jaundice" },
  { id: "ketosis", label: "Ketosis" },
  { id: "loss_of_appetite", label: "Loss of Appetite" },
  { id: "lameness", label: "Lameness" },
  { id: "lack_of_coordination", label: "Lack of Coordination" },
  { id: "lethargy", label: "Lethargy" },
  { id: "lacrimation", label: "Lacrimation" },
  { id: "milk_flakes", label: "Milk Flakes" },
  { id: "milk_watery", label: "Watery Milk" },
  { id: "milk_clots", label: "Milk Clots" },
  { id: "mild_diarrhoea", label: "Mild Diarrhoea" },
  { id: "moaning", label: "Moaning" },
  { id: "mucosal_lesions", label: "Mucosal Lesions" },
  { id: "milk_fever", label: "Milk Fever" },
  { id: "nausea", label: "Nausea" },
  { id: "nasel_discharges", label: "Nasal Discharges" },
  { id: "oedema", label: "Oedema" },
  { id: "pain", label: "Pain" },
  { id: "painful_tongue", label: "Painful Tongue" },
  { id: "pneumonia", label: "Pneumonia" },
  { id: "photo_sensitization", label: "Photosensitization" },
  { id: "quivering_lips", label: "Quivering Lips" },
  { id: "reduction_milk_yields", label: "Reduction in Milk Yields" },
  { id: "rapid_breathing", label: "Rapid Breathing" },
  { id: "rumenstasis", label: "Rumen Stasis" },
  { id: "reduced_rumination", label: "Reduced Rumination" },
  { id: "reduced_fertility", label: "Reduced Fertility" },
  { id: "reduced_fat", label: "Reduced Fat" },
  { id: "reduces_feed_intake", label: "Reduced Feed Intake" },
  { id: "raised_breathing", label: "Raised Breathing" },
  { id: "stomach_pain", label: "Stomach Pain" },
  { id: "salivation", label: "Salivation" },
  { id: "stillbirths", label: "Stillbirths" },
  { id: "shallow_breathing", label: "Shallow Breathing" },
  { id: "swollen_pharyngeal", label: "Swollen Pharyngeal" },
  { id: "swelling", label: "Swelling" },
  { id: "saliva", label: "Excessive Saliva" },
  { id: "swollen_tongue", label: "Swollen Tongue" },
  { id: "tachycardia", label: "Tachycardia" },
  { id: "torticollis", label: "Torticollis" },
  { id: "udder_swelling", label: "Udder Swelling" },
  { id: "udder_heat", label: "Udder Heat" },
  { id: "udder_hardness", label: "Udder Hardness" },
  { id: "udder_redness", label: "Udder Redness" },
  { id: "udder_pain", label: "Udder Pain" },
  { id: "unwillingness_to_move", label: "Unwillingness to Move" },
  { id: "ulcers", label: "Ulcers" },
  { id: "vomiting", label: "Vomiting" },
  { id: "weight_loss", label: "Weight Loss" },
  { id: "weakness", label: "Weakness" },
  { id: "prognosis", label: "Poor Prognosis" },
]

// Sample disease predictions for image-based fallback (since no image API provided)
const fallbackDiseasePredictions = {
  default: {
    disease: "Unknown Condition",
    confidence: 0,
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
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictionResult, setPredictionResult] = useState<{
    disease: string
    confidence: number
    description: string
    treatment: string
    prevention: string
  } | null>(null)

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
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(typeof reader.result === "string" ? reader.result : null)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle camera capture
  const handleCameraCapture = () => {
    toast({
      title: "Camera Access",
      description: "Camera functionality would be implemented here in a production environment.",
    })
  }

  // Predict disease based on symptoms using API
  const { data: session } = useSession()
  const   base_url = "http://127.0.0.1:8000/"
  const predictDiseaseFromSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No Symptoms Selected",
        description: "Please select at least one symptom to make a prediction.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await axios.post(
        base_url+"health/disease_prediction/",
        { symptoms: selectedSymptoms },
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`, // Adjust based on your auth mechanism
          },
        }
      )

      const result = response.data.predicted_disease || fallbackDiseasePredictions.default
      setPredictionResult(result)
      dispatch(setPrediction(result))
    } catch (error) {
      let errorMessage = "Failed to fetch prediction from server.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        errorMessage = err.response?.data?.error || errorMessage;
      }
      toast({
        title: "Prediction Error",
        description: errorMessage,
        variant: "destructive",
      })
      setPredictionResult(fallbackDiseasePredictions.default)
      dispatch(setPrediction(fallbackDiseasePredictions.default))
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Predict disease from image (simulated, as no image API provided)
  const predictDiseaseFromImage = () => {
    if (!imageFile) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image to make a prediction.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // Simulate API call with timeout (replace with actual image-based API if available)
    setTimeout(() => {
      const result = fallbackDiseasePredictions.default
      setPredictionResult(result)
      dispatch(setPrediction(result))
      setIsAnalyzing(false)
    }, 3000)
  }

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
                    <PredictionResult result={predictionResult} onReset={resetPrediction} />
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
                                    const input = document.getElementById("image-upload");
                                    if (input) (input as HTMLInputElement).click();
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
                    <PredictionResult result={predictionResult} onReset={resetPrediction} />
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

type PredictionResultProps = {
  result: {
    disease: string
    confidence: number
    description: string
    treatment: string
    prevention: string
  }
  onReset: () => void
}

function PredictionResult({ result, onReset }: PredictionResultProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{t("Prediction Results")}</h3>
        <Button variant="outline" onClick={onReset}>
          {t("New Prediction")}
        </Button>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <h4 className="text-lg font-semibold">{result.disease}</h4>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium">
            {result.confidence}% {t("Confidence")}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Description")}</h5>
            <p className="text-gray-600 dark:text-gray-400">{result.description}</p>
          </div>

          <div>
            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Recommended Treatment")}</h5>
            <p className="text-gray-600 dark:text-gray-400">{result.treatment}</p>
          </div>

          <div>
            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Prevention")}</h5>
            <p className="text-gray-600 dark:text-gray-400">{result.prevention}</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-yellow-800 dark:text-yellow-300">{t("Next Steps")}</h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-400 mt-1 list-disc list-inside space-y-1">
            <li>{t("Consult with a veterinarian to confirm the diagnosis")}</li>
            <li>{t("Isolate affected animals if the disease is contagious")}</li>
            <li>{t("Follow the recommended treatment plan under veterinary supervision")}</li>
            <li>{t("Implement prevention measures to protect other animals")}</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}