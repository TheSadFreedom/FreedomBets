/** Высота фиксированной нижней навигации (padding + inner + item). */
export const MOBILE_NAV_HEIGHT = "76px";

export const MOBILE_FAB_BOTTOM_GAP = "28px";
export const MOBILE_FAB_SIZE_PRIMARY = "60px";
export const MOBILE_FAB_SIZE_SYNC = "48px";
export const MOBILE_FAB_SIZE_SECONDARY = "52px";
export const MOBILE_FAB_GAP = "12px";

export const MOBILE_QUICK_ACTIONS_HEIGHT = `calc(${MOBILE_FAB_SIZE_PRIMARY} + ${MOBILE_FAB_GAP} + ${MOBILE_FAB_SIZE_SYNC} + ${MOBILE_FAB_GAP} + ${MOBILE_FAB_SIZE_SECONDARY})`;

/** Нижний край FAB-стека над навигацией. */
export const mobileQuickActionsBottomInset = `calc(${MOBILE_NAV_HEIGHT} + ${MOBILE_FAB_BOTTOM_GAP} + env(safe-area-inset-bottom, 0px))`;

/** Нижний отступ контента под FAB + навигацию. */
export const mobileContentBottomInset = `calc(${MOBILE_NAV_HEIGHT} + ${MOBILE_FAB_BOTTOM_GAP} + ${MOBILE_QUICK_ACTIONS_HEIGHT} + 12px + env(safe-area-inset-bottom, 0px))`;
