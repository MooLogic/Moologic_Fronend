'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, differenceInDays, addWeeks, subWeeks, parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useGetPregnantCattleQuery, useCreateBirthRecordMutation, useUpdateBirthRecordMutation } from '@/lib/service/cattleService';

interface Cattle {
  id: number;
  ear_tag_no: string;
  expected_calving_date: string | null;
  gestation_status: 'pregnant' | 'calving' | 'open' | 'inseminated';
  photo?: string | null;
  breed: string;
  birth_date: string;
  gender: 'male' | 'female';
  life_stage: string;
  health_status: string;
  farm: number;
}

interface ExtendedSession extends Record<string, any> {
  user: {
    accessToken: string;
    [key: string]: any;
  };
}

interface CalvingRecordFormProps {
  open: boolean;
  onClose: () => void;
  record?: any;
}

const formSchema = z.object({
  cattle: z.string().min(1, 'Please select a cattle'),
  calving_date: z.string().min(1, 'Calving date is required'),
  calving_outcome: z.enum(['successful', 'complications', 'stillborn', 'died_shortly_after']),
  calf_count: z.number().min(1, 'At least one calf is required'),
  calf_gender: z.string().min(1, 'Please select calf gender'),
  calf_weight: z.string().min(1, 'Calf weight is required'),
  calf_ear_tag: z.string().min(1, 'Calf ear tag is required'),
  complications: z.string().optional(),
  veterinary_assistance: z.boolean().default(false),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CalvingRecordForm({ open, onClose, record }: CalvingRecordFormProps) {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const { toast } = useToast();
  const [createBirthRecord] = useCreateBirthRecordMutation();
  const [updateBirthRecord] = useUpdateBirthRecordMutation();
  
  // Debug logging for session
  useEffect(() => {
    console.group('Session Debug');
    console.log('Session:', session);
    console.log('Access Token:', session?.user?.accessToken);
    console.groupEnd();
  }, [session]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cattle: '',
      calving_date: format(new Date(), 'yyyy-MM-dd'),
      calving_outcome: 'successful',
      calf_count: 1,
      calf_gender: '',
      calf_weight: '',
      calf_ear_tag: '',
      complications: '',
      veterinary_assistance: false,
      notes: '',
    },
  });

  const { data: pregnantCattleData, isLoading: isLoadingCattle, error: cattleError } = useGetPregnantCattleQuery(
    { accessToken: session?.user?.accessToken || '' },
    { 
      skip: !session?.user?.accessToken,
      pollingInterval: 30000,
    }
  );

  // Debug logging for API response
  useEffect(() => {
    console.group('Pregnant Cattle API Debug');
    console.log('Loading:', isLoadingCattle);
    console.log('Error:', cattleError);
    console.log('Data:', pregnantCattleData);
    console.log('Using Access Token:', session?.user?.accessToken);
    if (cattleError) {
      console.error('API Error:', cattleError);
    }
    console.groupEnd();
  }, [pregnantCattleData, isLoadingCattle, cattleError, session?.user?.accessToken]);

  const selectedCattleId = form.watch('cattle');
  const selectedCalvingDate = form.watch('calving_date');
  const selectedCattle = pregnantCattleData?.results?.find(
    (c) => c.id.toString() === selectedCattleId
  ) as Cattle | undefined;

  // Show error toast if API call fails
  useEffect(() => {
    if (cattleError) {
      toast({
        title: "Error",
        description: "Failed to load pregnant cattle. Please try again.",
        variant: "destructive",
      });
    }
  }, [cattleError, toast]);

  // Record effect
  useEffect(() => {
    if (record) {
      form.reset({
        cattle: record.cattle.id.toString(),
        calving_date: format(new Date(record.calving_date), 'yyyy-MM-dd'),
        calving_outcome: record.calving_outcome,
        calf_count: record.calf_count,
        calf_gender: record.calf_gender,
        calf_weight: record.calf_weight,
        calf_ear_tag: record.calf_ear_tag,
        complications: record.complications || '',
        veterinary_assistance: record.veterinary_assistance,
        notes: record.notes || '',
      });
    }
  }, [record, form]);

  // Add validation effect for calving date
  useEffect(() => {
    if (selectedCattle?.expected_calving_date && selectedCalvingDate) {
      const expectedDate = parseISO(selectedCattle.expected_calving_date);
      const calvingDate = parseISO(selectedCalvingDate);
      const minAllowedDate = subWeeks(expectedDate, 3);
      const maxAllowedDate = addWeeks(expectedDate, 3);
      
      if (calvingDate < minAllowedDate || calvingDate > maxAllowedDate) {
        form.setError('calving_date', {
          type: 'manual',
          message: `Warning: Selected date is too far from expected calving date (${format(expectedDate, 'MMM dd, yyyy')}). Please verify this is correct.`
        });
      } else {
        form.clearErrors('calving_date');
      }
    }
  }, [selectedCattle?.expected_calving_date, selectedCalvingDate, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Debug log the form values
      console.log('Submitting form values:', values);

      // Additional validation for complications
      if (values.calving_outcome !== 'successful' && !values.complications) {
        toast({
          title: 'Error',
          description: 'Please provide details about the complications',
          variant: 'destructive',
        });
        return;
      }

      // Additional validation for veterinary assistance
      if (values.calving_outcome !== 'successful' && !values.veterinary_assistance) {
        toast({
          title: 'Error',
          description: 'Please indicate if veterinary assistance was provided',
          variant: 'destructive',
        });
        return;
      }

      // Validate multiple births
      if (values.calf_count > 1) {
        if (!values.notes) {
          toast({
            title: 'Error',
            description: 'Please provide notes for multiple births',
            variant: 'destructive',
          });
          return;
        }
        
        const genderCount = values.calf_gender.split(',').length;
        const earTagCount = values.calf_ear_tag.split(',').length;
        
        if (genderCount !== values.calf_count || earTagCount !== values.calf_count) {
          toast({
            title: 'Error',
            description: 'Number of genders and ear tags must match calf count',
            variant: 'destructive',
          });
          return;
        }
      }

      const submissionData = {
        ...values,
        calf_ear_tag: values.calf_ear_tag.trim(),
        complications: values.complications?.trim() || '',
        veterinary_assistance: values.veterinary_assistance,
      };

      if (record) {
        const response = await updateBirthRecord({
          accessToken: session?.user?.accessToken || '',
          id: record.id,
          ...submissionData,
        }).unwrap();
        
        console.log('Update response:', response);
        
        toast({
          title: 'Success',
          description: 'Birth record updated successfully',
        });
      } else {
        const response = await createBirthRecord({
          accessToken: session?.user?.accessToken || '',
          ...submissionData,
        }).unwrap();
        
        console.log('Create response:', response);
        
        toast({
          title: 'Success',
          description: 'Birth record created successfully',
        });
      }
      onClose();
    } catch (error: any) {
      console.error('Error saving birth record:', error);
      toast({
        title: 'Error',
        description: error?.data?.message || error?.message || 'Failed to save birth record',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {record ? 'Edit Birth Record' : 'Add New Birth Record'}
          </DialogTitle>
          <DialogDescription>
            {isLoadingCattle ? (
              "Loading available cattle..."
            ) : cattleError ? (
              "Error loading cattle data. Please try again."
            ) : !pregnantCattleData?.results?.length ? (
              "No pregnant cattle available for calving records. Please ensure cattle are marked as pregnant in the system."
            ) : (
              "Select a pregnant cattle to record calving details."
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cattle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cattle</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset calving date when cattle changes
                      form.setValue('calving_date', format(new Date(), 'yyyy-MM-dd'));
                    }}
                    defaultValue={field.value}
                    disabled={isLoadingCattle}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCattle ? "Loading..." : "Select cattle"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCattle ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                      ) : !pregnantCattleData?.results?.length ? (
                        <SelectItem value="no-cattle">No pregnant cattle available</SelectItem>
                      ) : (
                        pregnantCattleData.results.map((cattle) => (
                          <SelectItem
                            key={cattle.id}
                            value={cattle.id.toString()}
                          >
                            {cattle.ear_tag_no} - Due: {cattle.expected_calving_date ? format(new Date(cattle.expected_calving_date), 'MMM dd, yyyy') : 'Unknown'}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {selectedCattle?.expected_calving_date && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Expected calving date: {format(new Date(selectedCattle.expected_calving_date), 'MMMM dd, yyyy')}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="calving_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calving Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        // This will trigger the validation effect
                        form.trigger('calving_date');
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-yellow-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="calving_outcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outcome</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select outcome" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="successful">Successful</SelectItem>
                      <SelectItem value="complications">Complications</SelectItem>
                      <SelectItem value="stillborn">Stillborn</SelectItem>
                      <SelectItem value="died_shortly_after">Died Shortly After</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="calf_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Calves</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="calf_gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calf Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male,female">Male & Female (Twins)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="calf_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calf Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="calf_ear_tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calf Ear Tag</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter ear tag number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="complications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complications</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe any complications..."
                      disabled={form.watch('calving_outcome') === 'successful'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="veterinary_assistance"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-4 h-4"
                      disabled={form.watch('calving_outcome') === 'successful'}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Veterinary Assistance Required</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Additional notes..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {record ? 'Update Record' : 'Add Record'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 