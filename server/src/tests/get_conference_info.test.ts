import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { conferenceInfoTable } from '../db/schema';
import { getConferenceInfo } from '../handlers/get_conference_info';

const testConferenceInfo = [
  {
    key: 'about',
    title: 'About the Conference',
    content: 'This is a premier technology conference bringing together industry leaders.',
    metadata: '{"theme": "innovation", "year": 2024}'
  },
  {
    key: 'venue',
    title: 'Venue Information',
    content: 'The conference will be held at the Grand Convention Center.',
    metadata: '{"capacity": 1000, "address": "123 Main St"}'
  },
  {
    key: 'schedule',
    title: 'Conference Schedule',
    content: 'The event runs from 9 AM to 6 PM with networking sessions.',
    metadata: null
  }
];

describe('getConferenceInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return all conference info when no key is provided', async () => {
    // Insert test data
    await db.insert(conferenceInfoTable)
      .values(testConferenceInfo)
      .execute();

    const result = await getConferenceInfo();

    expect(result).toHaveLength(3);
    
    // Verify all records are returned
    const keys = result.map(info => info.key).sort();
    expect(keys).toEqual(['about', 'schedule', 'venue']);

    // Verify data integrity
    const aboutInfo = result.find(info => info.key === 'about');
    expect(aboutInfo).toBeDefined();
    expect(aboutInfo!.title).toEqual('About the Conference');
    expect(aboutInfo!.content).toEqual('This is a premier technology conference bringing together industry leaders.');
    expect(aboutInfo!.metadata).toEqual('{"theme": "innovation", "year": 2024}');
    expect(aboutInfo!.id).toBeDefined();
    expect(aboutInfo!.created_at).toBeInstanceOf(Date);
    expect(aboutInfo!.updated_at).toBeInstanceOf(Date);
  });

  it('should return specific conference info when key is provided', async () => {
    // Insert test data
    await db.insert(conferenceInfoTable)
      .values(testConferenceInfo)
      .execute();

    const result = await getConferenceInfo('venue');

    expect(result).toHaveLength(1);
    expect(result[0].key).toEqual('venue');
    expect(result[0].title).toEqual('Venue Information');
    expect(result[0].content).toEqual('The conference will be held at the Grand Convention Center.');
    expect(result[0].metadata).toEqual('{"capacity": 1000, "address": "123 Main St"}');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);
  });

  it('should return empty array when key does not exist', async () => {
    // Insert test data
    await db.insert(conferenceInfoTable)
      .values(testConferenceInfo)
      .execute();

    const result = await getConferenceInfo('nonexistent');

    expect(result).toHaveLength(0);
  });

  it('should return empty array when no data exists', async () => {
    const result = await getConferenceInfo();

    expect(result).toHaveLength(0);
  });

  it('should handle null metadata correctly', async () => {
    // Insert only the record with null metadata
    await db.insert(conferenceInfoTable)
      .values([{
        key: 'schedule',
        title: 'Conference Schedule',
        content: 'The event runs from 9 AM to 6 PM with networking sessions.',
        metadata: null
      }])
      .execute();

    const result = await getConferenceInfo('schedule');

    expect(result).toHaveLength(1);
    expect(result[0].key).toEqual('schedule');
    expect(result[0].metadata).toBeNull();
  });

  it('should preserve metadata as string without parsing', async () => {
    const complexMetadata = '{"nested": {"data": [1, 2, 3]}, "boolean": true, "number": 42}';
    
    await db.insert(conferenceInfoTable)
      .values([{
        key: 'complex',
        title: 'Complex Data',
        content: 'Test content with complex metadata.',
        metadata: complexMetadata
      }])
      .execute();

    const result = await getConferenceInfo('complex');

    expect(result).toHaveLength(1);
    expect(result[0].metadata).toEqual(complexMetadata);
    expect(typeof result[0].metadata).toBe('string');
  });

  it('should handle multiple records with same content but different keys', async () => {
    const duplicateContent = [
      {
        key: 'intro1',
        title: 'Introduction',
        content: 'Welcome to our conference.',
        metadata: '{"version": 1}'
      },
      {
        key: 'intro2',
        title: 'Introduction',
        content: 'Welcome to our conference.',
        metadata: '{"version": 2}'
      }
    ];

    await db.insert(conferenceInfoTable)
      .values(duplicateContent)
      .execute();

    // Test getting all
    const allResults = await getConferenceInfo();
    expect(allResults).toHaveLength(2);

    // Test getting specific one
    const specificResult = await getConferenceInfo('intro1');
    expect(specificResult).toHaveLength(1);
    expect(specificResult[0].key).toEqual('intro1');
    expect(specificResult[0].metadata).toEqual('{"version": 1}');
  });
});