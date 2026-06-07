export const LOGO_CLICK_MESSAGES = [
  "не тыкай",
  "мне лень",
  "ну че ты тычешь",
  "я не имею функционала",
  "отстань",
  "угомонись",
  "окак",
  "себе потыкай",
  "иди ты на***",
  "-_-",
  "ты глупый или что",
] as const;

export function pickRandomLogoClickMessage(): string {
  const index = Math.floor(Math.random() * LOGO_CLICK_MESSAGES.length);
  return LOGO_CLICK_MESSAGES[index] ?? LOGO_CLICK_MESSAGES[0];
}
