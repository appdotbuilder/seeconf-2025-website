import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { conferenceInfoTable } from '../db/schema';
import { type UpdateConferenceInfoInput } from '../schema';
import { updateConferenceInfo } from '../handlers/update_conference_info';
import { eq } from 'drizzle-orm';

// Test input for creating new conference info
const createInput: UpdateConferenceInfoInput = {
  key: 'about',
  title: 'About the Conference',
  content: 'This is a great conference about technology and innovation.',
  metadata: JSON.stringify({ featured: true, order: 1 })
};

// Test input for updating existing conference info
const updateInput: UpdateConferenceInfoInput = {
  key: 'about',
  title: 'About Our Amazing Conference',
  content: 'This is an updated description of our technology conference.'
};

describe('updateConferenceInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create new conference info when key does not exist', async () => {
    const result = await updateConferenceInfo(createInput);

    // Verify returned data
    expect(result.key).toEqual('about');
    expect(result.title).toEqual('About the Conference');
    expect(result.content).toEqual('This is a great conference about technology and innovation.');
    expect(result.metadata).toEqual(JSON.stringify({ featured: true, order: 1 }));
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save new conference info to database', async () => {
    const result = await updateConferenceInfo(createInput);

    // Query database to verify record was saved
    const records = await db.select()
      .from(conferenceInfoTable)
      .where(eq(conferenceInfoTable.id, result.id))
      .execute();

    expect(records).toHaveLength(1);
    expect(records[0].key).toEqual('about');
    expect(records[0].title).toEqual('About the Conference');
    expect(records[0].content).toEqual('This is a great conference about technology and innovation.');
    expect(records[0].metadata).toEqual(JSON.stringify({ featured: true, order: 1 }));
    expect(records[0].created_at).toBeInstanceOf(Date);
    expect(records[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update existing conference info when key exists', async () => {
    // First create a record
    const created = await updateConferenceInfo(createInput);
    const originalUpdatedAt = created.updated_at;

    // Wait a bit to ensure updated_at changes
    await new Promise(resolve => setTimeout(resolve, 10));

    // Update the record
    const result = await updateConferenceInfo(updateInput);

    // Verify the update
    expect(result.id).toEqual(created.id);
    expect(result.key).toEqual('about');
    expect(result.title).toEqual('About Our Amazing Conference');
    expect(result.content).toEqual('This is an updated description of our technology conference.');
    expect(result.metadata).toEqual(JSON.stringify({ featured: true, order: 1 })); // Should remain unchanged
    expect(result.created_at).toEqual(created.created_at);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });

  it('should update only specified fields when updating existing record', async () => {
    // Create initial record
    await updateConferenceInfo(createInput);

    // Update only title
    const titleOnlyUpdate: UpdateConferenceInfoInput = {
      key: 'about',
      title: 'New Title Only'
    };

    const result = await updateConferenceInfo(titleOnlyUpdate);

    // Verify only title changed
    expect(result.title).toEqual('New Title Only');
    expect(result.content).toEqual('This is a great conference about technology and innovation.'); // Should remain unchanged
    expect(result.metadata).toEqual(JSON.stringify({ featured: true, order: 1 })); // Should remain unchanged
  });

  it('should update metadata correctly', async () => {
    // Create initial record
    await updateConferenceInfo(createInput);

    // Update metadata
    const metadataUpdate: UpdateConferenceInfoInput = {
      key: 'about',
      metadata: JSON.stringify({ featured: false, order: 2, new_field: 'test' })
    };

    const result = await updateConferenceInfo(metadataUpdate);

    // Verify metadata was updated
    expect(result.metadata).toEqual(JSON.stringify({ featured: false, order: 2, new_field: 'test' }));
    expect(result.title).toEqual('About the Conference'); // Should remain unchanged
    expect(result.content).toEqual('This is a great conference about technology and innovation.'); // Should remain unchanged
  });

  it('should handle null metadata', async () => {
    const inputWithNullMetadata: UpdateConferenceInfoInput = {
      key: 'contact',
      title: 'Contact Us',
      content: 'Get in touch with us.',
      metadata: null
    };

    const result = await updateConferenceInfo(inputWithNullMetadata);

    expect(result.metadata).toBeNull();
    expect(result.title).toEqual('Contact Us');
    expect(result.content).toEqual('Get in touch with us.');
  });

  it('should throw error when creating new record without required fields', async () => {
    const incompleteInput: UpdateConferenceInfoInput = {
      key: 'new-section'
      // Missing title and content
    };

    expect(updateConferenceInfo(incompleteInput)).rejects.toThrow(/title and content are required/i);
  });

  it('should throw error when creating new record with only title', async () => {
    const incompleteInput: UpdateConferenceInfoInput = {
      key: 'new-section',
      title: 'New Section'
      // Missing content
    };

    expect(updateConferenceInfo(incompleteInput)).rejects.toThrow(/title and content are required/i);
  });

  it('should throw error when creating new record with only content', async () => {
    const incompleteInput: UpdateConferenceInfoInput = {
      key: 'new-section',
      content: 'Some content'
      // Missing title
    };

    expect(updateConferenceInfo(incompleteInput)).rejects.toThrow(/title and content are required/i);
  });

  it('should handle multiple different keys correctly', async () => {
    // Create multiple conference info records
    const aboutInput: UpdateConferenceInfoInput = {
      key: 'about',
      title: 'About Us',
      content: 'About content'
    };

    const contactInput: UpdateConferenceInfoInput = {
      key: 'contact',
      title: 'Contact Us',
      content: 'Contact content'
    };

    const aboutResult = await updateConferenceInfo(aboutInput);
    const contactResult = await updateConferenceInfo(contactInput);

    // Verify both records exist and are distinct
    expect(aboutResult.key).toEqual('about');
    expect(contactResult.key).toEqual('contact');
    expect(aboutResult.id).not.toEqual(contactResult.id);

    // Verify in database
    const allRecords = await db.select()
      .from(conferenceInfoTable)
      .execute();

    expect(allRecords).toHaveLength(2);
    
    const aboutRecord = allRecords.find(r => r.key === 'about');
    const contactRecord = allRecords.find(r => r.key === 'contact');
    
    expect(aboutRecord).toBeDefined();
    expect(contactRecord).toBeDefined();
    expect(aboutRecord?.title).toEqual('About Us');
    expect(contactRecord?.title).toEqual('Contact Us');
  });
});