import { render, screen, waitFor } from '@testing-library/react';
import { AvailabilityList } from '../../../components/availability/AvailabilityList';
import { formatDate, formatTimeRange } from '../../../lib/utils/dates';

// Mock the supabase client
jest.mock('../../../lib/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          then: jest.fn().mockImplementation(callback => 
            callback({ 
              data: [
                { 
                  id: '1', 
                  start_time: '2023-10-12T09:00:00Z', 
                  end_time: '2023-10-12T10:00:00Z',
                  recurrence: null,
                  created_at: '2023-10-10T12:00:00Z'
                },
                { 
                  id: '2', 
                  start_time: '2023-10-13T14:00:00Z', 
                  end_time: '2023-10-13T15:30:00Z',
                  recurrence: 'weekly',
                  created_at: '2023-10-10T12:00:00Z'
                }
              ],
              error: null
            })
          )
        })
      }),
    }),
  },
}));

describe('AvailabilityList', () => {
  it('renders the availability list correctly', async () => {
    render(<AvailabilityList />);
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText('Your Availability')).toBeInTheDocument();
    });
    
    // Check that the entries are displayed
    const dates = screen.getAllByText(/Oct 1[23], 2023/);
    expect(dates.length).toBe(2);
    
    const times = screen.getAllByText(/[0-9]+:[0-9]+ [AP]M - [0-9]+:[0-9]+ [AP]M/);
    expect(times.length).toBe(2);
    
    // Check that recurrence pattern is displayed
    expect(screen.getByText('One-time')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
  });
  
  it('displays a message when no availability is found', async () => {
    // Override the mock to return empty data
    jest.spyOn(require('../../../lib/supabase/client').supabase.from('').select().order(), 'then')
      .mockImplementationOnce(callback => callback({ data: [], error: null }));
    
    render(<AvailabilityList />);
    
    await waitFor(() => {
      expect(screen.getByText('No availability found')).toBeInTheDocument();
      expect(screen.getByText('Add your first availability slot to get started.')).toBeInTheDocument();
    });
  });
}); 