import { db } from '../db';
import { partnersTable } from '../db/schema';
import { type CreatePartnerInput, type Partner } from '../schema';

export const createPartner = async (input: CreatePartnerInput): Promise<Partner> => {
  try {
    // Insert partner record
    const result = await db.insert(partnersTable)
      .values({
        name: input.name,
        logo_url: input.logo_url,
        website_url: input.website_url || null,
        tier: input.tier,
        description: input.description || null
      })
      .returning()
      .execute();

    // Return the created partner
    const partner = result[0];
    return partner;
  } catch (error) {
    console.error('Partner creation failed:', error);
    throw error;
  }
};