import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { speakersTable } from '../db/schema';
import { getSpeakers } from '../handlers/get_speakers';

describe('getSpeakers', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no speakers exist', async () => {
    const result = await getSpeakers();

    expect(result).toEqual([]);
  });

  it('should return all speakers', async () => {
    // Create test speakers
    const testSpeakers = [
      {
        name: 'John Doe',
        position: 'CEO',
        company: 'Tech Corp',
        avatar_url: 'https://example.com/avatar1.jpg',
        bio: 'Experienced tech leader',
        speech_topic: 'Future of Technology',
        social_links: JSON.stringify({ twitter: '@johndoe', linkedin: '/in/johndoe' })
      },
      {
        name: 'Jane Smith',
        position: 'CTO',
        company: 'Innovation Inc',
        avatar_url: 'https://example.com/avatar2.jpg',
        bio: 'Technical innovation expert',
        speech_topic: 'AI and Machine Learning',
        social_links: JSON.stringify({ twitter: '@janesmith', github: 'janesmith' })
      }
    ];

    await db.insert(speakersTable)
      .values(testSpeakers)
      .execute();

    const result = await getSpeakers();

    expect(result).toHaveLength(2);
    
    // Verify first speaker
    const firstSpeaker = result.find(s => s.name === 'John Doe');
    expect(firstSpeaker).toBeDefined();
    expect(firstSpeaker?.name).toEqual('John Doe');
    expect(firstSpeaker?.position).toEqual('CEO');
    expect(firstSpeaker?.company).toEqual('Tech Corp');
    expect(firstSpeaker?.avatar_url).toEqual('https://example.com/avatar1.jpg');
    expect(firstSpeaker?.bio).toEqual('Experienced tech leader');
    expect(firstSpeaker?.speech_topic).toEqual('Future of Technology');
    expect(firstSpeaker?.social_links).toEqual(JSON.stringify({ twitter: '@johndoe', linkedin: '/in/johndoe' }));
    expect(firstSpeaker?.id).toBeDefined();
    expect(firstSpeaker?.created_at).toBeInstanceOf(Date);
    expect(firstSpeaker?.updated_at).toBeInstanceOf(Date);

    // Verify second speaker
    const secondSpeaker = result.find(s => s.name === 'Jane Smith');
    expect(secondSpeaker).toBeDefined();
    expect(secondSpeaker?.name).toEqual('Jane Smith');
    expect(secondSpeaker?.position).toEqual('CTO');
    expect(secondSpeaker?.company).toEqual('Innovation Inc');
    expect(secondSpeaker?.avatar_url).toEqual('https://example.com/avatar2.jpg');
    expect(secondSpeaker?.bio).toEqual('Technical innovation expert');
    expect(secondSpeaker?.speech_topic).toEqual('AI and Machine Learning');
    expect(secondSpeaker?.social_links).toEqual(JSON.stringify({ twitter: '@janesmith', github: 'janesmith' }));
    expect(secondSpeaker?.id).toBeDefined();
    expect(secondSpeaker?.created_at).toBeInstanceOf(Date);
    expect(secondSpeaker?.updated_at).toBeInstanceOf(Date);
  });

  it('should handle speakers with null social_links', async () => {
    // Create speaker without social links
    const speakerWithoutSocial = {
      name: 'Bob Wilson',
      position: 'Developer',
      company: 'Code Studio',
      avatar_url: 'https://example.com/avatar3.jpg',
      bio: 'Full-stack developer',
      speech_topic: 'Web Development Best Practices',
      social_links: null
    };

    await db.insert(speakersTable)
      .values([speakerWithoutSocial])
      .execute();

    const result = await getSpeakers();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Bob Wilson');
    expect(result[0].social_links).toBeNull();
  });

  it('should return speakers in database insertion order', async () => {
    // Create speakers in specific order
    const speakers = [
      {
        name: 'First Speaker',
        position: 'Manager',
        company: 'First Corp',
        avatar_url: 'https://example.com/first.jpg',
        bio: 'First speaker bio',
        speech_topic: 'First Topic',
        social_links: null
      },
      {
        name: 'Second Speaker',
        position: 'Director',
        company: 'Second Corp',
        avatar_url: 'https://example.com/second.jpg',
        bio: 'Second speaker bio',
        speech_topic: 'Second Topic',
        social_links: null
      },
      {
        name: 'Third Speaker',
        position: 'VP',
        company: 'Third Corp',
        avatar_url: 'https://example.com/third.jpg',
        bio: 'Third speaker bio',
        speech_topic: 'Third Topic',
        social_links: null
      }
    ];

    // Insert speakers one by one to ensure order
    for (const speaker of speakers) {
      await db.insert(speakersTable)
        .values([speaker])
        .execute();
    }

    const result = await getSpeakers();

    expect(result).toHaveLength(3);
    
    // Verify they come back in insertion order (by ID)
    expect(result[0].name).toEqual('First Speaker');
    expect(result[1].name).toEqual('Second Speaker');
    expect(result[2].name).toEqual('Third Speaker');
    
    // Verify IDs are in ascending order
    expect(result[0].id).toBeLessThan(result[1].id);
    expect(result[1].id).toBeLessThan(result[2].id);
  });
});