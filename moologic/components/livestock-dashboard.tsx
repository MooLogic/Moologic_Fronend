"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { useSession } from "next-auth/react"
import { useTranslation } from "@/components/providers/language-provider"
import { AllAnimals } from "@/components/all-animals"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Plus, AlertTriangle, Loader2 } from "lucide-react"
import {
  Cattle,
  GestationStage,
  GestationStatus,
  HealthStatus,
  LifeStage,
  MilkingFrequency,
  useDeleteCattleMutation,
  useGetCattleDataQuery,
  useGetGestationDataQuery,
  useGetPregnantCattleQuery,
  usePostCattleMutation,
  useUpdateCattleMutation,
} from "@/lib/service/cattleService"

// Form state shape for cattle create/edit dialog
type CattleFormState = {
  ear_tag_no: string
  breed: string
  birth_date: string
  birth_weight: string
  current_weight: string
  weaning_date: string
  weaning_weight: string
  gender: "male" | "female"
  life_stage: LifeStage
  is_service_bull: boolean
  dam_id: string
  sire_id: string
  is_purchased: boolean
  purchase_date: string
  purchase_source: string
  gestation_status: GestationStatus
  gestation_stage: GestationStage
  health_status: HealthStatus
  last_insemination_date: string
  last_calving_date: string
  expected_calving_date: string
  expected_insemination_date: string
  milking_frequency: MilkingFrequency
  custom_milking_times: string
  avg_daily_milk: string
  photo?: File
}

const emptyForm: CattleFormState = {
  ear_tag_no: "",
  breed: "",
  birth_date: "",
  birth_weight: "",
  current_weight: "",
  weaning_date: "",
  weaning_weight: "",
  gender: "female",
  life_stage: "calf",
  is_service_bull: false,
  dam_id: "",
  sire_id: "",
  is_purchased: false,
  purchase_date: "",
  purchase_source: "",
  gestation_status: "not_pregnant",
  gestation_stage: "not_pregnant",
  health_status: "healthy",
  last_insemination_date: "",
  last_calving_date: "",
  expected_calving_date: "",
  expected_insemination_date: "",
  milking_frequency: "once",
  custom_milking_times: "",
  avg_daily_milk: "",
  photo: undefined,
}

const toDateInput = (value?: string | null) => (value ? value.split("T")[0] : "")

const toFormState = (cattle: Cattle): CattleFormState => ({
  ear_tag_no: cattle.ear_tag_no || "",
  breed: cattle.breed || "",
  birth_date: toDateInput(cattle.birth_date),
  birth_weight: cattle.birth_weight || "",
  current_weight: cattle.current_weight || "",
  weaning_date: toDateInput(cattle.weaning_date),
  weaning_weight: cattle.weaning_weight || "",
  gender: cattle.gender,
  life_stage: cattle.life_stage,
  is_service_bull: Boolean(cattle.is_service_bull),
  dam_id: cattle.dam_id || "",
  sire_id: cattle.sire_id || "",
  is_purchased: Boolean(cattle.is_purchased),
  purchase_date: toDateInput(cattle.purchase_date),
  purchase_source: cattle.purchase_source || "",
  gestation_status: cattle.gestation_status || "not_pregnant",
  gestation_stage: cattle.gestation_stage || "not_pregnant",
  health_status: cattle.health_status || "healthy",
  last_insemination_date: toDateInput(cattle.last_insemination_date),
  last_calving_date: toDateInput(cattle.last_calving_date),
  expected_calving_date: toDateInput(cattle.expected_calving_date),
  expected_insemination_date: toDateInput(cattle.expected_insemination_date),
  milking_frequency: cattle.milking_frequency || "once",
  custom_milking_times: cattle.custom_milking_times?.join(",") || "",
  avg_daily_milk: cattle.avg_daily_milk?.toString() || "",
  photo: undefined,
})

const AnimalListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, index) => (
      <Card key={index}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const StatsCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-[100px]" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-[50px]" />
      <Skeleton className="h-3 w-[150px] mt-2" />
    </CardContent>
  </Card>
)

export function LivestockDashboard() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { toast } = useToast()
  const accessToken = session?.user?.accessToken || ""

  const {
    data: cattleData,
    isLoading: isLoadingCattle,
    isFetching: isFetchingCattle,
    error: cattleError,
    refetch: refetchCattle,
  } = useGetCattleDataQuery({ accessToken }, { skip: !accessToken })

  const {
    data: pregnantCattleData,
    isLoading: isLoadingPregnant,
    error: pregnantError,
  } = useGetPregnantCattleQuery({ accessToken }, { skip: !accessToken })

  const {
    data: gestationData,
    isLoading: isLoadingGestation,
    error: gestationError,
  } = useGetGestationDataQuery({ accessToken }, { skip: !accessToken })

  const [postCattle, { isLoading: isPosting }] = usePostCattleMutation()
  const [updateCattle, { isLoading: isUpdating }] = useUpdateCattleMutation()
  const [deleteCattle] = useDeleteCattleMutation()

  const [activeTab, setActiveTab] = useState("all")
  const [open, setOpen] = useState(false)
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null)
  const [formData, setFormData] = useState<CattleFormState>(emptyForm)

  useEffect(() => {
    if (!open) {
      setSelectedCattle(null)
      setFormData(emptyForm)
    }
  }, [open])

  const handleInputChange = (key: keyof CattleFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSelectChange = (
    key: keyof Pick<
      CattleFormState,
      "gender" | "life_stage" | "gestation_status" | "gestation_stage" | "health_status" | "milking_frequency"
    >,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value as any }))
  }

  const handleCheckboxChange = (key: keyof Pick<CattleFormState, "is_service_bull" | "is_purchased">, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [key]: checked }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFormData((prev) => ({ ...prev, photo: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.ear_tag_no.trim()) {
      toast({ title: t("Ear tag required"), description: t("Please provide an ear tag number."), variant: "destructive" })
      return
    }

    const payload = {
      ear_tag_no: formData.ear_tag_no,
      breed: formData.breed || undefined,
      birth_date: formData.birth_date || null,
      birth_weight: formData.birth_weight || null,
      current_weight: formData.current_weight || null,
      weaning_date: formData.weaning_date || null,
      weaning_weight: formData.weaning_weight || null,
      gender: formData.gender,
      life_stage: formData.life_stage,
      is_service_bull: formData.is_service_bull,
      dam_id: formData.dam_id || undefined,
      sire_id: formData.sire_id || undefined,
      is_purchased: formData.is_purchased,
      purchase_date: formData.is_purchased ? formData.purchase_date || null : null,
      purchase_source: formData.is_purchased ? formData.purchase_source || undefined : undefined,
      last_insemination_date: formData.last_insemination_date || null,
      last_calving_date: formData.last_calving_date || null,
      expected_calving_date: formData.expected_calving_date || null,
      expected_insemination_date: formData.expected_insemination_date || null,
      gestation_status: formData.gestation_status,
      gestation_stage: formData.gestation_stage,
      health_status: formData.health_status,
      milking_frequency: formData.milking_frequency,
      custom_milking_times: formData.custom_milking_times
        ? formData.custom_milking_times.split(",").map((time) => time.trim()).filter(Boolean)
        : [],
      avg_daily_milk: formData.avg_daily_milk ? Number(formData.avg_daily_milk) : null,
      photo: formData.photo,
    }

    try {
      if (selectedCattle) {
        await updateCattle({ accessToken, id: selectedCattle.id, ...payload }).unwrap()
        toast({ title: t("Success"), description: t("Cattle updated successfully.") })
      } else {
        await postCattle({ accessToken, ...payload }).unwrap()
        toast({ title: t("Success"), description: t("Cattle added successfully.") })
      }

      setOpen(false)
      setSelectedCattle(null)
      setFormData(emptyForm)
      refetchCattle()
    } catch (error: any) {
      toast({
        title: t("Error"),
        description: error?.data?.message || t("Failed to save cattle."),
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCattle({ accessToken, id }).unwrap()
      toast({ title: t("Success"), description: t("Cattle deleted successfully.") })
      refetchCattle()
    } catch (error: any) {
      toast({
        title: t("Error"),
        description: error?.data?.message || t("An error occurred while deleting the cattle."),
        variant: "destructive",
      })
    }
  }

  if (cattleError || pregnantError || gestationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t("Error")}</AlertTitle>
        <AlertDescription>{t("An error occurred while fetching the data. Please try again later.")}</AlertDescription>
      </Alert>
    )
  }

  if (isLoadingCattle || isLoadingPregnant || isLoadingGestation) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
        <AnimalListSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Cattle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cattleData?.count || 0}</div>
            <p className="text-xs text-muted-foreground">{t("Total number of cattle in the farm")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Pregnant Cattle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pregnantCattleData?.count || 0}</div>
            <p className="text-xs text-muted-foreground">{t("Number of pregnant cattle")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Expected Calvings")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gestationData?.results?.filter((c: any) => c.cattle.gestation_status === "calving").length || 0}
            </div>
            <p className="text-xs text-muted-foreground">{t("Cattle expected to calve soon")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Health Alerts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gestationData?.results?.reduce((sum: number, item: any) => sum + (item.alerts?.length || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">{t("Number of active alerts")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">{t("All Cattle")}</TabsTrigger>
            <TabsTrigger value="pregnant">{t("Pregnant")}</TabsTrigger>
            <TabsTrigger value="alerts">{t("Health Alerts")}</TabsTrigger>
          </TabsList>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("Add Cattle")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>{selectedCattle ? t("Edit Cattle") : t("Add New Cattle")}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ear_tag_no" className="text-right">
                    {t("Ear Tag Number")} *
                  </Label>
                  <Input
                    id="ear_tag_no"
                    name="ear_tag_no"
                    value={formData.ear_tag_no}
                    onChange={(e) => handleInputChange("ear_tag_no", e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="breed" className="text-right">
                    {t("Breed")}
                  </Label>
                  <Input
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={(e) => handleInputChange("breed", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t("Gender")}</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">{t("Female")}</SelectItem>
                      <SelectItem value="male">{t("Male")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t("Life Stage")}</Label>
                  <Select value={formData.life_stage} onValueChange={(value) => handleSelectChange("life_stage", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calf">{t("Calf")}</SelectItem>
                      <SelectItem value="heifer">{t("Heifer")}</SelectItem>
                      <SelectItem value="cow">{t("Cow")}</SelectItem>
                      <SelectItem value="bull">{t("Bull")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t("Health Status")}</Label>
                  <Select value={formData.health_status} onValueChange={(value) => handleSelectChange("health_status", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthy">{t("Healthy")}</SelectItem>
                      <SelectItem value="sick">{t("Sick")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="birth_date" className="text-right">
                    {t("Birth Date")}
                  </Label>
                  <Input
                    id="birth_date"
                    name="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange("birth_date", e.target.value)}
                    className="col-span-3"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="birth_weight" className="text-right">
                    {t("Birth Weight (kg)")}
                  </Label>
                  <Input
                    id="birth_weight"
                    name="birth_weight"
                    type="number"
                    step="0.01"
                    value={formData.birth_weight}
                    onChange={(e) => handleInputChange("birth_weight", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="current_weight" className="text-right">
                    {t("Current Weight (kg)")}
                  </Label>
                  <Input
                    id="current_weight"
                    name="current_weight"
                    type="number"
                    step="0.01"
                    value={formData.current_weight}
                    onChange={(e) => handleInputChange("current_weight", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weaning_date" className="text-right">
                    {t("Weaning Date")}
                  </Label>
                  <Input
                    id="weaning_date"
                    name="weaning_date"
                    type="date"
                    value={formData.weaning_date}
                    onChange={(e) => handleInputChange("weaning_date", e.target.value)}
                    className="col-span-3"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weaning_weight" className="text-right">
                    {t("Weaning Weight (kg)")}
                  </Label>
                  <Input
                    id="weaning_weight"
                    name="weaning_weight"
                    type="number"
                    step="0.01"
                    value={formData.weaning_weight}
                    onChange={(e) => handleInputChange("weaning_weight", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                {formData.gender === "female" && formData.life_stage !== "calf" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">{t("Gestation Status")}</Label>
                      <Select
                        value={formData.gestation_status}
                        onValueChange={(value) => handleSelectChange("gestation_status", value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_pregnant">{t("Not Pregnant")}</SelectItem>
                          <SelectItem value="pregnant">{t("Pregnant")}</SelectItem>
                          <SelectItem value="in_oestrus">{t("In Oestrus")}</SelectItem>
                          <SelectItem value="missed_oestrus">{t("Missed Oestrus")}</SelectItem>
                          <SelectItem value="dry_off">{t("Dry Off")}</SelectItem>
                          <SelectItem value="calving">{t("Calving")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">{t("Gestation Stage")}</Label>
                      <Select
                        value={formData.gestation_stage}
                        onValueChange={(value) => handleSelectChange("gestation_stage", value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_pregnant">{t("Not Pregnant")}</SelectItem>
                          <SelectItem value="first_trimester">{t("First Trimester")}</SelectItem>
                          <SelectItem value="second_trimester">{t("Second Trimester")}</SelectItem>
                          <SelectItem value="third_trimester">{t("Third Trimester")}</SelectItem>
                          <SelectItem value="calving">{t("Calving")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="last_insemination_date" className="text-right">
                        {t("Last Insemination Date")}
                      </Label>
                      <Input
                        id="last_insemination_date"
                        name="last_insemination_date"
                        type="date"
                        value={formData.last_insemination_date}
                        onChange={(e) => handleInputChange("last_insemination_date", e.target.value)}
                        className="col-span-3"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="expected_calving_date" className="text-right">
                        {t("Expected Calving Date")}
                      </Label>
                      <Input
                        id="expected_calving_date"
                        name="expected_calving_date"
                        type="date"
                        value={formData.expected_calving_date}
                        onChange={(e) => handleInputChange("expected_calving_date", e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="last_calving_date" className="text-right">
                    {t("Last Calving Date")}
                  </Label>
                  <Input
                    id="last_calving_date"
                    name="last_calving_date"
                    type="date"
                    value={formData.last_calving_date}
                    onChange={(e) => handleInputChange("last_calving_date", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expected_insemination_date" className="text-right">
                    {t("Expected Insemination Date")}
                  </Label>
                  <Input
                    id="expected_insemination_date"
                    name="expected_insemination_date"
                    type="date"
                    value={formData.expected_insemination_date}
                    onChange={(e) => handleInputChange("expected_insemination_date", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dam_id" className="text-right">
                    {t("Dam ID")}
                  </Label>
                  <Input
                    id="dam_id"
                    name="dam_id"
                    value={formData.dam_id}
                    onChange={(e) => handleInputChange("dam_id", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sire_id" className="text-right">
                    {t("Sire ID")}
                  </Label>
                  <Input
                    id="sire_id"
                    name="sire_id"
                    value={formData.sire_id}
                    onChange={(e) => handleInputChange("sire_id", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t("Service Bull")}</Label>
                  <div className="col-span-3">
                    <Checkbox
                      id="is_service_bull"
                      checked={formData.is_service_bull}
                      onCheckedChange={(checked) => handleCheckboxChange("is_service_bull", Boolean(checked))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t("Purchased")}</Label>
                  <div className="col-span-3">
                    <Checkbox
                      id="is_purchased"
                      checked={formData.is_purchased}
                      onCheckedChange={(checked) => handleCheckboxChange("is_purchased", Boolean(checked))}
                    />
                  </div>
                </div>

                {formData.is_purchased && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="purchase_date" className="text-right">
                        {t("Purchase Date")}
                      </Label>
                      <Input
                        id="purchase_date"
                        name="purchase_date"
                        type="date"
                        value={formData.purchase_date}
                        onChange={(e) => handleInputChange("purchase_date", e.target.value)}
                        className="col-span-3"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="purchase_source" className="text-right">
                        {t("Purchase Source")}
                      </Label>
                      <Input
                        id="purchase_source"
                        name="purchase_source"
                        value={formData.purchase_source}
                        onChange={(e) => handleInputChange("purchase_source", e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t("Milking Frequency")}</Label>
                  <Select
                    value={formData.milking_frequency}
                    onValueChange={(value) => handleSelectChange("milking_frequency", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">{t("Once a day")}</SelectItem>
                      <SelectItem value="twice">{t("Twice a day")}</SelectItem>
                      <SelectItem value="thrice">{t("Three times a day")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="custom_milking_times" className="text-right">
                    {t("Custom Milking Times")}
                  </Label>
                  <Input
                    id="custom_milking_times"
                    name="custom_milking_times"
                    value={formData.custom_milking_times}
                    onChange={(e) => handleInputChange("custom_milking_times", e.target.value)}
                    className="col-span-3"
                    placeholder={t("Comma separated e.g. 06:00,14:00")}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="avg_daily_milk" className="text-right">
                    {t("Avg Daily Milk (L)")}
                  </Label>
                  <Input
                    id="avg_daily_milk"
                    name="avg_daily_milk"
                    type="number"
                    step="0.01"
                    value={formData.avg_daily_milk}
                    onChange={(e) => handleInputChange("avg_daily_milk", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="photo" className="text-right">
                    {t("Photo")}
                  </Label>
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="col-span-3"
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={isPosting || isUpdating}>
                    {(isPosting || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {selectedCattle ? t("Update") : t("Add")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="all" className="space-y-4">
          <AllAnimals
            animals={cattleData?.results || []}
            onEdit={(cattle) => {
              setSelectedCattle(cattle)
              setFormData(toFormState(cattle))
              setOpen(true)
            }}
            onDelete={handleDelete}
            isLoading={isFetchingCattle}
          />
        </TabsContent>

        <TabsContent value="pregnant" className="space-y-4">
          <AllAnimals
            animals={pregnantCattleData?.results || []}
            onEdit={(cattle) => {
              setSelectedCattle(cattle)
              setFormData(toFormState(cattle))
              setOpen(true)
            }}
            onDelete={handleDelete}
            isLoading={isFetchingCattle}
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {gestationData?.results
            ?.filter((item: any) => (item.alerts?.length || 0) > 0)
            .map((item: any) => (
              <Card key={item.cattle.id}>
                <CardHeader>
                  <CardTitle>{item.cattle.ear_tag_no}</CardTitle>
                  <CardDescription>{item.cattle.breed}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {item.alerts.map((alert: any, index: number) => (
                      <Alert key={index} variant={alert.priority?.toLowerCase() === "high" ? "destructive" : "default"}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>{alert.priority}</AlertTitle>
                        <AlertDescription>{alert.message || alert.description}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
