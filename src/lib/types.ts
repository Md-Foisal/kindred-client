export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Food Drive",
  "Blood Donation",
  "Health Camp",
  "Education",
  "Awareness",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface CommunityEvent {
  _id: string;
  title: string;
  description: string;
  eventType: EventType;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
  creatorName: string;
  creatorImage?: string;
  createdAt: string;
  updatedAt: string;
  joinedCount?: number;
}

export interface JoinedRow {
  joinId: string;
  joinedAt: string;
  event: CommunityEvent;
}

export interface EventInput {
  title: string;
  description: string;
  eventType: EventType | "";
  thumbnail: string;
  location: string;
  eventDate: string;
}
