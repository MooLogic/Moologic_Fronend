"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format, differenceInMonths } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"
import { addCattle } from "@/redux/features/cattle/cattleSlice"
import type { AppDispatch } from "@/redux/store"

// Schema with custom validation
const formSchema = z.object({
  ear_tag_no: z.string().min(1, { message: "Ear tag number is required." }).regex(/^[A-Za-z0-9-]+$/, {
    message: "Ear tag number must be alphanumeric with optional hyphens."
  }),
  breed: z.string().optional(),
  birth_date: z.date({
    required_error: "Birth date is required.",
    invalid_type_error: "Invalid date format."
  }).refine(date => date <= new Date(), { message: "Birth date cannot be in the future." }),
  gender: z.enum(["male", "female"], { required_error: "Gender is required." }),
  life_stage: z.enum(["calf", "heifer", "cow", "bull"], { required_error: "Life stage is required." }),
  dam_id: z.string().optional(),
  sire_id: z.string().optional(),
  is_purchased: z.boolean().default(false),
  purchase_date: z.date().optional().refine(
    (date) => !date || date <= new Date(),
    { message: "Purchase date cannot be in the future." }
  ),
  purchase_source: z.string().optional(),
  gestation_status: z.enum(["not_pregnant", "pregnant"]).optional(),
  health_status: z.enum(["healthy", "sick"], { required_error: "Health status is required." }),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validate life stage based on birth date and gender
  if (data.birth_date) {
    const ageInMonths = differenceInMonths(new Date(), data.birth_date);
    if (data.gender === "female") {
      if (ageInMonths < 12 && data.life_stage !== "calf") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["life_stage"],
          message: "Animal younger than 12 months must be a calf."
        });
      } else if (ageInMonths >= 12 && ageInMonths < 24 && data.life_stage !== "heifer") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["life_stage"],
          message: "Animal aged 12-24 months must be a heifer."
        });
      } else if (ageInMonths >= 24 && data.life_stage !== "cow") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["life_stage"],
          message: "Animal older than 24 months must be a cow."
        });
      }
    } else if (data.gender === "male" && data.life_stage !== "calf" && data.life_stage !== "bull") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["life_stage"],
        message: "Male animals must be calf or bull."
      });
    }
  }

  // Gestation status validation
  if (data.life_stage === "calf" && data.gestation_status && data.gestation_status !== "not_pregnant") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["gestation_status"],
      message: "Calves cannot have a pregnant gestation status."
    });
  }

  // Purchase date validation
  if (data.is_purchased && !data.purchase_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["purchase_date"],
      message: "Purchase date is required for purchased animals."
    });
  }
});

export function AddCattleForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()
  const [isPurchased, setIsPurchased] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ear_tag_no: "",
      breed: "",
      gender: "female",
      life_stage: "calf",
      dam_id: "",
      sire_id: "",
      is_purchased: false,
      purchase_source: "",
      gestation_status: "not_pregnant",
      health_status: "healthy",
      notes: "",
    },
  })

  // Calculate life stage based on birth date
  const calculateLifeStage = (
    birthDate: Date | undefined,
    gender: string
  ): "calf" | "heifer" | "cow" | "bull" => {
    if (!birthDate) return "calf";
    const ageInMonths = differenceInMonths(new Date(), birthDate);
    if (gender === "female") {
      if (ageInMonths < 12) return "calf";
      if (ageInMonths < 24) return "heifer";
      return "cow";
    }
    return ageInMonths < 12 ? "calf" : "bull";
  }

  // Watch birth_date and gender to update life_stage
  const birthDate = form.watch("birth_date");
  const gender = form.watch("gender");
  const lifeStage = form.watch("life_stage");

  // Update life_stage when birth_date or gender changes
  if (birthDate && form.getValues("life_stage") !== calculateLifeStage(birthDate, gender)) {
    form.setValue("life_stage", calculateLifeStage(birthDate, gender));
  }

  // Reset gestation_status if life_stage is calf
  if (lifeStage === "calf" && form.getValues("gestation_status") !== "not_pregnant") {
    form.setValue("gestation_status", "not_pregnant");
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        ...values,
        birth_date: format(values.birth_date, "yyyy-MM-dd"),
        purchase_date: values.purchase_date ? format(values.purchase_date, "yyyy-MM-dd") : "",
      };
      await dispatch(addCattle(payload)).unwrap()
      toast({
        title: t("Success"),
        description: t("Animal added successfully."),
      })
      router.push("/livestock")
    } catch (error: any) {
      toast({
        title: t("Error"),
        description: error.message || t("Failed to add animal. Please try again."),
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="ear_tag_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Ear Tag Number")}</FormLabel>
                <FormControl>
                  <Input placeholder="#123456" {...field} />
                </FormControl>
                <FormDescription>{t("The unique identifier for this animal.")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Breed")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("Holstein Friesian")} {...field} />
                </FormControl>
                <FormDescription>{t("The breed of the animal.")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Birth Date")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>{t("Pick a date")}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>{t("The birth date of the animal.")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Gender")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select gender")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="female">{t("Female")}</SelectItem>
                    <SelectItem value="male">{t("Male")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t("The gender of the animal.")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="life_stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Life Stage")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select life stage")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gender === "female" ? (
                      <>
                        <SelectItem value="calf">{t("Calf")}</SelectItem>
                        <SelectItem value="heifer">{t("Heifer")}</SelectItem>
                        <SelectItem value="cow">{t("Cow")}</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="calf">{t("Calf")}</SelectItem>
                        <SelectItem value="bull">{t("Bull")}</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>{t("The current life stage of the animal.")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="health_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Health Status")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select health status")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="healthy">{t("Healthy")}</SelectItem>
                    <SelectItem value="sick">{t("Sick")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t("The current health status of the animal.")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {(lifeStage === "heifer" || lifeStage === "cow") && (
            <FormField
              control={form.control}
              name="gestation_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Gestation Status")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select gestation status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="not_pregnant">{t("Not Pregnant")}</SelectItem>
                      <SelectItem value="pregnant">{t("Pregnant")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>{t("The current gestation status of the animal.")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="dam_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Dam ID")}</FormLabel>
                <FormControl>
                  <Input placeholder="#123456" {...field} />
                </FormControl>
                <FormDescription>{t("The ear tag number of the mother (if known).")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sire_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Sire ID")}</FormLabel>
                <FormControl>
                  <Input placeholder="#123456" {...field} />
                </FormControl>
                <FormDescription>{t("The ear tag number of the father (if known).")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_purchased"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Purchased Animal?")}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const boolValue = value === "true"
                    field.onChange(boolValue)
                    setIsPurchased(boolValue)
                  }}
                  defaultValue={field.value ? "true" : "false"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select option")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">{t("Yes")}</SelectItem>
                    <SelectItem value="false">{t("No")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t("Was this animal purchased from outside the farm?")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {isPurchased && (
            <>
              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("Purchase Date")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>{t("Pick a date")}</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>{t("The date when the animal was purchased.")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchase_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Purchase Source")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Farm name or seller")} {...field} />
                    </FormControl>
                    <FormDescription>{t("Where the animal was purchased from.")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t("Notes")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("Additional information about this animal...")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("Any additional information about this animal.")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/livestock")}>
            {t("Cancel")}
          </Button>
          <Button type="submit">{t("Add Animal")}</Button>
        </div>
      </form>
    </Form>
  )
}