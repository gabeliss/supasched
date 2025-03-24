import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AvailabilityForm } from '../../../components/availability/AvailabilityForm';
import { parseRecurrencePattern } from '../../../lib/utils/dates';

// Mock the supabase client
jest.mock('../../../lib/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'mock-user-id' } } }),
    },
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { id: 'new-availability-id' } }),
        }),
      }),
    }),
  },
}));

describe('AvailabilityForm', () => {
  it('renders the form correctly', () => {
    render(<AvailabilityForm onSuccess={jest.fn()} />);
    
    expect(screen.getByText('Add Availability')).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Recurrence/i)).toBeInTheDocument();
  });
  
  it('handles form submission correctly', async () => {
    const onSuccessMock = jest.fn();
    render(<AvailabilityForm onSuccess={onSuccessMock} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Start Time/i), { 
      target: { value: '2023-10-12T09:00' } 
    });
    
    fireEvent.change(screen.getByLabelText(/End Time/i), { 
      target: { value: '2023-10-12T10:00' } 
    });
    
    const recurrenceSelect = screen.getByLabelText(/Recurrence/i);
    fireEvent.change(recurrenceSelect, { target: { value: 'none' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save'));
    
    // Wait for the success callback to be called
    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });
  
  it('validates end time is after start time', async () => {
    render(<AvailabilityForm onSuccess={jest.fn()} />);
    
    // Set end time before start time
    fireEvent.change(screen.getByLabelText(/Start Time/i), { 
      target: { value: '2023-10-12T10:00' } 
    });
    
    fireEvent.change(screen.getByLabelText(/End Time/i), { 
      target: { value: '2023-10-12T09:00' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save'));
    
    // Wait for the validation error
    await waitFor(() => {
      expect(screen.getByText(/End time must be after start time/i)).toBeInTheDocument();
    });
  });
}); 