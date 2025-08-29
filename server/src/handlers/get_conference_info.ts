import { db } from '../db';
import { conferenceInfoTable } from '../db/schema';
import { type ConferenceInfo } from '../schema';
import { eq } from 'drizzle-orm';

export const getConferenceInfo = async (key?: string): Promise<ConferenceInfo[]> => {
  try {
    // Build query conditionally
    if (key) {
      const results = await db.select()
        .from(conferenceInfoTable)
        .where(eq(conferenceInfoTable.key, key))
        .execute();
      
      return results;
    } else {
      const results = await db.select()
        .from(conferenceInfoTable)
        .execute();
      
      return results;
    }
  } catch (error) {
    console.error('Conference info retrieval failed:', error);
    throw error;
  }
};