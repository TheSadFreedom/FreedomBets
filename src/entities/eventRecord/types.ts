import type { EventTier } from "@/entities/event";

export interface EventRecord {
  id: string;
  eventOrganization: string;
  eventName: string;
  date: string;
  endDate: string;
  eventTier: EventTier;
}

export type EventRecordCreateInput = Pick<
  EventRecord,
  "eventOrganization" | "eventName" | "date" | "endDate" | "eventTier"
>;
