import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createSpeakerInputSchema,
  createAgendaInputSchema,
  createPartnerInputSchema,
  createRegistrationInputSchema,
  updateConferenceInfoInputSchema,
  getAgendaInputSchema,
  getPartnersInputSchema
} from './schema';

// Import handlers
import { getSpeakers } from './handlers/get_speakers';
import { createSpeaker } from './handlers/create_speaker';
import { getAgenda } from './handlers/get_agenda';
import { createAgenda } from './handlers/create_agenda';
import { getPartners } from './handlers/get_partners';
import { createPartner } from './handlers/create_partner';
import { createRegistration } from './handlers/create_registration';
import { getRegistrations } from './handlers/get_registrations';
import { getConferenceInfo } from './handlers/get_conference_info';
import { updateConferenceInfo } from './handlers/update_conference_info';
import { getCountdown } from './handlers/get_countdown';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Countdown endpoint
  getCountdown: publicProcedure
    .query(() => getCountdown()),

  // Speaker endpoints
  getSpeakers: publicProcedure
    .query(() => getSpeakers()),
  createSpeaker: publicProcedure
    .input(createSpeakerInputSchema)
    .mutation(({ input }) => createSpeaker(input)),

  // Agenda endpoints
  getAgenda: publicProcedure
    .input(getAgendaInputSchema.optional())
    .query(({ input }) => getAgenda(input)),
  createAgenda: publicProcedure
    .input(createAgendaInputSchema)
    .mutation(({ input }) => createAgenda(input)),

  // Partner endpoints
  getPartners: publicProcedure
    .input(getPartnersInputSchema.optional())
    .query(({ input }) => getPartners(input)),
  createPartner: publicProcedure
    .input(createPartnerInputSchema)
    .mutation(({ input }) => createPartner(input)),

  // Registration endpoints
  createRegistration: publicProcedure
    .input(createRegistrationInputSchema)
    .mutation(({ input }) => createRegistration(input)),
  getRegistrations: publicProcedure
    .query(() => getRegistrations()),

  // Conference info endpoints
  getConferenceInfo: publicProcedure
    .input(z.string().optional())
    .query(({ input }) => getConferenceInfo(input)),
  updateConferenceInfo: publicProcedure
    .input(updateConferenceInfoInputSchema)
    .mutation(({ input }) => updateConferenceInfo(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors({
        origin: process.env['CLIENT_URL'] || 'http://localhost:3000',
        credentials: true
      })(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  
  server.listen(port);
  console.log(`🚀 See Conf 2025 API server listening at port: ${port}`);
  console.log(`📡 TRPC endpoints available at http://localhost:${port}`);
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});