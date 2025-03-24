import { format, addDays, getDay, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, parse, isAfter } from 'date-fns';

export type RecurrencePattern = 'none' | 'daily' | 'weekly' | 'weekly:1,2,3,4,5' | string;

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string, formatString: string = 'PPP'): string {
  return format(typeof date === 'string' ? new Date(date) : date, formatString);
}

/**
 * Format a time to a readable string
 */
export function formatTime(date: Date | string, formatString: string = 'h:mm a'): string {
  return format(typeof date === 'string' ? new Date(date) : date, formatString);
}

/**
 * Format a date range to a readable string
 */
export function formatDateRange(start: Date | string, end: Date | string): string {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Format a time range to a readable string
 */
export function formatTimeRange(startTimeString: string, endTimeString: string): string {
  const startTime = new Date(startTimeString);
  const endTime = new Date(endTimeString);
  
  return `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`;
}

/**
 * Parse a recurrence pattern string
 */
export function parseRecurrencePattern(pattern: string | null): {
  type: 'none' | 'daily' | 'weekly',
  days?: number[]
} {
  if (!pattern) return { type: 'none' };
  
  // Handle weekly pattern with specific days
  if (pattern.startsWith('weekly:')) {
    const days = pattern
      .replace('weekly:', '')
      .split(',')
      .map(day => parseInt(day.trim(), 10));
    
    return { type: 'weekly', days };
  }
  
  // Handle simple patterns
  if (pattern === 'daily') return { type: 'daily' };
  if (pattern === 'weekly') return { type: 'weekly', days: [0, 1, 2, 3, 4, 5, 6] };
  
  return { type: 'none' };
}

/**
 * Generate dates based on recurrence pattern
 */
export function generateRecurringDates(
  baseDate: Date | string,
  recurrencePattern: RecurrencePattern,
  rangeStart: Date | string,
  rangeEnd: Date | string
): Date[] {
  const baseDateObj = typeof baseDate === 'string' ? new Date(baseDate) : baseDate;
  const rangeStartObj = typeof rangeStart === 'string' ? new Date(rangeStart) : rangeStart;
  const rangeEndObj = typeof rangeEnd === 'string' ? new Date(rangeEnd) : rangeEnd;
  
  const { type, days } = parseRecurrencePattern(recurrencePattern);
  
  if (type === 'none') return [baseDateObj];
  
  // Generate all days in the range
  const allDaysInRange = eachDayOfInterval({ start: rangeStartObj, end: rangeEndObj });
  
  // Filter based on recurrence pattern
  return allDaysInRange.filter(date => {
    if (type === 'daily') return true;
    
    if (type === 'weekly') {
      const dayOfWeek = getDay(date);
      return days?.includes(dayOfWeek) ?? false;
    }
    
    return false;
  });
}

/**
 * Get all available timeslots for a therapist
 */
export function getAvailableTimeSlots(
  availability: Array<{ start_time: string; end_time: string; recurrence: string | null }>,
  timeOff: Array<{ start_time: string; end_time: string; recurrence: string | null }>,
  appointments: Array<{ start_time: string; end_time: string }>,
  date: Date
): Array<{ start: Date; end: Date }> {
  // Implementation would project all availability for the date,
  // subtract all time-off and appointments,
  // and return the resulting available slots
  
  // This is a simplified placeholder implementation
  return [];
}

/**
 * Check if two time ranges overlap
 */
export function hasOverlap(
  start1: string | Date, 
  end1: string | Date, 
  start2: string | Date, 
  end2: string | Date
): boolean {
  const startTime1 = typeof start1 === 'string' ? new Date(start1) : start1;
  const endTime1 = typeof end1 === 'string' ? new Date(end1) : end1;
  const startTime2 = typeof start2 === 'string' ? new Date(start2) : start2;
  const endTime2 = typeof end2 === 'string' ? new Date(end2) : end2;
  
  // No overlap if one ends before the other starts
  return !(
    isAfter(startTime1, endTime2) || 
    isAfter(startTime2, endTime1)
  );
} 