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
type TimeOff = Tables<'time_off'>;

interface TimeOffListProps {
  onEdit?: (timeOff: TimeOff) => void;
  refetchTrigger?: number;
}

// Separate component for empty state - adhering to small functional components principle
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="mb-2 text-lg font-semibold">No time off found</p>
      <p className="text-muted-foreground">Add your first time off entry to get started.</p>
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

// Component that formats reason with fallback - small functional component
function ReasonLabel({ reason }: { reason: string | null }) {
  if (!reason) {
    return <span className="text-muted-foreground">Not specified</span>;
  }
  
  if (reason.length > 30) {
    return <span title={reason}>{reason.substring(0, 27)}...</span>;
  }
  
  return <span>{reason}</span>;
}

export function TimeOffList({ onEdit, refetchTrigger = 0 }: TimeOffListProps) {
  // State for the component
  const [timeOffs, setTimeOffs] = useState<TimeOff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load time-off data on component mount and when refetchTrigger changes
  useEffect(() => {
    loadTimeOff();
  }, [refetchTrigger]);

  async function loadTimeOff() {
    try {
      setLoading(true);
      
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('time_off')
        .select('*')
        .order('start_time', { ascending: true })
        .then(res => res);
      
      if (error) {
        throw error;
      }
      
      // Update state with the fetched data
      setTimeOffs(data || []);
    } catch (err: any) {
      console.error('Error loading time off:', err);
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
        .from('time_off')
        .delete()
        .eq('id', deleteId);
      
      if (error) {
        throw error;
      }
      
      // Refresh the list
      await loadTimeOff();
      
      // Show success message
      toast.success('Time off deleted successfully');
    } catch (err: any) {
      console.error('Error deleting time off:', err);
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Function to handle edit request
  const handleEdit = (timeOff: TimeOff) => {
    if (onEdit) {
      onEdit(timeOff);
    }
  };

  // Render the component
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Time Off</CardTitle>
          <CardDescription>
            Manage your time off, vacations, and personal days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading time off entries...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Error: {error}
            </div>
          ) : timeOffs.length === 0 ? (
            <EmptyState />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Recurrence</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeOffs.map((timeOff) => (
                  <TableRow key={timeOff.id}>
                    <TableCell className="font-medium">
                      {formatDate(timeOff.start_time, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {formatTimeRange(timeOff.start_time, timeOff.end_time)}
                    </TableCell>
                    <TableCell>
                      <ReasonLabel reason={timeOff.reason} />
                    </TableCell>
                    <TableCell>
                      <RecurrenceLabel pattern={timeOff.recurrence} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(timeOff)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(timeOff.id)}
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
              selected time off entry.
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