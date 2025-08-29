import { afterEach, describe, expect, it } from 'bun:test';
import { getCountdown } from '../handlers/get_countdown';

describe('getCountdown', () => {
  const OriginalDate = global.Date;

  afterEach(() => {
    // Restore original Date implementation
    global.Date = OriginalDate;
  });

  const mockDateWith = (mockTime: string) => {
    const mockCurrentTime = new OriginalDate(mockTime);
    
    const MockDate = function(this: any, dateString?: string | number) {
      if (dateString) {
        return new OriginalDate(dateString);
      }
      return mockCurrentTime;
    } as any;
    
    MockDate.now = () => mockCurrentTime.getTime();
    MockDate.prototype = OriginalDate.prototype;
    
    global.Date = MockDate;
  };

  it('should return correct countdown when conference is in the future', async () => {
    // Mock current time to be exactly 1 day before conference
    mockDateWith('2025-11-21T09:00:00+08:00');

    const result = await getCountdown();

    expect(result.days).toEqual(1);
    expect(result.hours).toEqual(0);
    expect(result.minutes).toEqual(0);
    expect(result.seconds).toEqual(0);
    expect(result.total_seconds).toEqual(24 * 60 * 60); // 1 day in seconds
    expect(result.is_live).toEqual(false);
  });

  it('should return correct countdown for partial day remaining', async () => {
    // Mock current time to be 12 hours and 30 minutes before conference
    mockDateWith('2025-11-21T20:30:00+08:00');

    const result = await getCountdown();

    expect(result.days).toEqual(0);
    expect(result.hours).toEqual(12);
    expect(result.minutes).toEqual(30);
    expect(result.seconds).toEqual(0);
    expect(result.total_seconds).toEqual(12.5 * 60 * 60); // 12.5 hours in seconds
    expect(result.is_live).toEqual(false);
  });

  it('should return correct countdown for minutes and seconds', async () => {
    // Mock current time to be 5 minutes and 45 seconds before conference
    mockDateWith('2025-11-22T08:54:15+08:00');

    const result = await getCountdown();

    expect(result.days).toEqual(0);
    expect(result.hours).toEqual(0);
    expect(result.minutes).toEqual(5);
    expect(result.seconds).toEqual(45);
    expect(result.total_seconds).toEqual(5 * 60 + 45); // 345 seconds
    expect(result.is_live).toEqual(false);
  });

  it('should return is_live true when conference time has passed', async () => {
    // Mock current time to be after conference start
    mockDateWith('2025-11-22T10:00:00+08:00');

    const result = await getCountdown();

    expect(result.days).toEqual(0);
    expect(result.hours).toEqual(0);
    expect(result.minutes).toEqual(0);
    expect(result.seconds).toEqual(0);
    expect(result.total_seconds).toEqual(0);
    expect(result.is_live).toEqual(true);
  });

  it('should return is_live true when exactly at conference time', async () => {
    // Mock current time to be exactly at conference start
    mockDateWith('2025-11-22T09:00:00+08:00');

    const result = await getCountdown();

    expect(result.days).toEqual(0);
    expect(result.hours).toEqual(0);
    expect(result.minutes).toEqual(0);
    expect(result.seconds).toEqual(0);
    expect(result.total_seconds).toEqual(0);
    expect(result.is_live).toEqual(true);
  });

  it('should handle long duration countdown correctly', async () => {
    // Mock current time to be several months before conference
    mockDateWith('2025-01-01T00:00:00+08:00');

    const result = await getCountdown();

    // Should have many days remaining
    expect(result.days).toBeGreaterThan(300);
    expect(result.hours).toEqual(9);
    expect(result.minutes).toEqual(0);
    expect(result.seconds).toEqual(0);
    expect(result.total_seconds).toBeGreaterThan(300 * 24 * 60 * 60);
    expect(result.is_live).toEqual(false);
  });

  it('should handle timezone correctly', async () => {
    // Test with a time in different timezone context
    // Mock current time to be 1 hour before conference in UTC
    mockDateWith('2025-11-22T00:00:00Z'); // UTC midnight

    const result = await getCountdown();

    // Conference is at 09:00 +08:00 which is 01:00 UTC
    // So 1 hour remaining
    expect(result.days).toEqual(0);
    expect(result.hours).toEqual(1);
    expect(result.minutes).toEqual(0);
    expect(result.seconds).toEqual(0);
    expect(result.total_seconds).toEqual(60 * 60);
    expect(result.is_live).toEqual(false);
  });

  it('should handle edge case with seconds precision', async () => {
    // Mock current time to be just 1 second before conference
    mockDateWith('2025-11-22T08:59:59+08:00');

    const result = await getCountdown();

    expect(result.days).toEqual(0);
    expect(result.hours).toEqual(0);
    expect(result.minutes).toEqual(0);
    expect(result.seconds).toEqual(1);
    expect(result.total_seconds).toEqual(1);
    expect(result.is_live).toEqual(false);
  });
});