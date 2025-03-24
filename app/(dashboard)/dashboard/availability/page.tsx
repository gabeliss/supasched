'use client';

import { useState, useEffect } from 'react';
import { AvailabilityForm } from '../../../../components/availability/AvailabilityForm';
import { AvailabilityList } from '../../../../components/availability/AvailabilityList';
import { Button } from '../../../../components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { Tables } from '../../../../lib/supabase/client';

// Type for availability data
type Availability = Tables<'availability'>;

export default function AvailabilityPage() {
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(0); // Used to reset the form by changing the key
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  
  // Toggle the form visibility for adding new entries
  const toggleForm = () => {
    // If we're editing, clear the selection
    if (selectedAvailability) {
      setSelectedAvailability(null);
    }
    setShowForm(prev => !prev);
  };
  
  // Handle edit request
  const handleEdit = (availability: Availability) => {
    setSelectedAvailability(availability);
    setShowForm(true);
  };
  
  // Handle successful form submission
  const handleFormSuccess = () => {
    // Hide the form
    setShowForm(false);
    
    // Clear any selected availability
    setSelectedAvailability(null);
    
    // Reset the form by changing the key
    setFormKey(prev => prev + 1);
    
    // Trigger a refetch of the availability list
    setRefetchTrigger(prev => prev + 1);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Availability</h1>
        <Button 
          onClick={toggleForm}
          variant={showForm ? "destructive" : "default"}
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Availability
            </>
          )}
        </Button>
      </div>
      
      {showForm && (
        <div className="mb-6">
          <AvailabilityForm 
            key={formKey}
            onSuccess={handleFormSuccess} 
            availabilityToEdit={selectedAvailability}
          />
        </div>
      )}
      
      <AvailabilityList 
        onEdit={handleEdit} 
        refetchTrigger={refetchTrigger}
      />
    </div>
  );
} 