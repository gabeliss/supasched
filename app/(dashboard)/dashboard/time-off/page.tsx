'use client';

import { useState, useCallback } from 'react';
import { Tables } from '../../../../lib/supabase/client';

import { TimeOffForm } from '../../../../components/time-off/TimeOffForm';
import { TimeOffList } from '../../../../components/time-off/TimeOffList';
import { Button } from '../../../../components/ui/button';
import { PlusCircle } from 'lucide-react';

// Type for time-off data
type TimeOff = Tables<'time_off'>;

export default function TimeOffPage() {
  // State to track whether the form is visible
  const [showForm, setShowForm] = useState(false);
  // State to track the time-off entry being edited
  const [timeOffToEdit, setTimeOffToEdit] = useState<TimeOff | null>(null);
  // Trigger to refetch data when a successful submission occurs
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Toggle form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
    // Clear any edit state when toggling the form
    if (timeOffToEdit) {
      setTimeOffToEdit(null);
    }
  };

  // Handle edit request from the TimeOffList
  const handleEdit = useCallback((timeOff: TimeOff) => {
    setTimeOffToEdit(timeOff);
    setShowForm(true);
  }, []);

  // Handle successful form submission
  const handleSuccess = useCallback(() => {
    // Hide the form
    setShowForm(false);
    // Clear edit state
    setTimeOffToEdit(null);
    // Trigger refetch by incrementing the trigger value
    setRefetchTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Time Off</h1>
        <Button onClick={toggleForm} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'Add Time Off'}
        </Button>
      </div>

      {/* Conditionally show the form */}
      {showForm && (
        <TimeOffForm 
          onSuccess={handleSuccess}
          timeOffToEdit={timeOffToEdit}
        />
      )}

      {/* List of time-off entries */}
      <TimeOffList
        onEdit={handleEdit}
        refetchTrigger={refetchTrigger}
      />
    </div>
  );
} 