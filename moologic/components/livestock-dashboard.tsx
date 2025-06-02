"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTranslation } from "@/components/providers/language-provider"
import { Plus, AlertTriangle, Loader2 } from "lucide-react"
import { AllAnimals } from "@/components/all-animals"
import {
  useGetCattleDataQuery,
  useGetPregnantCattleQuery,
  useGetGestationDataQuery,
  usePostCattleMutation,
  useUpdateCattleMutation,
  useDeleteCattleMutation,
  useGenerateCattleAlertsQuery,
} from "@/lib/service/cattleService"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { format, differenceInMonths } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

// Interface for Cattle data based on backend model
interface Cattle {
  id: string
  ear_tag_no: string
  breed?: string
  birth_date?: string
  gender: "male" | "female"
  life_stage: "calf" | "heifer" | "cow" | "bull"
  dam_id?: string
  sire_id?: string
  is_purchased: boolean
  purchase_date?: string
  purchase_source?: string
  gestation_status: "not_pregnant" | "pregnant" | "calving"
  health_status: "healthy" | "sick"
  last_insemination_date?: string
  last_calving_date?: string
  expected_calving_date?: string
  expected_insemination_date?: string
  photo?: File | string
}

// Skeleton component for animal list
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

// Skeleton component for statistics cards
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
  const router = useRouter()

  // Fetch data using RTK Query hooks
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

  // Mutations
  const [postCattle, { isLoading: isPosting }] = usePostCattleMutation()
  const [updateCattle, { isLoading: isUpdating }] = useUpdateCattleMutation()
  const [deleteCattle, { isLoading: isDeleting }] = useDeleteCattleMutation()

  // Local state
  const [activeTab, setActiveTab] = useState("all")
  const [open, setOpen] = useState(false)
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null)

  // Form state
  type FormDataType = {
    breed: string;
    birth_date: string;
    gender: "male" | "female";
    life_stage: "calf" | "heifer" | "cow" | "bull";
    ear_tag_no: string;
    dam_id: string;
    sire_id: string;
    is_purchased: boolean;
    purchase_date: string;
    purchase_source: string;
    gestation_status: "not_pregnant" | "pregnant" | "calving";
    health_status: "healthy" | "sick";
    last_insemination_date: string;
    photo?: File;
  };

  const [formData, setFormData] = useState<FormDataType>({
    breed: "",
    birth_date: "",
    gender: "female",
    life_stage: "calf",
    ear_tag_no: "",
    dam_id: "",
    sire_id: "",
    is_purchased: false,
    purchase_date: "",
    purchase_source: "",
    gestation_status: "not_pregnant",
    health_status: "healthy",
    last_insemination_date: "",
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        breed: "",
        birth_date: "",
        gender: "female",
        life_stage: "calf",
        ear_tag_no: "",
        dam_id: "",
        sire_id: "",
        is_purchased: false,
        purchase_date: "",
        purchase_source: "",
        gestation_status: "not_pregnant",
        health_status: "healthy",
        last_insemination_date: "",
  })
      setSelectedCattle(null)
    }
  }, [open])

  // Calculate life stage based on birth date and gender
  const calculateLifeStage = (birthDate: string, gender: string): string => {
    if (!birthDate) return gender === "female" ? "calf" : "bull"
    
    const ageInMonths = differenceInMonths(new Date(), new Date(birthDate))
    
    if (gender === "female") {
      if (ageInMonths < 6) return "calf"
      if (ageInMonths < 24) return "heifer"
      return "cow"
    } else {
      if (ageInMonths < 6) return "calf"
      return "bull"
    }
  }

  // Validate life stage based on birth date and gender
  const validateLifeStage = (birthDate: string, gender: string, currentLifeStage: string): boolean => {
    const calculatedStage = calculateLifeStage(birthDate, gender)
    return calculatedStage === currentLifeStage
  }

  // Handle input changes with validation
  const handleInputChange = (name: keyof FormDataType, value: any) => {
    setFormData(prev => {
      const updatedData = { ...prev };
      if (name === 'gender') {
        updatedData.gender = value as "male" | "female";
      } else if (name === 'life_stage') {
        updatedData.life_stage = value as "calf" | "heifer" | "cow" | "bull";
      } else if (name === 'gestation_status') {
        updatedData.gestation_status = value as "not_pregnant" | "pregnant" | "calving";
      } else if (name === 'health_status') {
        updatedData.health_status = value as "healthy" | "sick";
      } else if (name === 'is_purchased') {
        updatedData.is_purchased = Boolean(value);
      } else {
        updatedData[name] = value;
      }
      return updatedData;
    });
  };

  // Handle select changes with validation
  const handleSelectChange = (name: string, value: string) => {
    if (name === "gender") {
      const newLifeStage = calculateLifeStage(formData.birth_date, value)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        life_stage: newLifeStage,
        // Reset gestation status for males or calves
        ...(value === "male" || newLifeStage === "calf" ? { gestation_status: "not_pregnant" } : {})
      }))
    } else if (name === "life_stage") {
      if (formData.birth_date) {
        const isValid = validateLifeStage(formData.birth_date, formData.gender, value)
        if (!isValid) {
          toast({
            title: t("Invalid Life Stage"),
            description: t("The selected life stage does not match the animal's age and gender."),
            variant: "destructive",
          })
          // Set to calculated life stage instead
          const correctLifeStage = calculateLifeStage(formData.birth_date, formData.gender)
          setFormData((prev) => ({
            ...prev,
            life_stage: correctLifeStage,
            // Reset gestation status for calves
            ...(correctLifeStage === "calf" ? { gestation_status: "not_pregnant" } : {})
          }))
          return
        }
      }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
        // Reset gestation status for calves
        ...(value === "calf" ? { gestation_status: "not_pregnant" } : {})
    }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  // Handle form submission with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCattle) {
        await updateCattle({
          accessToken,
          id: selectedCattle.id,
          updates: formData
        }).unwrap();
        toast({
          title: t("Success"),
          description: t("Cattle updated successfully"),
        });
      } else {
        await postCattle({
          accessToken,
          ...formData
        }).unwrap();
        toast({
          title: t("Success"),
          description: t("Cattle added successfully"),
        });
      }
      setOpen(false);
      refetchCattle();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: t("Error"),
        description: t("Failed to save cattle"),
        variant: "destructive",
      });
    }
  };

  // Handle cattle deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteCattle({ accessToken, id }).unwrap()
      toast({
        title: t("Success"),
        description: t("Cattle deleted successfully."),
      })
    } catch (error: any) {
      toast({
        title: t("Error"),
        description: error.data?.message || t("An error occurred while deleting the cattle."),
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = (id: string) => {
    router.push(`/cattle/${id}/detail`)
  }

  // Show error state if any of the queries fail
  if (cattleError || pregnantError || gestationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t("Error")}</AlertTitle>
        <AlertDescription>
          {t("An error occurred while fetching the data. Please try again later.")}
        </AlertDescription>
      </Alert>
    )
  }

  // Show loading state
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
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Total Cattle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cattleData?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t("Total number of cattle in the farm")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Pregnant Cattle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pregnantCattleData?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t("Number of pregnant cattle")}
            </p>
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
            <p className="text-xs text-muted-foreground">
              {t("Cattle expected to calve soon")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Health Alerts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gestationData?.results?.reduce((acc: number, curr: any) => acc + curr.alerts.length, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Active health alerts")}
            </p>
          </CardContent>
        </Card>
        </div>

      {/* Tabs and Content */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                  {selectedCattle ? t("Edit Cattle") : t("Add New Cattle")}
                </DialogTitle>
            </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="photo" className="text-right">
                      {t("Photo")}
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="col-span-3"
                      />
                      {selectedCattle && selectedCattle.photo && (
                        <div className="mt-2">
                          <img
                            src={typeof selectedCattle.photo === 'string' ? selectedCattle.photo : URL.createObjectURL(selectedCattle.photo)}
                            alt={t("Current photo")}
                            className="max-w-full h-auto max-h-[300px] object-contain rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ear_tag_no" className="text-right">
                      {t("Ear Tag No.")} *
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
                    <div className="col-span-3">
                      <Select
                        value={formData.breed || ""}
                        onValueChange={(value) => handleInputChange("breed", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select breed")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local Breed</SelectItem>
                          <SelectItem value="boran">Boran</SelectItem>
                          <SelectItem value="fogera">Fogera</SelectItem>
                          <SelectItem value="horro">Horro</SelectItem>
                          <SelectItem value="sheko">Sheko</SelectItem>
                          <SelectItem value="begait">Begait</SelectItem>
                          <SelectItem value="raya">Raya</SelectItem>
                          <SelectItem value="abigar">Abigar</SelectItem>
                          <SelectItem value="arsi">Arsi</SelectItem>
                          <SelectItem value="holstein_friesian">Holstein Friesian</SelectItem>
                          <SelectItem value="jersey">Jersey</SelectItem>
                          <SelectItem value="crossbreed">Cross Breed</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
              </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="birth_date" className="text-right">
                      {t("Birth Date")} *
                    </Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange("birth_date", e.target.value)}
                      className="col-span-3"
                  required
                      max={new Date().toISOString().split('T')[0]}
                />
              </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{t("Gender")} *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
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
                    <Label className="text-right">{t("Life Stage")} *</Label>
                <Select
                  value={formData.life_stage}
                  onValueChange={(value) => handleSelectChange("life_stage", value)}
                >
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
                    <Label className="text-right">{t("Health Status")} *</Label>
                <Select
                  value={formData.health_status}
                  onValueChange={(value) => handleSelectChange("health_status", value)}
                >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthy">{t("Healthy")}</SelectItem>
                    <SelectItem value="sick">{t("Sick")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                  {formData.gender === "female" && formData.life_stage !== "calf" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">{t("Gestation Status")} *</Label>
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
                          <SelectItem value="calving">{t("Calving")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
                      placeholder={t("Mother's ear tag number")}
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
                      placeholder={t("Father's ear tag number")}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{t("Purchased")}</Label>
                    <div className="col-span-3">
                <Checkbox
                  checked={formData.is_purchased}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("is_purchased", checked as boolean)
                        }
                />
                    </div>
              </div>
              {formData.is_purchased && (
                <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="purchase_date" className="text-right">
                          {t("Purchase Date")} *
                        </Label>
                    <Input
                      id="purchase_date"
                      name="purchase_date"
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => handleInputChange("purchase_date", e.target.value)}
                          className="col-span-3"
                      required
                          max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="purchase_source" className="text-right">
                          {t("Source")} *
                        </Label>
                    <Input
                      id="purchase_source"
                      name="purchase_source"
                      value={formData.purchase_source}
                      onChange={(e) => handleInputChange("purchase_source", e.target.value)}
                          className="col-span-3"
                          required
                          placeholder={t("Seller or market name")}
                    />
                  </div>
                </>
              )}
                  {formData.gender === "female" && formData.life_stage !== "calf" && formData.gestation_status !== "not_pregnant" && (
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
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isPosting || isUpdating}
                  >
                    {(isPosting || isUpdating) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
              setFormData({
                ...formData,
                ...cattle,
              })
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
              setFormData({
                ...formData,
                ...cattle,
              })
              setOpen(true)
            }}
            onDelete={handleDelete}
            isLoading={isFetchingCattle}
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {gestationData?.results?.map((item: any) => (
            item.alerts.length > 0 && (
              <Card key={item.cattle.id}>
            <CardHeader>
                  <CardTitle>{item.cattle.ear_tag_no}</CardTitle>
                  <CardDescription>{item.cattle.breed}</CardDescription>
            </CardHeader>
            <CardContent>
                  <div className="space-y-2">
                    {item.alerts.map((alert: any, index: number) => (
                      <Alert key={index} variant={alert.priority === "High" ? "destructive" : "default"}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>{alert.priority}</AlertTitle>
                        <AlertDescription>{alert.message}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
            </CardContent>
          </Card>
            )
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}