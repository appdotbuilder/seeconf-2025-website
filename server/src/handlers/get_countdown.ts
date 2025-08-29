import { type CountdownResponse } from '../schema';

export const getCountdown = async (): Promise<CountdownResponse> => {
  try {
    // Conference date: 2025-11-22 09:00:00 Beijing time (UTC+8)
    const conferenceDate = new Date('2025-11-22T09:00:00+08:00');
    const now = new Date();
    const diffMs = conferenceDate.getTime() - now.getTime();
    
    // If conference date has passed or is current, mark as live
    if (diffMs <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total_seconds: 0,
        is_live: true
      };
    }
    
    // Calculate time components
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;
    
    return {
      days,
      hours,
      minutes,
      seconds,
      total_seconds: totalSeconds,
      is_live: false
    };
  } catch (error) {
    console.error('Countdown calculation failed:', error);
    throw error;
  }
};