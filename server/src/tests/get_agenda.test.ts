import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { agendaTable, speakersTable } from '../db/schema';
import { type GetAgendaInput } from '../schema';
import { getAgenda } from '../handlers/get_agenda';

describe('getAgenda', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all agenda items when no filters provided', async () => {
    // Create test speaker
    const speakerResult = await db.insert(speakersTable)
      .values({
        name: 'John Doe',
        position: 'CTO',
        company: 'Tech Corp',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Experienced tech leader',
        speech_topic: 'Future of Technology'
      })
      .returning()
      .execute();

    // Create test agenda items
    const agendaData = [
      {
        title: 'Opening Keynote',
        description: 'Welcome to the conference',
        start_time: new Date('2024-06-15T09:00:00Z'),
        end_time: new Date('2024-06-15T10:00:00Z'),
        type: 'main_forum' as const,
        speaker_id: speakerResult[0].id,
        location: 'Main Hall'
      },
      {
        title: 'Design Workshop',
        description: 'Learn design principles',
        start_time: new Date('2024-06-15T11:00:00Z'),
        end_time: new Date('2024-06-15T12:00:00Z'),
        type: 'design_forum' as const,
        speaker_id: null,
        location: 'Room A'
      }
    ];

    await db.insert(agendaTable).values(agendaData).execute();

    const result = await getAgenda();

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('Opening Keynote');
    expect(result[0].type).toEqual('main_forum');
    expect(result[0].speaker_id).toEqual(speakerResult[0].id);
    expect(result[0].location).toEqual('Main Hall');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);

    // Verify ordering by start_time
    expect(result[0].start_time.getTime()).toBeLessThan(result[1].start_time.getTime());
  });

  it('should filter agenda items by type', async () => {
    // Create test agenda items with different types
    const agendaData = [
      {
        title: 'Main Session',
        description: 'Main forum session',
        start_time: new Date('2024-06-15T09:00:00Z'),
        end_time: new Date('2024-06-15T10:00:00Z'),
        type: 'main_forum' as const,
        speaker_id: null,
        location: 'Main Hall'
      },
      {
        title: 'Design Workshop',
        description: 'Design forum session',
        start_time: new Date('2024-06-15T11:00:00Z'),
        end_time: new Date('2024-06-15T12:00:00Z'),
        type: 'design_forum' as const,
        speaker_id: null,
        location: 'Room A'
      },
      {
        title: 'Engineering Talk',
        description: 'Engineering forum session',
        start_time: new Date('2024-06-15T13:00:00Z'),
        end_time: new Date('2024-06-15T14:00:00Z'),
        type: 'engineering_forum' as const,
        speaker_id: null,
        location: 'Room B'
      }
    ];

    await db.insert(agendaTable).values(agendaData).execute();

    const input: GetAgendaInput = { type: 'design_forum' };
    const result = await getAgenda(input);

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Design Workshop');
    expect(result[0].type).toEqual('design_forum');
  });

  it('should filter agenda items by date', async () => {
    // Create test agenda items on different dates
    const agendaData = [
      {
        title: 'Day 1 Session',
        description: 'First day session',
        start_time: new Date('2024-06-15T09:00:00Z'),
        end_time: new Date('2024-06-15T10:00:00Z'),
        type: 'main_forum' as const,
        speaker_id: null,
        location: 'Main Hall'
      },
      {
        title: 'Day 2 Session',
        description: 'Second day session',
        start_time: new Date('2024-06-16T09:00:00Z'),
        end_time: new Date('2024-06-16T10:00:00Z'),
        type: 'main_forum' as const,
        speaker_id: null,
        location: 'Main Hall'
      },
      {
        title: 'Day 1 Afternoon',
        description: 'Afternoon session on first day',
        start_time: new Date('2024-06-15T14:00:00Z'),
        end_time: new Date('2024-06-15T15:00:00Z'),
        type: 'workshop' as const,
        speaker_id: null,
        location: 'Room C'
      }
    ];

    await db.insert(agendaTable).values(agendaData).execute();

    const input: GetAgendaInput = { date: '2024-06-15' };
    const result = await getAgenda(input);

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('Day 1 Session');
    expect(result[1].title).toEqual('Day 1 Afternoon');
    
    // Verify all results are from the correct date
    result.forEach(item => {
      const itemDate = item.start_time.toISOString().split('T')[0];
      expect(itemDate).toEqual('2024-06-15');
    });
  });

  it('should filter by both type and date', async () => {
    // Create test agenda items with various combinations
    const agendaData = [
      {
        title: 'Main Forum Day 1',
        description: 'Main forum on first day',
        start_time: new Date('2024-06-15T09:00:00Z'),
        end_time: new Date('2024-06-15T10:00:00Z'),
        type: 'main_forum' as const,
        speaker_id: null,
        location: 'Main Hall'
      },
      {
        title: 'Design Forum Day 1',
        description: 'Design forum on first day',
        start_time: new Date('2024-06-15T11:00:00Z'),
        end_time: new Date('2024-06-15T12:00:00Z'),
        type: 'design_forum' as const,
        speaker_id: null,
        location: 'Room A'
      },
      {
        title: 'Design Forum Day 2',
        description: 'Design forum on second day',
        start_time: new Date('2024-06-16T09:00:00Z'),
        end_time: new Date('2024-06-16T10:00:00Z'),
        type: 'design_forum' as const,
        speaker_id: null,
        location: 'Room A'
      }
    ];

    await db.insert(agendaTable).values(agendaData).execute();

    const input: GetAgendaInput = { 
      type: 'design_forum',
      date: '2024-06-15'
    };
    const result = await getAgenda(input);

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Design Forum Day 1');
    expect(result[0].type).toEqual('design_forum');
    
    const itemDate = result[0].start_time.toISOString().split('T')[0];
    expect(itemDate).toEqual('2024-06-15');
  });

  it('should return empty array when no agenda items match filters', async () => {
    // Create test agenda item that won't match filter
    await db.insert(agendaTable)
      .values({
        title: 'Main Session',
        description: 'Main forum session',
        start_time: new Date('2024-06-15T09:00:00Z'),
        end_time: new Date('2024-06-15T10:00:00Z'),
        type: 'main_forum',
        speaker_id: null,
        location: 'Main Hall'
      })
      .execute();

    const input: GetAgendaInput = { type: 'workshop' };
    const result = await getAgenda(input);

    expect(result).toHaveLength(0);
  });

  it('should handle agenda items with and without speakers', async () => {
    // Create test speaker
    const speakerResult = await db.insert(speakersTable)
      .values({
        name: 'Jane Smith',
        position: 'Lead Developer',
        company: 'Dev Corp',
        avatar_url: 'https://example.com/jane.jpg',
        bio: 'Expert developer',
        speech_topic: 'Clean Code Practices'
      })
      .returning()
      .execute();

    // Create agenda items with and without speakers
    const agendaData = [
      {
        title: 'Keynote with Speaker',
        description: 'Session with speaker',
        start_time: new Date('2024-06-15T09:00:00Z'),
        end_time: new Date('2024-06-15T10:00:00Z'),
        type: 'main_forum' as const,
        speaker_id: speakerResult[0].id,
        location: 'Main Hall'
      },
      {
        title: 'Open Discussion',
        description: 'Session without speaker',
        start_time: new Date('2024-06-15T11:00:00Z'),
        end_time: new Date('2024-06-15T12:00:00Z'),
        type: 'workshop' as const,
        speaker_id: null,
        location: 'Room B'
      }
    ];

    await db.insert(agendaTable).values(agendaData).execute();

    const result = await getAgenda();

    expect(result).toHaveLength(2);
    expect(result[0].speaker_id).toEqual(speakerResult[0].id);
    expect(result[1].speaker_id).toBeNull();
  });

  it('should maintain proper chronological ordering', async () => {
    // Create agenda items in non-chronological order
    const agendaData = [
      {
        title: 'Afternoon Session',
        description: 'Later session',
        start_time: new Date('2024-06-15T15:00:00Z'),
        end_time: new Date('2024-06-15T16:00:00Z'),
        type: 'workshop' as const,
        speaker_id: null,
        location: 'Room C'
      },
      {
        title: 'Morning Session',
        description: 'Earlier session',
        start_time: new Date('2024-06-15T09:00:00Z'),
        end_time: new Date('2024-06-15T10:00:00Z'),
        type: 'main_forum' as const,
        speaker_id: null,
        location: 'Main Hall'
      },
      {
        title: 'Midday Session',
        description: 'Middle session',
        start_time: new Date('2024-06-15T12:00:00Z'),
        end_time: new Date('2024-06-15T13:00:00Z'),
        type: 'design_forum' as const,
        speaker_id: null,
        location: 'Room A'
      }
    ];

    await db.insert(agendaTable).values(agendaData).execute();

    const result = await getAgenda();

    expect(result).toHaveLength(3);
    expect(result[0].title).toEqual('Morning Session');
    expect(result[1].title).toEqual('Midday Session');
    expect(result[2].title).toEqual('Afternoon Session');

    // Verify chronological ordering
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].start_time.getTime()).toBeLessThanOrEqual(result[i + 1].start_time.getTime());
    }
  });
});