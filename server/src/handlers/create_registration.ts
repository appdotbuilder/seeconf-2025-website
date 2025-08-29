import { db } from '../db';
import { registrationsTable } from '../db/schema';
import { type CreateRegistrationInput, type Registration } from '../schema';
import { eq } from 'drizzle-orm';

export const createRegistration = async (input: CreateRegistrationInput): Promise<Registration> => {
  try {
    // Check for duplicate email address
    const existingRegistration = await db.select()
      .from(registrationsTable)
      .where(eq(registrationsTable.email, input.email))
      .execute();

    if (existingRegistration.length > 0) {
      throw new Error('Registration with this email already exists');
    }

    // Insert registration record
    const result = await db.insert(registrationsTable)
      .values({
        email: input.email,
        name: input.name,
        company: input.company || null,
        position: input.position || null,
        phone: input.phone || null,
        ticket_type: input.ticket_type,
        dietary_requirements: input.dietary_requirements || null,
        t_shirt_size: input.t_shirt_size || null,
        status: 'pending' // Default status
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Registration creation failed:', error);
    throw error;
  }
};