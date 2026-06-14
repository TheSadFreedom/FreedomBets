export function eventGroupKey(eventOrganizationOrName: string, eventName?: string): string {
  const name = eventName === undefined ? eventOrganizationOrName : eventName;
  return name.trim().toLowerCase();
}
