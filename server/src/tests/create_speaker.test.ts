import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { speakersTable } from '../db/schema';
import { type CreateSpeakerInput } from '../schema';
import { createSpeaker } from '../handlers/create_speaker';
import { eq } from 'drizzle-orm';

// Complete test input with all required fields
const testInput: CreateSpeakerInput = {
  name: 'Jane Smith',
  position: 'Senior Software Engineer',
  company: 'Tech Corp',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'Experienced software engineer with 10+ years in web development.',
  speech_topic: 'Modern Web Development Best Practices',
  social_links: '{"twitter": "@janesmith", "linkedin": "jane-smith"}'
};

describe('createSpeaker', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a speaker with all fields', async () => {
    const result = await createSpeaker(testInput);

    // Basic field validation
    expect(result.name).toEqual('Jane Smith');
    expect(result.position).toEqual('Senior Software Engineer');
    expect(result.company).toEqual('Tech Corp');
    expect(result.avatar_url).toEqual('https://example.com/avatar.jpg');
    expect(result.bio).toEqual('Experienced software engineer with 10+ years in web development.');
    expect(result.speech_topic).toEqual('Modern Web Development Best Practices');
    expect(result.social_links).toEqual('{"twitter": "@janesmith", "linkedin": "jane-smith"}');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save speaker to database', async () => {
    const result = await createSpeaker(testInput);

    // Query database to verify persistence
    const speakers = await db.select()
      .from(speakersTable)
      .where(eq(speakersTable.id, result.id))
      .execute();

    expect(speakers).toHaveLength(1);
    expect(speakers[0].name).toEqual('Jane Smith');
    expect(speakers[0].position).toEqual('Senior Software Engineer');
    expect(speakers[0].company).toEqual('Tech Corp');
    expect(speakers[0].avatar_url).toEqual('https://example.com/avatar.jpg');
    expect(speakers[0].bio).toEqual('Experienced software engineer with 10+ years in web development.');
    expect(speakers[0].speech_topic).toEqual('Modern Web Development Best Practices');
    expect(speakers[0].social_links).toEqual('{"twitter": "@janesmith", "linkedin": "jane-smith"}');
    expect(speakers[0].created_at).toBeInstanceOf(Date);
    expect(speakers[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create speaker without social_links', async () => {
    const inputWithoutSocial: CreateSpeakerInput = {
      name: 'John Doe',
      position: 'CTO',
      company: 'StartupXYZ',
      avatar_url: 'https://example.com/john.jpg',
      bio: 'Passionate technology leader and entrepreneur.',
      speech_topic: 'Building Scalable Systems'
    };

    const result = await createSpeaker(inputWithoutSocial);

    expect(result.name).toEqual('John Doe');
    expect(result.social_links).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create speaker with null social_links', async () => {
    const inputWithNullSocial: CreateSpeakerInput = {
      name: 'Alice Johnson',
      position: 'Product Manager',
      company: 'Innovation Inc',
      avatar_url: 'https://example.com/alice.jpg',
      bio: 'Product management expert with focus on user experience.',
      speech_topic: 'User-Centered Product Design',
      social_links: null
    };

    const result = await createSpeaker(inputWithNullSocial);

    expect(result.name).toEqual('Alice Johnson');
    expect(result.social_links).toBeNull();
    expect(result.id).toBeDefined();
  });

  it('should handle empty social_links JSON', async () => {
    const inputWithEmptyJSON: CreateSpeakerInput = {
      name: 'Bob Wilson',
      position: 'DevOps Engineer',
      company: 'Cloud Solutions',
      avatar_url: 'https://example.com/bob.jpg',
      bio: 'Cloud infrastructure and automation specialist.',
      speech_topic: 'Infrastructure as Code',
      social_links: '{}'
    };

    const result = await createSpeaker(inputWithEmptyJSON);

    expect(result.name).toEqual('Bob Wilson');
    expect(result.social_links).toEqual('{}');
    expect(result.id).toBeDefined();
  });

  it('should create multiple speakers independently', async () => {
    const input1: CreateSpeakerInput = {
      name: 'Speaker One',
      position: 'Frontend Developer',
      company: 'Web Corp',
      avatar_url: 'https://example.com/speaker1.jpg',
      bio: 'Frontend development expert.',
      speech_topic: 'React Best Practices'
    };

    const input2: CreateSpeakerInput = {
      name: 'Speaker Two',
      position: 'Backend Developer',
      company: 'API Corp',
      avatar_url: 'https://example.com/speaker2.jpg',
      bio: 'Backend systems architect.',
      speech_topic: 'API Design Patterns'
    };

    const result1 = await createSpeaker(input1);
    const result2 = await createSpeaker(input2);

    expect(result1.id).not.toEqual(result2.id);
    expect(result1.name).toEqual('Speaker One');
    expect(result2.name).toEqual('Speaker Two');

    // Verify both are in database
    const allSpeakers = await db.select().from(speakersTable).execute();
    expect(allSpeakers).toHaveLength(2);
  });
});