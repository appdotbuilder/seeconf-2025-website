import { z } from 'zod';

// Speaker schema
export const speakerSchema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.string(),
  company: z.string(),
  avatar_url: z.string().url(),
  bio: z.string(),
  speech_topic: z.string(),
  social_links: z.string().nullable(), // JSON string of social links
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Speaker = z.infer<typeof speakerSchema>;

// Input schema for creating speakers
export const createSpeakerInputSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  company: z.string().min(1),
  avatar_url: z.string().url(),
  bio: z.string(),
  speech_topic: z.string(),
  social_links: z.string().nullable().optional()
});

export type CreateSpeakerInput = z.infer<typeof createSpeakerInputSchema>;

// Agenda schema
export const agendaSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  type: z.enum(['main_forum', 'design_forum', 'engineering_forum', 'workshop']),
  speaker_id: z.number().nullable(),
  location: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Agenda = z.infer<typeof agendaSchema>;

// Input schema for creating agenda items
export const createAgendaInputSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  type: z.enum(['main_forum', 'design_forum', 'engineering_forum', 'workshop']),
  speaker_id: z.number().nullable().optional(),
  location: z.string()
});

export type CreateAgendaInput = z.infer<typeof createAgendaInputSchema>;

// Partner schema
export const partnerSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo_url: z.string().url(),
  website_url: z.string().url().nullable(),
  tier: z.enum(['title', 'platinum', 'gold', 'silver', 'community']),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Partner = z.infer<typeof partnerSchema>;

// Input schema for creating partners
export const createPartnerInputSchema = z.object({
  name: z.string().min(1),
  logo_url: z.string().url(),
  website_url: z.string().url().nullable().optional(),
  tier: z.enum(['title', 'platinum', 'gold', 'silver', 'community']),
  description: z.string().nullable().optional()
});

export type CreatePartnerInput = z.infer<typeof createPartnerInputSchema>;

// Registration schema
export const registrationSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  company: z.string().nullable(),
  position: z.string().nullable(),
  phone: z.string().nullable(),
  ticket_type: z.enum(['early_bird', 'regular', 'student', 'speaker']),
  dietary_requirements: z.string().nullable(),
  t_shirt_size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).nullable(),
  registration_date: z.coerce.date(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Registration = z.infer<typeof registrationSchema>;

// Input schema for creating registrations
export const createRegistrationInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  company: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  ticket_type: z.enum(['early_bird', 'regular', 'student', 'speaker']),
  dietary_requirements: z.string().nullable().optional(),
  t_shirt_size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).nullable().optional()
});

export type CreateRegistrationInput = z.infer<typeof createRegistrationInputSchema>;

// Conference info schema for static content
export const conferenceInfoSchema = z.object({
  id: z.number(),
  key: z.string(),
  title: z.string(),
  content: z.string(),
  metadata: z.string().nullable(), // JSON string for additional data
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ConferenceInfo = z.infer<typeof conferenceInfoSchema>;

// Input schema for updating conference info
export const updateConferenceInfoInputSchema = z.object({
  key: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  metadata: z.string().nullable().optional()
});

export type UpdateConferenceInfoInput = z.infer<typeof updateConferenceInfoInputSchema>;

// Countdown response schema
export const countdownResponseSchema = z.object({
  days: z.number(),
  hours: z.number(),
  minutes: z.number(),
  seconds: z.number(),
  total_seconds: z.number(),
  is_live: z.boolean()
});

export type CountdownResponse = z.infer<typeof countdownResponseSchema>;

// Get agenda input schema with optional filters
export const getAgendaInputSchema = z.object({
  type: z.enum(['main_forum', 'design_forum', 'engineering_forum', 'workshop']).optional(),
  date: z.string().optional() // YYYY-MM-DD format
});

export type GetAgendaInput = z.infer<typeof getAgendaInputSchema>;

// Get partners input schema with optional tier filter
export const getPartnersInputSchema = z.object({
  tier: z.enum(['title', 'platinum', 'gold', 'silver', 'community']).optional()
});

export type GetPartnersInput = z.infer<typeof getPartnersInputSchema>;