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
  "Bomb has been planted",
  "Good Job",
  "Good Game",
  "GG WP",
  "Иди в доту",
  "Я зеленая",
  "Freedom",
  "Ставки на спорт! 1x....",
  "Я твою мать е...",
  "Может делом займешься?",
  "GL HF",
  "Удачи!",
  "Промазал",
  "АХахаха, щекотно!",
  "Чики брики и в ставку",
  "Артефактов, хабара нет!",
  "やめてください",
  "Omae wa mou shindeiru",
] as const;

export function pickRandomLogoClickMessage(): string {
  const index = Math.floor(Math.random() * LOGO_CLICK_MESSAGES.length);
  return LOGO_CLICK_MESSAGES[index] ?? LOGO_CLICK_MESSAGES[0];
}
