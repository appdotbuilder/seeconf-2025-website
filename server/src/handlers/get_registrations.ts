import { db } from '../db';
import { registrationsTable } from '../db/schema';
import { type Registration } from '../schema';
import { desc } from 'drizzle-orm';

export const getRegistrations = async (): Promise<Registration[]> => {
  try {
    // Fetch all registrations, ordered by registration date (newest first)
    const results = await db.select()
      .from(registrationsTable)
      .orderBy(desc(registrationsTable.registration_date))
      .execute();

    // Return results with proper date coercion (already handled by Zod schema)
    return results;
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    throw error;
  }
};