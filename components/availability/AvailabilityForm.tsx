'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../lib/supabase/client';
import { formatDate, hasOverlap } from '../../lib/utils/dates';
import { toast } from 'sonner';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tables } from '../../lib/supabase/client';

// Type for availability data
type Availability = Tables<'availability'>;
type TimeOff = Tables<'time_off'>;

// Schema for form validation - following separation of concerns principle
const availabilityFormSchema = z.object({
  startTime: z.string()
    .min(1, { message: 'Start time is required' }),
  endTime: z.string()
    .min(1, { message: 'End time is required' }),
  recurrence: z.enum(['none', 'daily', 'weekly'], {
    required_error: 'Please select a recurrence pattern',
  }),
}).refine(data => {
  // Validate end time is after start time
  return new Date(data.endTime) > new Date(data.startTime);
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

// Type for the form data based on the schema
type AvailabilityFormValues = z.infer<typeof availabilityFormSchema>;

// Props for the component - focusing on clear interfaces
interface AvailabilityFormProps {
  onSuccess: () => void;
  initialValues?: AvailabilityFormValues;
  availabilityToEdit?: Availability | null;
}

// Default values for the form
const defaultValues: AvailabilityFormValues = {
  startTime: '',
  endTime: '',
  recurrence: 'none',
};

export function AvailabilityForm({ onSuccess, initialValues = defaultValues, availabilityToEdit }: AvailabilityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allAvailabilities, setAllAvailabilities] = useState<Availability[]>([]);
  const [allTimeOffs, setAllTimeOffs] = useState<TimeOff[]>([]);
  const isEditing = !!availabilityToEdit;
  
  // Fetch all availabilities and time-offs for conflict checking
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch availabilities
        const { data: availData, error: availError } = await supabase
          .from('availability')
          .select('*')
          .then(res => res);
        
        if (availError) throw availError;
        setAllAvailabilities(availData || []);
        
        // Fetch time-offs for conflict checking
        const { data: timeOffData, error: timeOffError } = await supabase
          .from('time_off')
          .select('*')
          .then(res => res);
        
        if (timeOffError) throw timeOffError;
        setAllTimeOffs(timeOffData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    
    fetchData();
  }, []);
  
  // Set form values when editing an existing availability
  useEffect(() => {
    if (availabilityToEdit) {
      // Format dates to local datetime string format for input elements
      const startDate = new Date(availabilityToEdit.start_time);
      const endDate = new Date(availabilityToEdit.end_time);
      
      const formattedStart = formatDateForInput(startDate);
      const formattedEnd = formatDateForInput(endDate);
      
      // Ensure recurrence is one of the allowed values
      const recurrence = availabilityToEdit.recurrence as 'none' | 'daily' | 'weekly' || 'none';
      
      form.reset({
        startTime: formattedStart,
        endTime: formattedEnd,
        recurrence: recurrence,
      });
    }
  }, [availabilityToEdit]);
  
  // Helper function to format dates for datetime-local input
  function formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  }
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: initialValues,
  });

  // Check for conflicts with existing availability slots
  const checkForAvailabilityConflicts = (start: Date, end: Date, currentId?: string): boolean => {
    return allAvailabilities.some(avail => {
      // Skip the current availability when editing
      if (currentId && avail.id === currentId) return false;
      
      const availStart = new Date(avail.start_time);
      const availEnd = new Date(avail.end_time);
      
      return hasOverlap(start, end, availStart, availEnd);
    });
  };
  
  // Check for conflicts with existing time-off slots
  const checkForTimeOffConflicts = (start: Date, end: Date): boolean => {
    return allTimeOffs.some(timeOff => {
      const timeOffStart = new Date(timeOff.start_time);
      const timeOffEnd = new Date(timeOff.end_time);
      
      return hasOverlap(start, end, timeOffStart, timeOffEnd);
    });
  };

  // Handle form submission
  const onSubmit = async (values: AvailabilityFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const startTime = new Date(values.startTime);
      const endTime = new Date(values.endTime);
      
      // Check for conflicts with other availability slots
      const hasAvailabilityConflict = checkForAvailabilityConflicts(
        startTime, 
        endTime,
        availabilityToEdit?.id
      );
      
      if (hasAvailabilityConflict) {
        toast.error('This time slot conflicts with an existing availability slot');
        return;
      }
      
      // Check for conflicts with time-off slots
      const hasTimeOffConflict = checkForTimeOffConflicts(startTime, endTime);
      
      if (hasTimeOffConflict) {
        toast.warning('This availability overlaps with your time off. Continue?', {
          action: {
            label: 'Continue Anyway',
            onClick: () => saveAvailability(values, user.id, startTime, endTime),
          },
        });
        return;
      }
      
      // No conflicts, proceed with saving
      await saveAvailability(values, user.id, startTime, endTime);
      
    } catch (error: any) {
      console.error('Error saving availability:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to save availability data
  const saveAvailability = async (
    values: AvailabilityFormValues,
    therapistId: string,
    startTime: Date,
    endTime: Date
  ) => {
    try {
      // Format the data for insertion/update
      const availabilityData = {
        therapist_id: therapistId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        recurrence: values.recurrence === 'none' ? null : values.recurrence,
      };
      
      let result;
      
      if (isEditing && availabilityToEdit) {
        // Update existing availability
        result = await supabase
          .from('availability')
          .update(availabilityData)
          .eq('id', availabilityToEdit.id)
          .select('id')
          .single();
          
        if (result.error) throw result.error;
        toast.success('Availability updated successfully');
      } else {
        // Insert new availability
        result = await supabase
          .from('availability')
          .insert(availabilityData)
          .select('id')
          .single();
          
        if (result.error) throw result.error;
        toast.success('Availability added successfully');
      }
      
      // Call the success callback provided by the parent
      onSuccess();
      
      // Reset the form
      form.reset(defaultValues);
    } catch (error: any) {
      console.error('Error saving availability:', error);
      toast.error(`Error: ${error.message}`);
      throw error; // Re-throw to be caught by the parent
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Availability' : 'Add Availability'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recurrence</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recurrence pattern" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">One-time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onSuccess()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 