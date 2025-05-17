"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTranslation } from "@/components/providers/language-provider"
import { Plus } from "lucide-react"
import { LoadingScreen } from "@/components/loading-screen"
import { AllAnimals } from "@/components/all-animals"
import { useGetCattleDataQuery, usePostCattleMutation } from "@/lib/service/cattleService"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

export function LivestockDashboard() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { toast } = useToast()
  const accessToken = session?.user?.accessToken || ""

  // Fetch cattle data using RTK Query
  const {
    data: cattleData,
    isLoading,
    error,
  } = useGetCattleDataQuery({ accessToken }, { skip: !accessToken })

  // RTK mutation for posting new cattle
  const [postCattle, { isLoading: isPosting }] = usePostCattleMutation()

  const [activeTab, setActiveTab] = useState("all")
  const [open, setOpen] = useState(false)

  // Form state for new animal
  const [formData, setFormData] = useState({
    breed: "",
    birth_date: "",
    gender: "female",
    life_stage: "calf",
    ear_tag_no: "",
    dam_id: "",
    sire_id: "",
    is_purchased: false,
    is_pregnant: false,
    last_insemination_date: "",
    last_calving_date: "",
    expected_calving_date: "",
    expected_insemination_date: "",
    gestation_status: "not_pregnant",
    health_status: "healthy",
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset gestation_status if life_stage is changed to calf
      ...(name === "life_stage" && value === "calf" ? { gestation_status: "not_pregnant", is_pregnant: false } : {}),
    }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      // Reset gestation_status if is_pregnant is unchecked
      ...(name === "is_pregnant" && !checked ? { gestation_status: "not_pregnant" } : {}),
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await postCattle({ accessToken, ...formData }).unwrap()
      toast({
        title: t("Success"),
        description: t("New animal added successfully"),
      })
      setOpen(false)
      // Reset form
      setFormData({
        breed: "",
        birth_date: "",
        gender: "female",
        life_stage: "calf",
        ear_tag_no: "",
        dam_id: "",
        sire_id: "",
        is_purchased: false,
        is_pregnant: false,
        last_insemination_date: "",
        last_calving_date: "",
        expected_calving_date: "",
        expected_insemination_date: "",
        gestation_status: "not_pregnant",
        health_status: "healthy",
      })
    } catch (err) {
      console.error("Failed to add animal:", err)
      toast({
        title: t("Error"),
        description: t("Failed to add new animal"),
        variant: "destructive",
      })
    }
  }

  // Handle loading and error states
  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    console.error("Failed to load cattle data:", error)
    return <div className="text-red-500">{t("Failed to load cattle data")}</div>
  }

  // Use cattle data (assuming cattleData.results contains the array of cattle)
  const cattle = cattleData?.results || []

  // Calculate statistics
  const totalCattle = cattle.length
  const femaleCattle = cattle.filter((c: { gender: string }) => c.gender === "female").length
  const maleCattle = cattle.filter((c: { gender: string }) => c.gender === "male").length
  const pregnantCattle = cattle.filter((c: { gestation_status: string }) => c.gestation_status === "pregnant").length
  const calvingCattle = cattle.filter((c: { gestation_status: string }) => c.gestation_status === "calving").length
  const healthyCattle = cattle.filter((c: { health_status: string }) => c.health_status === "healthy").length
  const sickCattle = cattle.filter((c: { health_status: string }) => c.health_status === "sick").length

  // Check if gestation status should be shown
  const showGestationStatus = formData.is_pregnant && (formData.life_stage === "heifer" || formData.life_stage === "cow")

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("Livestock Management")}</h2>
          <p className="text-muted-foreground">{t("Manage and monitor your entire herd from one place")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="mr-2 h-4 w-4" /> {t("Add New Animal")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("Add New Animal")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="ear_tag_no">{t("Ear Tag Number")}</Label>
                <Input
                  id="ear_tag_no"
                  name="ear_tag_no"
                  value={formData.ear_tag_no}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="breed">{t("Breed")}</Label>
                <Input
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="birth_date">{t("Birth Date")}</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="gender">{t("Gender")}</Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("Male")}</SelectItem>
                    <SelectItem value="female">{t("Female")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="life_stage">{t("Life Stage")}</Label>
                <Select
                  name="life_stage"
                  value={formData.life_stage}
                  onValueChange={(value) => handleSelectChange("life_stage", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select life stage")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calf">{t("Calf")}</SelectItem>
                    <SelectItem value="heifer">{t("Heifer")}</SelectItem>
                    <SelectItem value="cow">{t("Cow")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="health_status">{t("Health Status")}</Label>
                <Select
                  name="health_status"
                  value={formData.health_status}
                  onValueChange={(value) => handleSelectChange("health_status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select health status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthy">{t("Healthy")}</SelectItem>
                    <SelectItem value="sick">{t("Sick")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_purchased"
                  checked={formData.is_purchased}
                  onCheckedChange={(checked) => handleCheckboxChange("is_purchased", checked as boolean)}
                />
                <Label htmlFor="is_purchased">{t("Is Purchased")}</Label>
              </div>
              {(formData.life_stage === "heifer" || formData.life_stage === "cow") && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_pregnant"
                    checked={formData.is_pregnant}
                    onCheckedChange={(checked) => handleCheckboxChange("is_pregnant", checked as boolean)}
                  />
                  <Label htmlFor="is_pregnant">{t("Is Pregnant")}</Label>
                </div>
              )}
              {showGestationStatus && (
                <div>
                  <Label htmlFor="gestation_status">{t("Gestation Status")}</Label>
                  <Select
                    name="gestation_status"
                    value={formData.gestation_status}
                    onValueChange={(value) => handleSelectChange("gestation_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select gestation status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_pregnant">{t("Not Pregnant")}</SelectItem>
                      <SelectItem value="pregnant">{t("Pregnant")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" disabled={isPosting}>
                {isPosting ? t("Adding...") : t("Add Animal")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Cattle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCattle}</div>
            <p className="text-xs text-muted-foreground">{t("Total number of animals in your herd")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Female / Male")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {femaleCattle} / {maleCattle}
            </div>
            <p className="text-xs text-muted-foreground">{t("Distribution of female and male animals")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Pregnant / Calving")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pregnantCattle} / {calvingCattle}
            </div>
            <p className="text-xs text-muted-foreground">{t("Number of pregnant and calving animals")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Healthy / Sick")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthyCattle} / {sickCattle}
            </div>
            <p className="text-xs text-muted-foreground">{t("Health status of your herd")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t("All Animals")}</TabsTrigger>
          <TabsTrigger value="cows">{t("Cows")}</TabsTrigger>
          <TabsTrigger value="heifers">{t("Heifers")}</TabsTrigger>
          <TabsTrigger value="calves">{t("Calves")}</TabsTrigger>
          <TabsTrigger value="bulls">{t("Bulls")}</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>{t("All Animals")}</CardTitle>
              <CardDescription>{t("View and manage all animals in your herd")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllAnimals animals={cattle} showFilters={true} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cows">
          <Card>
            <CardHeader>
              <CardTitle>{t("Cows")}</CardTitle>
              <CardDescription>{t("View and manage all cows in your herd")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllAnimals animals={cattle.filter((c: { life_stage: string }) => c.life_stage === "cow")} showFilters={false} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="heifers">
          <Card>
            <CardHeader>
              <CardTitle>{t("Heifers")}</CardTitle>
              <CardDescription>{t("View and manage all heifers in your herd")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllAnimals animals={cattle.filter((c: { life_stage: string }) => c.life_stage === "heifer")} showFilters={false} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calves">
          <Card>
            <CardHeader>
              <CardTitle>{t("Calves")}</CardTitle>
              <CardDescription>{t("View and manage all calves in your herd")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllAnimals animals={cattle.filter((c: { life_stage: string }) => c.life_stage === "calf")} showFilters={false} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bulls">
          <Card>
            <CardHeader>
              <CardTitle>{t("Bulls")}</CardTitle>
              <CardDescription>{t("View and manage all bulls in your herd")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AllAnimals animals={cattle.filter((c: { life_stage: string }) => c.life_stage === "bull")} showFilters={false} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}