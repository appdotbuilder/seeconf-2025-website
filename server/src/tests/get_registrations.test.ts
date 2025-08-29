import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { registrationsTable } from '../db/schema';
import { type CreateRegistrationInput } from '../schema';
import { getRegistrations } from '../handlers/get_registrations';

// Test registration inputs
const testRegistration1: CreateRegistrationInput = {
  email: 'john.doe@example.com',
  name: 'John Doe',
  company: 'Tech Corp',
  position: 'Software Developer',
  phone: '+1234567890',
  ticket_type: 'early_bird',
  dietary_requirements: 'Vegetarian',
  t_shirt_size: 'M'
};

const testRegistration2: CreateRegistrationInput = {
  email: 'jane.smith@example.com',
  name: 'Jane Smith',
  company: null,
  position: null,
  phone: null,
  ticket_type: 'student',
  dietary_requirements: null,
  t_shirt_size: 'S'
};

const testRegistration3: CreateRegistrationInput = {
  email: 'speaker@example.com',
  name: 'Speaker Person',
  company: 'Conference Co',
  position: 'Tech Lead',
  phone: '+9876543210',
  ticket_type: 'speaker',
  dietary_requirements: 'No restrictions',
  t_shirt_size: 'L'
};

describe('getRegistrations', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no registrations exist', async () => {
    const result = await getRegistrations();
    expect(result).toEqual([]);
  });

  it('should fetch all registrations', async () => {
    // Create test registrations
    await db.insert(registrationsTable).values([
      {
        ...testRegistration1,
        status: 'confirmed'
      },
      {
        ...testRegistration2,
        status: 'pending'
      },
      {
        ...testRegistration3,
        status: 'confirmed'
      }
    ]).execute();

    const result = await getRegistrations();

    expect(result).toHaveLength(3);
    
    // Verify all registrations are returned
    const emails = result.map(r => r.email);
    expect(emails).toContain('john.doe@example.com');
    expect(emails).toContain('jane.smith@example.com');
    expect(emails).toContain('speaker@example.com');
  });

  it('should return registrations with all required fields', async () => {
    // Create a single registration
    await db.insert(registrationsTable).values({
      ...testRegistration1,
      status: 'confirmed'
    }).execute();

    const result = await getRegistrations();
    const registration = result[0];

    // Verify all fields are present and have correct types
    expect(registration.id).toBeDefined();
    expect(typeof registration.id).toBe('number');
    expect(registration.email).toBe('john.doe@example.com');
    expect(registration.name).toBe('John Doe');
    expect(registration.company).toBe('Tech Corp');
    expect(registration.position).toBe('Software Developer');
    expect(registration.phone).toBe('+1234567890');
    expect(registration.ticket_type).toBe('early_bird');
    expect(registration.dietary_requirements).toBe('Vegetarian');
    expect(registration.t_shirt_size).toBe('M');
    expect(registration.status).toBe('confirmed');
    expect(registration.registration_date).toBeInstanceOf(Date);
    expect(registration.created_at).toBeInstanceOf(Date);
    expect(registration.updated_at).toBeInstanceOf(Date);
  });

  it('should handle registrations with null optional fields', async () => {
    // Create registration with null fields
    await db.insert(registrationsTable).values({
      ...testRegistration2,
      status: 'pending'
    }).execute();

    const result = await getRegistrations();
    const registration = result[0];

    expect(registration.email).toBe('jane.smith@example.com');
    expect(registration.name).toBe('Jane Smith');
    expect(registration.company).toBeNull();
    expect(registration.position).toBeNull();
    expect(registration.phone).toBeNull();
    expect(registration.ticket_type).toBe('student');
    expect(registration.dietary_requirements).toBeNull();
    expect(registration.t_shirt_size).toBe('S');
    expect(registration.status).toBe('pending');
  });

  it('should return registrations ordered by registration date (newest first)', async () => {
    // Create registrations with different registration dates
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    // Insert in random order
    await db.insert(registrationsTable).values([
      {
        ...testRegistration2,
        registration_date: yesterday,
        status: 'confirmed'
      },
      {
        ...testRegistration3,
        registration_date: now,
        status: 'confirmed'
      },
      {
        ...testRegistration1,
        registration_date: twoDaysAgo,
        status: 'confirmed'
      }
    ]).execute();

    const result = await getRegistrations();

    expect(result).toHaveLength(3);
    
    // Verify ordering (newest first)
    expect(result[0].email).toBe('speaker@example.com'); // now
    expect(result[1].email).toBe('jane.smith@example.com'); // yesterday
    expect(result[2].email).toBe('john.doe@example.com'); // two days ago
    
    // Verify dates are in descending order
    expect(result[0].registration_date >= result[1].registration_date).toBe(true);
    expect(result[1].registration_date >= result[2].registration_date).toBe(true);
  });

  it('should include all registration statuses', async () => {
    // Create registrations with different statuses
    await db.insert(registrationsTable).values([
      {
        ...testRegistration1,
        status: 'confirmed'
      },
      {
        ...testRegistration2,
        status: 'pending'
      },
      {
        email: 'cancelled@example.com',
        name: 'Cancelled User',
        ticket_type: 'regular',
        status: 'cancelled'
      }
    ]).execute();

    const result = await getRegistrations();

    expect(result).toHaveLength(3);
    
    const statuses = result.map(r => r.status);
    expect(statuses).toContain('confirmed');
    expect(statuses).toContain('pending');
    expect(statuses).toContain('cancelled');
  });

  it('should include all ticket types', async () => {
    // Create registrations with different ticket types
    await db.insert(registrationsTable).values([
      {
        email: 'early@example.com',
        name: 'Early Bird',
        ticket_type: 'early_bird',
        status: 'confirmed'
      },
      {
        email: 'regular@example.com',
        name: 'Regular Attendee',
        ticket_type: 'regular',
        status: 'confirmed'
      },
      {
        email: 'student@example.com',
        name: 'Student',
        ticket_type: 'student',
        status: 'confirmed'
      },
      {
        email: 'speaker@example.com',
        name: 'Speaker',
        ticket_type: 'speaker',
        status: 'confirmed'
      }
    ]).execute();

    const result = await getRegistrations();

    expect(result).toHaveLength(4);
    
    const ticketTypes = result.map(r => r.ticket_type);
    expect(ticketTypes).toContain('early_bird');
    expect(ticketTypes).toContain('regular');
    expect(ticketTypes).toContain('student');
    expect(ticketTypes).toContain('speaker');
  });
});