export const MAX_BET_AMOUNT = 100_000;
export const MAX_BALANCE = 1_000_000;
export const MAX_INPUT_LENGTH = 25;
export const MAX_EVENT_NAME_LENGTH = 40;

export function limitInputLength(value: string, max = MAX_INPUT_LENGTH): string {
  return value.slice(0, max);
}

export function clampBetAmount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(0, Math.round(value)), MAX_BET_AMOUNT);
}

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

export function clampBalance(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(0, roundMoney(value)), MAX_BALANCE);
}

export function isValidBetAmount(value: number): boolean {
  return Number.isFinite(value) && value > 0 && value <= MAX_BET_AMOUNT;
}
