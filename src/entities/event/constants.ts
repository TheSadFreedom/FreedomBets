export const EVENT_TIERS = ["Major", "Big", "Small"] as const;

export type EventTier = (typeof EVENT_TIERS)[number];

/** Статусы для вкладки «Турниры» — Major вынесен в отдельную вкладку */
export const NON_MAJOR_EVENT_TIERS = ["Big", "Small"] as const satisfies readonly EventTier[];

export function isEventTier(value: unknown): value is EventTier {
  return typeof value === "string" && EVENT_TIERS.includes(value as EventTier);
}
