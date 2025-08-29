import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { agendaTable, speakersTable } from '../db/schema';
import { type CreateAgendaInput } from '../schema';
import { createAgenda } from '../handlers/create_agenda';
import { eq } from 'drizzle-orm';

// Test input for agenda without speaker
const testInputWithoutSpeaker: CreateAgendaInput = {
  title: 'Opening Keynote',
  description: 'Welcome to the conference and overview of the day',
  start_time: new Date('2024-06-15T09:00:00Z'),
  end_time: new Date('2024-06-15T10:00:00Z'),
  type: 'main_forum',
  location: 'Main Auditorium'
};

// Test input for agenda with speaker
const testInputWithSpeaker: CreateAgendaInput = {
  title: 'Advanced React Patterns',
  description: 'Deep dive into modern React development patterns',
  start_time: new Date('2024-06-15T10:30:00Z'),
  end_time: new Date('2024-06-15T11:30:00Z'),
  type: 'engineering_forum',
  speaker_id: 1,
  location: 'Engineering Room'
};

describe('createAgenda', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an agenda item without speaker', async () => {
    const result = await createAgenda(testInputWithoutSpeaker);

    // Basic field validation
    expect(result.title).toEqual('Opening Keynote');
    expect(result.description).toEqual(testInputWithoutSpeaker.description);
    expect(result.start_time).toEqual(testInputWithoutSpeaker.start_time);
    expect(result.end_time).toEqual(testInputWithoutSpeaker.end_time);
    expect(result.type).toEqual('main_forum');
    expect(result.speaker_id).toBeNull();
    expect(result.location).toEqual('Main Auditorium');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create an agenda item with speaker', async () => {
    // Create a speaker first
    await db.insert(speakersTable)
      .values({
        name: 'John Doe',
        position: 'Senior Engineer',
        company: 'Tech Corp',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Experienced developer',
        speech_topic: 'React Development',
        social_links: '{"twitter": "@johndoe"}'
      })
      .execute();

    const result = await createAgenda(testInputWithSpeaker);

    // Basic field validation
    expect(result.title).toEqual('Advanced React Patterns');
    expect(result.description).toEqual(testInputWithSpeaker.description);
    expect(result.start_time).toEqual(testInputWithSpeaker.start_time);
    expect(result.end_time).toEqual(testInputWithSpeaker.end_time);
    expect(result.type).toEqual('engineering_forum');
    expect(result.speaker_id).toEqual(1);
    expect(result.location).toEqual('Engineering Room');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save agenda to database', async () => {
    const result = await createAgenda(testInputWithoutSpeaker);

    // Query using proper drizzle syntax
    const agendaItems = await db.select()
      .from(agendaTable)
      .where(eq(agendaTable.id, result.id))
      .execute();

    expect(agendaItems).toHaveLength(1);
    expect(agendaItems[0].title).toEqual('Opening Keynote');
    expect(agendaItems[0].description).toEqual(testInputWithoutSpeaker.description);
    expect(agendaItems[0].type).toEqual('main_forum');
    expect(agendaItems[0].speaker_id).toBeNull();
    expect(agendaItems[0].created_at).toBeInstanceOf(Date);
    expect(agendaItems[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error when speaker_id does not exist', async () => {
    const inputWithInvalidSpeaker = {
      ...testInputWithSpeaker,
      speaker_id: 999 // Non-existent speaker ID
    };

    await expect(createAgenda(inputWithInvalidSpeaker)).rejects.toThrow(/Speaker with id 999 does not exist/i);
  });

  it('should handle different agenda types correctly', async () => {
    const workshopInput: CreateAgendaInput = {
      title: 'Hands-on Workshop',
      description: 'Interactive coding workshop',
      start_time: new Date('2024-06-15T14:00:00Z'),
      end_time: new Date('2024-06-15T16:00:00Z'),
      type: 'workshop',
      location: 'Workshop Room A'
    };

    const result = await createAgenda(workshopInput);

    expect(result.type).toEqual('workshop');
    expect(result.title).toEqual('Hands-on Workshop');
    expect(result.location).toEqual('Workshop Room A');

    // Verify it's saved correctly in database
    const savedAgenda = await db.select()
      .from(agendaTable)
      .where(eq(agendaTable.id, result.id))
      .execute();

    expect(savedAgenda[0].type).toEqual('workshop');
  });

  it('should handle design forum type', async () => {
    const designInput: CreateAgendaInput = {
      title: 'UX Design Principles',
      description: 'Modern design thinking and user experience',
      start_time: new Date('2024-06-15T11:00:00Z'),
      end_time: new Date('2024-06-15T12:00:00Z'),
      type: 'design_forum',
      location: 'Design Studio'
    };

    const result = await createAgenda(designInput);

    expect(result.type).toEqual('design_forum');
    expect(result.title).toEqual('UX Design Principles');
    expect(result.location).toEqual('Design Studio');
  });

  it('should preserve exact timestamps', async () => {
    const specificTime = new Date('2024-06-15T15:30:45.123Z');
    const inputWithSpecificTime = {
      ...testInputWithoutSpeaker,
      start_time: specificTime,
      end_time: new Date('2024-06-15T16:30:45.123Z')
    };

    const result = await createAgenda(inputWithSpecificTime);

    expect(result.start_time).toEqual(specificTime);
    expect(result.end_time).toEqual(inputWithSpecificTime.end_time);

    // Verify timestamps are preserved in database
    const savedAgenda = await db.select()
      .from(agendaTable)
      .where(eq(agendaTable.id, result.id))
      .execute();

    expect(savedAgenda[0].start_time).toEqual(specificTime);
  });
});