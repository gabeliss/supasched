/**
 * Checks if two time ranges overlap
 */
export function doTimeRangesOverlap(
  range1Start: Date | string,
  range1End: Date | string,
  range2Start: Date | string,
  range2End: Date | string
): boolean {
  // Convert strings to Date objects if necessary
  const start1 = typeof range1Start === 'string' ? new Date(range1Start) : range1Start;
  const end1 = typeof range1End === 'string' ? new Date(range1End) : range1End;
  const start2 = typeof range2Start === 'string' ? new Date(range2Start) : range2Start;
  const end2 = typeof range2End === 'string' ? new Date(range2End) : range2End;

  // Check for overlap
  return start1 < end2 && start2 < end1;
}

/**
 * Checks if a new time block conflicts with existing blocks
 */
export function checkForConflicts(
  newStart: Date | string,
  newEnd: Date | string,
  existingBlocks: Array<{ start_time: string; end_time: string }>
): boolean {
  return existingBlocks.some(block => 
    doTimeRangesOverlap(newStart, newEnd, block.start_time, block.end_time)
  );
}

/**
 * Returns detailed conflicts information
 */
export function getConflictDetails(
  newStart: Date | string,
  newEnd: Date | string,
  availabilityBlocks: Array<{ start_time: string; end_time: string }>,
  timeOffBlocks: Array<{ start_time: string; end_time: string }>,
  appointmentBlocks: Array<{ start_time: string; end_time: string }>
) {
  return {
    hasAvailabilityConflict: checkForConflicts(newStart, newEnd, availabilityBlocks),
    hasTimeOffConflict: checkForConflicts(newStart, newEnd, timeOffBlocks),
    hasAppointmentConflict: checkForConflicts(newStart, newEnd, appointmentBlocks),
    hasAnyConflict: 
      checkForConflicts(newStart, newEnd, availabilityBlocks) ||
      checkForConflicts(newStart, newEnd, timeOffBlocks) ||
      checkForConflicts(newStart, newEnd, appointmentBlocks)
  };
} 