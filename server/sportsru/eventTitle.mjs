export function mergeEventTitle(eventOrganization, eventName) {
  const org = String(eventOrganization ?? "").trim();
  const name = String(eventName ?? "").trim();
  if (!org) return name;
  if (!name) return org;

  const normalizedName = name.toLowerCase();
  const normalizedOrg = org.toLowerCase();
  if (normalizedName.startsWith(normalizedOrg) || normalizedName.includes(normalizedOrg)) {
    return name;
  }

  return `${org} ${name}`.trim();
}

export function normalizeStoredEvent(event) {
  const title = mergeEventTitle(event?.eventOrganization, event?.eventName);
  if (!title) return null;
  return { eventOrganization: "", eventName: title };
}
