export function mergeEventTitle(_unused: string, eventName: string): string {
  return eventName.trim();
}

export function eventTitlesMatch(
  _leftOrganization: string,
  leftName: string,
  _rightOrganization: string,
  rightName: string
): boolean {
  return leftName.trim().toLowerCase() === rightName.trim().toLowerCase();
}

export function storedEventTitle(event: { name?: string; eventName?: string }): string {
  return (event.name ?? event.eventName ?? "").trim();
}
