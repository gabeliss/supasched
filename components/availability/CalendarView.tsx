'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Tables } from '../../lib/supabase/client';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  isToday, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Button } from '../ui/button';

// Type definitions
type Availability = Tables<'availability'>;
type TimeOff = Tables<'time_off'>;

// Props for the component
interface CalendarViewProps {
  onDateClick?: (date: Date) => void;
  refetchTrigger?: number;
}

export function CalendarView({ onDateClick, refetchTrigger = 0 }: CalendarViewProps) {
  // State for tracking the current month
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // State for availability and time-off entries
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [timeOffs, setTimeOffs] = useState<TimeOff[]>([]);
  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch data when component mounts or when refetchTrigger changes
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch both availabilities and time-offs
        const [availabilityData, timeOffData] = await Promise.all([
          supabase.from('availability').select('*'),
          supabase.from('time_off').select('*')
        ]);
        
        if (availabilityData.error) throw availabilityData.error;
        if (timeOffData.error) throw timeOffData.error;
        
        setAvailabilities(availabilityData.data || []);
        setTimeOffs(timeOffData.data || []);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [refetchTrigger]);

  // Generate days for the calendar month
  const generateCalendarDays = () => {
    // Get the start and end of the month
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Get the start and end of the calendar (including days from previous/next months)
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    // Generate array of all days in the calendar view
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  // Check if a day has availability entries
  const getDayAvailability = (day: Date) => {
    return availabilities.filter(avail => {
      const availDate = new Date(avail.start_time);
      return isSameDay(availDate, day);
    });
  };

  // Check if a day has time-off entries
  const getDayTimeOff = (day: Date) => {
    return timeOffs.filter(timeOff => {
      const timeOffDate = new Date(timeOff.start_time);
      return isSameDay(timeOffDate, day);
    });
  };

  // Handle click on a day
  const handleDayClick = (day: Date) => {
    if (onDateClick) {
      onDateClick(day);
    }
  };

  // Navigation methods
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Render the calendar
  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Calendar View</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {format(currentMonth, 'MMMM yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center">Loading calendar...</div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {/* Weekday headers */}
            {weekDays.map(day => (
              <div key={day} className="text-center font-medium py-1">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map(day => {
              const dayAvailability = getDayAvailability(day);
              const dayTimeOff = getDayTimeOff(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDayClick(day)}
                  className={`
                    min-h-[80px] p-1 border rounded-md cursor-pointer
                    ${isToday(day) ? 'bg-accent/20' : ''}
                    ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground bg-muted/50'}
                    ${dayAvailability.length || dayTimeOff.length ? 'hover:bg-accent/30' : 'hover:bg-accent/10'}
                  `}
                >
                  <div className="text-right font-medium text-sm">
                    {format(day, 'd')}
                  </div>
                  
                  {/* Availability indicators */}
                  {dayAvailability.length > 0 && (
                    <div className="mt-1">
                      <div className="h-2 w-full bg-green-500 rounded-full mb-1" title={`${dayAvailability.length} availability slots`} />
                    </div>
                  )}
                  
                  {/* Time-off indicators */}
                  {dayTimeOff.length > 0 && (
                    <div className="mt-1">
                      <div className="h-2 w-full bg-red-500 rounded-full mb-1" title={`${dayTimeOff.length} time off entries`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 