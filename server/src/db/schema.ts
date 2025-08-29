import { serial, text, pgTable, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums for type safety
export const agendaTypeEnum = pgEnum('agenda_type', ['main_forum', 'design_forum', 'engineering_forum', 'workshop']);
export const partnerTierEnum = pgEnum('partner_tier', ['title', 'platinum', 'gold', 'silver', 'community']);
export const ticketTypeEnum = pgEnum('ticket_type', ['early_bird', 'regular', 'student', 'speaker']);
export const registrationStatusEnum = pgEnum('registration_status', ['pending', 'confirmed', 'cancelled']);
export const tShirtSizeEnum = pgEnum('t_shirt_size', ['XS', 'S', 'M', 'L', 'XL', 'XXL']);

// Speakers table
export const speakersTable = pgTable('speakers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  position: text('position').notNull(),
  company: text('company').notNull(),
  avatar_url: text('avatar_url').notNull(),
  bio: text('bio').notNull(),
  speech_topic: text('speech_topic').notNull(),
  social_links: text('social_links'), // JSON string for social media links
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Agenda table
export const agendaTable = pgTable('agenda', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time').notNull(),
  type: agendaTypeEnum('type').notNull(),
  speaker_id: integer('speaker_id'), // References speakers table
  location: text('location').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Partners table
export const partnersTable = pgTable('partners', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  logo_url: text('logo_url').notNull(),
  website_url: text('website_url'),
  tier: partnerTierEnum('tier').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Registrations table
export const registrationsTable = pgTable('registrations', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  company: text('company'),
  position: text('position'),
  phone: text('phone'),
  ticket_type: ticketTypeEnum('ticket_type').notNull(),
  dietary_requirements: text('dietary_requirements'),
  t_shirt_size: tShirtSizeEnum('t_shirt_size'),
  registration_date: timestamp('registration_date').defaultNow().notNull(),
  status: registrationStatusEnum('status').notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Conference info table for static content
export const conferenceInfoTable = pgTable('conference_info', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(), // Unique identifier for content sections
  title: text('title').notNull(),
  content: text('content').notNull(),
  metadata: text('metadata'), // JSON string for additional data
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Define relations
export const speakersRelations = relations(speakersTable, ({ many }) => ({
  agendaItems: many(agendaTable)
}));

export const agendaRelations = relations(agendaTable, ({ one }) => ({
  speaker: one(speakersTable, {
    fields: [agendaTable.speaker_id],
    references: [speakersTable.id]
  })
}));

// TypeScript types for the table schemas
export type Speaker = typeof speakersTable.$inferSelect;
export type NewSpeaker = typeof speakersTable.$inferInsert;

export type Agenda = typeof agendaTable.$inferSelect;
export type NewAgenda = typeof agendaTable.$inferInsert;

export type Partner = typeof partnersTable.$inferSelect;
export type NewPartner = typeof partnersTable.$inferInsert;

export type Registration = typeof registrationsTable.$inferSelect;
export type NewRegistration = typeof registrationsTable.$inferInsert;

export type ConferenceInfo = typeof conferenceInfoTable.$inferSelect;
export type NewConferenceInfo = typeof conferenceInfoTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  speakers: speakersTable,
  agenda: agendaTable,
  partners: partnersTable,
  registrations: registrationsTable,
  conferenceInfo: conferenceInfoTable
};