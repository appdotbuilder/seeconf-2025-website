import { db } from '../db';
import { agendaTable, speakersTable } from '../db/schema';
import { type CreateAgendaInput, type Agenda } from '../schema';
import { eq } from 'drizzle-orm';

export const createAgenda = async (input: CreateAgendaInput): Promise<Agenda> => {
  try {
    // Validate speaker exists if speaker_id is provided
    if (input.speaker_id) {
      const existingSpeaker = await db.select()
        .from(speakersTable)
        .where(eq(speakersTable.id, input.speaker_id))
        .execute();

      if (existingSpeaker.length === 0) {
        throw new Error(`Speaker with id ${input.speaker_id} does not exist`);
      }
    }

    // Insert agenda record
    const result = await db.insert(agendaTable)
      .values({
        title: input.title,
        description: input.description,
        start_time: input.start_time,
        end_time: input.end_time,
        type: input.type,
        speaker_id: input.speaker_id || null,
        location: input.location
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Agenda creation failed:', error);
    throw error;
  }
};