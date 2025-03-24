'use client';

import { useState, useCallback } from 'react';
import { Tables } from '../../../../lib/supabase/client';

import { AvailabilityForm } from '../../../../components/availability/AvailabilityForm';
import { AvailabilityList } from '../../../../components/availability/AvailabilityList';
import { CalendarView } from '../../../../components/availability/CalendarView';
import { Button } from '../../../../components/ui/button';
import { PlusCircle, CalendarDays, List } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';

// Type for availability data
type Availability = Tables<'availability'>;

export default function AvailabilityPage() {
  // State to track whether the form is visible
  const [showForm, setShowForm] = useState(false);
  // State to track the availability being edited
  const [availabilityToEdit, setAvailabilityToEdit] = useState<Availability | null>(null);
  // Trigger to refetch data when a successful submission occurs
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  // State to track the view mode (list or calendar)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Toggle form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
    // Clear any edit state when toggling the form
    if (availabilityToEdit) {
      setAvailabilityToEdit(null);
    }
  };

  // Handle edit request from the AvailabilityList
  const handleEdit = useCallback((availability: Availability) => {
    setAvailabilityToEdit(availability);
    setShowForm(true);
  }, []);

  // Handle successful form submission
  const handleSuccess = useCallback(() => {
    // Hide the form
    setShowForm(false);
    // Clear edit state
    setAvailabilityToEdit(null);
    // Trigger refetch by incrementing the trigger value
    setRefetchTrigger(prev => prev + 1);
  }, []);
  
  // Handle click on a date in the calendar
  const handleDateClick = useCallback((date: Date) => {
    // Pre-fill the form with the selected date
    const now = new Date();
    const startTime = new Date(date);
    startTime.setHours(now.getHours());
    startTime.setMinutes(0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    // Show form with pre-filled date
    setShowForm(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header with action buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Availability</h1>
        
        <div className="flex items-center gap-2">
          <Button onClick={toggleForm} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            {showForm ? 'Cancel' : 'Add Availability'}
          </Button>
        </div>
      </div>

      {/* Conditionally show the form */}
      {showForm && (
        <AvailabilityForm 
          onSuccess={handleSuccess}
          availabilityToEdit={availabilityToEdit}
        />
      )}

      {/* View toggle */}
      <Tabs defaultValue="list" value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'calendar')}>
        <TabsList className="grid w-[300px] grid-cols-2">
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-4">
          <AvailabilityList
            onEdit={handleEdit}
            refetchTrigger={refetchTrigger}
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <CalendarView 
            onDateClick={handleDateClick}
            refetchTrigger={refetchTrigger}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 