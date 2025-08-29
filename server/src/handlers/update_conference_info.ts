import { db } from '../db';
import { conferenceInfoTable } from '../db/schema';
import { type UpdateConferenceInfoInput, type ConferenceInfo } from '../schema';
import { eq } from 'drizzle-orm';

export const updateConferenceInfo = async (input: UpdateConferenceInfoInput): Promise<ConferenceInfo> => {
  try {
    // First, try to find existing record by key
    const existing = await db.select()
      .from(conferenceInfoTable)
      .where(eq(conferenceInfoTable.key, input.key))
      .limit(1)
      .execute();

    if (existing.length > 0) {
      // Update existing record
      const updateData: any = {
        updated_at: new Date()
      };

      if (input.title !== undefined) {
        updateData.title = input.title;
      }

      if (input.content !== undefined) {
        updateData.content = input.content;
      }

      if (input.metadata !== undefined) {
        updateData.metadata = input.metadata;
      }

      const result = await db.update(conferenceInfoTable)
        .set(updateData)
        .where(eq(conferenceInfoTable.key, input.key))
        .returning()
        .execute();

      return result[0];
    } else {
      // Create new record - require title and content for new records
      if (!input.title || !input.content) {
        throw new Error('Title and content are required when creating new conference info');
      }

      const result = await db.insert(conferenceInfoTable)
        .values({
          key: input.key,
          title: input.title,
          content: input.content,
          metadata: input.metadata || null
        })
        .returning()
        .execute();

      return result[0];
    }
  } catch (error) {
    console.error('Conference info update failed:', error);
    throw error;
  }
};