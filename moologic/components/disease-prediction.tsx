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

// Sample disease symptoms data
const diseaseSymptoms = [
  { id: "fever", label: "Fever" },
  { id: "coughing", label: "Coughing" },
  { id: "nasal_discharge", label: "Nasal Discharge" },
  { id: "difficulty_breathing", label: "Difficulty Breathing" },
  { id: "diarrhea", label: "Diarrhea" },
  { id: "reduced_appetite", label: "Reduced Appetite" },
  { id: "weight_loss", label: "Weight Loss" },
  { id: "lethargy", label: "Lethargy" },
  { id: "lameness", label: "Lameness" },
  { id: "swollen_joints", label: "Swollen Joints" },
  { id: "skin_lesions", label: "Skin Lesions" },
  { id: "udder_swelling", label: "Udder Swelling" },
  { id: "abnormal_milk", label: "Abnormal Milk" },
  { id: "eye_discharge", label: "Eye Discharge" },
  { id: "excessive_salivation", label: "Excessive Salivation" },
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
  "udder_swelling,abnormal_milk,fever": {
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
    disease: "Lumpy Skin Disease",
    confidence: 90,
    description:
      "Lumpy skin disease is a viral disease characterized by fever and nodules on the skin. It's transmitted by biting insects.",
    treatment: "Supportive care, antibiotics for secondary infections, and anti-inflammatory drugs.",
    prevention: "Vaccination, insect control, and quarantine of affected animals.",
  },
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
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictionResult, setPredictionResult] = useState(null)

  // Handle symptom selection
  const handleSymptomChange = (symptomId) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptomId)) {
        return prev.filter((id) => id !== symptomId)
      } else {
        return [...prev, symptomId]
      }
    })
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
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

  // Predict disease based on symptoms
  const predictDiseaseFromSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No Symptoms Selected",
        description: "Please select at least one symptom to make a prediction.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      const symptomKey = selectedSymptoms.sort().join(",")
      const result = diseasePredictions[symptomKey] || diseasePredictions.default

      setPredictionResult(result)
      dispatch(setPrediction(result))
      setIsAnalyzing(false)
    }, 2000)
  }

  // Predict disease from image
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

    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes, we'll return a random disease prediction
      const predictions = Object.values(diseasePredictions).filter((p) => p.disease !== "Unknown Condition")
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)]

      setPredictionResult(randomPrediction)
      dispatch(setPrediction(randomPrediction))
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
                                  onClick={() => document.getElementById("image-upload").click()}
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

function PredictionResult({ result, onReset }) {
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

