import { db } from '../db';
import { agendaTable } from '../db/schema';
import { type GetAgendaInput, type Agenda } from '../schema';
import { eq, and, gte, lte, asc, type SQL } from 'drizzle-orm';

export async function getAgenda(input?: GetAgendaInput): Promise<Agenda[]> {
  try {
    // Build conditions array for filtering
    const conditions: SQL<unknown>[] = [];

    if (input?.type) {
      conditions.push(eq(agendaTable.type, input.type));
    }

    if (input?.date) {
      // Parse the date string and create date range for the entire day
      const targetDate = new Date(input.date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      conditions.push(
        gte(agendaTable.start_time, startOfDay),
        lte(agendaTable.start_time, endOfDay)
      );
    }

    // Build and execute the query
    const queryBuilder = db.select().from(agendaTable);
    
    const finalQuery = conditions.length > 0
      ? queryBuilder
          .where(conditions.length === 1 ? conditions[0] : and(...conditions))
          .orderBy(asc(agendaTable.start_time))
      : queryBuilder.orderBy(asc(agendaTable.start_time));

    const results = await finalQuery.execute();

    return results;
  } catch (error) {
    console.error('Get agenda failed:', error);
    throw error;
  }
}