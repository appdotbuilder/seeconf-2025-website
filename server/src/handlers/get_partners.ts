import { db } from '../db';
import { partnersTable } from '../db/schema';
import { type GetPartnersInput, type Partner } from '../schema';
import { eq, sql, type SQL } from 'drizzle-orm';

export async function getPartners(input?: GetPartnersInput): Promise<Partner[]> {
  try {
    // Define tier priority order: title -> platinum -> gold -> silver -> community
    const tierOrderCase = sql`
      CASE ${partnersTable.tier}
        WHEN 'title' THEN 1
        WHEN 'platinum' THEN 2
        WHEN 'gold' THEN 3
        WHEN 'silver' THEN 4
        WHEN 'community' THEN 5
        ELSE 6
      END
    `;

    // Build query with conditional filtering
    const baseQuery = db.select().from(partnersTable);
    
    const query = input?.tier 
      ? baseQuery
          .where(eq(partnersTable.tier, input.tier))
          .orderBy(tierOrderCase, partnersTable.name)
      : baseQuery
          .orderBy(tierOrderCase, partnersTable.name);

    const results = await query.execute();

    // Convert timestamps to proper Date objects
    return results.map(partner => ({
      ...partner,
      created_at: new Date(partner.created_at),
      updated_at: new Date(partner.updated_at)
    }));
  } catch (error) {
    console.error('Get partners failed:', error);
    throw error;
  }
}