import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { partnersTable } from '../db/schema';
import { type GetPartnersInput, type CreatePartnerInput } from '../schema';
import { getPartners } from '../handlers/get_partners';

// Test partner data
const testPartners: CreatePartnerInput[] = [
  {
    name: 'Silver Sponsor Corp',
    logo_url: 'https://example.com/silver-logo.png',
    website_url: 'https://silverpartner.com',
    tier: 'silver',
    description: 'A silver tier partner'
  },
  {
    name: 'Title Sponsor Inc',
    logo_url: 'https://example.com/title-logo.png',
    website_url: 'https://titlepartner.com',
    tier: 'title',
    description: 'The main title sponsor'
  },
  {
    name: 'Gold Partner LLC',
    logo_url: 'https://example.com/gold-logo.png',
    website_url: 'https://goldpartner.com',
    tier: 'gold',
    description: 'A gold tier partner'
  },
  {
    name: 'Platinum Solutions',
    logo_url: 'https://example.com/platinum-logo.png',
    website_url: 'https://platinumpartner.com',
    tier: 'platinum',
    description: 'A platinum tier partner'
  },
  {
    name: 'Community Partner',
    logo_url: 'https://example.com/community-logo.png',
    website_url: null,
    tier: 'community',
    description: null
  },
  {
    name: 'Another Gold Partner',
    logo_url: 'https://example.com/gold2-logo.png',
    website_url: 'https://anothergold.com',
    tier: 'gold',
    description: 'Second gold partner'
  }
];

// Helper function to create test partners
async function createTestPartners() {
  await db.insert(partnersTable)
    .values(testPartners)
    .execute();
}

describe('getPartners', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should get all partners when no filter is provided', async () => {
    await createTestPartners();

    const result = await getPartners();

    expect(result).toHaveLength(6);
    expect(result.every(partner => partner.id)).toBe(true);
    expect(result.every(partner => partner.created_at instanceof Date)).toBe(true);
    expect(result.every(partner => partner.updated_at instanceof Date)).toBe(true);
  });

  it('should order partners by tier priority correctly', async () => {
    await createTestPartners();

    const result = await getPartners();

    // Check that partners are ordered by tier priority
    const tierOrder = result.map(p => p.tier);
    const expectedOrder: Array<'title' | 'platinum' | 'gold' | 'silver' | 'community'> = ['title', 'platinum', 'gold', 'gold', 'silver', 'community'];
    expect(tierOrder).toEqual(expectedOrder);

    // Verify specific partners are in correct positions
    expect(result[0].name).toBe('Title Sponsor Inc');
    expect(result[0].tier).toBe('title');
    expect(result[1].name).toBe('Platinum Solutions');
    expect(result[1].tier).toBe('platinum');
    expect(result[5].name).toBe('Community Partner');
    expect(result[5].tier).toBe('community');
  });

  it('should order by name within same tier', async () => {
    await createTestPartners();

    const result = await getPartners();

    // Find gold tier partners (should be sorted alphabetically)
    const goldPartners = result.filter(p => p.tier === 'gold');
    expect(goldPartners).toHaveLength(2);
    expect(goldPartners[0].name).toBe('Another Gold Partner');
    expect(goldPartners[1].name).toBe('Gold Partner LLC');
  });

  it('should filter by tier when tier is specified', async () => {
    await createTestPartners();

    const input: GetPartnersInput = { tier: 'gold' };
    const result = await getPartners(input);

    expect(result).toHaveLength(2);
    expect(result.every(partner => partner.tier === 'gold')).toBe(true);
    
    // Should still be ordered by name within the tier
    expect(result[0].name).toBe('Another Gold Partner');
    expect(result[1].name).toBe('Gold Partner LLC');
  });

  it('should filter by title tier correctly', async () => {
    await createTestPartners();

    const input: GetPartnersInput = { tier: 'title' };
    const result = await getPartners(input);

    expect(result).toHaveLength(1);
    expect(result[0].tier).toBe('title');
    expect(result[0].name).toBe('Title Sponsor Inc');
    expect(result[0].description).toBe('The main title sponsor');
  });

  it('should filter by platinum tier correctly', async () => {
    await createTestPartners();

    const input: GetPartnersInput = { tier: 'platinum' };
    const result = await getPartners(input);

    expect(result).toHaveLength(1);
    expect(result[0].tier).toBe('platinum');
    expect(result[0].name).toBe('Platinum Solutions');
  });

  it('should filter by silver tier correctly', async () => {
    await createTestPartners();

    const input: GetPartnersInput = { tier: 'silver' };
    const result = await getPartners(input);

    expect(result).toHaveLength(1);
    expect(result[0].tier).toBe('silver');
    expect(result[0].name).toBe('Silver Sponsor Corp');
  });

  it('should filter by community tier correctly', async () => {
    await createTestPartners();

    const input: GetPartnersInput = { tier: 'community' };
    const result = await getPartners(input);

    expect(result).toHaveLength(1);
    expect(result[0].tier).toBe('community');
    expect(result[0].name).toBe('Community Partner');
    expect(result[0].website_url).toBeNull();
    expect(result[0].description).toBeNull();
  });

  it('should return empty array when no partners match filter', async () => {
    // Create only gold partners
    await db.insert(partnersTable)
      .values([testPartners[2]]) // Just the gold partner
      .execute();

    const input: GetPartnersInput = { tier: 'title' };
    const result = await getPartners(input);

    expect(result).toHaveLength(0);
  });

  it('should return empty array when no partners exist', async () => {
    const result = await getPartners();

    expect(result).toHaveLength(0);
  });

  it('should handle undefined input gracefully', async () => {
    await createTestPartners();

    const result = await getPartners(undefined);

    expect(result).toHaveLength(6);
    // Should still be ordered by tier priority
    expect(result[0].tier).toBe('title');
    expect(result[1].tier).toBe('platinum');
  });

  it('should preserve all partner fields correctly', async () => {
    await createTestPartners();

    const result = await getPartners();
    const titlePartner = result.find(p => p.tier === 'title');

    expect(titlePartner).toBeDefined();
    expect(titlePartner!.name).toBe('Title Sponsor Inc');
    expect(titlePartner!.logo_url).toBe('https://example.com/title-logo.png');
    expect(titlePartner!.website_url).toBe('https://titlepartner.com');
    expect(titlePartner!.tier).toBe('title');
    expect(titlePartner!.description).toBe('The main title sponsor');
    expect(titlePartner!.id).toBeDefined();
    expect(titlePartner!.created_at).toBeInstanceOf(Date);
    expect(titlePartner!.updated_at).toBeInstanceOf(Date);
  });
});