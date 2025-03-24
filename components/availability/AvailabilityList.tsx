'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { formatDate, formatTimeRange } from '../../lib/utils/dates';
import { Tables } from '../../lib/supabase/client';
import { toast } from 'sonner';
import { Trash2, Pencil } from 'lucide-react';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

// Using type from Supabase schema - adhering to type safety
type Availability = Tables<'availability'>;

interface AvailabilityListProps {
  onEdit?: (availability: Availability) => void;
  refetchTrigger?: number;
}

// Separate component for empty state - adhering to small functional components principle
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="mb-2 text-lg font-semibold">No availability found</p>
      <p className="text-muted-foreground">Add your first availability slot to get started.</p>
    </div>
  );
}

// Component that formats recurrence pattern - small functional component
function RecurrenceLabel({ pattern }: { pattern: string | null }) {
  if (!pattern) {
    return <Badge variant="outline">One-time</Badge>;
  }
  
  switch (pattern) {
    case 'daily':
      return <Badge>Daily</Badge>;
    case 'weekly':
      return <Badge>Weekly</Badge>;
    default:
      // Handle specific days if pattern includes them
      if (pattern.startsWith('weekly:')) {
        return <Badge>Weekly (Custom)</Badge>;
      }
      return <Badge variant="outline">{pattern}</Badge>;
  }
}

export function AvailabilityList({ onEdit, refetchTrigger = 0 }: AvailabilityListProps) {
  // State for the component
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load availability data on component mount and when refetchTrigger changes
  useEffect(() => {
    loadAvailability();
  }, [refetchTrigger]);

  async function loadAvailability() {
    try {
      setLoading(true);
      
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .order('start_time', { ascending: true })
        .then(res => res);
      
      if (error) {
        throw error;
      }
      
      // Update state with the fetched data
      setAvailabilities(data || []);
    } catch (err: any) {
      console.error('Error loading availability:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Function to handle delete confirmation
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('id', deleteId);
      
      if (error) {
        throw error;
      }
      
      // Refresh the list
      await loadAvailability();
      
      // Show success message
      toast.success('Availability deleted successfully');
    } catch (err: any) {
      console.error('Error deleting availability:', err);
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Function to handle edit request
  const handleEdit = (availability: Availability) => {
    if (onEdit) {
      onEdit(availability);
    }
  };

  // Render the component
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Availability</CardTitle>
          <CardDescription>
            Manage your working hours and recurring schedules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading availability...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Error: {error}
            </div>
          ) : availabilities.length === 0 ? (
            <EmptyState />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Recurrence</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availabilities.map((avail) => (
                  <TableRow key={avail.id}>
                    <TableCell className="font-medium">
                      {formatDate(avail.start_time, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {formatTimeRange(avail.start_time, avail.end_time)}
                    </TableCell>
                    <TableCell>
                      <RecurrenceLabel pattern={avail.recurrence} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(avail)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(avail.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected availability slot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 