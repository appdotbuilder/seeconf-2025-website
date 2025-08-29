import { db } from '../db';
import { speakersTable } from '../db/schema';
import { type CreateSpeakerInput, type Speaker } from '../schema';

export const createSpeaker = async (input: CreateSpeakerInput): Promise<Speaker> => {
  try {
    // Insert speaker record
    const result = await db.insert(speakersTable)
      .values({
        name: input.name,
        position: input.position,
        company: input.company,
        avatar_url: input.avatar_url,
        bio: input.bio,
        speech_topic: input.speech_topic,
        social_links: input.social_links || null
      })
      .returning()
      .execute();

    // Return the created speaker
    return result[0];
  } catch (error) {
    console.error('Speaker creation failed:', error);
    throw error;
  }
};