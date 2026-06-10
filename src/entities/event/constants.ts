export const EVENT_TIERS = ["Major", "Big", "Small"] as const;

export type EventTier = (typeof EVENT_TIERS)[number];

/** Статусы для вкладки «Турниры» — Major на отдельной вкладке */
export const NON_MAJOR_EVENT_TIERS = ["Big", "Small"] as const satisfies readonly EventTier[];

export const MAJOR_EVENT_TIERS = ["Major"] as const satisfies readonly EventTier[];

export function isEventTier(value: unknown): value is EventTier {
  return typeof value === "string" && EVENT_TIERS.includes(value as EventTier);
}
