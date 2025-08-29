import { db } from '../db';
import { speakersTable } from '../db/schema';
import { type Speaker } from '../schema';

export const getSpeakers = async (): Promise<Speaker[]> => {
  try {
    // Fetch all speakers from the database
    const results = await db.select()
      .from(speakersTable)
      .execute();

    // Return speakers (no numeric conversions needed for this table)
    return results;
  } catch (error) {
    console.error('Failed to fetch speakers:', error);
    throw error;
  }
};