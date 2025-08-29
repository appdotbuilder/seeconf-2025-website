import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { partnersTable } from '../db/schema';
import { type CreatePartnerInput } from '../schema';
import { createPartner } from '../handlers/create_partner';
import { eq } from 'drizzle-orm';

// Test inputs for different partner tiers
const titlePartnerInput: CreatePartnerInput = {
  name: 'TechCorp Global',
  logo_url: 'https://example.com/techcorp-logo.png',
  website_url: 'https://techcorp.com',
  tier: 'title',
  description: 'Leading technology solutions provider'
};

const communityPartnerInput: CreatePartnerInput = {
  name: 'Local Dev Community',
  logo_url: 'https://example.com/community-logo.png',
  tier: 'community',
  description: 'Supporting local developers'
};

const minimalPartnerInput: CreatePartnerInput = {
  name: 'Startup Inc',
  logo_url: 'https://example.com/startup-logo.png',
  tier: 'silver'
};

describe('createPartner', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a partner with all fields', async () => {
    const result = await createPartner(titlePartnerInput);

    // Basic field validation
    expect(result.name).toEqual('TechCorp Global');
    expect(result.logo_url).toEqual('https://example.com/techcorp-logo.png');
    expect(result.website_url).toEqual('https://techcorp.com');
    expect(result.tier).toEqual('title');
    expect(result.description).toEqual('Leading technology solutions provider');
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a partner with minimal fields', async () => {
    const result = await createPartner(minimalPartnerInput);

    expect(result.name).toEqual('Startup Inc');
    expect(result.logo_url).toEqual('https://example.com/startup-logo.png');
    expect(result.website_url).toBeNull();
    expect(result.tier).toEqual('silver');
    expect(result.description).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save partner to database', async () => {
    const result = await createPartner(titlePartnerInput);

    // Query using proper drizzle syntax
    const partners = await db.select()
      .from(partnersTable)
      .where(eq(partnersTable.id, result.id))
      .execute();

    expect(partners).toHaveLength(1);
    expect(partners[0].name).toEqual('TechCorp Global');
    expect(partners[0].logo_url).toEqual('https://example.com/techcorp-logo.png');
    expect(partners[0].website_url).toEqual('https://techcorp.com');
    expect(partners[0].tier).toEqual('title');
    expect(partners[0].description).toEqual('Leading technology solutions provider');
    expect(partners[0].created_at).toBeInstanceOf(Date);
    expect(partners[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle different partner tiers correctly', async () => {
    const tiers: CreatePartnerInput['tier'][] = ['title', 'platinum', 'gold', 'silver', 'community'];
    
    for (const tier of tiers) {
      const input: CreatePartnerInput = {
        name: `${tier} Partner`,
        logo_url: `https://example.com/${tier}-logo.png`,
        tier: tier
      };

      const result = await createPartner(input);
      
      expect(result.tier).toEqual(tier);
      expect(result.name).toEqual(`${tier} Partner`);
    }
  });

  it('should create multiple partners independently', async () => {
    const partner1 = await createPartner(titlePartnerInput);
    const partner2 = await createPartner(communityPartnerInput);
    const partner3 = await createPartner(minimalPartnerInput);

    // Verify all partners were created with unique IDs
    expect(partner1.id).not.toEqual(partner2.id);
    expect(partner2.id).not.toEqual(partner3.id);
    expect(partner1.id).not.toEqual(partner3.id);

    // Verify all partners exist in database
    const allPartners = await db.select()
      .from(partnersTable)
      .execute();

    expect(allPartners).toHaveLength(3);
    
    const partnerNames = allPartners.map(p => p.name).sort();
    expect(partnerNames).toEqual(['Local Dev Community', 'Startup Inc', 'TechCorp Global']);
  });

  it('should handle null website_url and description correctly', async () => {
    const inputWithNulls: CreatePartnerInput = {
      name: 'Partner with Nulls',
      logo_url: 'https://example.com/null-partner-logo.png',
      tier: 'gold',
      website_url: null,
      description: null
    };

    const result = await createPartner(inputWithNulls);

    expect(result.website_url).toBeNull();
    expect(result.description).toBeNull();

    // Verify in database
    const dbPartner = await db.select()
      .from(partnersTable)
      .where(eq(partnersTable.id, result.id))
      .execute();

    expect(dbPartner[0].website_url).toBeNull();
    expect(dbPartner[0].description).toBeNull();
  });
});