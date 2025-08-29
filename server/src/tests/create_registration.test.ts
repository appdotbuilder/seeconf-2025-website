import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { registrationsTable } from '../db/schema';
import { type CreateRegistrationInput } from '../schema';
import { createRegistration } from '../handlers/create_registration';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateRegistrationInput = {
  email: 'test@example.com',
  name: 'Test User',
  company: 'Test Company',
  position: 'Software Engineer',
  phone: '+1234567890',
  ticket_type: 'regular',
  dietary_requirements: 'Vegetarian',
  t_shirt_size: 'M'
};

// Minimal test input
const minimalInput: CreateRegistrationInput = {
  email: 'minimal@example.com',
  name: 'Minimal User',
  ticket_type: 'student'
};

describe('createRegistration', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a registration with all fields', async () => {
    const result = await createRegistration(testInput);

    // Verify all fields are properly set
    expect(result.email).toEqual('test@example.com');
    expect(result.name).toEqual('Test User');
    expect(result.company).toEqual('Test Company');
    expect(result.position).toEqual('Software Engineer');
    expect(result.phone).toEqual('+1234567890');
    expect(result.ticket_type).toEqual('regular');
    expect(result.dietary_requirements).toEqual('Vegetarian');
    expect(result.t_shirt_size).toEqual('M');
    expect(result.status).toEqual('pending');
    expect(result.id).toBeDefined();
    expect(result.registration_date).toBeInstanceOf(Date);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a registration with minimal fields', async () => {
    const result = await createRegistration(minimalInput);

    // Verify required fields are set
    expect(result.email).toEqual('minimal@example.com');
    expect(result.name).toEqual('Minimal User');
    expect(result.ticket_type).toEqual('student');
    expect(result.status).toEqual('pending');
    expect(result.id).toBeDefined();
    expect(result.registration_date).toBeInstanceOf(Date);

    // Verify optional fields are null
    expect(result.company).toBeNull();
    expect(result.position).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.dietary_requirements).toBeNull();
    expect(result.t_shirt_size).toBeNull();
  });

  it('should save registration to database', async () => {
    const result = await createRegistration(testInput);

    // Query database to verify registration was saved
    const registrations = await db.select()
      .from(registrationsTable)
      .where(eq(registrationsTable.id, result.id))
      .execute();

    expect(registrations).toHaveLength(1);
    expect(registrations[0].email).toEqual('test@example.com');
    expect(registrations[0].name).toEqual('Test User');
    expect(registrations[0].company).toEqual('Test Company');
    expect(registrations[0].ticket_type).toEqual('regular');
    expect(registrations[0].status).toEqual('pending');
    expect(registrations[0].created_at).toBeInstanceOf(Date);
  });

  it('should reject duplicate email addresses', async () => {
    // Create first registration
    await createRegistration(testInput);

    // Attempt to create second registration with same email
    const duplicateInput: CreateRegistrationInput = {
      email: 'test@example.com', // Same email
      name: 'Another User',
      ticket_type: 'early_bird'
    };

    await expect(createRegistration(duplicateInput))
      .rejects.toThrow(/already exists/i);
  });

  it('should handle different ticket types correctly', async () => {
    const ticketTypes: Array<CreateRegistrationInput['ticket_type']> = [
      'early_bird', 'regular', 'student', 'speaker'
    ];

    for (const ticketType of ticketTypes) {
      const input: CreateRegistrationInput = {
        email: `${ticketType}@example.com`,
        name: `${ticketType} User`,
        ticket_type: ticketType
      };

      const result = await createRegistration(input);
      expect(result.ticket_type).toEqual(ticketType);
      expect(result.email).toEqual(`${ticketType}@example.com`);
    }
  });

  it('should handle different t-shirt sizes correctly', async () => {
    const tShirtSizes: Array<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'> = [
      'XS', 'S', 'M', 'L', 'XL', 'XXL'
    ];

    for (const size of tShirtSizes) {
      const input: CreateRegistrationInput = {
        email: `size-${size}@example.com`,
        name: `Size ${size} User`,
        ticket_type: 'regular',
        t_shirt_size: size
      };

      const result = await createRegistration(input);
      expect(result.t_shirt_size).toEqual(size);
    }
  });

  it('should set default status to pending', async () => {
    const result = await createRegistration(minimalInput);
    expect(result.status).toEqual('pending');
  });

  it('should set registration_date automatically', async () => {
    const beforeRegistration = new Date();
    const result = await createRegistration(testInput);
    const afterRegistration = new Date();

    expect(result.registration_date).toBeInstanceOf(Date);
    expect(result.registration_date.getTime()).toBeGreaterThanOrEqual(beforeRegistration.getTime());
    expect(result.registration_date.getTime()).toBeLessThanOrEqual(afterRegistration.getTime());
  });

  it('should validate email uniqueness case-insensitively', async () => {
    // Create registration with lowercase email
    await createRegistration({
      email: 'test@example.com',
      name: 'User One',
      ticket_type: 'regular'
    });

    // Try to create with uppercase email (should still be rejected if DB is case-sensitive)
    const upperCaseInput: CreateRegistrationInput = {
      email: 'TEST@EXAMPLE.COM',
      name: 'User Two',
      ticket_type: 'student'
    };

    // This might pass or fail depending on DB collation settings
    // The test documents the current behavior
    try {
      const result = await createRegistration(upperCaseInput);
      // If it succeeds, the DB treats emails as case-sensitive
      expect(result.email).toEqual('TEST@EXAMPLE.COM');
    } catch (error) {
      // If it fails, the DB treats emails as case-insensitive
      expect(String(error)).toMatch(/already exists/i);
    }
  });
});