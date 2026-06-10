/** Единые брейкпоинты для адаптивной вёрстки */
export const breakpoints = {
  xs: 480,
  sm: 640,
  /** Узкое окно / планшет / ~⅓ ultrawide: нижняя навигация и компактные карточки */
  md: 1280,
  lg: 1440,
} as const;

export const media = {
  down: (key: keyof typeof breakpoints) =>
    `@media (max-width: ${breakpoints[key]}px)` as const,
  up: (key: keyof typeof breakpoints) =>
    `@media (min-width: ${breakpoints[key] + 1}px)` as const,
};
