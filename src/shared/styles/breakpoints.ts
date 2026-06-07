/** Единые брейкпоинты для адаптивной вёрстки */
export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 900,
  lg: 1200,
} as const;

export const media = {
  down: (key: keyof typeof breakpoints) =>
    `@media (max-width: ${breakpoints[key]}px)` as const,
  up: (key: keyof typeof breakpoints) =>
    `@media (min-width: ${breakpoints[key] + 1}px)` as const,
};
