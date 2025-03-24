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
import { Textarea } from '../ui/textarea';
import { Tables } from '../../lib/supabase/client';

// Type for time-off data
type TimeOff = Tables<'time_off'>;

// Schema for form validation - following separation of concerns principle
const timeOffFormSchema = z.object({
  startTime: z.string()
    .min(1, { message: 'Start time is required' }),
  endTime: z.string()
    .min(1, { message: 'End time is required' }),
  reason: z.string().optional(),
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
type TimeOffFormValues = z.infer<typeof timeOffFormSchema>;

// Props for the component - focusing on clear interfaces
interface TimeOffFormProps {
  onSuccess: () => void;
  initialValues?: TimeOffFormValues;
  timeOffToEdit?: TimeOff | null;
}

// Default values for the form
const defaultValues: TimeOffFormValues = {
  startTime: '',
  endTime: '',
  reason: '',
  recurrence: 'none',
};

export function TimeOffForm({ onSuccess, initialValues = defaultValues, timeOffToEdit }: TimeOffFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allTimeOffs, setAllTimeOffs] = useState<TimeOff[]>([]);
  const isEditing = !!timeOffToEdit;
  
  // Fetch all time-offs for conflict checking
  useEffect(() => {
    async function fetchTimeOffs() {
      try {
        const { data, error } = await supabase
          .from('time_off')
          .select('*')
          .then(res => res);
        
        if (error) throw error;
        setAllTimeOffs(data || []);
      } catch (err) {
        console.error('Error fetching time-offs:', err);
      }
    }
    
    fetchTimeOffs();
  }, []);
  
  // Set form values when editing an existing time-off entry
  useEffect(() => {
    if (timeOffToEdit) {
      // Format dates to local datetime string format for input elements
      const startDate = new Date(timeOffToEdit.start_time);
      const endDate = new Date(timeOffToEdit.end_time);
      
      const formattedStart = formatDateForInput(startDate);
      const formattedEnd = formatDateForInput(endDate);
      
      // Ensure recurrence is one of the allowed values
      const recurrence = timeOffToEdit.recurrence as 'none' | 'daily' | 'weekly' || 'none';
      
      form.reset({
        startTime: formattedStart,
        endTime: formattedEnd,
        reason: timeOffToEdit.reason || '',
        recurrence: recurrence,
      });
    }
  }, [timeOffToEdit]);
  
  // Helper function to format dates for datetime-local input
  function formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  }
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<TimeOffFormValues>({
    resolver: zodResolver(timeOffFormSchema),
    defaultValues: initialValues,
  });

  // Check for conflicts with existing time-off slots
  const checkForConflicts = (start: Date, end: Date, currentId?: string): boolean => {
    return allTimeOffs.some(toff => {
      // Skip the current time-off entry when editing
      if (currentId && toff.id === currentId) return false;
      
      const toffStart = new Date(toff.start_time);
      const toffEnd = new Date(toff.end_time);
      
      return hasOverlap(start, end, toffStart, toffEnd);
    });
  };

  // Handle form submission
  const onSubmit = async (values: TimeOffFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const startTime = new Date(values.startTime);
      const endTime = new Date(values.endTime);
      
      // Check for conflicts
      const hasConflict = checkForConflicts(
        startTime, 
        endTime,
        timeOffToEdit?.id
      );
      
      if (hasConflict) {
        toast.error('This time slot conflicts with an existing time-off slot');
        return;
      }
      
      // Format the data for insertion/update
      const timeOffData = {
        therapist_id: user.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        reason: values.reason || null,
        recurrence: values.recurrence === 'none' ? null : values.recurrence,
      };
      
      let result;
      
      if (isEditing && timeOffToEdit) {
        // Update existing time-off
        result = await supabase
          .from('time_off')
          .update(timeOffData)
          .eq('id', timeOffToEdit.id)
          .select('id')
          .single();
          
        if (result.error) throw result.error;
        toast.success('Time off updated successfully');
      } else {
        // Insert new time-off
        result = await supabase
          .from('time_off')
          .insert(timeOffData)
          .select('id')
          .single();
          
        if (result.error) throw result.error;
        toast.success('Time off added successfully');
      }
      
      // Call the success callback provided by the parent
      onSuccess();
      
      // Reset the form
      form.reset(defaultValues);
    } catch (error: any) {
      console.error('Error saving time off:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Time Off' : 'Add Time Off'}</CardTitle>
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the reason for this time off..."
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