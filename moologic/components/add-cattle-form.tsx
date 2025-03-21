"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
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

const formSchema = z.object({
  ear_tag_no: z.string().min(1, {
    message: "Ear tag number is required.",
  }),
  breed: z.string().optional(),
  birth_date: z.date().optional(),
  gender: z.enum(["male", "female"]),
  dam_id: z.string().optional(),
  sire_id: z.string().optional(),
  is_purchased: z.boolean().default(false),
  purchase_date: z.date().optional(),
  purchase_source: z.string().optional(),
  notes: z.string().optional(),
})

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
      dam_id: "",
      sire_id: "",
      is_purchased: false,
      purchase_source: "",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await dispatch(addCattle(values)).unwrap()
      toast({
        title: t("Success"),
        description: t("Animal added successfully."),
      })
      router.push("/livestock")
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to add animal. Please try again."),
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

