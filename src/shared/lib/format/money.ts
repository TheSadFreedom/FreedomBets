export const formatMoney = (n: number) =>
  `${n >= 0 ? "" : "−"}${Math.abs(n).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;

export const formatMoneySigned = (n: number) =>
  `${n >= 0 ? "+" : "−"}${Math.abs(n).toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽`;
